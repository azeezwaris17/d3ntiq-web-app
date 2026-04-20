/**
 * Auth types shared across all auth pages.
 */

/** The two roles supported in the MVP */
export type AuthRole = 'patient' | 'provider';

/** Read the role from a URLSearchParams object, defaulting to 'patient' */
export function getRoleFromParams(params: URLSearchParams): AuthRole {
  const role = params.get('role');
  return role === 'provider' ? 'provider' : 'patient';
}
