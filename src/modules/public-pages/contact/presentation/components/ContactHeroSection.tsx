/**
 * ContactHeroSection Component
 *
 * This file contains the hero section component for the contact page.
 * It displays the main title, description, and call-to-action buttons.
 *
 * How it works:
 * 1. Receives hero data as props from the contact page content
 * 2. Renders a full-width banner with background image and gradient overlay
 * 3. Displays badge, title, description, and CTA buttons
 * 4. Uses responsive design with different layouts for mobile and desktop
 * 5. Removes "More Details" button and makes "Book Demo" button wider as requested
 *
 * The component is client-side only ('use client') for interactivity and uses
 * responsive design patterns consistent with other hero sections.
 */
'use client';
import React from 'react';

import Link from 'next/link';
import { Title, Text, Stack, Group, Box, Button } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import type { ContactPageContent } from '../../domain/entities/ContactFormData';
import { useMediaQuery } from '@mantine/hooks';
import { contactData } from '../../infrastructure/data/contactData';
import { themeColors, typography } from '@/shared/theme';
import { HeroShell, PageSection } from '@/shared/components/layout';

export interface ContactHeroSectionProps {
  hero: ContactPageContent['hero'];
}

export const ContactHeroSection: React.FC<ContactHeroSectionProps> = ({ hero }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const theme = useMantineTheme();
  const colors = themeColors(theme);
  const ctaButtons = hero.ctaButtons ?? contactData.hero.ctaButtons;

  return (
    <HeroShell backgroundImage={hero.backgroundImage} innerClassName="flex flex-col">
      <PageSection className="lg:py-[120px]">
        <Stack gap="xl" justify="center" style={{ maxWidth: 780, minHeight: '60vh' }}>
          {/* Badge */}
          <Group gap="md" justify="flex-start" align="center" w="100%">
            <Box className="h-[2px] w-20" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }} />
            <Text
              style={{
                fontSize: typography.scale.body.lg,
                fontWeight: typography.weights.medium,
                letterSpacing: typography.letterSpacing.normal,
                color: colors.neutral[0],
                fontFamily: theme.fontFamily,
              }}
            >
              {hero.badge}
            </Text>
          </Group>

          {/* Title */}
          <Title
            order={1}
            ta="left"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.375rem)', // 40px to 70px
              fontWeight: typography.weights.extrabold,
              lineHeight: typography.lineHeights.tight,
              letterSpacing: typography.letterSpacing.tighter,
              color: colors.neutral[0],
              fontFamily: theme.fontFamily,
            }}
          >
            {hero.title}
          </Title>

          {/* Description */}
          <Text
            ta="left"
            style={{
              fontSize: isMobile ? '1.375rem' : typography.scale.body.xl,
              fontWeight: typography.weights.regular,
              lineHeight: typography.lineHeights.loose,
              opacity: 0.92,
              maxWidth: isMobile ? 720 : 640,
              color: colors.neutral[0],
              fontFamily: theme.fontFamily,
            }}
          >
            {hero.description}
          </Text>

          {/* CTA Button - Only Book Demo, made wider */}
          <Group gap="md" justify={isMobile ? 'center' : 'flex-start'} w="100%" mt="lg">
            <Button
              component={Link}
              href={ctaButtons.bookDemo.link}
              size="lg"
              radius="md"
              className="h-14"
              styles={(theme) => ({
                root: {
                  backgroundColor: colors.primary[5],
                  color: colors.neutral[0],
                  fontSize: typography.scale.body.lg,
                  fontWeight: typography.weights.semibold,
                  width: isMobile ? '80%' : 320,
                  fontFamily: theme.fontFamily,

                  '&:hover': {
                    backgroundColor: colors.primary[6],
                    transform: 'translateY(-1px)',
                  },
                },
              })}
            >
              {ctaButtons.bookDemo.text}
            </Button>
          </Group>
        </Stack>
      </PageSection>
    </HeroShell>
  );
};
