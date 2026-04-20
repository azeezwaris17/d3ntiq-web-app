/**
 * useAuth.ts
 * React hooks for all authentication GraphQL mutations.
 */

import { useMutation } from '@apollo/client/react';
import {
  REGISTER_MUTATION,
  LOGIN_MUTATION,
  FORGOT_PASSWORD_MUTATION,
  VERIFY_OTP_MUTATION,
  RESET_PASSWORD_MUTATION,
  LOGOUT_MUTATION,
} from './auth.graphql';

// ── Shared types ──────────────────────────────────────────────────────────────

export interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  idLabel: string;
  avatarUrl?: string | null;
}

export interface AuthResult {
  accessToken: string;
  user: AuthenticatedUser;
}

// ── Cookie helpers ────────────────────────────────────────────────────────────

function setAuthCookies(role: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `dentiq_auth=true; path=/; expires=${expires}; SameSite=Lax`;
  document.cookie = `dentiq_role=${role.toLowerCase()}; path=/; expires=${expires}; SameSite=Lax`;
}

function clearAuthCookies() {
  document.cookie = 'dentiq_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'dentiq_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

// ── Register ──────────────────────────────────────────────────────────────────

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  role: 'PATIENT' | 'PROVIDER';
  phone?: string;
  specialty?: string;
  practiceName?: string;
  address?: string;
}

export function useRegister() {
  const [mutate, { loading, error }] = useMutation<
    { register: AuthResult },
    { input: RegisterInput }
  >(REGISTER_MUTATION);

  async function register(input: RegisterInput): Promise<AuthResult> {
    const result = await mutate({ variables: { input } });
    if (result.error) throw result.error;
    if (!result.data) throw new Error('No data returned from server.');
    localStorage.setItem('accessToken', result.data.register.accessToken);
    setAuthCookies(input.role);
    return result.data.register;
  }

  return { register, loading, error };
}

// ── Login ─────────────────────────────────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
  role: 'PATIENT' | 'PROVIDER';
}

export function useLogin() {
  const [mutate, { loading, error }] = useMutation<
    { login: AuthResult },
    { input: LoginInput }
  >(LOGIN_MUTATION);

  async function login(input: LoginInput): Promise<AuthResult> {
    const result = await mutate({ variables: { input } });
    if (result.error) throw result.error;
    if (!result.data) throw new Error('No data returned from server.');
    localStorage.setItem('accessToken', result.data.login.accessToken);
    setAuthCookies(input.role);
    return result.data.login;
  }

  return { login, loading, error };
}

// ── Forgot password ───────────────────────────────────────────────────────────

export interface ForgotPasswordInput {
  email: string;
  role: 'PATIENT' | 'PROVIDER';
}

export function useForgotPassword() {
  const [mutate, { loading, error }] = useMutation<
    { forgotPassword: boolean },
    { input: ForgotPasswordInput }
  >(FORGOT_PASSWORD_MUTATION);

  async function forgotPassword(input: ForgotPasswordInput): Promise<boolean> {
    const result = await mutate({ variables: { input } });
    if (result.error) throw result.error;
    return result.data?.forgotPassword ?? false;
  }

  return { forgotPassword, loading, error };
}

// ── Verify OTP ────────────────────────────────────────────────────────────────

export interface VerifyOtpInput {
  email: string;
  otp: string;
  role: 'PATIENT' | 'PROVIDER';
}

export function useVerifyOtp() {
  const [mutate, { loading, error }] = useMutation<
    { verifyOtp: boolean },
    { input: VerifyOtpInput }
  >(VERIFY_OTP_MUTATION);

  async function verifyOtp(input: VerifyOtpInput): Promise<boolean> {
    const result = await mutate({ variables: { input } });
    if (result.error) throw result.error;
    return result.data?.verifyOtp ?? false;
  }

  return { verifyOtp, loading, error };
}

// ── Reset password ────────────────────────────────────────────────────────────

export interface ResetPasswordInput {
  email: string;
  newPassword: string;
  role: 'PATIENT' | 'PROVIDER';
}

export function useResetPassword() {
  const [mutate, { loading, error }] = useMutation<
    { resetPassword: boolean },
    { input: ResetPasswordInput }
  >(RESET_PASSWORD_MUTATION);

  async function resetPassword(input: ResetPasswordInput): Promise<boolean> {
    const result = await mutate({ variables: { input } });
    if (result.error) throw result.error;
    return result.data?.resetPassword ?? false;
  }

  return { resetPassword, loading, error };
}

// ── Logout ────────────────────────────────────────────────────────────────────

export function useLogout() {
  const [mutate, { loading, error }] = useMutation<{ logout: boolean }>(LOGOUT_MUTATION);

  async function logout(): Promise<void> {
    await mutate();
    localStorage.removeItem('accessToken');
    clearAuthCookies();
  }

  return { logout, loading, error };
}
