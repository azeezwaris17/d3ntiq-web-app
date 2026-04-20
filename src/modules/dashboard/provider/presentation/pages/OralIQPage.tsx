/**
 * Provider OralIQPage
 *
 * Embeds the full Oral IQ assessment flow inside the provider dashboard.
 * The provider can run an AI-powered dental assessment for a patient.
 */
'use client';

import { Box, Title, Text } from '@mantine/core';
import { OralIQPage as OralIQAssessment } from '@/modules/oral-iq/presentation/OralIQPage';

export function ProviderOralIQPage() {
  return (
    <Box>
      <Box mb={24}>
        <Title order={2} fw={700} c="#1e293b" fz={22}>Oral IQ Assessment</Title>
        <Text size="sm" c="dimmed" mt={4}>
          Run an AI-powered dental symptom assessment for your patient
        </Text>
      </Box>

      <OralIQAssessment />
    </Box>
  );
}
