/**
 * dashboard.graphql.ts
 * All GraphQL documents for dashboard operations.
 */

import { gql } from '@apollo/client';
import { PATIENT_USER_FRAGMENT, PROVIDER_USER_FRAGMENT, AUTHENTICATED_USER_FRAGMENT } from '@/core/graphql/fragments';

// ── Get my profile ────────────────────────────────────────────────────────────
// Uses the full fragment — the resolver only populates fields relevant to the
// user's role, so provider fields will be null for patients and vice versa.

export const GET_MY_PROFILE_QUERY = gql`
  ${AUTHENTICATED_USER_FRAGMENT}
  query GetMyProfile {
    getMyProfile {
      ...AuthenticatedUserFields
    }
  }
`;

export const UPDATE_PATIENT_PROFILE_MUTATION = gql`
  ${PATIENT_USER_FRAGMENT}
  mutation UpdatePatientProfile($input: UpdatePatientProfileInput!) {
    updatePatientProfile(input: $input) {
      ...PatientUserFields
    }
  }
`;

export const UPDATE_PROVIDER_PROFILE_MUTATION = gql`
  ${PROVIDER_USER_FRAGMENT}
  mutation UpdateProviderProfile($input: UpdateProviderProfileInput!) {
    updateProviderProfile(input: $input) {
      ...ProviderUserFields
    }
  }
`;

export const SUBMIT_INSURANCE_PROFILE_MUTATION = gql`
  mutation SubmitInsuranceProfile($input: SubmitInsuranceProfileInput!) {
    submitInsuranceProfile(input: $input) {
      id
      insuranceProvider
      memberId
      groupNumber
      policyHolderName
      policyHolderDob
      relationshipToHolder
      planType
      effectiveDate
      isPrimary
      preferredProvider
      cardFrontUrl
      cardBackUrl
      createdAt
    }
  }
`;
