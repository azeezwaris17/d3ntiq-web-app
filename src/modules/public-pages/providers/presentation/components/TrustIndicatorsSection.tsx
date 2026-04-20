'use client';
import React from 'react';

import { Box, Container, Stack, Text, ThemeIcon, SimpleGrid } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { IconShield, IconLock, IconUsers, IconMoodSmile } from '@tabler/icons-react';
import { themeColors } from '@/shared/theme';

export interface TrustIndicator {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  color: string;
}

export interface TrustIndicatorsSectionProps {
  indicators?: TrustIndicator[];
}

const defaultIndicators: TrustIndicator[] = [
  {
    icon: IconShield,
    title: 'HIPAA-Compliant',
    subtitle: 'Federal standard protection',
    color: 'blue',
  },
  {
    icon: IconLock,
    title: 'Secure Data Encryption',
    subtitle: '256-bit AES protection',
    color: 'cyan',
  },
  {
    icon: IconUsers,
    title: '5,000+ Professionals',
    subtitle: 'Growing dental network',
    color: 'teal',
  },
  {
    icon: IconMoodSmile,
    title: '98% Satisfaction',
    subtitle: 'Based on patient feedback',
    color: 'green',
  },
];

export const TrustIndicatorsSection: React.FC<TrustIndicatorsSectionProps> = ({
  indicators = defaultIndicators,
}) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  return (
    <Box
      component="section"
      bg={colors.neutral[0]}
      py={{ base: 24, md: 32 }}
      style={{
        borderTop: `1px solid ${colors.neutral[2]}`,
        borderBottom: `1px solid ${colors.neutral[2]}`,
      }}
    >
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 'lg', md: 'xl' }}>
          {indicators.map((indicator, index) => {
            const IconComponent = indicator.icon;

            return (
              <Stack key={index} gap="xs" align="center" ta="center">
                {/* Icon - Smaller */}
                <ThemeIcon size={48} radius="xl" variant="light" color={indicator.color}>
                  <IconComponent size={22} stroke={2} />
                </ThemeIcon>

                {/* Title */}
                <Text size="sm" fw={600} c={colors.neutral[9]}>
                  {indicator.title}
                </Text>

                {/* Subtitle */}
                <Text size="xs" c={colors.neutral[6]}>
                  {indicator.subtitle}
                </Text>
              </Stack>
            );
          })}
        </SimpleGrid>
      </Container>
    </Box>
  );
};