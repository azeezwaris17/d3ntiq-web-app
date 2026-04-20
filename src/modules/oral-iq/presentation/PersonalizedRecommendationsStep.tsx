'use client';
import React from 'react';

import { Text, Stack, Button, Group, Box } from '@mantine/core';
import { Section, Container } from '@/shared/components/layout';
import type { PersonalizedRecommendation } from '../domain/entities/PersonalizedRecommendation';
import { RecommendationSkeleton } from '@/shared/components/SkeletonLoader';
import { GraphQLErrorAlert } from '@/shared/components/GraphQLErrorAlert';

export interface PersonalizedRecommendationsStepProps {
  recommendation: PersonalizedRecommendation;
  onBack: () => void;
  /** Called when user clicks "Find a Dentist" (public flow) */
  onLocateProvider?: () => void;
  /** When inside the dashboard with a pre-selected provider, show "Book Now" instead */
  onBookNow?: () => void;
  /** The provider the patient selected before logging in */
  selectedProvider?: { name: string; specialty: string; address?: string } | null;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  /** Loading state for the action button (Find a Dentist / Book Now) */
  isActionLoading?: boolean;
}

const ToothIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C9.5 2 7 3.5 7 6.5C7 8 7 10 7 12C7 14 6 16 6 18C6 20 7 22 9 22C10 22 10.5 21 11 20C11.5 19 12 18 12 18C12 18 12.5 19 13 20C13.5 21 14 22 15 22C17 22 18 20 18 18C18 16 17 14 17 12C17 10 17 8 17 6.5C17 3.5 14.5 2 12 2Z" fill="#495057" />
  </svg>
);

export const PersonalizedRecommendationsStep: React.FC<PersonalizedRecommendationsStepProps> = ({
  recommendation, onBack, onLocateProvider, onBookNow,
  isLoading = false, error = null, onRetry, isActionLoading = false,
}) => {
  if (error) {
    return (
      <Section background="light">
        <Container size="md" className="py-10">
          <Stack gap="lg">
            <GraphQLErrorAlert error={error} onRetry={onRetry} />
            <Group justify="center">
              <Button variant="outline" size="xs" onClick={onBack}>Back</Button>
            </Group>
          </Stack>
        </Container>
      </Section>
    );
  }

  if (isLoading) {
    return (
      <Section background="light">
        <Container size="md" className="py-10">
          <Stack gap="lg">
            <Box ta="center">
              <Text size="md" fw={600} mb="xs">Generating Recommendations</Text>
              <Text size="sm" c="dimmed" mb={4}>Creating tailored recommendations for you...</Text>
              <Text size="xs" c="dimmed">Estimated: 5-10 seconds</Text>
            </Box>
            <RecommendationSkeleton />
          </Stack>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="light">
      <Container size="md" className="py-10">
        <Stack gap="lg">
          {recommendation.concerns && (
            <Box p="md" bg="#E8F4F8" style={{ border: '1px solid #548CA1', borderRadius: 8 }}>
              <Text size="sm" fw={600} mb="xs">Assessment Summary</Text>
              <Text size="xs" lh={1.6} c="dimmed">{recommendation.concerns}</Text>
              {recommendation.severityLevel && (
                <Text size="xs" mt="xs" fs="italic" c="dimmed">
                  Severity: {recommendation.severityLevel.replace(/_/g, ' ')}
                </Text>
              )}
            </Box>
          )}

          {recommendation.specialties.length > 0 && (
            <Box>
              <Text size="sm" fw={600} mb="sm">Recommended Specialists</Text>
              <Stack gap="md">
                {recommendation.specialties.map((specialty) => (
                  <Group key={specialty.id} wrap="nowrap" align="flex-start" gap="sm">
                    <Box p={8} bg="#F1F3F5" style={{ borderRadius: 6 }}>
                      <ToothIcon size={16} />
                    </Box>
                    <Box style={{ flex: 1 }}>
                      <Text fw={600} size="xs" mb={2}>{specialty.name}</Text>
                      <Text size="xs" c="#548CA1">{specialty.description}</Text>
                    </Box>
                  </Group>
                ))}
              </Stack>
            </Box>
          )}

          <Box>
            <Stack gap="xs">
              {recommendation.recommendations.map((step, idx) => (
                <Group key={idx} gap="xs" align="flex-start">
                  <Box
                    w={24} h={24}
                    style={{ borderRadius: '50%', backgroundColor: '#548CA1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}
                  >
                    <Text size="xs" fw={700} c="white">{idx + 1}</Text>
                  </Box>
                  <Text size="xs" lh={1.6} c="dimmed" style={{ flex: 1 }}>{step}</Text>
                </Group>
              ))}
            </Stack>
          </Box>

          {recommendation.disclaimer && (
            <Box p="sm" bg="#FFF9E6" style={{ border: '1px solid #FFE066', borderRadius: 6 }}>
              <Text size="xs" fw={600} mb={2} c="#856404">DISCLAIMER</Text>
              <Text size="xs" c="#856404" lh={1.5}>{recommendation.disclaimer}</Text>
            </Box>
          )}

          <Group justify="space-between" mt="md" gap="sm" wrap="nowrap">
            <Button variant="outline" size="xs" px={32} onClick={onBack} disabled={isActionLoading}>Back</Button>

            {/* Show "Book Now" in dashboard flow, "Find a Dentist" in public flow */}
            {onBookNow ? (
              <Button 
                size="xs" 
                px={32} 
                onClick={onBookNow} 
                style={{ backgroundColor: '#548CA1' }}
                loading={isActionLoading}
                loaderProps={{ type: 'oval' }}
              >
                {isActionLoading ? 'Redirecting...' : 'Book Now'}
              </Button>
            ) : (
              <Button 
                size="xs" 
                px={32} 
                onClick={onLocateProvider} 
                style={{ backgroundColor: '#548CA1' }}
                loading={isActionLoading}
                loaderProps={{ type: 'oval' }}
              >
                {isActionLoading ? 'Redirecting...' : 'Find a Dentist'}
              </Button>
            )}
          </Group>
        </Stack>
      </Container>
    </Section>
  );
};
