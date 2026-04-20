'use client';
import React from 'react';

import { Title, Text, Stack, Button, Group, Box, Grid, Badge } from '@mantine/core';
import { Section, Container } from '@/shared/components/layout';
import { MultipleCardsSkeleton } from '@/shared/components/SkeletonLoader';
import { GraphQLErrorAlert } from '@/shared/components/GraphQLErrorAlert';

export interface TreatmentItem {
  id: string;
  title: string;
  description: string;
  estimatedCost?: string;
  conditionName?: string;
}

export interface TreatmentOptionsStepProps {
  treatments: TreatmentItem[];
  onNext: () => void;
  onBack: () => void;
  onLocateProvider?: () => void;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export const TreatmentOptionsStep: React.FC<TreatmentOptionsStepProps> = ({
  treatments, onNext, onBack, onLocateProvider, isLoading = false, error = null, onRetry,
}) => {
  if (error) {
    return (
      <Section background="light">
        <Container size="lg" className="py-8">
          <Stack gap="lg">
            <GraphQLErrorAlert error={error} onRetry={onRetry} />
            <Group justify="space-between">
              <Button variant="outline" onClick={onBack} size="sm">Back</Button>
            </Group>
          </Stack>
        </Container>
      </Section>
    );
  }

  if (isLoading) {
    return (
      <Section background="light">
        <Container size="lg" className="py-8">
          <Stack gap="lg">
            <Box ta="center" role="status" aria-live="polite" aria-busy="true">
              <Text size="md" fw={600} mb="xs">Analyzing Treatment Options</Text>
              <Text size="sm" c="dimmed" mb={4}>Our AI is generating personalized recommendations...</Text>
              <Text size="xs" c="dimmed" role="timer">Estimated: 5-10 seconds</Text>
            </Box>
            <MultipleCardsSkeleton count={3} type="treatment" />
          </Stack>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="light">
      <Container size="lg" className="py-6">
        <Stack gap="lg">
          <Box p="xs" bg="#FEF3C7" style={{ border: '1px solid #FCD34D', borderRadius: 6 }} role="alert">
            <Text size="xs" fw={600} c="#92400E" mb={2}>⚕️ MEDICAL DISCLAIMER</Text>
            <Text size="xs" c="#92400E" lh={1.5}>
              These are AI-generated suggestions for educational purposes only. Always consult with a dental professional.
            </Text>
          </Box>

          <Stack gap="sm">
            <Title order={4} fw={600} fz={{ base: 16, md: 18 }}>Recommended Treatment Options</Title>
            <Text size="xs" c="dimmed">Each treatment below addresses a specific cause identified in your matched conditions.</Text>

            <Grid gutter="md" role="list">
              {treatments.map((treatment, index) => (
                <Grid.Col key={treatment.id} span={{ base: 12, md: 6 }} role="listitem">
                  <Box p="md" bg="#FFFFFF" style={{ border: '1px solid #E2E8F0', borderRadius: 8, height: '100%' }}>
                    <Stack gap="xs">
                      <Group gap="xs" wrap="nowrap" align="flex-start">
                        <Box
                          w={24} h={24} style={{ borderRadius: '50%', backgroundColor: '#548CA1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}
                        >
                          <Text size="xs" fw={700} c="white">{index + 1}</Text>
                        </Box>
                        <Stack gap={2} style={{ flex: 1 }}>
                          <Title order={5} fw={600} size="sm">{treatment.title}</Title>
                          {treatment.conditionName && (
                            <Text size="xs" c="#548CA1" fw={500}>For: {treatment.conditionName}</Text>
                          )}
                        </Stack>
                      </Group>
                      <Text size="xs" c="dimmed" lh={1.6}>{treatment.description}</Text>
                      {treatment.estimatedCost && (
                        <Group gap="xs" mt={4}>
                          <Badge variant="light" color="teal" size="sm" radius="sm">
                            Est. Cost: {treatment.estimatedCost}
                          </Badge>
                        </Group>
                      )}
                    </Stack>
                  </Box>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>

          <Group justify="space-between" mt="md">
            <Button variant="outline" onClick={onBack} size="xs">Back</Button>
            <Group gap="sm">
              {onLocateProvider && (
                <Button variant="outline" onClick={onLocateProvider} size="xs">Find Provider</Button>
              )}
              <Button onClick={onNext} size="xs" style={{ backgroundColor: '#1e293b' }}>Next</Button>
            </Group>
          </Group>
        </Stack>
      </Container>
    </Section>
  );
};
