/**
 * User-Friendly Error Messages Utility
 *
 * This utility provides user-friendly error messages for common technical errors.
 * It maps technical error messages to messages that users can understand.
 */

/**
 * Maps technical error messages to user-friendly messages
 */
export function getUserFriendlyErrorMessage(error: Error | string | null | undefined): string {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  const errorMessage = error instanceof Error ? error.message : error;
  const lowerMessage = errorMessage.toLowerCase();

  // Authentication errors
  if (
    lowerMessage.includes('invalid login response') ||
    lowerMessage.includes('invalid registration response')
  ) {
    return 'We encountered an issue processing your request. Please try again in a moment.';
  }

  if (
    lowerMessage.includes('invalid email or password') ||
    lowerMessage.includes('invalid credentials')
  ) {
    return 'The email or password you entered is incorrect. Please check your credentials and try again.';
  }

  if (lowerMessage.includes('user with this email already exists')) {
    return 'An account with this email address already exists. Please use a different email or try logging in.';
  }

  if (lowerMessage.includes('user not found')) {
    return 'No account found with this email address. Please check your email or sign up for a new account.';
  }

  if (lowerMessage.includes('invalid or expired password reset token')) {
    return 'This password reset link has expired or is invalid. Please request a new password reset link.';
  }

  if (lowerMessage.includes('passwords do not match')) {
    return 'The passwords you entered do not match. Please make sure both password fields are identical.';
  }

  if (
    lowerMessage.includes('token refresh failed') ||
    lowerMessage.includes('invalid refresh token')
  ) {
    return 'Your session has expired. Please log in again to continue.';
  }

  if (lowerMessage.includes('token validation failed')) {
    return 'Your session is no longer valid. Please log in again.';
  }

  // Network errors
  if (lowerMessage.includes('network error') || lowerMessage.includes('fetch failed')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return 'The request took too long to complete. Please try again.';
  }

  // GraphQL/API errors
  if (lowerMessage.includes('failed to fetch') || lowerMessage.includes('invalid response')) {
    return 'We encountered an issue communicating with the server. Please try again.';
  }

  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('unauthenticated')) {
    return 'You need to be logged in to perform this action. Please log in and try again.';
  }

  if (lowerMessage.includes('forbidden') || lowerMessage.includes('access denied')) {
    return 'You do not have permission to perform this action.';
  }

  // Data errors
  if (lowerMessage.includes('not found')) {
    return 'The requested information could not be found.';
  }

  if (lowerMessage.includes('already exists')) {
    return 'This item already exists. Please use a different value.';
  }

  if (lowerMessage.includes('invalid') && lowerMessage.includes('response')) {
    return 'We received an unexpected response from the server. Please try again.';
  }

  // Generic fallbacks for common patterns
  if (lowerMessage.includes('failed to')) {
    return errorMessage.replace(/failed to/i, 'Unable to');
  }

  // If no match found, return a generic user-friendly message
  // but preserve some context if it's already user-friendly
  if (
    errorMessage.length < 100 &&
    !errorMessage.includes('Error:') &&
    !errorMessage.includes('at ')
  ) {
    // Likely already user-friendly
    return errorMessage;
  }

  return 'Something went wrong. Please try again, and if the problem persists, contact support.';
}

/**
 * Common user-friendly error messages as constants
 */
export const USER_ERROR_MESSAGES = {
  LOGIN_FAILED: 'Unable to log in. Please check your email and password and try again.',
  LOGIN_INVALID_CREDENTIALS: 'The email or password you entered is incorrect. Please try again.',
  LOGIN_NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  LOGIN_UNEXPECTED: 'We encountered an issue logging you in. Please try again in a moment.',

  REGISTRATION_FAILED: 'Unable to create your account. Please try again.',
  REGISTRATION_EMAIL_EXISTS:
    'An account with this email already exists. Please use a different email or log in.',
  REGISTRATION_NETWORK_ERROR:
    'Unable to connect to the server. Please check your internet connection.',

  PASSWORD_RESET_FAILED: 'Unable to reset your password. Please try again.',
  PASSWORD_RESET_TOKEN_INVALID:
    'This password reset link has expired or is invalid. Please request a new one.',
  PASSWORD_MISMATCH:
    'The passwords you entered do not match. Please make sure both fields are identical.',

  SESSION_EXPIRED: 'Your session has expired. Please log in again to continue.',
  UNAUTHORIZED: 'You need to be logged in to perform this action.',
  FORBIDDEN: 'You do not have permission to perform this action.',

  NETWORK_ERROR:
    'Unable to connect to the server. Please check your internet connection and try again.',
  TIMEOUT: 'The request took too long to complete. Please try again.',
  SERVER_ERROR: 'We encountered an issue on our end. Please try again in a moment.',
  UNEXPECTED_ERROR:
    'An unexpected error occurred. Please try again, and if the problem persists, contact support.',

  NOT_FOUND: 'The requested information could not be found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;
