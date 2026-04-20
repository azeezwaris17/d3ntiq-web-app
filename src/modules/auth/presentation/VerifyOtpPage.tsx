/**
 * VerifyOtpPage
 * Patient: white centred layout. Provider: split image/form layout.
 */
'use client';
import React from 'react';

import { useState } from 'react';
import {
  Stack, Button, Text, Title, Box, Flex, Notification, PinInput,
} from '@mantine/core';
import { CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthHeader } from './components/AuthHeader';
import { AuthFooter } from './components/AuthFooter';
import type { AuthRole } from '../types';

import { useVerifyOtp, useForgotPassword } from '../infrastructure/useAuth';
import { friendlyAuthError } from '../infrastructure/auth-error';

interface OtpFormProps { role: AuthRole; email: string; }

function OtpForm({ role, email }: OtpFormProps) {
  const router = useRouter();
  const { verifyOtp, loading } = useVerifyOtp();
  const { forgotPassword, loading: resending } = useForgotPassword();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (otp.length < 6) return setError('Please enter the complete 6-digit verification code.');
    try {
      await verifyOtp({ email, otp, role: role.toUpperCase() as 'PATIENT' | 'PROVIDER' });
      setSuccess(true);
      setTimeout(() => router.push(`/reset-password?role=${role}&email=${encodeURIComponent(email)}`), 1200);
    } catch (err) {
      setError(friendlyAuthError(err, 'verifyOtp'));
    }
  }

  async function handleResend() {
    setResendSuccess('');
    setError('');
    try {
      await forgotPassword({ email, role: role.toUpperCase() as 'PATIENT' | 'PROVIDER' });
      setResendSuccess('A new code has been sent to your email.');
      setOtp('');
    } catch (err) {
      setError(friendlyAuthError(err, 'verifyOtp'));
    }
  }

  return (
    <form onSubmit={handleVerify}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          We sent a 6-digit code to <strong>{email || 'your email'}</strong>. Enter it below to continue.
        </Text>

        <PinInput length={6} value={otp} onChange={setOtp} size="lg" type="number"
          placeholder="○" style={{ justifyContent: 'center' }} disabled={loading || success} />

        {/* Success notification */}
        {success && (
          <Notification icon={<CheckCircle size={18} />} color="teal" title="Code verified!" withCloseButton={false}>
            Your code is correct. Redirecting you to set a new password...
          </Notification>
        )}

        {/* Error notification */}
        {error && (
          <Notification icon={<XCircle size={18} />} color="red" title="Verification failed" onClose={() => setError('')}>
            {error}
          </Notification>
        )}

        {/* Resend success notification */}
        {resendSuccess && (
          <Notification icon={<CheckCircle size={18} />} color="teal" title="Code resent" onClose={() => setResendSuccess('')}>
            {resendSuccess}
          </Notification>
        )}

        <Button type="submit" fullWidth size="md" loading={loading} disabled={success}
          loaderProps={{ type: 'oval' }} style={{ backgroundColor: '#2d7d9a' }}>
          {loading ? 'Verifying...' : 'Verify Code'}
        </Button>

        <Text size="xs" c="dimmed" ta="center">
          Didn&apos;t receive a code?{' '}
          <Text component="span" c="#2d7d9a" fw={600}
            style={{ cursor: resending ? 'not-allowed' : 'pointer', opacity: resending ? 0.6 : 1 }}
            onClick={!resending ? handleResend : undefined}>
            {resending ? 'Sending...' : 'Resend code'}
          </Text>
        </Text>
      </Stack>
    </form>
  );
}

function PatientVerifyOtp({ email }: { email: string }) {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AuthHeader />
      <Box style={{ flex: 1, padding: '60px 20px' }}>
        <Stack align="center" gap="xl" maw={480} mx="auto">
          <Stack gap="sm" align="center">
            <Title order={1} fw={700} ta="center" c="#1e293b" fz={{ base: 26, md: 32 }}>Verify Your Email</Title>
            <Text size="sm" c="dimmed" ta="center">Enter the verification code sent to your email address.</Text>
          </Stack>
          <Box w="100%"><OtpForm role="patient" email={email} /></Box>
        </Stack>
      </Box>
      <AuthFooter />
    </Box>
  );
}

function ProviderVerifyOtp({ email }: { email: string }) {
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
              <Title order={1} fw={700} c="#1e293b" fz={{ base: 26, md: 32 }}>Verify Your Email</Title>
              <Text size="sm" c="dimmed">Enter the verification code sent to your email address.</Text>
            </Stack>
            <OtpForm role="provider" email={email} />
          </Stack>
        </Flex>
      </Flex>
      <AuthFooter />
    </Box>
  );
}

export function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const role: AuthRole = searchParams.get('role') === 'provider' ? 'provider' : 'patient';
  const email = searchParams.get('email') ?? '';
  return role === 'provider' ? <ProviderVerifyOtp email={email} /> : <PatientVerifyOtp email={email} />;
}
