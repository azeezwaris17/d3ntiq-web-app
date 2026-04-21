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
