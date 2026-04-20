'use client';
import React from 'react';

import Image from 'next/image';
import { Box, Container, Grid, Stack, Text, Title } from '@mantine/core';
import type { AboutPageContent } from '../../domain/entities/AboutPageContent';

export interface FounderStorySectionProps {
  founderStory: AboutPageContent['founderStory'];
}

/** Render D3NTIQ as D3NT with superscript IQ, bold white — no background box */
const renderWithBrand = (text: string): React.ReactNode => {
  const parts = text.split(/(D3NTIQ)/g);
  return parts.map((part, i) =>
    part === 'D3NTIQ' ? (
      <Text key={i} component="span" fw={700} c="white" style={{ display: 'inline' }}>
        D3NT<sup style={{ fontSize: '0.65em', verticalAlign: 'super' }}>IQ</sup>
      </Text>
    ) : (
      part
    )
  );
};

export const FounderStorySection: React.FC<FounderStorySectionProps> = ({ founderStory }) => {
  return (
    <Box
      component="section"
      py={{ base: 60, md: 80 }}
      style={{
        background: 'linear-gradient(135deg, #2a7a8c 0%, #1e5f72 40%, #174f60 100%)',
        width: '100%',
      }}
    >
      <Container size="xl">

        {/* Title */}
        <Title
          order={2}
          ta="center"
          c="white"
          fw={700}
          mb={{ base: 40, md: 52 }}
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
            letterSpacing: '-0.02em',
          }}
        >
          {founderStory.title}
        </Title>

        {/* Two-column layout */}
        <Grid gutter={{ base: 32, md: 52 }} align="center">

          {/* Left — image */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Box
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4/3',
                borderRadius: 14,
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}
            >
              {founderStory.image?.src && (
                <Image
                  src={founderStory.image.src}
                  alt={founderStory.image.alt ?? 'Founder story'}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                  priority
                />
              )}
            </Box>
          </Grid.Col>

          {/* Right — quote + description */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap={24} align="center">

              {/* Italic bold quote */}
              <Text
                ta="center"
                fs="italic"
                fw={700}
                c="white"
                style={{
                  fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-line',
                }}
              >
                {founderStory.quote}
              </Text>

              {/* Body description */}
              {founderStory.description && (
                <Text
                  ta="center"
                  lh={1.7}
                  style={{
                    fontSize: 'clamp(0.8rem, 1.3vw, 0.875rem)',
                    color: 'rgba(255,255,255,0.82)',
                    maxWidth: 480,
                  }}
                >
                  {renderWithBrand(founderStory.description)}
                </Text>
              )}

            </Stack>
          </Grid.Col>

        </Grid>
      </Container>
    </Box>
  );
};
