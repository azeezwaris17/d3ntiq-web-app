/**
 * Shared GraphQL Fragments
 * 
 * This file contains reusable GraphQL fragments that are used across multiple modules.
 * Centralizing fragments here prevents duplicate fragment name errors.
 */

import { gql } from '@apollo/client';

/**
 * AuthenticatedUserFields Fragment
 * 
 * Contains all fields for an authenticated user.
 * Used in auth and dashboard operations.
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
    avatarUrl
  }
`;
