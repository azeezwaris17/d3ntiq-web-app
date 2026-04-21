/**
 * Oral IQ GraphQL Repository
 * Handles AI-powered oral health assessment using Apollo Client
 */

import { useMutation } from '@apollo/client/react';
import type {
  SymptomAssessmentInput,
  OralIQAssessment,
} from '../../domain/entities/ai-treatment-recommendation.entity';
import { ASSESS_ORAL_HEALTH } from '../services/graphql-queries';

// ============================================================================
// Unified Assessment Hook
// ============================================================================

export function useAssessOralHealth() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    { assessOralHealth: OralIQAssessment },
    { input: SymptomAssessmentInput }
  >(ASSESS_ORAL_HEALTH, { errorPolicy: 'all' });

  const assess = async (input: SymptomAssessmentInput): Promise<OralIQAssessment> => {
    if (loading) return Promise.reject(new Error('Assessment already in progress'));
    const result = await mutate({ variables: { input } });
    if (result.error) throw new Error(result.error.message);
    if (!result.data) throw new Error('No data returned from server');
    return result.data.assessOralHealth;
  };

  return { assess, loading, error, data: data?.assessOralHealth, reset };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format input for GraphQL mutation
 */
export function formatSymptomAssessmentInput(
  selection: any,
  formData: any
): SymptomAssessmentInput {
  const regionId = selection.fdiNumber
    ? selection.fdiNumber.toString()
    : selection.regionId || 'TOOTH';

  const convertDuration = (duration: string): string => {
    const durationMap: Record<string, string> = {
      'less-than-1-day': '1 day',
      '1-3-days': '2 days',
      '4-7-days': '5 days',
      '1-2-weeks': '10 days',
      'more-than-2-weeks': '3 weeks',
      chronic: '3 months',
    };
    return durationMap[duration] || duration;
  };

  const normalizeEnum = (value: string | undefined): string | undefined => {
    return value ? value.toUpperCase() : undefined;
  };

  return {
    selection: {
      regionType: (normalizeEnum(selection.regionType) as any) || 'TOOTH',
      regionId: regionId,
      jaw: (normalizeEnum(selection.jaw) as any) || 'UPPER',
      quadrant: selection.quadrant,
      fdiNumber: selection.fdiNumber,
      toothType: normalizeEnum(selection.toothType) as any,
      userComplaint: selection.userComplaint,
    },
    formData: {
      symptomTypes: formData.symptomTypes ?? [],
      painLevel: formData.painLevel,
      duration: convertDuration(formData.duration || '1 day'),
      specificSensations: formData.specificSensations || '',
      sensations: {
        sharpPain: Boolean(formData.sensations?.sharpPain),
        dullAche: Boolean(formData.sensations?.dullAche),
        throbbing: Boolean(formData.sensations?.throbbing),
      },
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate symptom assessment input before sending to backend
 */
export function validateSymptomAssessmentInput(input: SymptomAssessmentInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.selection.regionType) errors.push('Region type is required');
  if (!input.selection.regionId) errors.push('Region ID is required');
  if (!input.selection.jaw) errors.push('Jaw position is required');

  if (!input.formData.symptomTypes || input.formData.symptomTypes.length === 0) {
    errors.push('At least one symptom type is required');
  }

  if (input.formData.painLevel !== undefined && input.formData.painLevel !== null) {
    if (
      !Number.isInteger(input.formData.painLevel) ||
      input.formData.painLevel < 0 ||
      input.formData.painLevel > 10
    ) {
      errors.push('Pain level must be an integer between 0 and 10');
    }
  }

  if (!input.formData.duration) {
    errors.push('Duration is required');
  } else {
    const durationPattern = /^(\d+)\s*(hour|hours|day|days|week|weeks|month|months|year|years)$/i;
    if (!durationPattern.test(input.formData.duration)) {
      errors.push('Duration must be in format like "2 days", "1 week", "3 hours"');
    }
  }

  if (input.formData.specificSensations && input.formData.specificSensations.length > 500) {
    errors.push('Specific sensations must not exceed 500 characters');
  }

  if (!input.formData.sensations) errors.push('Sensations are required');
  if (!input.timestamp) errors.push('Timestamp is required');

  return { valid: errors.length === 0, errors };
}
