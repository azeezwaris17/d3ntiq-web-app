import { gql } from '@apollo/client';

export const REGISTER_PRACTICE = gql`
  mutation RegisterPractice($input: RegisterPracticeInput!) {
    registerPractice(input: $input) {
      id
      workEmail
      phone
      specialty
      status
      createdAt
    }
  }
`;
