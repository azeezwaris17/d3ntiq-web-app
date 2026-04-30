/**
 * LoginPage — patient and provider share this page.
 * Role: ?role=patient (default) | ?role=provider
 */
'use client';
import React from 'react';

import { useState } from 'react';
import {
  Stack, TextInput, PasswordInput, Button, Text, Anchor,
  Checkbox, Group, Divider, Notification,
} from '@mantine/core';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthBackground } from './components/AuthBackground';
import { AuthCard } from './components/AuthCard';
import { BrandTitle } from './components/BrandTitle';
import type { AuthRole } from '../types';

import { useLogin } from '../infrastructure/useAuth';
import { friendlyAuthError } from '../infrastructure/auth-error';

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role: AuthRole = searchParams.get('role') === 'provider' ? 'provider' : 'patient';
  const { login, loading } = useLogin();

  const copy = {
    patient: {
      subtitle: 'Access your dental records, appointments,\ntreatment plans, billing and more',
      signInLabel: 'Sign In to Portal',
      newUserLabel: 'New patient?',
      createLabel: 'Create Patient Account',
      successMessage: 'Signed in successfully! Redirecting to your dashboard...',
    },
    provider: {
      subtitle: 'Access your provider dashboard, patient records,\nappointments and clinical tools',
      signInLabel: 'Sign In to Portal',
      newUserLabel: 'New provider?',
      createLabel: 'Create Provider Account',
      successMessage: 'Signed in successfully! Redirecting to your provider dashboard...',
    },
  }[role];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Please enter your email address.');
    if (!password) return setError('Please enter your password.');

    try {
      await login({ email: email.trim(), password, role: role.toUpperCase() as 'PATIENT' | 'PROVIDER' });
      setSuccess(true);

      // Only use redirectAfterLogin if it points to a dashboard page (set by providers page flow)
      const redirectTo = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');

      if (role === 'provider') {
        router.push('/provider/appointments');
      } else {
        // Only honour the redirect if it's a dashboard path, not an external page
        const safePath = redirectTo?.startsWith('/patient') ? redirectTo : '/patient/oral-iq';
        router.push(safePath);
      }
    } catch (err) {
      setError(friendlyAuthError(err, 'login'));
    }
  }

  return (
    <AuthBackground>
      <AuthCard>
        <Stack gap="xs" mb="lg" align="center">
          <BrandTitle prefix="My" suffix="Portal" />
          <Text size="sm" c="dimmed" ta="center" style={{ whiteSpace: 'pre-line' }}>
            {copy.subtitle}
          </Text>
        </Stack>

        {/* Success notification */}
        {success && (
          <Notification
            icon={<CheckCircle size={18} />}
            color="teal"
            title="Success!"
            mb="md"
            withCloseButton={false}
          >
            {copy.successMessage}
          </Notification>
        )}

        {/* Error notification */}
        {error && (
          <Notification
            icon={<XCircle size={18} />}
            color="red"
            title="Sign in failed"
            mb="md"
            onClose={() => setError('')}
          >
            {error}
          </Notification>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Email Address" placeholder="Enter your email" type="email"
              value={email} onChange={(e) => setEmail(e.currentTarget.value)}
              required size="md" disabled={loading || success}
            />
            <PasswordInput
              label="Password" placeholder="Enter your password"
              value={password} onChange={(e) => setPassword(e.currentTarget.value)}
              required size="md" disabled={loading || success}
            />
            <Group justify="space-between" align="center">
              <Checkbox label="Remember me" checked={rememberMe}
                onChange={(e) => setRememberMe(e.currentTarget.checked)}
                size="sm" disabled={loading || success} />              <Anchor component={Link} href={`/forgot-password?role=${role}`} size="sm" c="#2d7d9a">
                Forgot password?
              </Anchor>
            </Group>
            <Button type="submit" fullWidth size="md" loading={loading} disabled={success}
              loaderProps={{ type: 'oval' }} style={{ backgroundColor: '#2d7d9a', marginTop: 4 }}>
              {loading ? 'Signing in...' : copy.signInLabel}
            </Button>
          </Stack>
        </form>

        <Divider my="md" label={copy.newUserLabel} labelPosition="center" />

        <Button component={Link} href={`/register?role=${role}`} fullWidth size="md"
          variant="outline" color="gray" style={{ borderColor: '#d1d5db', color: '#374151' }}
          disabled={loading || success}>
          {copy.createLabel}
        </Button>

        <Stack gap={4} mt="lg" align="center">
          <Text size="xs" c="dimmed">Need help accessing your account?</Text>
          <Group gap="xs">
            <Anchor href="mailto:support@dentiq.com" size="xs" c="#2d7d9a">Contact Support</Anchor>
            <Text size="xs" c="dimmed">|</Text>
            <Anchor href="tel:+1800000000" size="xs" c="#2d7d9a">Call Clinic</Anchor>
          </Group>
        </Stack>

        <Text size="xs" c="dimmed" ta="center" mt="md">
          {role === 'patient' ? 'Are you a provider?' : 'Are you a patient?'}{' '}
          <Anchor component={Link}
            href={role === 'patient' ? '/login?role=provider' : '/login?role=patient'}
            size="xs" c="#2d7d9a" fw={600}>
            Sign in as {role === 'patient' ? 'Provider' : 'Patient'}
          </Anchor>
        </Text>
      </AuthCard>
    </AuthBackground>
  );
}
