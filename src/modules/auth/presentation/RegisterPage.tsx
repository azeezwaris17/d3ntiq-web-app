/**
 * RegisterPage — patient and provider share this page.
 * Role: ?role=patient (default) | ?role=provider
 * Provider fields pre-filled from homepage practice registration via URL params.
 */
'use client';
import React, { useState } from 'react';
import {
  Stack, TextInput, PasswordInput, Button, Text, Anchor, Select, Notification,
} from '@mantine/core';
import { DateOfBirthInput } from '@/shared/components/base/DateOfBirthInput';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuthBackground } from './components/AuthBackground';
import { AuthCard } from './components/AuthCard';
import { BrandTitle } from './components/BrandTitle';
import type { AuthRole } from '../types';

import { useRegister } from '../infrastructure/useAuth';
import { friendlyAuthError } from '../infrastructure/auth-error';

const SPECIALTIES = [
  'General Dentistry', 'Orthodontics', 'Periodontics',
  'Endodontics', 'Pediatric Dentistry', 'Oral Surgery',
];

export function RegisterPage() {

  const searchParams = useSearchParams();
  const role: AuthRole = searchParams.get('role') === 'provider' ? 'provider' : 'patient';
  const { register, loading } = useRegister();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentProvider, setCurrentProvider] = useState('');

  // Provider fields
  const [phone, setPhone] = useState(searchParams.get('phone') ?? '');
  const [specialty, setSpecialty] = useState<string | null>(searchParams.get('specialty') ?? null);
  const [practiceName, setPracticeName] = useState(searchParams.get('practiceName') ?? '');
  const [providerAddress, setProviderAddress] = useState(searchParams.get('address') ?? '');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) return setError('Please enter your first name.');
    if (!lastName.trim()) return setError('Please enter your last name.');

    if (role === 'patient') {
      if (!dateOfBirth) return setError('Please select your date of birth.');
      if (!address.trim()) return setError('Please enter your address.');
      if (!currentProvider.trim()) return setError('Please enter your current provider (or type NA if none).');
    }

    if (!email.trim()) return setError('Please enter your email address.');

    if (role === 'provider') {
      if (!phone.trim()) return setError('Please enter your phone number.');
      if (!specialty) return setError('Please select your practice specialty.');
      if (!practiceName.trim()) return setError('Please enter your practice name.');
      if (!providerAddress.trim()) return setError('Please enter your practice address.');
    }

    if (password.length < 8) return setError('Password must be at least 8 characters long.');
    if (password !== confirmPassword) return setError('Passwords do not match. Please check and try again.');

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        role: role.toUpperCase() as 'PATIENT' | 'PROVIDER',
        dateOfBirth: role === 'patient' ? dateOfBirth : undefined,
        patientAddress: role === 'patient' ? address.trim() : undefined,
        currentProvider: role === 'patient' ? currentProvider.trim() : undefined,
        phone: role === 'provider' ? phone.trim() : undefined,
        specialty: role === 'provider' ? specialty ?? undefined : undefined,
        practiceName: role === 'provider' ? practiceName.trim() : undefined,
        address: role === 'provider' ? providerAddress.trim() : undefined,
      });
      setSuccess(true);
      // Use window.location for reliable navigation after auth state change
      setTimeout(() => {
        window.location.href = `/login?role=${role}`;
      }, 1200);
    } catch (err) {
      setError(friendlyAuthError(err, 'register'));
    }
  }

  const isDisabled = loading || success;

  return (
    <AuthBackground>
      <AuthCard>
        <Stack gap="xs" mb="lg" align="center">
          <BrandTitle suffix="Portal" />
          <Text size="sm" c="dimmed" ta="center">
            {role === 'provider'
              ? 'Create your provider account to access the D3NTIQ portal'
              : <>Register to enjoy full the benefits/features of <Text component="span" c="#38bdf8" fw={600}>D3NT<sup style={{ fontSize: 10 }}>IQ</sup></Text></>
            }
          </Text>
        </Stack>

        {success && (
          <Notification icon={<CheckCircle size={18} />} color="teal" title="Account created!" mb="md" withCloseButton={false}>
            Your account has been created successfully. Redirecting you to the login page...
          </Notification>
        )}

        {error && (
          <Notification icon={<XCircle size={18} />} color="red" title="Registration failed" mb="md" onClose={() => setError('')}>
            {error}
          </Notification>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput label="First Name" placeholder="Enter your first name"
              value={firstName} onChange={(e) => setFirstName(e.currentTarget.value)}
              required size="md" disabled={isDisabled} />

            <TextInput label="Last Name" placeholder="Enter your last name"
              value={lastName} onChange={(e) => setLastName(e.currentTarget.value)}
              required size="md" disabled={isDisabled} />

            {role === 'patient' && (
              <>
                <DateOfBirthInput
                  label="Birthday"
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  required
                  size="md"
                  disabled={isDisabled}
                />

                <TextInput label="Address" placeholder="Enter your home address"
                  value={address} onChange={(e) => setAddress(e.currentTarget.value)}
                  required size="md" disabled={isDisabled} />
              </>
            )}

            <TextInput label="Email Address" placeholder="Enter your email" type="email"
              value={email} onChange={(e) => setEmail(e.currentTarget.value)}
              required size="md" disabled={isDisabled} />

            {role === 'provider' && (
              <>
                <TextInput label="Phone Number" placeholder="Enter your phone number" type="tel"
                  value={phone} onChange={(e) => setPhone(e.currentTarget.value)}
                  required size="md" disabled={isDisabled} />
                <TextInput label="Practice Name" placeholder="Enter your practice name"
                  value={practiceName} onChange={(e) => setPracticeName(e.currentTarget.value)}
                  required size="md" disabled={isDisabled} />
                <Select label="Practice Specialty" placeholder="Select specialty"
                  data={SPECIALTIES} value={specialty} onChange={setSpecialty}
                  required size="md" disabled={isDisabled} />
                <TextInput label="Practice Address" placeholder="Enter your practice address"
                  value={providerAddress} onChange={(e) => setProviderAddress(e.currentTarget.value)}
                  required size="md" disabled={isDisabled} />
              </>
            )}

            <PasswordInput label="Password" placeholder="At least 8 characters"
              value={password} onChange={(e) => setPassword(e.currentTarget.value)}
              required size="md" disabled={isDisabled} />

            <PasswordInput label="Confirm Password" placeholder="Re-enter your password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              required size="md" disabled={isDisabled} />

            {role === 'patient' && (
              <TextInput label="Current Provider" placeholder="If none, type NA"
                value={currentProvider} onChange={(e) => setCurrentProvider(e.currentTarget.value)}
                required size="md" disabled={isDisabled} />
            )}

            <Button type="submit" fullWidth size="md" loading={loading} disabled={success}
              loaderProps={{ type: 'oval' }} style={{ backgroundColor: '#2d7d9a', marginTop: 4 }}>
              {loading ? 'Creating account...' : 'Register now'}
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center" mt="md" c="dimmed">
          Have an account?{' '}
          <Anchor component={Link} href={`/login?role=${role}`} fw={600} c="#2d7d9a">Login now</Anchor>
        </Text>

        <Text size="xs" c="dimmed" ta="center" mt="xs">
          {role === 'patient' ? 'Are you a provider?' : 'Are you a patient?'}{' '}
          <Anchor component={Link}
            href={role === 'patient' ? '/register?role=provider' : '/register?role=patient'}
            size="xs" c="#2d7d9a" fw={600}>
            Register as {role === 'patient' ? 'Provider' : 'Patient'}
          </Anchor>
        </Text>
      </AuthCard>
    </AuthBackground>
  );
}
