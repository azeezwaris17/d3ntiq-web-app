'use client';
import React from 'react';

import Link from 'next/link';
import { Box, Button, Stack, Text, Title } from '@mantine/core';
import type { HowItWorksContent } from '../../domain/entities/HowItWorksContent';

export interface HowItWorksHeroSectionProps {
  hero: HowItWorksContent['hero'];
}

const TEAL = '#3a8fa3';

/** Render "How D3NTIQ Works" with D3NT in teal + superscript IQ */
const renderTitle = (title: string): React.ReactNode => {
  // title = "How D3NTIQ Works"
  const parts = title.split(/(D3NTIQ)/g);
  return parts.map((part, i) =>
    part === 'D3NTIQ' ? (
      <Text key={i} component="span" c={TEAL} inherit style={{ display: 'inline' }}>
        D3NT<sup style={{ fontSize: '0.5em', verticalAlign: 'super' }}>IQ</sup>
      </Text>
    ) : (
      part
    )
  );
};

/** Render description with D3NT superscript IQ */
const renderDescription = (text: string): React.ReactNode => {
  const parts = text.split(/(D3NTIQ)/g);
  return parts.map((part, i) =>
    part === 'D3NTIQ' ? (
      <Text key={i} component="span" fw={600} c="#0c2140" style={{ display: 'inline' }}>
        D3NT<sup style={{ fontSize: '0.62em', verticalAlign: 'super' }}>IQ</sup>
      </Text>
    ) : (
      part
    )
  );
};

export function HowItWorksHeroSection({ hero }: HowItWorksHeroSectionProps) {
  return (
    <Box
      component="section"
      style={{
        width: '100%',
        minHeight: '72vh',
        background: 'linear-gradient(160deg, #e8f4f8 0%, #f0f8fc 35%, #ffffff 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack
        gap={28}
        align="center"
        style={{
          maxWidth: 620,
          width: '100%',
          padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 48px)',
          textAlign: 'center',
        }}
      >
        {/* Badge */}
        <Box
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 999,
            backgroundColor: '#d6eef5',
            border: '1px solid #b8dde9',
          }}
        >
          <Box
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: TEAL,
              flexShrink: 0,
            }}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: TEAL,
            }}
          >
            {hero.badge}
          </Text>
        </Box>

        {/* Title */}
        <Title
          order={1}
          fw={800}
          c="#0c2140"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}
        >
          {renderTitle(hero.title)}
        </Title>

        {/* Description */}
        <Text
          lh={1.7}
          c="#5f6c7b"
          style={{
            fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
            maxWidth: 500,
          }}
        >
          {renderDescription(hero.description)}
        </Text>

        {/* CTA button */}
        <Button
          component={Link}
          href="/oral-iq"
          size="md"
          style={{
            backgroundColor: TEAL,
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 600,
            height: 48,
            paddingLeft: 32,
            paddingRight: 32,
            borderRadius: 10,
            marginTop: 4,
          }}
        >
          {hero.primaryButtonText}
        </Button>

      </Stack>
    </Box>
  );
}

export default HowItWorksHeroSection;
