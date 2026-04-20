'use client';
import React from 'react';

import { Box, Container, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { Shield, Stethoscope, Handshake } from 'lucide-react';

const CARDS = [
  {
    icon: Shield,
    title: 'Restore Trust',
    description:
      'Creating an environment where patients feel safe, heard, and valued through complete transparency.',
  },
  {
    icon: Stethoscope,
    title: 'Simplify Knowledge',
    description:
      'Using visuals and intuitive tools to make complex dental treatments easy for anyone to understand.',
  },
  {
    icon: Handshake,
    title: 'Strengthen Bonds',
    description:
      'Bridge the gap between doctors and patients to foster long-term oral health partnerships.',
  },
] as const;

export const MissionStorySection: React.FC = () => {
  return (
    <Box py={72} style={{ backgroundColor: '#ffffff' }}>
      <Container size="lg">

        {/* Header */}
        <Stack gap={12} align="center" mb={48}>
          <Title
            order={2}
            ta="center"
            fw={800}
            c="#0c2140"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', letterSpacing: '-0.02em' }}
          >
            Our Mission Story
          </Title>
          <Text
            ta="center"
            maw={520}
            c="#64748b"
            lh={1.6}
            style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
          >
            Beyond clinical procedures, we&apos;re rewriting the dental experience through
            transparency and technology.
          </Text>
        </Stack>

        {/* Cards */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={20}>
          {CARDS.map(({ icon: Icon, title, description }) => (
            <Box
              key={title}
              style={{
                backgroundColor: '#f4f8fb',
                borderRadius: 14,
                padding: '36px 28px 32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {/* Icon circle */}
              <Box
                mb={20}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: '#daeef7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={26} color="#3aabcf" strokeWidth={1.8} />
              </Box>

              {/* Title */}
              <Text
                fw={700}
                c="#0c2140"
                mb={10}
                style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.05rem)', letterSpacing: '-0.01em' }}
              >
                {title}
              </Text>

              {/* Description */}
              <Text
                c="#64748b"
                lh={1.6}
                style={{ fontSize: 'clamp(0.8rem, 1.3vw, 0.875rem)' }}
              >
                {description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

      </Container>
    </Box>
  );
};
