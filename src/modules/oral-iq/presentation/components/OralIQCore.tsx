'use client';
import React from 'react';

/**
 * OralIQCore - Pure Presentation Component
 * 
 * This component handles ONLY the UI and presentation logic for the 5-step Oral IQ wizard.
 * It does NOT:
 * - Access sessionStorage
 * - Check authentication
 * - Decide when to pre-fill data
 * - Handle booking flow
 * 
 * All behavior is controlled by the parent wrapper component through props.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Box,
  Progress,
  Group,
  Alert,
  Loader,
  Button,
  useMantineTheme,
} from '@mantine/core';
import { useCounter, useListState } from '@mantine/hooks';
import { themeColors } from '@/shared/theme';
import {
  useAssessOralHealth,
  formatSymptomAssessmentInput,
  validateSymptomAssessmentInput,
} from '@/modules/oral-iq/infrastructure/repositories/oral-iq-graphql.repository';
import {
  SymptomFormStep,
  MatchedConditionsStep,
  TreatmentOptionsStep,
  PersonalizedRecommendationsStep,
} from '@/modules/oral-iq/presentation/';
import { DentalMapSelectionStep } from '../DentalMapSelectionStep';
import type { MouthModelSelection } from '@/modules/oral-iq/domain/oral-iq.types';
import type {
  OralIQAssessment,
  SymptomFormData,
} from '@/modules/oral-iq/domain/entities/ai-treatment-recommendation.entity';

const TOTAL_STEPS = 5;

const STEP_META: Record<number, { title: string; subtitle?: string; description: string }> = {
  0: {
    title: 'Dental Assessment',
    description: 'Select the tooth or gum area where you are experiencing symptoms. You can select multiple areas.',
  },
  1: {
    title: 'Symptom Assessment',
    subtitle: 'Describe Your Symptoms',
    description: '',
  },
  2: {
    title: 'Matched Conditions',
    description: '',
  },
  3: {
    title: 'Treatment Options',
    description: '',
  },
  4: {
    title: 'Personalized Recommendations',
    description: '',
  },
};

export interface OralIQInitialData {
  selection?: MouthModelSelection | null;
  formData?: Partial<SymptomFormData> | null;
  result?: OralIQAssessment | null;
  dentalMapSelected?: string[];
  dentalMapGroups?: Record<string, string[]>;
  selectionLabels?: string[];
}

export interface OralIQCompleteData {
  selection: MouthModelSelection;
  formData: SymptomFormData;
  result: OralIQAssessment;
  dentalMapSelected: string[];
  dentalMapGroups: Record<string, string[]>;
  selectionLabels: string[];
}

export interface OralIQCoreProps {
  /** Initial data to pre-fill (undefined = start fresh, defined = pre-fill) */
  initialData?: OralIQInitialData;
  
  /** Whether to force re-assessment even if data hasn't changed */
  shouldReassess?: boolean;
  
  /** Called when user completes step 4 (recommendations) */
  onComplete: (data: OralIQCompleteData) => void;
  
  /** Called whenever user changes steps (for auto-save) */
  onStepChange?: (step: number, data: any) => void;
  
  /** Called when AI assessment completes */
  onAssessmentComplete?: (result: OralIQAssessment) => void;
}

export const OralIQCore: React.FC<OralIQCoreProps> = ({
  initialData,
  shouldReassess = true,
  onComplete,
  onStepChange,
  onAssessmentComplete,
}) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  const [currentStep, stepHandlers] = useCounter(0, { min: 0, max: TOTAL_STEPS - 1 });
  const [validationErrors, validationHandlers] = useListState<string>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Current state
  const [selection, setSelection] = useState<MouthModelSelection | null>(initialData?.selection || null);
  const [result, setResult] = useState<OralIQAssessment | null>(initialData?.result || null);
  const [dentalMapSelected, setDentalMapSelected] = useState<string[]>(initialData?.dentalMapSelected || []);
  const [dentalMapGroups, setDentalMapGroups] = useState<Record<string, string[]>>(initialData?.dentalMapGroups || {});
  const [dentalMapDisplayLabels, setDentalMapDisplayLabels] = useState<string[]>(initialData?.selectionLabels || []);
  const [savedFormData, setSavedFormData] = useState<Partial<SymptomFormData>>(initialData?.formData || {});

  // Update state when initialData changes (important for dashboard pre-fill)
  useEffect(() => {
    if (initialData) {
      if (initialData.selection) setSelection(initialData.selection);
      if (initialData.result) setResult(initialData.result);
      if (initialData.dentalMapSelected) setDentalMapSelected(initialData.dentalMapSelected);
      if (initialData.dentalMapGroups) setDentalMapGroups(initialData.dentalMapGroups);
      if (initialData.selectionLabels) setDentalMapDisplayLabels(initialData.selectionLabels);
      if (initialData.formData) setSavedFormData(initialData.formData);
    }
  }, [initialData]);

  const { assess, loading, error, reset: resetMutation } = useAssessOralHealth();

  const updateSelection = useCallback(
    (newSelection: MouthModelSelection) => {
      setSelection(newSelection);
      validationHandlers.setState([]);
    },
    [validationHandlers]
  );

  const submitAssessment = useCallback(
    async (
      overrideSelection?: MouthModelSelection,
      overrideFormData?: SymptomFormData
    ): Promise<OralIQAssessment> => {
      const currentSelection = overrideSelection || selection;
      if (!currentSelection || !overrideFormData) throw new Error('Incomplete assessment data');

      const input = formatSymptomAssessmentInput(currentSelection, overrideFormData);
      const validation = validateSymptomAssessmentInput(input);
      if (!validation.valid) {
        validationHandlers.setState(validation.errors);
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      validationHandlers.setState([]);
      const response = await assess(input);
      setResult(response);
      
      if (onAssessmentComplete) {
        onAssessmentComplete(response);
      }
      
      if (overrideSelection) setSelection(overrideSelection);
      return response;
    },
    [selection, assess, validationHandlers, onAssessmentComplete]
  );

  const clearFeedback = useCallback(() => {
    validationHandlers.setState([]);
    resetMutation();
  }, [resetMutation, validationHandlers]);

  const handleSymptomFormNext = useCallback(
    (data: SymptomFormData) => {
      if (loading) return;
      
      // If we have an existing result and shouldn't reassess, skip to step 2
      if (result && !shouldReassess) {
        stepHandlers.set(2);
        if (onStepChange) onStepChange(2, { formData: data });
        return;
      }

      // Otherwise run the assessment
      submitAssessment(selection || undefined, data)
        .then(() => {
          stepHandlers.set(2);
          if (onStepChange) onStepChange(2, { formData: data });
        })
        .catch((err) => console.error('Failed to process assessment:', err));
    },
    [loading, selection, submitAssessment, stepHandlers, result, shouldReassess, onStepChange]
  );

  const handleStep4Complete = useCallback(() => {
    if (!selection || !savedFormData || !result) {
      console.error('Cannot complete: missing required data');
      return;
    }

    setIsRedirecting(true);
    onComplete({
      selection,
      formData: savedFormData as SymptomFormData,
      result,
      dentalMapSelected,
      dentalMapGroups,
      selectionLabels: dentalMapDisplayLabels,
    });
  }, [selection, savedFormData, result, dentalMapSelected, dentalMapGroups, dentalMapDisplayLabels, onComplete]);

  const { title, subtitle, description } = STEP_META[currentStep] ?? STEP_META[0];

  return (
    <Box
      component="section"
      py={{ base: 48, md: 80 }}
      bg={colors.neutral[0]}
      style={{ minHeight: '100vh' }}
    >
      <Container size="xl" px={{ base: 'md', md: 'xl' }}>
        <Box
          pos="relative"
          mx="auto"
          px={{ base: 20, md: 28 }}
          py={{ base: 24, md: 32 }}
          bg="#ffffff"
          style={{
            maxWidth: 1000,
          }}
        >
          <Stack gap="md" align="flex-start">
            <Group justify="left">
              <Text component="span" fz={{ base: 16, md: 32 }} fw={700} c={colors.primary[5]}>
                ORAL
              </Text>
              <Text component="sup" fz={{ base: 16, md: 32 }} fw={700} c={colors.secondary[4]}>
                IQ
              </Text>
              <Text
                component="span"
                fz={{ base: 16, md: 32 }}
                fw={700}
                c={colors.primary[5]}
                ml={10}
              >
                – Interactive Dental Assessment
              </Text>
            </Group>

            <Text ta="left" fz={{ base: 12, md: 18 }} fw={700} c={colors.neutral[6]}>
              Understand symptoms. Visualize care. Communicate clearly with your dentist
            </Text>

            <Box maw={900} w="100%">
              <Title order={3} mb={4} fz={{ base: 20, md: 24 }} fw={600} c={colors.neutral[8]}>
                {title}
              </Title>
              {description && (
                <Text mb={4} fz={{ base: 14, md: 16 }} fw={400} c={colors.neutral[6]} lh={1.6}>
                  {description}
                </Text>
              )}
              {subtitle && (
                <Text mb={4} fz={{ base: 14, md: 16 }} fw={500} c={colors.neutral[6]}>
                  {subtitle}
                </Text>
              )}
              <Text mb={8} fz={{ base: 14, md: 16 }} fw={500} c={colors.primary[5]}>
                Step {currentStep + 1} of {TOTAL_STEPS}
              </Text>
              <Progress
                value={((currentStep + 1) / TOTAL_STEPS) * 100}
                size="sm"
                radius="xl"
                color="primary"
                mb="xl"
                style={{ backgroundColor: colors.neutral[3] }}
              />
            </Box>

            <Box mb="xl" maw={900} w="100%" />
          </Stack>

          {/* Step 0: Dental Map Selection */}
          {currentStep === 0 && (
            <DentalMapSelectionStep
              key={`dental-map-${dentalMapSelected.join(',')}-${Object.keys(dentalMapGroups).join(',')}`}
              initialSelected={dentalMapSelected}
              initialGroups={dentalMapGroups}
              onProceed={(sel, selectedIds, displayLabels, activeGroups) => {
                updateSelection(sel);
                const groupIds = new Set(Object.values(activeGroups).flat());
                const individualIds = selectedIds.filter((id) => !groupIds.has(id));
                setDentalMapSelected(individualIds);
                setDentalMapGroups(activeGroups);
                setDentalMapDisplayLabels(displayLabels);
                stepHandlers.set(1);
                if (onStepChange) onStepChange(1, { selection: sel, selectedIds: individualIds, displayLabels, activeGroups });
              }}
              loading={loading}
            />
          )}

          {/* Step 1: Symptom Form */}
          {currentStep === 1 && (
            <Box style={{ marginTop: -40 }}>
              <SymptomFormStep
                selection={selection}
                initialFormData={savedFormData}
                selectionLabels={dentalMapDisplayLabels}
                onNext={(data) => {
                  setSavedFormData(data);
                  handleSymptomFormNext(data);
                }}
                onBack={() => {
                  stepHandlers.set(0);
                  if (onStepChange) onStepChange(0, {});
                }}
                onSelectionChange={updateSelection}
                loading={loading}
              />
            </Box>
          )}

          {/* Step 2: Matched Conditions */}
          {currentStep === 2 && result && (
            <Box style={{ marginTop: -40 }}>
              <MatchedConditionsStep
                conditions={result.matchedConditions}
                onNext={() => {
                  stepHandlers.set(3);
                  if (onStepChange) onStepChange(3, {});
                }}
                onBack={() => {
                  clearFeedback();
                  stepHandlers.set(1);
                  if (onStepChange) onStepChange(1, {});
                }}
              />
            </Box>
          )}

          {/* Step 3: Treatment Options */}
          {currentStep === 3 && result && (
            <Box style={{ marginTop: -40 }}>
              <TreatmentOptionsStep
                treatments={result.treatments.map((t) => ({
                  id: t.id,
                  title: t.title,
                  description: t.description,
                  conditionName: t.conditionName,
                  causeTreated: t.causeTreated,
                  estimatedCost: t.estimatedCost,
                }))}
                onNext={() => {
                  stepHandlers.set(4);
                  if (onStepChange) onStepChange(4, {});
                }}
                onBack={() => {
                  stepHandlers.set(2);
                  if (onStepChange) onStepChange(2, {});
                }}
              />
            </Box>
          )}

          {/* Step 4: Personalized Recommendations */}
          {currentStep === 4 && result && (
            <Box style={{ marginTop: -40 }}>
              <PersonalizedRecommendationsStep
                recommendation={{
                  specialties: result.specialties,
                  recommendations: result.recommendations,
                  concerns: result.aiMetadata?.concerns,
                  severityLevel: result.aiMetadata?.severityLevel,
                  disclaimer: result.aiMetadata?.disclaimer,
                }}
                onBack={() => {
                  stepHandlers.set(3);
                  if (onStepChange) onStepChange(3, {});
                }}
                selectedProvider={undefined}
                onLocateProvider={handleStep4Complete}
                isActionLoading={isRedirecting}
              />
            </Box>
          )}

          {/* Loading State */}
          {loading && currentStep === 1 && (
            <Box style={{ textAlign: 'center', padding: '60px 0' }}>
              <Loader size="md" color={colors.primary[5]} mb="md" />
              <Text size="lg" mb="md">
                Processing symptom assessment...
              </Text>
              <Text size="sm" c="dimmed">
                This may take a few seconds
              </Text>
            </Box>
          )}

          {/* Error State */}
          {(error || validationErrors.length > 0) && (
            <Box style={{ textAlign: 'center', padding: '60px 0' }}>
              <Alert
                color="red"
                title="Failed to process symptom assessment"
                style={{ maxWidth: 600, margin: '0 auto' }}
              >
                <Text size="sm">Failed to process symptom assessment.</Text>
                <Button
                  variant="outline"
                  size="sm"
                  mt="md"
                  onClick={() => {
                    clearFeedback();
                    stepHandlers.set(1);
                  }}
                >
                  Try Again
                </Button>
              </Alert>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};
