/**
 * Oral IQ GraphQL Queries
 */

import { gql } from '@apollo/client';

/**
 * Get condition information for display in Condition Information step
 */
export const GET_CONDITION_INFORMATION_QUERY = gql`
  query GetConditionInformation($input: SymptomAssessmentInput!) {
    getConditionInformation(input: $input) {
      whatIsHappening
      likelyConditions {
        id
        name
        description
        severity
        category
      }
      possibleCauses
    }
  }
`;

/**
 * Get available treatment options with optional filters
 */
export const TREATMENT_OPTIONS_QUERY = gql`
  query TreatmentOptions($filters: TreatmentFilter) {
    treatmentOptions(filters: $filters) {
      id
      title
      description
      category
      estimatedCost
      duration
      recoveryTime
      isActive
    }
  }
`;

/**
 * Get treatment option by ID
 */
export const TREATMENT_OPTION_QUERY = gql`
  query TreatmentOption($id: ID!) {
    treatmentOption(id: $id) {
      id
      title
      description
      category
      estimatedCost
      duration
      recoveryTime
      isActive
    }
  }
`;

/**
 * Get available conditions with optional filters
 */
export const CONDITIONS_QUERY = gql`
  query Conditions($filters: ConditionFilter) {
    conditions(filters: $filters) {
      id
      name
      description
      severity
      category
    }
  }
`;

/**
 * Get condition by ID
 */
export const CONDITION_QUERY = gql`
  query Condition($id: ID!) {
    condition(id: $id) {
      id
      name
      description
      severity
      category
    }
  }
`;

/**
 * Get all specialties
 */
export const SPECIALTIES_QUERY = gql`
  query Specialties {
    specialties {
      id
      name
      description
      icon
    }
  }
`;

/**
 * Get specialty by ID
 */
export const SPECIALTY_QUERY = gql`
  query Specialty($id: ID!) {
    specialty(id: $id) {
      id
      name
      description
      icon
    }
  }
`;
