import React from 'react';
/**
 * Auth Layout
 * Wraps all auth pages (login, register, forgot-password, etc.)
 * No public nav — just the auth chrome.
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D3NTIQ – Portal',
  description: 'Sign in or create your D3NTIQ account',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
