import { gql } from '@apollo/client';

export const ASSESS_ORAL_HEALTH = gql`
  mutation AssessOralHealth($input: SymptomAssessmentInput!) {
    assessOralHealth(input: $input) {
      matchedConditions {
        id
        name
        description
        symptoms
        severity
        detailedExplanation
        possibleCauses
        recommendedActions
        whenToSeekCare
      }
      treatments {
        id
        title
        description
        conditionName
        causeTreated
        estimatedCost
        category
        specialty
      }
      specialties {
        id
        name
        icon
        description
      }
      recommendations
      aiMetadata {
        concerns
        severityLevel
        personalizedGuidance
        professionalCareRecommendation
        disclaimer
      }
    }
  }
`;
