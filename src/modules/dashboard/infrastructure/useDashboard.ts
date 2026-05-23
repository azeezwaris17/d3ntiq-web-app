/**
 * useDashboard.ts
 * React hooks for all dashboard GraphQL queries and mutations.
 */

import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_MY_PROFILE_QUERY,
  UPDATE_PATIENT_PROFILE_MUTATION,
  UPDATE_PROVIDER_PROFILE_MUTATION,
  SUBMIT_INSURANCE_PROFILE_MUTATION,
} from './dashboard.graphql';

// ── Shared types ──────────────────────────────────────────────────────────────

/** The currently authenticated user — patient or provider. */
export interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  idLabel: string;
  phone?: string | null;
  avatarUrl?: string | null;
  // Patient-only (null for providers)
  patientAddress?: string | null;
  dateOfBirth?: string | null;
  currentProvider?: string | null;
  // Provider-only (null for patients)
  specialty?: string | null;
  practiceName?: string | null;
  address?: string | null;
  /** Weekly working hours — provider only. Shape: { monday: { enabled, startTime, endTime }, ... } */
  workingHours?: Record<string, { enabled: boolean; startTime: string; endTime: string }> | null;
}

export interface PatientInsuranceProfile {
  id: string;
  insuranceProvider: string;
  memberId: string;
  groupNumber?: string | null;
  policyHolderName: string;
  policyHolderDob: string;
  relationshipToHolder: string;
  planType?: string | null;
  effectiveDate?: string | null;
  isPrimary: boolean;
  preferredProvider?: string | null;
  cardFrontUrl?: string | null;
  cardBackUrl?: string | null;
  createdAt: string;
}

// ── Get my profile ────────────────────────────────────────────────────────────

export function useGetMyProfile() {
  const { data, loading, error, refetch } = useQuery<{ getMyProfile: AuthenticatedUser }>(
    GET_MY_PROFILE_QUERY,
    { fetchPolicy: 'cache-and-network' }
  );

  return {
    profile: data?.getMyProfile ?? null,
    loading,
    error: error ?? null,
    refetch,
  };
}

// ── Update patient profile ────────────────────────────────────────────────────

export interface UpdatePatientProfileInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date | null;
  address?: string;
  currentProvider?: string;
}

export function useUpdatePatientProfile() {
  const [mutate, { loading, error }] = useMutation<
    { updatePatientProfile: AuthenticatedUser },
    { input: UpdatePatientProfileInput }
  >(UPDATE_PATIENT_PROFILE_MUTATION);

  async function updatePatientProfile(input: UpdatePatientProfileInput): Promise<AuthenticatedUser> {
    const result = await mutate({ variables: { input } });
    if (result.error) throw new Error(result.error.message);
    if (!result.data) throw new Error('No data returned from server.');
    return result.data.updatePatientProfile;
  }

  return { updatePatientProfile, loading, error };
}

// ── Update provider profile ───────────────────────────────────────────────────

export interface UpdateProviderProfileInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialty?: string;
  practiceName?: string;
  address?: string;
  workingHours?: Record<string, { enabled: boolean; startTime: string; endTime: string }>;
}

export function useUpdateProviderProfile() {
  const [mutate, { loading, error }] = useMutation<
    { updateProviderProfile: AuthenticatedUser },
    { input: UpdateProviderProfileInput }
  >(UPDATE_PROVIDER_PROFILE_MUTATION);

  async function updateProviderProfile(input: UpdateProviderProfileInput): Promise<AuthenticatedUser> {
    const result = await mutate({ variables: { input } });
    if (result.error) throw new Error(result.error.message);
    if (!result.data) throw new Error('No data returned from server.');
    return result.data.updateProviderProfile;
  }

  return { updateProviderProfile, loading, error };
}

// ── Update provider availability (working hours only) ─────────────────────────
//
// The availability tab only needs to send workingHours — it doesn't touch
// name, email, or other profile fields. We reuse the same updateProviderProfile
// mutation but only pass the workingHours field alongside the required fields
// read from the current profile.

export function useUpdateProviderAvailability() {
  const { profile } = useGetMyProfile();
  const [mutate, { loading, error }] = useMutation<
    { updateProviderProfile: AuthenticatedUser },
    { input: UpdateProviderProfileInput }
  >(UPDATE_PROVIDER_PROFILE_MUTATION);

  /**
   * Saves the working hours schedule to the database.
   * All other profile fields are preserved from the current profile.
   */
  async function saveAvailability(
    workingHours: Record<string, { enabled: boolean; startTime: string; endTime: string }>
  ): Promise<void> {
    if (!profile) throw new Error('Profile not loaded yet.');

    // Split fullName back into firstName / lastName for the required fields
    const parts = profile.fullName.split(' ');
    const firstName = parts[0] ?? '';
    const lastName  = parts.slice(1).join(' ');

    const result = await mutate({
      variables: {
        input: {
          firstName,
          lastName,
          email:        profile.email,
          phone:        profile.phone ?? undefined,
          specialty:    profile.specialty ?? undefined,
          practiceName: profile.practiceName ?? undefined,
          address:      profile.address ?? undefined,
          workingHours,
        },
      },
    });

    if (result.error) throw new Error(result.error.message);
  }

  return { saveAvailability, loading, error };
}

// ── Submit insurance profile ──────────────────────────────────────────────────

export interface SubmitInsuranceProfileInput {
  insuranceProvider: string;
  memberId: string;
  groupNumber?: string;
  policyHolderName: string;
  policyHolderDob: string;
  relationshipToHolder: string;
  planType?: string;
  effectiveDate?: string;
  isPrimary?: boolean;
  preferredProvider?: string;
  cardFrontUrl?: string;
  cardBackUrl?: string;
}

export function useSubmitInsuranceProfile() {
  const [mutate, { loading, error }] = useMutation<
    { submitInsuranceProfile: PatientInsuranceProfile },
    { input: SubmitInsuranceProfileInput }
  >(SUBMIT_INSURANCE_PROFILE_MUTATION);

  async function submitInsuranceProfile(input: SubmitInsuranceProfileInput): Promise<PatientInsuranceProfile> {
    const result = await mutate({ variables: { input } });
    if (result.error) throw new Error(result.error.message);
    if (!result.data) throw new Error('No data returned from server.');
    return result.data.submitInsuranceProfile;
  }

  return { submitInsuranceProfile, loading, error };
}

// ── Change password ───────────────────────────────────────────────────────────

import { CHANGE_PASSWORD_MUTATION } from './dashboard.graphql';

export function useChangePassword() {
  const [mutate, { loading, error }] = useMutation<
    { changePassword: boolean },
    { input: { currentPassword: string; newPassword: string } }
  >(CHANGE_PASSWORD_MUTATION);

  async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const result = await mutate({ variables: { input: { currentPassword, newPassword } } });
    if (result.error) throw new Error(result.error.message);
    if (!result.data?.changePassword) throw new Error('Password change failed. Please try again.');
  }

  return { changePassword, loading, error };
}
