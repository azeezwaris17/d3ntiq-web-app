/**
 * GraphQL Client Configuration
 *
 * This file provides centralized configuration for Apollo Client (GraphQL).
 * It includes authentication, error handling, and token refresh logic.
 */

import { ApolloClient, InMemoryCache, createHttpLink, from, Observable } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { apiConfig } from './api.config';
import { logger } from '@/core/logging';
import * as MantineNotifications from '@mantine/notifications';

// Get GraphQL endpoint from environment or use default
const getGraphQLEndpoint = (): string => {
  const baseUrl = apiConfig.baseUrl.replace(/\/$/, '');
  const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '/graphql';
  return `${baseUrl}${graphqlEndpoint}`;
};

// HTTP link for GraphQL requests
const httpLink = createHttpLink({
  uri: getGraphQLEndpoint(),
  credentials: 'same-origin',
});

// Auth link to add authorization header
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage (client-side) or from cookies (SSR)
  let token: string | null = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error link for handling authentication errors and token refresh
// Single-flight refresh promise to prevent concurrent refresh requests
let refreshPromise: Promise<string | null> | null = null;
// Prevent showing the session-expired notification multiple times
let sessionExpiredNotified = false;
const errorLink = onError((errorHandlerOptions) => {
  const { graphQLErrors, networkError, operation, forward } = errorHandlerOptions as any;
  if (graphQLErrors) {
    for (const { message, extensions } of graphQLErrors) {
      logger.error('GraphQL error', new Error(message), {
        module: 'graphql',
        metadata: { extensions },
      });

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Attempt to refresh token
        return new Observable((observer) => {
          refreshAccessToken()
            .then((accessToken) => {
              if (!accessToken) {
                // Refresh failed, clear tokens and redirect to login
                if (typeof window !== 'undefined') {
                  // Show notification to user (only once)
                  if (!sessionExpiredNotified) {
                    sessionExpiredNotified = true;
                    MantineNotifications.notifications.show({
                      title: 'Session Expired',
                      message: 'Your session has expired. Please log in again to continue.',
                      color: 'yellow',
                      autoClose: 5000,
                    });
                  }

                  // Store current path for redirect after login
                  const currentPath = window.location.pathname + window.location.search;
                  if (
                    currentPath &&
                    !currentPath.includes('/provider/login') &&
                    !currentPath.includes('/provider/register')
                  ) {
                    sessionStorage.setItem('redirectAfterLogin', currentPath);
                  }

                  clearAuthTokens();

                  // Delay redirect to allow notification to be seen
                  setTimeout(() => {
                    window.location.href = '/provider/login';
                  }, 1000);
                }
                // Forward the operation without retry
                forward(operation).subscribe(observer);
                return;
              }

              // Retry the original request with new token
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${accessToken}`,
                },
              });
              forward(operation).subscribe(observer);
            })
            .catch(() => {
              // Refresh failed, clear tokens and redirect to login
              if (typeof window !== 'undefined') {
                // Show notification to user (only once)
                if (!sessionExpiredNotified) {
                  sessionExpiredNotified = true;
                  MantineNotifications.notifications.show({
                    title: 'Session Expired',
                    message: 'Your session has expired. Please log in again to continue.',
                    color: 'yellow',
                    autoClose: 5000,
                  });
                }

                // Store current path for redirect after login
                const currentPath = window.location.pathname + window.location.search;
                if (
                  currentPath &&
                  !currentPath.includes('/provider/login') &&
                  !currentPath.includes('/provider/register')
                ) {
                  sessionStorage.setItem('redirectAfterLogin', currentPath);
                }

                clearAuthTokens();

                // Delay redirect to allow notification to be seen
                setTimeout(() => {
                  window.location.href = '/provider/login';
                }, 1000);
              }
              // Forward the operation without retry
              forward(operation).subscribe(observer);
            });
        });
      }
    }
  }

  if (networkError) {
    logger.error('Network error', networkError as Error, {
      module: 'graphql',
    });
    // Log detailed information for 400 errors
    if ('statusCode' in networkError && networkError.statusCode === 400) {
      logger.error('GraphQL 400 Bad Request Details', networkError as Error, {
        module: 'graphql',
        metadata: {
          operationName: operation.operationName,
          query: operation.query.loc?.source.body,
          variables: operation.variables,
        },
      });
    }
  }

  // Return forward chain for non-auth errors
  return forward(operation);
});

/**
 * Refresh access token with a cookie-first approach and a single-flight lock
 * 1) Try an HTTP cookie-based refresh endpoint (POST /auth/refresh) with credentials included
 * 2) Fallback to the existing GraphQL mutation-based refresh using a locally-stored refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  // If a refresh is already in progress, return the same promise so callers wait for it
  if (refreshPromise) return refreshPromise;

  // Create the single-flight refresh promise
  const p = (async (): Promise<string | null> => {
    try {
      // Try cookie-based refresh first (backend should set an httpOnly refresh cookie)
      try {
        const refreshUrl = `${apiConfig.baseUrl.replace(/\/$/, '')}/auth/refresh`;
        const resp = await fetch(refreshUrl, {
          method: 'POST',
          credentials: 'include', // include httpOnly cookies
          headers: { 'Content-Type': 'application/json' },
        });

        if (resp.ok) {
          // Expecting { accessToken, expiresIn } or similar JSON payload
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

          // If server didn't return access token but set cookie, try GraphQL or consider user still authenticated.
        }
      } catch (_err) {
        // Cookie-based refresh failed; fall through to mutation fallback
      }

      // Fallback: use GraphQL mutation refresh token from localStorage
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const graphqlEndpoint = getGraphQLEndpoint();
      const mutation = `
        mutation RefreshToken($input: RefreshTokenInput!) {
          refreshToken(input: $input) {
            accessToken
            expiresIn
          }
        }
      `;

      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          query: mutation,
          variables: {
            input: {
              refreshToken,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0]?.message || 'Token refresh failed');
      }

      if (!result.data?.refreshToken) {
        throw new Error('Token refresh failed');
      }

      const { accessToken, expiresIn } = result.data.refreshToken;

      // Store new access token (do NOT automatically persist refresh token to localStorage unless explicitly allowed)
      localStorage.setItem('accessToken', accessToken);
      if (expiresIn) {
        localStorage.setItem('tokenExpiresAt', String(Date.now() + expiresIn * 1000));
      }

      sessionExpiredNotified = false;
      return accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  })();

  // Keep the global reference until the promise settles so other callers await the same work
  refreshPromise = p.finally(() => {
    refreshPromise = null;
  }) as Promise<string | null>;

  return refreshPromise;
}

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add field policies for pagination and caching
          providerPatients: {
            keyArgs: ['filters'],
            merge(_existing = [], incoming) {
              return incoming;
            },
          },
          providerAppointments: {
            keyArgs: ['filters'],
            merge(_existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
      // Cache conditions by ID
      Condition: {
        keyFields: ['id'],
      },
      // Cache treatment options by ID
      TreatmentOption: {
        keyFields: ['id'],
      },
      // Cache personalized recommendations by ID
      PersonalizedRecommendation: {
        keyFields: ['id'],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

/**
 * Check if token is expired
 */
export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const expiresAt = localStorage.getItem('tokenExpiresAt');
  if (!expiresAt) {
    return true;
  }

  return Date.now() >= parseInt(expiresAt, 10);
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('accessToken');
}

/**
 * Clear all authentication tokens and user data
 * Note: We attempt to clear a server-set httpOnly refresh cookie by calling the logout endpoint
 * (fire-and-forget). LocalStorage tokens are removed synchronously.
 */
export function clearAuthTokens(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Fire-and-forget server logout to clear httpOnly refresh cookie (backend may or may not implement this)
  void (async () => {
    try {
      await fetch(`${apiConfig.baseUrl.replace(/\/$/, '')}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (_e) {
      // Ignore network errors - best effort
    }
  })();

  // Clear client-side tokens
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresAt');
  localStorage.removeItem('userData');
}

/**
 * Store authentication tokens
 * - We store access token and expiry locally
 * - We prefer server-set httpOnly refresh cookies; storing refresh tokens in localStorage
 *   is only done if `NEXT_PUBLIC_ALLOW_REFRESH_TOKEN_IN_LOCAL_STORAGE` is explicitly set to 'true'
 */
export function storeAuthTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem('accessToken', accessToken);
  if (typeof expiresIn === 'number') {
    localStorage.setItem('tokenExpiresAt', String(Date.now() + expiresIn * 1000));
  }

  const allowLocalStorageRefresh =
    process.env.NEXT_PUBLIC_ALLOW_REFRESH_TOKEN_IN_LOCAL_STORAGE === 'true';
  if (refreshToken && allowLocalStorageRefresh) {
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    // Remove any stale refresh token to prefer cookie-based flow
    localStorage.removeItem('refreshToken');
  }
}
