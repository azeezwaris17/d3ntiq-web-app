'use client';
import React from 'react';

import Image from 'next/image';
import { Box, Container, Grid, Stack, Text, Title } from '@mantine/core';
import { MousePointerClick, BarChart2, ClipboardCheck } from 'lucide-react';

const TEAL = '#3a8fa3';

const STEPS = [
  {
    number: '1.',
    icon: MousePointerClick,
    title: 'Patients Select Symptoms',
    description:
      'Patients use our intuitive dental interface to pinpoint exactly where they feel discomfort or issues before their visit.',
  },
  {
    number: '2.',
    icon: BarChart2,
    title: 'System Structures and Analyzes Input',
    description:
      'Our proprietary AI engine translates visual input into structured medical data, flagging critical concerns automatically.',
  },
  {
    number: '3.',
    icon: ClipboardCheck,
    title: 'Providers Receive Clear Reports',
    description:
      'Dental teams receive high-fidelity, organized reports directly in their dashboard, optimizing chair time and care quality.',
  },
];

export const JourneySection: React.FC = () => {
  return (
    <Box
      component="section"
      py={{ base: 64, md: 80 }}
      style={{ backgroundColor: '#ffffff', width: '100%' }}
    >
      <Container size="xl">
        <Grid gutter={{ base: 40, md: 72 }} align="center">

          {/* Left — browser mockup with 3D dental model */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box
              style={{
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(15,23,42,0.08)',
                backgroundColor: '#f8fafc',
              }}
            >
              {/* Browser chrome bar */}
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  backgroundColor: '#f1f5f9',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                {/* Traffic lights */}
                <Box style={{ display: 'flex', gap: 6 }}>
                  {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                    <Box
                      key={c}
                      style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c }}
                    />
                  ))}
                </Box>
                <Text style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em' }}>
                  3D INTERFACE
                </Text>
                <Box style={{ width: 42 }} />
              </Box>

              {/* Image area */}
              <Box style={{ position: 'relative', width: '100%', aspectRatio: '4/3', backgroundColor: '#1a2a3a' }}>
                <Image
                  src="/images/how-it-works/hero-img.png"
                  alt="3D dental model interface"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Tooltip overlay */}
                <Box
                  style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: 8,
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  <Box
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#f59e0b',
                      flexShrink: 0,
                    }}
                  />
                  <Text style={{ fontSize: 12, fontWeight: 600, color: '#0c2140' }}>
                    Sharp pain: Molar 3
                  </Text>
                </Box>

                {/* Bottom-right icon badge */}
                <Box
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: TEAL,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MousePointerClick size={16} color="#ffffff" strokeWidth={2} />
                </Box>
              </Box>
            </Box>
          </Grid.Col>

          {/* Right — badge, title, description, steps */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap={28}>

              {/* Badge */}
              <Box
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '5px 14px',
                  borderRadius: 999,
                  backgroundColor: '#d6eef5',
                  border: '1px solid #b8dde9',
                  alignSelf: 'flex-start',
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: TEAL,
                  }}
                >
                  PROCESS FLOW
                </Text>
              </Box>

              {/* Title — "How Oral IQ Works" */}
              <Title
                order={2}
                fw={800}
                c="#0c2140"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                How{' '}
                <Text component="span" inherit c="#0c2140">
                  Oral
                </Text>
                <sup
                  style={{
                    fontSize: '0.45em',
                    verticalAlign: 'super',
                    color: TEAL,
                    fontWeight: 800,
                  }}
                >
                  IQ
                </sup>{' '}
                Works
              </Title>

              {/* Subtitle */}
              <Text lh={1.6} c="#5f6c7b" style={{ fontSize: 'clamp(0.875rem, 1.4vw, 0.95rem)' }}>
                We bridge the gap between patient concerns and clinical data with a seamless 3-step digital journey.
              </Text>

              {/* Steps */}
              <Stack gap={24}>
                {STEPS.map(({ number, icon: Icon, title, description }) => (
                  <Box
                    key={number}
                    style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
                  >
                    {/* Icon circle */}
                    <Box
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        backgroundColor: '#e8f4f8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color={TEAL} strokeWidth={1.8} />
                    </Box>

                    {/* Text */}
                    <Stack gap={4}>
                      <Text fw={700} c="#0c2140" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                        {number} {title}
                      </Text>
                      <Text lh={1.6} c="#64748b" style={{ fontSize: 'clamp(0.8rem, 1.3vw, 0.875rem)' }}>
                        {description}
                      </Text>
                    </Stack>
                  </Box>
                ))}
              </Stack>

            </Stack>
          </Grid.Col>

        </Grid>
      </Container>
    </Box>
  );
};
