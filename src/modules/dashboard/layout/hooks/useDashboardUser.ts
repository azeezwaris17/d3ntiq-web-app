/**
 * useDashboardUser
 *
 * Returns the authenticated user's profile for the dashboard layout.
 * Fetches from the backend via getMyProfile query.
 * Falls back to safe placeholder values while loading.
 */

import { useGetMyProfile } from '@/modules/dashboard/infrastructure/useDashboard';
import type { DashboardRole, DashboardUser } from '../types';

export function useDashboardUser(role: DashboardRole): DashboardUser {
  const { profile } = useGetMyProfile();

  if (!profile) {
    return {
      fullName: '...',
      idLabel: role === 'provider' ? 'Provider' : 'Patient',
      avatarUrl: undefined,
    };
  }

  return {
    fullName: profile.fullName,
    idLabel: profile.idLabel,
    avatarUrl: profile.avatarUrl ?? undefined,
  };
}
