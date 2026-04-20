/**
 * dashboard.graphql.ts
 * All GraphQL documents for dashboard operations.
 */

import { gql } from '@apollo/client';
import { AUTHENTICATED_USER_FRAGMENT } from '@/core/graphql/fragments';

export const GET_MY_PROFILE_QUERY = gql`
  ${AUTHENTICATED_USER_FRAGMENT}
  query GetMyProfile {
    getMyProfile {
      ...AuthenticatedUserFields
    }
  }
`;

export const UPDATE_PATIENT_PROFILE_MUTATION = gql`
  ${AUTHENTICATED_USER_FRAGMENT}
  mutation UpdatePatientProfile($input: UpdatePatientProfileInput!) {
    updatePatientProfile(input: $input) {
      ...AuthenticatedUserFields
    }
  }
`;

export const UPDATE_PROVIDER_PROFILE_MUTATION = gql`
  ${AUTHENTICATED_USER_FRAGMENT}
  mutation UpdateProviderProfile($input: UpdateProviderProfileInput!) {
    updateProviderProfile(input: $input) {
      ...AuthenticatedUserFields
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
