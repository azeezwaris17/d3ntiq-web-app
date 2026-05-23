/**
 * Apollo Client Configuration
 *
 * Single Apollo Client instance with:
 * - Auth link: attaches JWT token to every request automatically
 * - Error link: handles 401 UNAUTHENTICATED (refresh + retry) and 403 FORBIDDEN (role mismatch)
 * - HTTP link: sends requests to the GraphQL endpoint
 */

import { ApolloClient, InMemoryCache, HttpLink, from, Observable } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import * as MantineNotifications from '@mantine/notifications';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ── HTTP Link ────────────────────────────────────────────────────────────────

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
  credentials: 'include', // include httpOnly cookies (refresh token)
});

// ── Auth Link — attaches token to EVERY request ───────────────────────────────

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

// ── Token Refresh ─────────────────────────────────────────────────────────────

let refreshPromise: Promise<string | null> | null = null;
let sessionExpiredNotified = false;

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  // Single-flight: if a refresh is already in progress, wait for it
  if (refreshPromise) return refreshPromise;

  const p = (async (): Promise<string | null> => {
    try {
      // Cookie-based refresh — the httpOnly refresh_token cookie is sent automatically
      const resp = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (resp.ok) {
        const json = await resp.json().catch(() => null) as Record<string, unknown> | null;
        const accessToken = typeof json?.accessToken === 'string' ? json.accessToken : null;
        const expiresIn = typeof json?.expiresIn === 'number' ? json.expiresIn : null;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          if (expiresIn) {
            localStorage.setItem('tokenExpiresAt', String(Date.now() + expiresIn * 1000));
          }
          sessionExpiredNotified = false;
          return accessToken;
        }
      }

      // Refresh failed — session is expired
      throw new Error('Token refresh failed');
    } catch (_err) {
      return null;
    }
  })();

  refreshPromise = p.finally(() => { refreshPromise = null; }) as Promise<string | null>;
  return refreshPromise;
}

function handleSessionExpired() {
  if (typeof window === 'undefined') return;

  if (!sessionExpiredNotified) {
    sessionExpiredNotified = true;
    MantineNotifications.notifications.show({
      title: 'Session Expired',
      message: 'Your session has expired. Please log in again.',
      color: 'yellow',
      autoClose: 5000,
    });
  }

  // Store current path for redirect after login
  const currentPath = window.location.pathname + window.location.search;
  if (currentPath && !currentPath.includes('/login')) {
    sessionStorage.setItem('redirectAfterLogin', currentPath);
  }

  // Clear tokens and role
  localStorage.removeItem('accessToken');
  localStorage.removeItem('tokenExpiresAt');
  localStorage.removeItem('userRole');

  setTimeout(() => {
    window.location.href = '/login';
  }, 1200);
}

/**
 * Handles a FORBIDDEN (403) response — the token is valid but the user's role
 * does not have permission for this operation.
 *
 * Most common cause: a provider's token is in localStorage while the patient
 * dashboard is open (or vice versa). Clear the stale token and redirect to
 * the correct login page so the user can sign in with the right account.
 */
function handleForbidden() {
  if (typeof window === 'undefined') return;

  // Read the stored role to redirect to the right login page
  const storedRole = localStorage.getItem('userRole') ?? 'patient';
  const loginPath = storedRole === 'PROVIDER' ? '/login?role=provider' : '/login?role=patient';

  MantineNotifications.notifications.show({
    title: 'Access Denied',
    message: 'Your session does not have permission for this action. Please log in again.',
    color: 'red',
    autoClose: 5000,
  });

  // Clear all auth state
  localStorage.removeItem('accessToken');
  localStorage.removeItem('tokenExpiresAt');
  localStorage.removeItem('userRole');
  document.cookie = 'dentiq_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'dentiq_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  setTimeout(() => {
    window.location.href = loginPath;
  }, 1500);
}

// ── Error Link — auto-refresh on 401, redirect on 403 ────────────────────────

const errorLink = onError((errorResponse) => {
  const { error, operation, forward } = errorResponse;

  // GraphQL errors (UNAUTHENTICATED / FORBIDDEN extension codes)
  if (CombinedGraphQLErrors.is(error)) {
    for (const gqlError of error.errors) {
      const code = gqlError.extensions?.code as string | undefined;

      if (code === 'UNAUTHENTICATED') {
        return new Observable((observer) => {
          refreshAccessToken()
            .then((newToken) => {
              if (!newToken) {
                handleSessionExpired();
                observer.error(new Error('Session expired'));
                return;
              }

              // Retry with new token
              operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
                headers: {
                  ...headers,
                  authorization: `Bearer ${newToken}`,
                },
              }));

              forward(operation).subscribe(observer);
            })
            .catch(() => {
              handleSessionExpired();
              observer.error(new Error('Session expired'));
            });
        });
      }

      if (code === 'FORBIDDEN') {
        handleForbidden();
        return;
      }
    }
  }

  // Network / other errors
  if (error) {
    console.error('Apollo error:', error);
  }

  return undefined;
});

// ── Apollo Client ─────────────────────────────────────────────────────────────

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network', errorPolicy: 'all' },
    query:      { fetchPolicy: 'network-only',      errorPolicy: 'all' },
    mutate:     { errorPolicy: 'all' },
  },
});

export default apolloClient;

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return false;
  const expiresAt = localStorage.getItem('tokenExpiresAt');
  if (!expiresAt) return true;
  return Date.now() >= parseInt(expiresAt, 10);
}

export function clearAuthTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('tokenExpiresAt');
}
