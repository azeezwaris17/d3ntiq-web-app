'use client';
import React from 'react';

import { useRouter } from 'next/navigation';
import { Container, Title, Text, Stack, Box, Card, Button, SimpleGrid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { IconDental, IconDeviceMobile, IconChartBar, IconFirstAidKit } from '@tabler/icons-react';

const PatientIcon = () => (
  <Box style={{ position: 'relative', width: 48, height: 48 }}>
    <IconDental size={40} color="#548CA4" stroke={1.5} />
    <Box style={{ position: 'absolute', bottom: -4, right: -8, background: 'white', borderRadius: 4, padding: 2, border: '1px solid #E2E8F0', display: 'flex' }}>
      <IconDeviceMobile size={12} color="#548CA4" stroke={1.5} />
    </Box>
  </Box>
);

const ProviderIcon = () => (
  <Box style={{ position: 'relative', width: 48, height: 48 }}>
    <IconChartBar size={40} color="#334155" stroke={1.5} />
    <Box style={{ position: 'absolute', bottom: -4, right: -8, background: 'white', borderRadius: 4, padding: 2, border: '1px solid #E2E8F0', display: 'flex' }}>
      <IconFirstAidKit size={12} color="#334155" stroke={1.5} />
    </Box>
  </Box>
);

export const LandingPage: React.FC = () => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#EBF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
      {/* Blur blobs */}
      <Box style={{ position: 'absolute', width: 512, height: 410, top: -102, left: -128, borderRadius: 9999, backgroundColor: 'rgba(19,164,236,0.08)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <Box style={{ position: 'absolute', width: 640, height: 512, top: 736, left: 768, borderRadius: 9999, backgroundColor: 'rgba(96,165,250,0.08)', filter: 'blur(150px)', pointerEvents: 'none' }} />

      <Container size="lg" style={{ width: '100%', maxWidth: '880px', position: 'relative', zIndex: 1 }}>
        <Stack gap={32} align="center">

          {/* Logo */}
          <Link href="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Image src="/images/dentiq-logo.png" alt="D3NTIQ Logo" width={140} height={140} style={{ objectFit: 'contain', width: 'auto' }} />
          </Link>

          {/* Heading */}
          <Stack gap={8} align="center">
            <Title order={1} style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 700, color: '#1E293B', textAlign: 'center', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Welcome to DENT{' '}
              <Text component="span" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', color: '#38BDF8', fontWeight: 600 }}>IQ</Text>
            </Title>
            <Text style={{ color: '#64748B', textAlign: 'center', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', maxWidth: '480px', lineHeight: 1.5 }}>
              Choose your experience to get started with our intelligent dental solution.
            </Text>
          </Stack>

          {/* Cards */}
          <SimpleGrid cols={isMobile ? 1 : 2} spacing={20} style={{ width: '100%' }}>
            {/* Patient */}
            <Card padding={28} radius={16} bg="white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9' }}>
              <Stack gap={20} align="center" style={{ height: '100%' }}>
                <Box style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#EBF5FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PatientIcon />
                </Box>
                <Stack gap={6} align="center">
                  <Title order={3} style={{ color: '#1E293B', fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', fontWeight: 600 }}>I&apos;m a Patient</Title>
                  <Text style={{ color: '#64748B', textAlign: 'center', lineHeight: 1.5, fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
                    Assess symptoms instantly and connect with top dental providers using our AI-driven tool.
                  </Text>
                </Stack>
                <Button fullWidth size="md" radius="md" styles={{ root: { backgroundColor: '#548CA4', height: '44px', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', fontWeight: 600, marginTop: 'auto' } }} onClick={() => router.push('/oral-iq')}>
                  Start Oral IQ
                </Button>
              </Stack>
            </Card>

            {/* Provider */}
            <Card padding={28} radius={16} bg="white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9' }}>
              <Stack gap={20} align="center" style={{ height: '100%' }}>
                <Box style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ProviderIcon />
                </Box>
                <Stack gap={6} align="center">
                  <Title order={3} style={{ color: '#1E293B', fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', fontWeight: 600 }}>I&apos;m a Provider</Title>
                  <Text style={{ color: '#64748B', textAlign: 'center', lineHeight: 1.5, fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
                    Access advanced reporting tools and manage patient flows through our professional dashboard.
                  </Text>
                </Stack>
                <Button fullWidth size="md" radius="md" styles={{ root: { backgroundColor: '#1E293B', height: '44px', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', fontWeight: 600, marginTop: 'auto', opacity: 0.9 } }} onClick={() => router.push('/login?role=provider')}>
                 Register Practice
                </Button>
              </Stack>
            </Card>
          </SimpleGrid>

          {/* Continue without selecting */}
          <Stack gap={12} align="center" style={{ width: '100%', marginTop: '8px' }}>
            <Text style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Continue without selecting
            </Text>
            <Button size="md" radius="md" styles={{ root: { backgroundColor: '#548CA4', width: isMobile ? '100%' : '300px', height: '44px', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', fontWeight: 600 } }} onClick={() => router.push('/home')}>
              Continue to Homepage
            </Button>
          </Stack>

        </Stack>
      </Container>
    </Box>
  );
};
