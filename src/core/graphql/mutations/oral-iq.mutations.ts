/**
 * Oral IQ GraphQL Mutations
 */

import { gql } from '@apollo/client';

/**
 * Process symptom assessment and return treatment recommendations
 */
export const PROCESS_SYMPTOM_ASSESSMENT_MUTATION = gql`
  mutation ProcessSymptomAssessment($input: SymptomAssessmentInput!) {
    processSymptomAssessment(input: $input) {
      treatments {
        id
        title
        description
        category
        estimatedCost
        duration
        recoveryTime
        isActive
      }
      matchedConditions {
        id
        name
        description
        severity
        category
      }
      confidence
      summary
    }
  }
`;

/**
 * Generate personalized recommendations based on treatment recommendations
 */
export const GENERATE_PERSONALIZED_RECOMMENDATION_MUTATION = gql`
  mutation GeneratePersonalizedRecommendation($input: PersonalizedRecommendationInput!) {
    generatePersonalizedRecommendation(input: $input) {
      specialties {
        specialty {
          id
          name
          description
          icon
        }
        treatments {
          id
          title
          description
          category
          estimatedCost
          duration
          recoveryTime
        }
        matchScore
      }
      nextSteps
      generalAdvice
    }
  }
`;
