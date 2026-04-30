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
  causeTreated?: string;
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

// ── Data structure ────────────────────────────────────────────────────────────

interface CauseGroup {
  cause: string;
  treatments: TreatmentItem[];
}

interface ConditionGroup {
  conditionName: string;
  causes: CauseGroup[];
}

/**
 * Groups treatments by condition → cause.
 * Each condition section contains one sub-group per possible cause.
 */
function buildConditionGroups(treatments: TreatmentItem[]): ConditionGroup[] {
  // Preserve insertion order using Maps
  const conditionMap = new Map<string, Map<string, TreatmentItem[]>>();

  for (const t of treatments) {
    const condition = t.conditionName ?? 'General Recommendations';
    const cause = t.causeTreated ?? 'General';

    if (!conditionMap.has(condition)) {
      conditionMap.set(condition, new Map());
    }
    const causeMap = conditionMap.get(condition)!;
    if (!causeMap.has(cause)) {
      causeMap.set(cause, []);
    }
    causeMap.get(cause)!.push(t);
  }

  return Array.from(conditionMap.entries()).map(([conditionName, causeMap]) => ({
    conditionName,
    causes: Array.from(causeMap.entries()).map(([cause, items]) => ({
      cause,
      treatments: items,
    })),
  }));
}

// ── Single treatment card ─────────────────────────────────────────────────────

function TreatmentCard({ treatment, index }: { treatment: TreatmentItem; index: number }) {
  return (
    <Box
      p="md"
      bg="#FFFFFF"
      style={{ border: '1px solid #E2E8F0', borderRadius: 8, height: '100%' }}
      role="listitem"
    >
      <Stack gap="xs">
        <Group gap="xs" wrap="nowrap" align="flex-start">
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
              marginTop: 2,
            }}
          >
            <Text size="xs" fw={700} c="white">{index + 1}</Text>
          </Box>
          <Title order={5} fw={600} size="sm" style={{ flex: 1 }}>
            {treatment.title}
          </Title>
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
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export const TreatmentOptionsStep: React.FC<TreatmentOptionsStepProps> = ({
  treatments,
  onNext,
  onBack,
  onLocateProvider,
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
              <Text size="sm" c="dimmed" mb={4}>
                Our AI is generating personalized recommendations...
              </Text>
              <Text size="xs" c="dimmed" role="timer">Estimated: 5–10 seconds</Text>
            </Box>
            <MultipleCardsSkeleton count={3} type="treatment" />
          </Stack>
        </Container>
      </Section>
    );
  }

  const conditionGroups = buildConditionGroups(treatments);
  let globalIndex = 0;

  return (
    <Section background="light">
      <Container size="lg" className="py-6">
        <Stack gap="xl">

          {/* Disclaimer */}
          <Box
            p="xs"
            bg="#FEF3C7"
            style={{ border: '1px solid #FCD34D', borderRadius: 6 }}
            role="alert"
          >
            <Text size="xs" fw={600} c="#92400E" mb={2}>⚕️ MEDICAL DISCLAIMER</Text>
            <Text size="xs" c="#92400E" lh={1.5}>
              These are AI-generated suggestions for educational purposes only.
              Always consult with a dental professional.
            </Text>
          </Box>

          {/* Heading */}
          <Stack gap={4}>
            <Title order={4} fw={600} fz={{ base: 16, md: 18 }}>
              Recommended Treatment Options
            </Title>
            <Text size="xs" c="dimmed">
              For each matched condition, treatment options are listed per possible cause.
            </Text>
          </Stack>

          {/* Condition groups */}
          {conditionGroups.map((conditionGroup) => (
            <Stack key={conditionGroup.conditionName} gap="md">

              {/* Condition heading */}
              <Box
                p="sm"
                style={{
                  backgroundColor: '#EFF6FF',
                  borderLeft: '4px solid #548CA1',
                  borderRadius: '0 6px 6px 0',
                }}
              >
                <Text size="sm" fw={700} c="#1e293b">
                  Condition:{' '}
                  <Text component="span" c="#548CA1">{conditionGroup.conditionName}</Text>
                </Text>
              </Box>

              {/* Cause sub-groups — two per row */}
              <Grid gutter="md">
                {conditionGroup.causes.map((causeGroup) => (
                  <Grid.Col key={causeGroup.cause} span={{ base: 12, md: 6 }}>
                    <Stack gap="sm">

                      {/* Cause label */}
                      <Group gap={8} align="center">
                        <Box
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: '#94a3b8',
                            flexShrink: 0,
                          }}
                        />
                        <Text size="xs" fw={600} c="#64748b" tt="uppercase" style={{ letterSpacing: '0.04em' }}>
                          Cause: {causeGroup.cause}
                        </Text>
                      </Group>

                      {/* Treatment cards for this cause */}
                      <Stack gap="sm" role="list">
                        {causeGroup.treatments.map((treatment) => {
                          const cardIndex = globalIndex++;
                          return (
                            <TreatmentCard key={treatment.id} treatment={treatment} index={cardIndex} />
                          );
                        })}
                      </Stack>

                    </Stack>
                  </Grid.Col>
                ))}
              </Grid>

            </Stack>
          ))}

          {/* Navigation */}
          <Group justify="space-between" mt="md">
            <Button variant="outline" onClick={onBack} size="xs">Back</Button>
            <Group gap="sm">
              {onLocateProvider && (
                <Button variant="outline" onClick={onLocateProvider} size="xs">
                  Find Provider
                </Button>
              )}
              <Button onClick={onNext} size="xs" style={{ backgroundColor: '#1e293b' }}>
                Next
              </Button>
            </Group>
          </Group>

        </Stack>
      </Container>
    </Section>
  );
};
