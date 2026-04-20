/**
 * ResetPasswordPage
 * Patient: white centred layout. Provider: split image/form layout.
 */
'use client';
import React from 'react';

import { useState } from 'react';
import {
  Stack, PasswordInput, Button, Text, Title, Box, Flex, Notification,
} from '@mantine/core';
import { CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthHeader } from './components/AuthHeader';
import { AuthFooter } from './components/AuthFooter';
import type { AuthRole } from '../types';

import { useResetPassword } from '../infrastructure/useAuth';
import { friendlyAuthError } from '../infrastructure/auth-error';

interface ResetFormProps { role: AuthRole; email: string; }

function ResetForm({ role, email }: ResetFormProps) {
  const router = useRouter();
  const { resetPassword, loading } = useResetPassword();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Password must be at least 8 characters long.');
    if (password !== confirmPassword) return setError('Passwords do not match. Please check and try again.');
    try {
      await resetPassword({ email, newPassword: password, role: role.toUpperCase() as 'PATIENT' | 'PROVIDER' });
      setSuccess(true);
      setTimeout(() => router.push(`/login?role=${role}`), 1500);
    } catch (err) {
      setError(friendlyAuthError(err, 'resetPassword'));
    }
  }

  return (
    <form onSubmit={handleReset}>
      <Stack gap="md">
        {/* Success notification */}
        {success && (
          <Notification icon={<CheckCircle size={18} />} color="teal" title="Password reset!" withCloseButton={false}>
            Your password has been updated successfully. Redirecting you to the login page...
          </Notification>
        )}

        {/* Error notification */}
        {error && (
          <Notification icon={<XCircle size={18} />} color="red" title="Reset failed" onClose={() => setError('')}>
            {error}
          </Notification>
        )}

        <PasswordInput label="New Password" placeholder="At least 8 characters"
          description="Use a mix of letters, numbers, and symbols for a strong password."
          value={password} onChange={(e) => setPassword(e.currentTarget.value)}
          required size="md" disabled={loading || success} />

        <PasswordInput label="Confirm New Password" placeholder="Re-enter your new password"
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          required size="md" disabled={loading || success} />

        <Button type="submit" fullWidth size="md" loading={loading} disabled={success}
          loaderProps={{ type: 'oval' }} style={{ backgroundColor: '#2d7d9a' }}>
          {loading ? 'Resetting password...' : 'Reset Password'}
        </Button>
      </Stack>
    </form>
  );
}

function PatientResetPassword({ email }: { email: string }) {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AuthHeader />
      <Box style={{ flex: 1, padding: '60px 20px' }}>
        <Stack align="center" gap="xl" maw={480} mx="auto">
          <Stack gap="sm" align="center">
            <Title order={1} fw={700} ta="center" c="#1e293b" fz={{ base: 26, md: 32 }}>Set New Password</Title>
            <Text size="sm" c="dimmed" ta="center">Create a strong new password for your account.</Text>
          </Stack>
          <Box w="100%"><ResetForm role="patient" email={email} /></Box>
        </Stack>
      </Box>
      <AuthFooter />
    </Box>
  );
}

function ProviderResetPassword({ email }: { email: string }) {
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
              <Title order={1} fw={700} c="#1e293b" fz={{ base: 26, md: 32 }}>Set New Password</Title>
              <Text size="sm" c="dimmed">Create a strong new password for your provider account.</Text>
            </Stack>
            <ResetForm role="provider" email={email} />
          </Stack>
        </Flex>
      </Flex>
      <AuthFooter />
    </Box>
  );
}

export function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const role: AuthRole = searchParams.get('role') === 'provider' ? 'provider' : 'patient';
  const email = searchParams.get('email') ?? '';
  return role === 'provider' ? <ProviderResetPassword email={email} /> : <PatientResetPassword email={email} />;
}
