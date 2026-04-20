/**
 * ProviderImpactSection Component
 * Full-width background image with floating cards
 */
'use client';
import React from 'react';

import {
  Box,
  Container,
  Text,
  Avatar,
  Stack,
  Group,
  Paper,
  BackgroundImage,
} from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { IconChartLine } from '@tabler/icons-react';
import { themeColors } from '@/shared/theme';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  avatar?: string;
}

export interface ImpactMetric {
  title: string;
  percentage: string;
  description: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Sarah Miller',
    role: 'Orthodontist',
    location: 'Los Angeles',
    avatar: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    quote: 'The Oral IQ profile saved us 20 minutes of data collection on the first visit.',
  },
];

const defaultImpactMetric: ImpactMetric = {
  title: 'Oral IQ Impact',
  percentage: '94%',
  description: 'Of providers reported higher diagnostic accuracy when previewing patient data.',
};

export const ProviderImpactSection: React.FC = () => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);
  const testimonial = defaultTestimonials[0];

  return (
    <Container size="xl" py={48}>
      <Paper radius="lg" style={{ overflow: 'hidden', position: 'relative' }}>
        <BackgroundImage
          src="/images/providers/dental-office-image.png"
          h={{ base: 360, md: 400 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            backgroundPosition: 'center 20%',
          }}
        >
          {/* Overlay */}
          <Box
            pos="absolute"
            inset={0}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1 }}
          />

          <Group
            justify="space-between"
            align="center"
            px={{ base: 16, md: 48 }}
            w="100%"
            style={{ zIndex: 2 }}
          >
            {/* Left Side: Testimonial Card */}
            <Paper
              shadow="md"
              p={24}
              radius="md"
              w={{ base: '100%', md: 320 }}
              style={{
                transform: 'rotate(-1deg)',
                backgroundColor: '#ffffff',
              }}
            >
              <Stack gap="sm">
                <Group gap="sm">
                  <Avatar src={testimonial.avatar} size={40} radius="xl" />
                  <Box>
                    <Text fw={600} size="sm">
                      {testimonial.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {testimonial.role} • {testimonial.location}
                    </Text>
                  </Box>
                </Group>
                <Text size="sm" c={colors.neutral[7]} lh={1.5}>
                  &ldquo;{testimonial.quote}&rdquo;
                </Text>
              </Stack>
            </Paper>

            {/* Right Side: Impact Badge */}
            <Paper
              p={24}
              radius="md"
              w={{ base: '100%', md: 280 }}
              style={{
                backgroundColor: '#52899b',
                color: '#ffffff',
                transform: 'rotate(1deg)',
              }}
            >
              <Stack gap={4}>
                <Group gap={4}>
                  <IconChartLine size={14} />
                  <Text size="xs" fw={600} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                    {defaultImpactMetric.title}
                  </Text>
                </Group>

                <Text fz={36} fw={700} lh={1}>
                  {defaultImpactMetric.percentage}
                </Text>

                <Text size="xs" opacity={0.9} lh={1.4}>
                  {defaultImpactMetric.description}
                </Text>
              </Stack>
            </Paper>
          </Group>
        </BackgroundImage>
      </Paper>
    </Container>
  );
};