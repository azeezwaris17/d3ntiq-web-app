'use client';
import React from 'react';

import { useState, useCallback } from 'react';
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
import { oralIQSession } from '@/modules/oral-iq/infrastructure/oral-iq-session';
import {
  SymptomFormStep,
  MatchedConditionsStep,
  TreatmentOptionsStep,
  PersonalizedRecommendationsStep,
} from '@/modules/oral-iq/presentation/';
import { DentalMapSelectionStep } from './DentalMapSelectionStep';
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

export interface SelectedProvider {
  id: string;
  name: string;
  specialty: string;
  address?: string;
  phone?: string;
}

export interface OralIQPageProps {
  /** Pre-selected provider from the providers page (dashboard flow only) */
  selectedProvider?: SelectedProvider | null;
  /** Pre-filled assessment result restored from sessionStorage (dashboard flow only) */
  initialResult?: OralIQAssessment | null;
  /** Pre-filled selection restored from sessionStorage (dashboard flow only) */
  initialSelection?: MouthModelSelection | null;
  /** Pre-filled symptom form data restored from sessionStorage (dashboard flow only) */
  initialFormData?: Partial<SymptomFormData> | null;
  /** Pre-filled dental map selected IDs (dashboard flow only) */
  initialDentalMapSelected?: string[];
  /** Pre-filled dental map groups (dashboard flow only) */
  initialDentalMapGroups?: Record<string, string[]>;
  /** Pre-filled display labels for the dental map (dashboard flow only) */
  initialSelectionLabels?: string[];
  /** Called when patient clicks "Book Now" in the last step (dashboard flow only) */
  onBookNow?: (provider: SelectedProvider) => void;
  /** Called when patient clicks "Find a Dentist" — overrides the default redirect (dashboard flow only) */
  onLocateProvider?: () => void;
}

export const OralIQPage: React.FC<OralIQPageProps> = ({
  selectedProvider,
  onBookNow,
  onLocateProvider,
  initialResult = null,
  initialSelection = null,
  initialFormData = null,
  initialDentalMapSelected = [],
  initialDentalMapGroups = {},
  initialSelectionLabels = [],
}) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  // Read from session if no props provided (public flow) — runs once on mount
  const [sessionData] = useState(() => {
    // If props are provided (dashboard flow), use them — don't read session
    if (initialResult || initialSelection || initialFormData) {
      return {
        result: initialResult,
        selection: initialSelection,
        formData: initialFormData,
        dentalMapSelected: initialDentalMapSelected,
        dentalMapGroups: initialDentalMapGroups,
        selectionLabels: initialSelectionLabels,
      };
    }
    // Public flow — don't pre-fill, start fresh
    return {
      result: null,
      selection: null,
      formData: {},
      dentalMapSelected: [],
      dentalMapGroups: {},
      selectionLabels: [],
    };
  });

  // Determine starting step:
  // - Always start at step 0 to show pre-filled data
  // - User can navigate forward to see their previous results
  const startStep = 0;

  const [currentStep, stepHandlers] = useCounter(startStep, { min: 0, max: TOTAL_STEPS - 1 });
  const [validationErrors, validationHandlers] = useListState<string>([]);

  const [selection, setSelection] = useState<MouthModelSelection | null>(sessionData.selection);
  const [result, setResult] = useState<OralIQAssessment | null>(sessionData.result);

  // Store original data to detect actual changes
  const [originalDentalMapSelected] = useState<string[]>(sessionData.dentalMapSelected ?? []);
  const [originalDentalMapGroups] = useState<Record<string, string[]>>(sessionData.dentalMapGroups ?? {});
  const [originalFormData] = useState<Partial<SymptomFormData>>(sessionData.formData ?? {});

  // Persisted state for step 0 (dental map) — seeded from session on mount
  const [dentalMapSelected, setDentalMapSelected] = useState<string[]>(sessionData.dentalMapSelected ?? []);
  const [dentalMapGroups, setDentalMapGroups] = useState<Record<string, string[]>>(sessionData.dentalMapGroups ?? {});
  const [dentalMapDisplayLabels, setDentalMapDisplayLabels] = useState<string[]>(sessionData.selectionLabels ?? []);

  // Persisted state for step 1 (symptom form) — seeded from session on mount
  const [savedFormData, setSavedFormData] = useState<Partial<SymptomFormData>>(sessionData.formData ?? {});

  // Human-readable labels for selected areas passed to step 1
  const selectionLabels = dentalMapDisplayLabels;

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
      oralIQSession.saveResult(response);
      if (overrideSelection) setSelection(overrideSelection);
      return response;
    },
    [selection, assess, validationHandlers]
  );

  const clearFeedback = useCallback(() => {
    validationHandlers.setState([]);
    resetMutation();
  }, [resetMutation, validationHandlers]);

  const handleSymptomFormNext = useCallback(
    (data: any) => {
      if (loading) return;
      
      // Check if step 0 data actually changed
      const step0DataChanged = 
        JSON.stringify(dentalMapSelected.sort()) !== JSON.stringify(originalDentalMapSelected.sort()) ||
        JSON.stringify(dentalMapGroups) !== JSON.stringify(originalDentalMapGroups);
      
      // Check if step 1 data actually changed
      const step1DataChanged = JSON.stringify(data) !== JSON.stringify(originalFormData);
      
      // If we have an existing result and nothing changed, just move to step 2 without re-assessment
      if (result && !step0DataChanged && !step1DataChanged) {
        stepHandlers.set(2);
        return;
      }

      // Otherwise run the assessment
      submitAssessment(selection || undefined, data)
        .then(() => {
          stepHandlers.set(2);
        })
        .catch((err) => console.error('Failed to process assessment:', err));
    },
    [loading, selection, submitAssessment, stepHandlers, result, dentalMapSelected, dentalMapGroups, originalDentalMapSelected, originalDentalMapGroups, originalFormData]
  );

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
          <Stack gap="md" 
          // mb={{ base: 40, md: 60 }} 
          align="flex-start"
          >
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

          {currentStep === 0 && (
            <DentalMapSelectionStep
              key={`dental-map-${dentalMapSelected.join(',')}-${Object.keys(dentalMapGroups).join(',')}`}
              initialSelected={dentalMapSelected}
              initialGroups={dentalMapGroups}
              onProceed={(sel, selectedIds, displayLabels, activeGroups) => {
                updateSelection(sel);
                // only store individual selections (not group members) so back nav restores correctly
                const groupIds = new Set(Object.values(activeGroups).flat());
                const individualIds = selectedIds.filter((id) => !groupIds.has(id));
                setDentalMapSelected(individualIds);
                setDentalMapGroups(activeGroups);
                setDentalMapDisplayLabels(displayLabels);
                // Persist so the dashboard can restore step 0
                oralIQSession.saveSelection(sel, displayLabels, individualIds, activeGroups);
                stepHandlers.set(1);
              }}
              loading={loading}
            />
          )}

          {currentStep === 1 && (
            <Box style={{ marginTop: -40 }}>
              <SymptomFormStep
                selection={selection}
                initialFormData={savedFormData}
                selectionLabels={selectionLabels}
                onNext={(data) => {
                  setSavedFormData(data);
                  // Persist so the dashboard can restore step 1
                  oralIQSession.saveFormData(data);
                  handleSymptomFormNext(data);
                }}
                onBack={() => {
                  stepHandlers.set(0);
                }}
                onSelectionChange={updateSelection}
                loading={loading}
              />
            </Box>
          )}

          {currentStep === 2 && result && (
            <Box 
            style={{ marginTop: -40 }}
            >
              <MatchedConditionsStep
                conditions={result.matchedConditions}
                onNext={() => stepHandlers.set(3)}
                onBack={() => {
                  clearFeedback();
                  stepHandlers.set(1);
                }}
              />
            </Box>
          )}

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
                onNext={() => stepHandlers.set(4)}
                onBack={() => stepHandlers.set(2)}
              />
            </Box>
          )}

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
                onBack={() => stepHandlers.set(3)}
                selectedProvider={selectedProvider}
                onBookNow={
                  selectedProvider && onBookNow
                    ? () => onBookNow(selectedProvider)
                    : undefined
                }
                onLocateProvider={
                  !selectedProvider
                    ? () => {
                        if (onLocateProvider) {
                          // Dashboard flow — let the parent handle navigation
                          onLocateProvider();
                        } else if (selection && result) {
                          // Public flow — save to session and redirect to providers page
                          oralIQSession.saveResult(result);
                          oralIQSession.saveSelection(selection, selectionLabels, dentalMapSelected, dentalMapGroups);
                          const params = new URLSearchParams({
                            toothNumber: selection.fdiNumber?.toString() || selection.regionId,
                            jaw: selection.jaw,
                            symptoms: result.matchedConditions.map((c) => c.name).join(','),
                          });
                          window.location.href = `/providers?${params.toString()}`;
                        }
                      }
                    : undefined
                }
              />
            </Box>
          )}

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
