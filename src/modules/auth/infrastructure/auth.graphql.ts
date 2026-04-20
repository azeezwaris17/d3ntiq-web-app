/**
 * auth.graphql.ts
 * All GraphQL documents for authentication operations.
 */

import { gql } from '@apollo/client';
import { AUTHENTICATED_USER_FRAGMENT } from '@/core/graphql/fragments';

export const REGISTER_MUTATION = gql`
  ${AUTHENTICATED_USER_FRAGMENT}
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        ...AuthenticatedUserFields
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  ${AUTHENTICATED_USER_FRAGMENT}
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        ...AuthenticatedUserFields
      }
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input)
  }
`;

export const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($input: VerifyOtpInput!) {
    verifyOtp(input: $input)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;
