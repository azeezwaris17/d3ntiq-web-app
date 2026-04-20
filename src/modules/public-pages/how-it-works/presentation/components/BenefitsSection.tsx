'use client';
import React from 'react';

import { Box, Container, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { LayoutGrid, Sparkles, UserCheck } from 'lucide-react';

const TEAL = '#3a8fa3';

/** Inline Oral superscript IQ */
const OralIQ: React.FC = () => (
  <Text component="span" fw={600} c={TEAL} style={{ display: 'inline' }}>
    Oral<sup style={{ fontSize: '0.62em', verticalAlign: 'super' }}>IQ</sup>
  </Text>
);

const CARDS = [
  {
    icon: LayoutGrid,
    title: 'Interactive Symptom Analysis',
    description: (
      <>
        Patients use the <OralIQ /> dental model to identify symptoms, pain location, and
        duration—creating structured information that helps providers understand concerns before
        the appointment.
      </>
    ),
  },
  {
    icon: Sparkles,
    title: 'Better Prepared Patients',
    description:
      'Patients arrive with a clearer understanding of their symptoms and potential treatments, leading to more productive consultations and stronger patient-provider relationships.',
  },
  {
    icon: UserCheck,
    title: 'Smart Provider Matching',
    description: (
      <>
        Based on symptoms and location, <OralIQ /> guides patients toward the most appropriate
        dental provider—helping practices attract patients who actually need their services.
      </>
    ),
  },
];

export const BenefitsSection: React.FC = () => {
  return (
    <Box
      component="section"
      py={{ base: 64, md: 80 }}
      style={{ backgroundColor: '#f0f5f8', width: '100%' }}
    >
      <Container size="xl">

        {/* Header */}
        <Stack gap={14} align="center" mb={52}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: TEAL,
            }}
          >
            CORE BENEFITS
          </Text>

          <Title
            order={2}
            ta="center"
            fw={800}
            c="#0c2140"
            maw={620}
            style={{
              fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            Technology That Turns Patient Symptoms Into Actionable Insights
          </Title>

          <Text
            ta="center"
            maw={580}
            lh={1.65}
            c="#5f6c7b"
            style={{ fontSize: 'clamp(0.875rem, 1.4vw, 0.95rem)' }}
          >
            <OralIQ /> helps patients describe their symptoms through an interactive dental
            assessment, giving providers clearer information before the visit and helping the right
            patients find the right care.
          </Text>
        </Stack>

        {/* Cards */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={20}>
          {CARDS.map(({ icon: Icon, title, description }) => (
            <Box
              key={title}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 14,
                padding: '32px 28px',
                boxShadow: '0 2px 16px rgba(15,23,42,0.06)',
              }}
            >
              {/* Icon box */}
              <Box
                mb={20}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: '#e0eff5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} color={TEAL} strokeWidth={1.8} />
              </Box>

              {/* Title */}
              <Text
                fw={700}
                c="#0c2140"
                mb={10}
                style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', letterSpacing: '-0.01em' }}
              >
                {title}
              </Text>

              {/* Description */}
              <Text lh={1.65} c="#64748b" style={{ fontSize: 'clamp(0.8rem, 1.3vw, 0.875rem)' }}>
                {description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

      </Container>
    </Box>
  );
};
