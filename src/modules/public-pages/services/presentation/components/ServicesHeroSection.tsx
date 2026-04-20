'use client';
import React from 'react';

import Link from 'next/link';
import { Box, Button, Group, Stack, Text, Title } from '@mantine/core';
import type { ServicesPageContent } from '../../domain/entities/Service';
import { PageSection } from '@/shared/components/layout';
import { typography } from '@/shared/theme/typography';

export interface ServicesHeroSectionProps {
  hero: ServicesPageContent['hero'];
}

export const ServicesHeroSection: React.FC<ServicesHeroSectionProps> = ({ hero }) => {
  return (
    <Box className="relative w-full overflow-hidden">
      {/* Background Image */}
      <Box
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
      />

      {/* Overlay */}
      <Box className="absolute inset-0 bg-gradient-to-b from-primary-dark-200/60 via-primary-dark-200/70 to-primary-dark-200/90" />

      {/* Content Container */}
      <PageSection className="relative z-10 flex flex-col lg:py-[120px]">
        <Stack gap="xl" justify="center" w="100%" style={{ maxWidth: 780, minHeight: '60vh' }}>
          {/* Badge row */}
          <Group gap="md" align="center">
            <Box w={56} h={2} style={{ backgroundColor: 'rgba(255,255,255,0.7)' }} />
            <Text
              c="white"
              style={{
                fontSize: typography.scale.body.sm,
                fontWeight: typography.weights.semibold,
                letterSpacing: typography.letterSpacing.wider,
                textTransform: 'uppercase',
                opacity: 0.95,
              }}
            >
              {hero.badge}
            </Text>
          </Group>

          {/* Big title */}
          <Title
            order={1}
            c="white"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.375rem)', // 40px to 70px
              fontWeight: typography.weights.extrabold,
              lineHeight: typography.lineHeights.tight,
              letterSpacing: typography.letterSpacing.tighter,
            }}
          >
            {hero.title}
          </Title>

          {/* Description */}
          <Text
            c="white"
            style={{
              fontSize: typography.scale.body.xl,
              fontWeight: typography.weights.regular,
              lineHeight: typography.lineHeights.relaxed,
              opacity: 0.92,
              maxWidth: 720,
            }}
          >
            {hero.description}
          </Text>

          {/* CTA buttons */}
          <Group gap="md" mt="sm">
            <Button
              component={Link}
              href={hero.ctaButtons.bookDemo.link}
              size="lg"
              radius="md"
              color="primary"
              styles={{
                root: {
                  fontSize: typography.scale.body.lg,
                  fontWeight: typography.weights.semibold,
                },
              }}
            >
              {hero.ctaButtons.bookDemo.text}
            </Button>
          </Group>
        </Stack>
      </PageSection>
    </Box>
  );
};
