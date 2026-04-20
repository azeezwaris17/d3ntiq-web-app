'use client';
import React from 'react';

import Image from 'next/image';
import { Title, Text, Stack, Grid, Box } from '@mantine/core';
import type { AboutPageContent } from '../../domain/entities/AboutPageContent';
import { typography } from '@/shared/theme/typography';

export interface LearnMoreSectionProps {
  learnMore: AboutPageContent['learnMore'];
}

const BrandMark: React.FC = () => {
  return (
    <>
      <Text component="span" fw={700} c="primary.5" inherit>
        D3NT
      </Text>
      <Text component="sup" fw={700} c="secondary.4" inherit ml={2}>
        IQ
      </Text>
    </>
  );
};

const renderBrandizedText = (text: string) => {
  const parts = text.split('D3NTIQ');
  if (parts.length === 1) {
    return text;
  }
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && <BrandMark />}
        </React.Fragment>
      ))}
    </>
  );
};

const RoundedImage: React.FC<{
  src: string;
  alt: string;
  heightClassName: string;
  sizes: string;
}> = ({ src, alt, heightClassName, sizes }) => {
  // Convert Tailwind height classes to inline styles
  const getHeightFromClassName = (className: string): string => {
    if (className.includes('h-[560px]')) return '560px';
    if (className.includes('h-[260px]')) return '260px';
    if (className.includes('h-[320px]')) return '320px';
    if (className.includes('h-[400px]')) return '400px';
    // Default fallback
    return '300px';
  };

  return (
    <Box
      className="relative overflow-hidden rounded-3xl bg-secondary-light-100"
      style={{ height: getHeightFromClassName(heightClassName) }}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />
    </Box>
  );
};

export const LearnMoreSection: React.FC<LearnMoreSectionProps> = ({ learnMore }) => {
  return (
    <Box className="relative w-full overflow-hidden">
      {/* Content Container */}
      <Box className="relative z-10 flex flex-col px-6 py-24 lg:px-[154px] lg:py-[120px]">
        <Stack gap="xl" align="center" mb="xl">
          <Title
            order={2}
            ta="center"
            style={{
              fontSize: typography.scale.heading.h2,
              fontWeight: typography.weights.bold,
              lineHeight: typography.lineHeights.snug,
              letterSpacing: typography.letterSpacing.tight,
              color: typography.colors.light.primary,
            }}
          >
            {learnMore.title}
          </Title>
          <Text
            ta="center"
            style={{
              fontSize: typography.scale.body.lg,
              fontWeight: typography.weights.regular,
              lineHeight: typography.lineHeights.relaxed,
              color: typography.colors.light.secondary,
            }}
          >
            {renderBrandizedText(learnMore.description)}
          </Text>
        </Stack>

        {/* Desktop layout (matches Figma) */}
        <Box visibleFrom="lg">
          <Grid gutter={40} align="start">
            {/* Left: tall image */}
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <RoundedImage
                src={learnMore.images.teamScrubs}
                alt={learnMore.imageAlts.teamScrubs}
                heightClassName="h-[560px]"
                sizes="(max-width: 1200px) 100vw, 33vw"
              />
            </Grid.Col>

            {/* Middle: two stacked images */}
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Stack gap={20}>
                <RoundedImage
                  src={learnMore.images.dentalModel}
                  alt={learnMore.imageAlts.dentalModel}
                  heightClassName="h-[260px]"
                  sizes="(max-width: 1200px) 100vw, 33vw"
                />
                <RoundedImage
                  src={learnMore.images.anatomicalModel}
                  alt={learnMore.imageAlts.anatomicalModel}
                  heightClassName="h-[260px]"
                  sizes="(max-width: 1200px) 100vw, 33vw"
                />
              </Stack>
            </Grid.Col>

            {/* Right: text blocks (two paragraphs, left aligned) */}
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Stack gap={28} pt={6} maw={520} mx="auto">
                <Text
                  ta="left"
                  className="text-pretty"
                  style={{
                    fontSize: typography.scale.body.lg,
                    fontWeight: typography.weights.regular,
                    lineHeight: typography.lineHeights.relaxed,
                    color: typography.colors.light.secondary,
                  }}
                >
                  {renderBrandizedText(learnMore.content.paragraph1)}
                </Text>
                <Text
                  ta="left"
                  className="text-pretty"
                  style={{
                    fontSize: typography.scale.body.lg,
                    fontWeight: typography.weights.regular,
                    lineHeight: typography.lineHeights.relaxed,
                    color: typography.colors.light.secondary,
                  }}
                >
                  {renderBrandizedText(learnMore.content.paragraph2)}
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Box>

        {/* Mobile / tablet layout (matches Figma) */}
        <Box hiddenFrom="lg">
          <Stack gap={24} maw={820} mx="auto">
            <RoundedImage
              src={learnMore.images.teamScrubs}
              alt={learnMore.imageAlts.teamScrubs}
              heightClassName="h-[520px]"
              sizes="100vw"
            />

            <RoundedImage
              src={learnMore.images.dentalModel}
              alt={learnMore.imageAlts.dentalModel}
              heightClassName="h-[260px]"
              sizes="100vw"
            />

            <RoundedImage
              src={learnMore.images.anatomicalModel}
              alt={learnMore.imageAlts.anatomicalModel}
              heightClassName="h-[260px]"
              sizes="100vw"
            />

            <Text
              ta="left"
              maw={560}
              mx="auto"
              className="text-pretty"
              style={{
                fontSize: typography.scale.body.lg,
                fontWeight: typography.weights.regular,
                lineHeight: typography.lineHeights.relaxed,
                color: typography.colors.light.secondary,
              }}
            >
              {renderBrandizedText(learnMore.content.paragraph1)}
            </Text>
            <Text
              ta="left"
              maw={560}
              mx="auto"
              className="text-pretty"
              style={{
                fontSize: typography.scale.body.lg,
                fontWeight: typography.weights.regular,
                lineHeight: typography.lineHeights.relaxed,
                color: typography.colors.light.secondary,
              }}
            >
              {renderBrandizedText(learnMore.content.paragraph2)}
            </Text>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
