'use client';
import React from 'react';

import { Title, Text, Divider, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/core';
import { Section, Container, ComponentGroup } from '@/shared/components/layout';
import { themeColors } from '@/shared/theme';
import type { ProvidersPageContent } from '../../domain/entities/Provider';

export interface ProvidersHeroSectionProps {
  hero: ProvidersPageContent['hero'];
}

export const ProvidersHeroSection: React.FC<ProvidersHeroSectionProps> = ({ hero }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const colors = themeColors(useMantineTheme());

  return (
    <Section
      backgroundImage={hero.backgroundImage}
      className="relative overflow-hidden"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark-200/60 via-primary-dark-200/70 to-primary-dark-200/90" />

      <Container size="xl" className="relative z-10 py-20 lg:py-[80px]">
        <ComponentGroup direction="col" spacing="md" className="max-w-[600px]">

          {/* Badge */}
          <Group gap="md" align="center" wrap="nowrap">
            <Divider size="xs" w={32} color={colors.neutral[0]} opacity={0.8} />
            <Text size="xs" fw={400} c={colors.neutral[0]} opacity={0.95}>
              {hero.badge}
            </Text>
          </Group>

          {/* Title */}
          <Title
            order={1}
            style={{
              fontSize: isMobile ? 38 : 60,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: colors.neutral[0],
            }}
          >
            {hero.title}
          </Title>

          {/* Description */}
          <Text
            style={{
              color: colors.neutral[0],
              opacity: 0.95,
              lineHeight: 1.6,
              maxWidth: 540,
              fontSize: isMobile ? 16 : 20,
              fontWeight: 400,
            }}
          >
            {hero.description}
          </Text>

        </ComponentGroup>
      </Container>
    </Section>
  );
};
