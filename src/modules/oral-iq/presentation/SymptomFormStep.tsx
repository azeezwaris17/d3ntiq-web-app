'use client';
import React from 'react';

import { Text, Stack, Textarea, TextInput, Button, Box, Group, MultiSelect, Select } from '@mantine/core';
import * as MantineNotifications from '@mantine/notifications';
import { Section } from '@/shared/components/layout';
import type { MouthModelSelection } from '@/modules/oral-iq/domain/oral-iq.types';
import type { SymptomFormData } from '../domain/entities/SymptomAssessment';
import { useForm } from '@mantine/form';
import { SymptomFormValidator } from '../domain/services/SymptomFormValidator';

export interface SymptomFormStepProps {
  selection: MouthModelSelection | null;
  onNext: (formData: SymptomFormData) => void;
  onBack: () => void;
  onSelectionChange?: (selection: MouthModelSelection) => void;
  loading?: boolean;
  initialFormData?: Partial<SymptomFormData>;
  selectionLabels?: string[];
}

const symptomOptions = [
  { value: 'tooth-pain', label: 'Tooth Pain' },
  { value: 'gum-bleeding', label: 'Gum Bleeding' },
  { value: 'tooth-sensitivity', label: 'Tooth Sensitivity' },
  { value: 'swelling', label: 'Swelling' },
  { value: 'crooked-teeth', label: 'Crooked/Misaligned' },
  { value: 'discolored-teeth', label: 'Discolored/Stained' },
  { value: 'chipped-tooth', label: 'Chipped/Cracked' },
  { value: 'other', label: 'Other' },
];

const durationOptions = [
  { value: 'less-than-1-day', label: '< 1 day' },
  { value: '1-3-days', label: '1-3 days' },
  { value: '4-7-days', label: '4-7 days' },
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: 'more-than-2-weeks', label: '2+ weeks' },
  { value: 'chronic', label: 'Chronic (ongoing)' },
];

export const SymptomFormStep: React.FC<SymptomFormStepProps> = ({
  selection: initialSelection,
  onNext,
  onBack,
  loading = false,
  initialFormData = {},
  selectionLabels = [],
}) => {
  const form = useForm<SymptomFormData>({
    initialValues: {
      symptomTypes: initialFormData.symptomTypes ?? [],
      painLevel: initialFormData.painLevel ?? null,
      duration: initialFormData.duration ?? '',
      specificSensations: initialFormData.specificSensations ?? '',
      sensations: initialFormData.sensations ?? {
        sharpPain: false,
        dullAche: false,
        throbbing: false,
      },
    },
    validate: {
      symptomTypes: (value) => {
        if (!value || value.length === 0) return 'Please select at least one symptom type';
        return null;
      },
      painLevel: (value) => {
        if (value === null || value === undefined) return null;
        const v = SymptomFormValidator.validatePainLevel(value);
        return v.isValid ? null : v.error;
      },
    },
  });

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const validation = SymptomFormValidator.validateFormData({
      symptomTypes: form.values.symptomTypes,
      painLevel: form.values.painLevel,
      duration: form.values.duration,
      specificSensations: form.values.specificSensations,
    });
    if (!validation.isValid) {
      Object.keys(validation.errors).forEach((key) => {
        form.setFieldError(key as keyof SymptomFormData, validation.errors[key]);
      });
    }
    return validation;
  };

  const currentSelection = initialSelection;

  const handleSubmit = form.onSubmit((values) => {
    if (!currentSelection) {
      MantineNotifications.notifications.show({
        title: 'Selection Required',
        message: 'Please select a tooth area first',
        color: 'red',
      });
      return;
    }
    const validation = validateForm();
    if (!validation.isValid) {
      MantineNotifications.notifications.show({
        title: 'Validation Error',
        message: 'Please correct the form errors',
        color: 'red',
      });
      return;
    }
    onNext({
      symptomTypes: values.symptomTypes,
      painLevel: values.painLevel,
      duration: values.duration || '',
      specificSensations: values.specificSensations || '',
      sensations: values.sensations || { sharpPain: false, dullAche: false, throbbing: false },
    });
  });

  return (
    <Section background="light">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {(currentSelection || selectionLabels.length > 0) && (
            <Box p="xs" bg="#E8F4F8" style={{ border: '1px solid #548CA1', borderRadius: 6 }}>
              <Group gap="sm">
                <Box
                  w={32}
                  h={32}
                  style={{
                    borderRadius: '50%',
                    backgroundColor: '#548CA1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  🦷
                </Box>
                <Stack gap={2}>
                  <Text size="xs" fw={600}>
                    Selected Area
                  </Text>
                  <Text size="xs" c="dimmed">
                    {selectionLabels.length > 0
                      ? selectionLabels.join(', ')
                      : currentSelection
                        ? currentSelection.regionType === 'gum'
                          ? `${currentSelection.jaw === 'upper' ? 'Upper' : 'Lower'} Gum`
                          : `${currentSelection.jaw === 'upper' ? 'Upper' : 'Lower'} Jaw${currentSelection.fdiNumber ? ` — Tooth ${currentSelection.fdiNumber}` : ''}`
                        : ''}
                  </Text>
                </Stack>
              </Group>
            </Box>
          )}

          <Box>
            <Text size="xs" fw={600} mb={4} component="label">
              Symptom Types (select all that apply)
            </Text>
            <MultiSelect
              placeholder="Select one or more symptoms"
              data={symptomOptions}
              size="sm"
              searchable
              clearable
              {...form.getInputProps('symptomTypes')}
              styles={{
                input: {
                  fontSize: 13,
                  minHeight: 36,
                  '--input-bd-focus': '#ced4da',
                } as React.CSSProperties,
              }}
            />
          </Box>

          <Box>
            <Text size="xs" fw={600} mb={4} component="label">
              Pain Level (1-10)
            </Text>
            <TextInput
              placeholder="Enter pain level"
              size="sm"
              type="number"
              min={1}
              max={10}
              value={
                form.values.painLevel !== null && form.values.painLevel !== undefined
                  ? form.values.painLevel.toString()
                  : ''
              }
              onChange={(e) => {
                const v = e.currentTarget.value;
                form.setFieldValue('painLevel', v ? parseInt(v, 10) : null);
              }}
              styles={{ input: { fontSize: 13, height: 36 } }}
            />
          </Box>

          <Box>
            <Text size="xs" fw={600} mb={4} component="label">
              Duration
            </Text>
            <Select
              placeholder="Select duration"
              data={durationOptions}
              size="sm"
              clearable
              value={form.values.duration || null}
              onChange={(value) => form.setFieldValue('duration', value || '')}
              error={form.errors.duration}
              styles={{ input: { fontSize: 13, height: 36 } }}
            />
          </Box>

          <Box>
            <Text size="xs" fw={600} mb={4} component="label">
              Specific Sensations
            </Text>
            <Textarea
              placeholder="Describe any specific sensations..."
              size="sm"
              minRows={3}
              {...form.getInputProps('specificSensations')}
              styles={{ input: { fontSize: 13 } }}
            />
          </Box>

          <Text size="xs" c="dimmed" mt="xs">
            <Text component="span" fw={600} c="#548CA1">
              DISCLAIMER:
            </Text>{' '}
            This tool does not provide a diagnosis. Information will be shared with your provider.
          </Text>

          <Group mt="md" gap="sm">
            <Button
              variant="outline"
              size="xs"
              onClick={onBack}
              style={{ flex: 1 }}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              type="submit"
              size="xs"
              style={{ flex: 1, backgroundColor: '#548CA1' }}
              loading={loading}
              loaderProps={{ type: 'oval' }}
            >
              Next
            </Button>
          </Group>
        </Stack>
      </form>
    </Section>
  );
};
