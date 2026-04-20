/**
 * auth-error.ts
 * Maps raw GraphQL / network errors to user-friendly messages
 * appropriate for each auth context.
 */

type AuthContext =
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'verifyOtp'
  | 'resetPassword';

/**
 * Returns a clear, friendly error message the user can act on.
 * Never exposes internal details like stack traces or DB errors.
 */
export function friendlyAuthError(err: unknown, context: AuthContext): string {
  const raw = err instanceof Error ? err.message.toLowerCase() : '';

  // Network / server down
  if (
    raw.includes('network') ||
    raw.includes('fetch') ||
    raw.includes('failed to fetch') ||
    raw.includes('econnrefused')
  ) {
    return 'Unable to reach the server. Please check your internet connection and try again.';
  }

  // Rate limited
  if (raw.includes('too many') || raw.includes('rate limit')) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }

  switch (context) {
    case 'login':
      if (raw.includes('unauthorized') || raw.includes('invalid') || raw.includes('credentials')) {
        return 'Incorrect email or password. Please check your details and try again.';
      }
      if (raw.includes('not found') || raw.includes('no user')) {
        return 'No account found with that email address. Please register first.';
      }
      if (raw.includes('inactive') || raw.includes('disabled')) {
        return 'Your account has been deactivated. Please contact support.';
      }
      return 'Sign in failed. Please check your email and password and try again.';

    case 'register':
      if (raw.includes('already exists') || raw.includes('duplicate') || raw.includes('unique')) {
        return 'An account with this email already exists. Please log in or use a different email.';
      }
      if (raw.includes('password')) {
        return 'Password does not meet the requirements. Please use at least 8 characters.';
      }
      return 'Registration failed. Please check your details and try again.';

    case 'forgotPassword':
      // Always show a neutral message — never confirm whether an email exists
      return 'If an account with that email exists, a reset code has been sent. Please check your inbox.';

    case 'verifyOtp':
      if (raw.includes('expired')) {
        return 'Your verification code has expired. Please request a new one.';
      }
      if (raw.includes('invalid') || raw.includes('incorrect') || raw.includes('wrong')) {
        return 'Incorrect code. Please check the code sent to your email and try again.';
      }
      return 'Verification failed. Please check the code and try again.';

    case 'resetPassword':
      if (raw.includes('expired') || raw.includes('invalid token')) {
        return 'Your reset session has expired. Please request a new reset code.';
      }
      if (raw.includes('password')) {
        return 'Password does not meet the requirements. Please use at least 8 characters.';
      }
      return 'Password reset failed. Please request a new reset code and try again.';

    default:
      return 'Something went wrong. Please try again.';
  }
}
