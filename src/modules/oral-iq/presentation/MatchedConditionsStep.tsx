'use client';
import React from 'react';

import { Title, Text, Stack, Button, Group, Box, Badge } from '@mantine/core';
import { Section, Container } from '@/shared/components/layout';
import type { Condition } from '../domain/entities/ai-treatment-recommendation.entity';
import { MultipleCardsSkeleton } from '@/shared/components/SkeletonLoader';
import { GraphQLErrorAlert } from '@/shared/components/GraphQLErrorAlert';

export interface MatchedConditionsStepProps {
  conditions: Condition[];
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'SEVERE':
      return '#DC2626';
    case 'MODERATE':
      return '#F59E0B';
    case 'MILD':
      return '#10B981';
    default:
      return '#6B7280';
  }
};

const getSeverityLabel = (severity: string) => severity.charAt(0) + severity.slice(1).toLowerCase();

export const MatchedConditionsStep: React.FC<MatchedConditionsStepProps> = ({
  conditions,
  onNext,
  onBack,
  isLoading = false,
  error = null,
  onRetry,
}) => {
  if (error) {
    return (
      <Section background="light">
        <Container size="lg" className="py-8">
          <Stack gap="lg">
            <GraphQLErrorAlert error={error} onRetry={onRetry} />
            <Group justify="space-between">
              <Button variant="outline" onClick={onBack} size="xs">
                Back
              </Button>
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
            <Box ta="center">
              <Text size="md" fw={600} mb="xs">
                Analyzing Your Symptoms
              </Text>
              <Text size="sm" c="dimmed" mb={4}>
                Identifying matched conditions...
              </Text>
              <Text size="xs" c="dimmed">
                Estimated: 5-10 seconds
              </Text>
            </Box>
            <MultipleCardsSkeleton count={3} type="condition" />
          </Stack>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="light">
      <Container size="lg" className="py-6">
        <Stack gap="lg">
          <Box p="xs" bg="#FEF3C7" style={{ border: '1px solid #FCD34D', borderRadius: 6 }}>
            <Text size="xs" fw={600} c="#92400E" mb={2}>
              ⚕️ MEDICAL DISCLAIMER
            </Text>
            <Text size="xs" c="#92400E" lh={1.5}>
              These are AI-generated suggestions. Always consult with a dental professional.
            </Text>
          </Box>

          <Stack gap="sm">
            <Text size="xs" c="dimmed">
              Based on your symptoms, here are the matched conditions.
            </Text>

            <Stack gap="sm">
              {conditions.map((condition, index) => (
                <Box
                  key={condition.id}
                  p="md"
                  bg="#FFFFFF"
                  style={{ border: '1px solid #E2E8F0', borderRadius: 8 }}
                >
                  <Group gap="xs" mb="xs" align="center">
                    <Box
                      w={24}
                      h={24}
                      style={{
                        borderRadius: '50%',
                        backgroundColor: '#548CA1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Text size="xs" fw={700} c="white">
                        {index + 1}
                      </Text>
                    </Box>
                    <Title order={5} fw={600} size="sm" style={{ flex: 1 }}>
                      {condition.name}
                    </Title>
                    <Badge color={getSeverityColor(condition.severity)} variant="light" size="xs">
                      {getSeverityLabel(condition.severity)}
                    </Badge>
                  </Group>

                  <Text size="xs" c="dimmed" mb="sm" lh={1.6}>
                    {condition.description}
                  </Text>

                  {!!condition.possibleCauses?.length && (
                    <Box>
                      <Text size="xs" fw={600} mb={4} tt="uppercase" c="dimmed">
                        Possible Causes
                      </Text>
                      <Stack gap={2}>
                        {condition.possibleCauses.map((cause, idx) => (
                          <Group key={idx} gap="xs" align="flex-start">
                            <Text size="xs" c="#548CA1">
                              •
                            </Text>
                            <Text size="xs" c="dimmed" lh={1.5}>
                              {cause}
                            </Text>
                          </Group>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Stack>

          <Group justify="space-between" mt="md">
            <Button variant="outline" onClick={onBack} size="xs">
              Back
            </Button>
            <Button onClick={onNext} size="xs" style={{ backgroundColor: '#1e293b' }}>
              Next
            </Button>
          </Group>
        </Stack>
      </Container>
    </Section>
  );
};
