'use client';
import React from 'react';

import { useState, useCallback } from 'react';
import { Container, Title, Text, Stack, Box, Progress, Group, Alert, Loader, Button, useMantineTheme } from '@mantine/core';
import { useCounter, useListState } from '@mantine/hooks';
import type { HomepageContent } from '@/modules/public-pages/homepage/domain/entities/HomepageContent';
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
} from '@/modules/oral-iq/presentation';
import { DentalMapSelectionStep } from '@/modules/oral-iq/presentation/DentalMapSelectionStep';
import type { MouthModelSelection } from '@/modules/oral-iq/domain/oral-iq.types';
import type { OralIQAssessment, SymptomFormData } from '@/modules/oral-iq/domain/entities/ai-treatment-recommendation.entity';

export interface OralIQSectionProps {
  oralIQ: HomepageContent['oralIQ'];
}

const TOTAL_STEPS = 5;

const STEP_META: Record<number, { title: string; subtitle?: string; description: string }> = {
  0: { title: 'Dental Assessment', description: 'Select the tooth or gum area where you are experiencing symptoms. You can select multiple areas.' },
  1: { title: 'Symptom Assessment', subtitle: 'Describe Your Symptoms', description: '' },
  2: { title: 'Matched Conditions', description: '' },
  3: { title: 'Treatment Options', description: '' },
  4: { title: 'Personalized Recommendations', description: '' },
};

export const OralIQSection: React.FC<OralIQSectionProps> = ({ oralIQ: _oralIQ }) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  const [currentStep, stepHandlers] = useCounter(0, { min: 0, max: TOTAL_STEPS - 1 });
  const [validationErrors, validationHandlers] = useListState<string>([]);

  const [selection, setSelection] = useState<MouthModelSelection | null>(null);
  const [result, setResult] = useState<OralIQAssessment | null>(null);

  const [dentalMapSelected, setDentalMapSelected] = useState<string[]>([]);
  const [dentalMapGroups, setDentalMapGroups] = useState<Record<string, string[]>>({});
  const [dentalMapDisplayLabels, setDentalMapDisplayLabels] = useState<string[]>([]);
  const [savedFormData, setSavedFormData] = useState<Partial<SymptomFormData>>({});

  const selectionLabels = dentalMapDisplayLabels;

  const { assess, loading, error, reset: resetMutation } = useAssessOralHealth();

  const updateSelection = useCallback((newSelection: MouthModelSelection) => {
    setSelection(newSelection);
    validationHandlers.setState([]);
  }, [validationHandlers]);

  const submitAssessment = useCallback(async (
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
    if (overrideSelection) setSelection(overrideSelection);
    return response;
  }, [selection, assess, validationHandlers]);

  const clearFeedback = useCallback(() => {
    validationHandlers.setState([]);
    resetMutation();
  }, [resetMutation, validationHandlers]);

  const handleSymptomFormNext = useCallback((data: any) => {
    if (loading) return;
    submitAssessment(selection || undefined, data)
      .then(() => stepHandlers.set(2))
      .catch((err) => console.error('Failed to process assessment:', err));
  }, [loading, selection, submitAssessment, stepHandlers]);

  const { title, subtitle, description } = STEP_META[currentStep] ?? STEP_META[0];

  return (
    <Box component="section" py={{ base: 40, md: 60 }} bg={colors.neutral[0]} aria-labelledby="oral-iq-section-title">
      <Container size="xl" px={{ base: 'md', md: 'xl' }}>
        <Box pos="relative" mx="auto" px={{ base: 20, md: 28 }} py={{ base: 24, md: 32 }} bg="#ffffff" style={{ maxWidth: 1000 }}>
          <Stack gap="md" align="flex-start">
            <Group justify="left">
              <Text id="oral-iq-section-title" component="span" fz={{ base: 16, md: 32 }} fw={700} c={colors.primary[5]}>ORAL</Text>
              <Text component="sup" fz={{ base: 16, md: 32 }} fw={700} c={colors.secondary[4]}>IQ</Text>
              <Text component="span" fz={{ base: 16, md: 32 }} fw={700} c={colors.primary[5]} ml={10}>– Interactive Dental Assessment</Text>
            </Group>

            <Text ta="left" fz={{ base: 12, md: 18 }} fw={700} c={colors.neutral[6]}>
              Understand symptoms. Visualize care. Communicate clearly with your dentist
            </Text>

            <Box maw={900} w="100%">
              <Title order={3} mb={4} fz={{ base: 20, md: 24 }} fw={600} c={colors.neutral[8]}>{title}</Title>
              {description && (
                <Text mb={4} fz={{ base: 14, md: 16 }} fw={400} c={colors.neutral[6]} lh={1.6}>{description}</Text>
              )}
              {subtitle && (
                <Text mb={4} fz={{ base: 14, md: 16 }} fw={500} c={colors.neutral[6]}>{subtitle}</Text>
              )}
              <Text mb={8} fz={{ base: 14, md: 16 }} fw={500} c={colors.primary[5]}>
                Step {currentStep + 1} of {TOTAL_STEPS}
              </Text>
              <Progress
                value={((currentStep + 1) / TOTAL_STEPS) * 100}
                size="sm" radius="xl" color="primary" mb="xl"
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
                const groupIds = new Set(Object.values(activeGroups).flat());
                setDentalMapSelected(selectedIds.filter((id) => !groupIds.has(id)));
                setDentalMapGroups(activeGroups);
                setDentalMapDisplayLabels(displayLabels);
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
                onNext={(data) => { setSavedFormData(data); handleSymptomFormNext(data); }}
                onBack={() => stepHandlers.set(0)}
                onSelectionChange={updateSelection}
                loading={loading}
              />
            </Box>
          )}

          {currentStep === 2 && result && (
            <Box style={{ marginTop: -40 }}>
              <MatchedConditionsStep
                conditions={result.matchedConditions}
                onNext={() => stepHandlers.set(3)}
                onBack={() => { clearFeedback(); stepHandlers.set(1); }}
              />
            </Box>
          )}

          {currentStep === 3 && result && (
            <Box style={{ marginTop: -40 }}>
              <TreatmentOptionsStep
                treatments={result.treatments.map((t) => ({ id: t.id, title: t.title, description: t.description }))}
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
                onLocateProvider={() => {
                  if (selection && result) {
                    const params = new URLSearchParams({
                      toothNumber: selection.fdiNumber?.toString() || selection.regionId,
                      jaw: selection.jaw,
                      symptoms: result.matchedConditions.map((c) => c.name).join(','),
                    });
                    window.location.href = `/providers?${params.toString()}`;
                  }
                }}
              />
            </Box>
          )}

          {loading && currentStep === 1 && (
            <Box style={{ textAlign: 'center', padding: '60px 0' }}>
              <Loader size="md" color={colors.primary[5]} mb="md" />
              <Text size="lg" mb="md">Processing symptom assessment...</Text>
              <Text size="sm" c="dimmed">This may take a few seconds</Text>
            </Box>
          )}

          {(error || validationErrors.length > 0) && (
            <Box style={{ textAlign: 'center', padding: '60px 0' }}>
              <Alert color="red" title="Failed to process symptom assessment" style={{ maxWidth: 600, margin: '0 auto' }}>
                <Text size="sm">Failed to process symptom assessment.</Text>
                <Button variant="outline" size="sm" mt="md" onClick={() => { clearFeedback(); stepHandlers.set(1); }}>
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
