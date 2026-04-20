'use client';
import React from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import { Center, Loader } from '@mantine/core';
import { useGetMyProfile } from '@/modules/dashboard/infrastructure/useDashboard';
import type { DashboardRole } from '../types';

interface AuthGuardProps {
  role: DashboardRole;
  children: React.ReactNode;
}

export function AuthGuard({ role, children }: AuthGuardProps) {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const { profile, loading, error } = useGetMyProfile();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // No token — redirect immediately
    if (!localStorage.getItem('accessToken')) {
      router.replace(`/login?role=${role}`);
      return;
    }

    // Apollo returned an auth error — token expired or invalid
    if (error) {
      const message = error.message?.toLowerCase() ?? '';
      const isAuthError =
        message.includes('unauthenticated') ||
        message.includes('unauthorized') ||
        message.includes('jwt');

      if (isAuthError) {
        localStorage.removeItem('accessToken');
        document.cookie = 'dentiq_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'dentiq_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        void apolloClient.clearStore();
        router.replace(`/login?role=${role}`);
      }
    }

    // Profile loaded — verify the role matches
    if (profile && !loading) {
      const profileRole = profile.role.toLowerCase() as DashboardRole;
      if (profileRole !== role) {
        router.replace(profileRole === 'provider' ? '/provider/profile' : '/patient/oral-iq');
      }
    }
  }, [profile, loading, error, role, router, apolloClient]);

  if (loading && !profile) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="md" color="#2d7d9a" />
      </Center>
    );
  }

  return <>{children}</>;
}
