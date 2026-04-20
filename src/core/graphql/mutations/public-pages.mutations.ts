/**
 * Public Pages GraphQL Mutations
 *
 * These mutations follow the backend contract defined in:
 * - PUBLIC-PAGES-GRAPHQL-REFERENCE.md
 * - PUBLIC-PAGES-EXAMPLE-QUERIES.md
 */

import { gql } from '@apollo/client';

/**
 * Submit contact form
 */
export const SUBMIT_CONTACT_FORM_MUTATION = gql`
  mutation SubmitContactForm($input: ContactFormInput!) {
    submitContactForm(input: $input) {
      success
      message
      contactId
    }
  }
`;
