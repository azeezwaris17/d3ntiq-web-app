/**
 * Shared GraphQL Fragments
 *
 * Two variants of the authenticated user fragment:
 * - PATIENT_USER_FRAGMENT  — patient-specific fields (dob, address, currentProvider)
 * - PROVIDER_USER_FRAGMENT — provider-specific fields (specialty, practiceName, address)
 *
 * Use AUTHENTICATED_USER_FRAGMENT as the default (patient) for backward compatibility.
 */

import { gql } from '@apollo/client';

export const PATIENT_USER_FRAGMENT = gql`
  fragment PatientUserFields on AuthenticatedUser {
    id
    fullName
    email
    role
    idLabel
    phone
    patientAddress
    dateOfBirth
    currentProvider
    avatarUrl
  }
`;

export const PROVIDER_USER_FRAGMENT = gql`
  fragment ProviderUserFields on AuthenticatedUser {
    id
    fullName
    email
    role
    idLabel
    phone
    specialty
    practiceName
    address
    avatarUrl
  }
`;

/**
 * Default fragment — includes all fields (used in auth mutations where role
 * is not yet known, e.g. register / login response).
 */
export const AUTHENTICATED_USER_FRAGMENT = gql`
  fragment AuthenticatedUserFields on AuthenticatedUser {
    id
    fullName
    email
    role
    idLabel
    phone
    specialty
    practiceName
    address
    patientAddress
    dateOfBirth
    currentProvider
    avatarUrl
  }
`;
