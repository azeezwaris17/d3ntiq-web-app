'use client';
import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Container, Grid, Group, Stack, Text, Title } from '@mantine/core';
import type { AboutPageContent } from '../../domain/entities/AboutPageContent';

export interface WhyChooseUsSectionProps {
  whyChooseUs: AboutPageContent['helpingSection'];
}

const TEAL = '#3a8fa3';

/** Render D3NTIQ as D3NT + superscript IQ */
const renderWithBrand = (text: string): React.ReactNode => {
  const parts = text.split(/(D3NTIQ)/g);
  return parts.map((part, i) =>
    part === 'D3NTIQ' ? (
      <Text key={i} component="span" fw={700} c={TEAL} style={{ display: 'inline' }}>
        D3NT<sup style={{ fontSize: '0.62em', verticalAlign: 'super' }}>IQ</sup>
      </Text>
    ) : (
      part
    )
  );
};

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ whyChooseUs }) => {
  return (
    <Box
      component="section"
      py={{ base: 56, md: 72 }}
      style={{ backgroundColor: '#ffffff', width: '100%' }}
    >
      <Container size="xl">
        <Grid gutter={{ base: 40, md: 64 }} align="center">

          {/* Left — text content */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap={20}>

              {/* Badge */}
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: TEAL,
                  letterSpacing: '0.01em',
                }}
              >
                {whyChooseUs.badge}
              </Text>

              {/* Title */}
              <Title
                order={2}
                fw={800}
                c="#0c2140"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  maxWidth: 420,
                }}
              >
                {whyChooseUs.title}
              </Title>

              {/* Description with D3NTIQ brand */}
              <Text
                lh={1.65}
                c="#5f6c7b"
                style={{ fontSize: 'clamp(0.875rem, 1.4vw, 0.95rem)', maxWidth: 480 }}
              >
                {renderWithBrand(whyChooseUs.description)}
              </Text>

              {/* CTA buttons */}
              <Group gap={12} mt={8}>
                <Button
                  component={Link}
                  href="/oral-iq"
                  variant="outline"
                  size="sm"
                  style={{
                    borderColor: '#cbd5e1',
                    color: '#0c2140',
                    fontSize: 13,
                    fontWeight: 500,
                    height: 40,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 6,
                  }}
                >
                  Start your{' '}
                  <Text component="span" fw={700} style={{ display: 'inline', marginLeft: 4 }}>
                    Oral<sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>IQ</sup>
                  </Text>{' '}
                  journey
                </Button>

                <Button
                  component={Link}
                  href="/register?role=provider"
                  size="sm"
                  style={{
                    backgroundColor: TEAL,
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 500,
                    height: 40,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 6,
                  }}
                >
                  Register a Practice
                </Button>
              </Group>

            </Stack>
          </Grid.Col>

          {/* Right — image */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4/3',
                borderRadius: 14,
                overflow: 'hidden',
                backgroundColor: '#e2eef2',
              }}
            >
              {whyChooseUs.image?.src && (
                <Image
                  src={whyChooseUs.image.src}
                  alt={whyChooseUs.image.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </Box>
          </Grid.Col>

        </Grid>
      </Container>
    </Box>
  );
};
