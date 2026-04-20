/**
 * ForgotPasswordPage
 * Patient: white centred layout. Provider: split image/form layout.
 */
'use client';
import React from 'react';

import { useState } from 'react';
import {
  Stack, TextInput, Button, Text, Title, Box, Flex, Notification, Anchor,
} from '@mantine/core';
import { CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuthHeader } from './components/AuthHeader';
import { AuthFooter } from './components/AuthFooter';
import type { AuthRole } from '../types';

import { useForgotPassword } from '../infrastructure/useAuth';
import { friendlyAuthError } from '../infrastructure/auth-error';

interface ForgotFormProps { role: AuthRole; }

function ForgotForm({ role }: ForgotFormProps) {
  const { forgotPassword, loading } = useForgotPassword();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Please enter your email address.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.');
    try {
      await forgotPassword({ email: email.trim(), role: role.toUpperCase() as 'PATIENT' | 'PROVIDER' });
      setSent(true);
    } catch (err) {
      // Always show a neutral message — never confirm whether the email exists
      setError(friendlyAuthError(err, 'forgotPassword'));
    }
  }

  if (sent) {
    return (
      <Stack gap="md">
        <Notification icon={<CheckCircle size={18} />} color="teal" title="Check your inbox!" withCloseButton={false}>
          We&apos;ve sent a password reset link to <strong>{email}</strong>.
          Please check your email — the link expires in 30 minutes.
        </Notification>
        <Text size="xs" c="dimmed" ta="center">
          Didn&apos;t receive it? Check your spam folder or{' '}
          <Text component="span" c="#2d7d9a" fw={600} style={{ cursor: 'pointer' }} onClick={() => setSent(false)}>
            try again
          </Text>.
        </Text>
        <Button component={Link} href={`/login?role=${role}`} fullWidth size="md"
          variant="outline" style={{ borderColor: '#2d7d9a', color: '#2d7d9a' }}>
          Back to Login
        </Button>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput placeholder="Enter your email" type="email"
          value={email} onChange={(e) => setEmail(e.currentTarget.value)}
          required size="md" disabled={loading} />

        {error && (
          <Notification icon={<XCircle size={18} />} color="red" title="Error" onClose={() => setError('')}>
            {error}
          </Notification>
        )}

        <Stack gap="xs">
          <Button type="submit" fullWidth size="md" loading={loading}
            loaderProps={{ type: 'oval' }} style={{ backgroundColor: '#2d7d9a' }}>
            {loading ? 'Sending reset link...' : 'Send Reset Link'}
          </Button>
          <Button component={Link} href={`/login?role=${role}`} fullWidth size="md"
            variant="outline" style={{ borderColor: '#d1d5db', color: '#374151' }} disabled={loading}>
            Back to Login
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

function PatientForgotPassword() {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AuthHeader />
      <Box style={{ flex: 1, padding: '60px 20px' }}>
        <Stack align="center" gap="xl" maw={640} mx="auto">
          <Stack gap="sm" align="center">
            <Title order={1} fw={700} ta="center" c="#1e293b" fz={{ base: 28, md: 36 }}>
              Welcome to Your Patient Dashboard
            </Title>
            <Text size="sm" c="dimmed" ta="center" maw={480}>
              Enter your email address below. A reset link will be sent to your email address so you can change your password.
            </Text>
          </Stack>
          <Box w="100%" maw={480}><ForgotForm role="patient" /></Box>
          <Box w="100%" style={{ borderRadius: 12, background: 'linear-gradient(135deg, #2d6e7e 0%, #1e4a5c 100%)', padding: '48px 32px', textAlign: 'center' }}>
            <Text fw={700} fz={18} c="white">
              Your dental health is our priority!{' '}
              <Anchor component={Link} href="/login?role=patient" c="#38bdf8" fw={700}>Login</Anchor>{' '}
              to schedule an appointment today.
            </Text>
          </Box>
        </Stack>
      </Box>
      <AuthFooter />
    </Box>
  );
}

function ProviderForgotPassword() {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AuthHeader />
      <Flex style={{ flex: 1 }} direction={{ base: 'column', md: 'row' }}>
        <Box style={{ flex: '0 0 45%', position: 'relative', minHeight: 400 }}>
          <Image src="/images/provider-auth-bg.jpg" alt="Dental provider" fill style={{ objectFit: 'cover' }} priority />
        </Box>
        <Flex style={{ flex: 1, padding: '60px 48px' }} direction="column" justify="center">
          <Stack gap="lg" maw={440} w="100%">
            <Stack gap="sm">
              <Title order={1} fw={700} c="#1e293b" fz={{ base: 26, md: 32 }}>
                Welcome to Your Provider/<br />Dentist Dashboard
              </Title>
              <Text size="sm" c="dimmed">
                Enter your email address below. A reset link will be sent to your email address so you can change your password.
              </Text>
            </Stack>
            <ForgotForm role="provider" />
          </Stack>
        </Flex>
      </Flex>
      <AuthFooter />
    </Box>
  );
}

export function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const role: AuthRole = searchParams.get('role') === 'provider' ? 'provider' : 'patient';
  return role === 'provider' ? <ProviderForgotPassword /> : <PatientForgotPassword />;
}
