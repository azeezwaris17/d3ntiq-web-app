/**
 * Apollo Client Configuration
 *
 * Single Apollo Client instance with:
 * - Auth link: attaches JWT token to every request automatically
 * - Error link: handles 401 UNAUTHENTICATED by refreshing the token and retrying
 * - HTTP link: sends requests to the GraphQL endpoint
 */

import { ApolloClient, InMemoryCache, HttpLink, from, Observable } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
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
      // Try cookie-based refresh first
      const resp = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (resp.ok) {
        const json = await resp.json().catch(() => null);
        const accessToken = json?.accessToken ?? json?.data?.accessToken ?? null;
        const expiresIn = json?.expiresIn ?? json?.data?.expiresIn ?? null;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          if (expiresIn) {
            localStorage.setItem('tokenExpiresAt', String(Date.now() + expiresIn * 1000));
          }
          sessionExpiredNotified = false;
          return accessToken;
        }
      }

      // Fallback: GraphQL mutation with refresh token from localStorage
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          query: `mutation RefreshToken($input: RefreshTokenInput!) {
            refreshToken(input: $input) { accessToken expiresIn }
          }`,
          variables: { input: { refreshToken } },
        }),
      });

      const result = await response.json();
      if (result.errors?.length || !result.data?.refreshToken) {
        throw new Error('Token refresh failed');
      }

      const { accessToken, expiresIn } = result.data.refreshToken;
      localStorage.setItem('accessToken', accessToken);
      if (expiresIn) {
        localStorage.setItem('tokenExpiresAt', String(Date.now() + expiresIn * 1000));
      }
      sessionExpiredNotified = false;
      return accessToken;
    } catch (err) {
      console.error('Token refresh failed:', err);
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

  // Clear tokens
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresAt');

  setTimeout(() => {
    window.location.href = '/login';
  }, 1200);
}

// ── Error Link — auto-refresh on 401, then retry ──────────────────────────────

const errorLink = onError((errorResponse) => {
  const { graphQLErrors, networkError, operation, forward } = errorResponse as any;
  if (graphQLErrors) {
    for (const { extensions } of graphQLErrors) {
      if (extensions?.code === 'UNAUTHENTICATED') {
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
    }
  }

  if (networkError) {
    console.error('Network error:', networkError);
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
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresAt');
}
