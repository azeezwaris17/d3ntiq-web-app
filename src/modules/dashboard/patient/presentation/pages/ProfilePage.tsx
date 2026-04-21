'use client';
import React from 'react';

import { useRef, useState } from 'react';
import {
  Box, Title, Text, Tabs, Stack, TextInput, Button, Avatar,
  Group, Notification, Badge, Checkbox,
} from '@mantine/core';
import { DateOfBirthInput } from '@/shared/components/base/DateOfBirthInput';
import { CheckCircle, XCircle, Camera, ArrowLeft, User, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InsuranceWizard } from '../components/InsuranceWizard';
import { useGetMyProfile, useUpdatePatientProfile } from '@/modules/dashboard/infrastructure/useDashboard';

// ─── Edit form ────────────────────────────────────────────────────────────────

function EditForm({ onBack }: { onBack: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useGetMyProfile();
  const { updatePatientProfile, loading } = useUpdatePatientProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [address, setAddress] = useState('');
  const [currentProvider, setCurrentProvider] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Pre-fill form once the profile query resolves
  React.useEffect(() => {
    if (!profile) return;
    const parts = profile.fullName.split(' ');
    setFirstName(parts[0] ?? '');
    setLastName(parts.slice(1).join(' '));
    setEmail(profile.email);
    setPhone(profile.phone ?? '');
    setAddress(profile.patientAddress ?? '');
    setCurrentProvider(profile.currentProvider ?? '');
    if (profile.dateOfBirth) {
      // Parse using UTC parts to avoid timezone-shift issues
      // e.g. "1998-09-21T23:00:00.000Z" should render as Sep 21 1998, not Sep 22
      const d = new Date(profile.dateOfBirth);
      setDateOfBirth(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    }
  }, [profile]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!firstName.trim()) return setError('First name is required.');
    if (!email.trim()) return setError('Email address is required.');
    try {
      await updatePatientProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        dateOfBirth: dateOfBirth ?? undefined,
        address: address.trim() || undefined,
        currentProvider: currentProvider.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    }
  }

  return (
    <Box>
      <Group gap={12} mb={24} align="center">
        <Button variant="subtle" size="xs" leftSection={<ArrowLeft size={14} strokeWidth={1.8} />} c="#64748b" onClick={onBack}>
          Back
        </Button>
        <Box>
          <Title order={2} fw={700} c="#1e293b" fz={22}>My Account Settings</Title>
          <Text size="sm" c="dimmed" mt={2}>Manage your profile and insurance information</Text>
        </Box>
      </Group>

      <Tabs
        defaultValue="profile"
        variant="underline"
        styles={{
          tab: {
            '&[dataActive]': { color: '#2d7d9a', borderBottomColor: '#2d7d9a' },
            '&:hover': { color: '#2d7d9a', backgroundColor: 'transparent' },
          },
        }}
      >
        <Tabs.List mb={24}>
          <Tabs.Tab value="profile" leftSection={<User size={14} strokeWidth={1.8} />}>
            Profile
          </Tabs.Tab>
          <Tabs.Tab value="insurance" leftSection={<ShieldCheck size={14} strokeWidth={1.8} />}>
            Insurance
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile">
          <Box maw={640}>

            {success && (
              <Notification icon={<CheckCircle size={18} />} color="teal" title="Profile updated!" mb="md" withCloseButton={false}>
                Your profile has been updated successfully.
              </Notification>
            )}
            {error && (
              <Notification icon={<XCircle size={18} />} color="red" title="Update failed" mb="md" onClose={() => setError('')}>
                {error}
              </Notification>
            )}

            <Group gap={16} mb={24} align="center">
              <Avatar src={avatarPreview} alt="Profile picture" size={72} radius="xl" color="teal"
                style={{ cursor: 'pointer', border: '2px solid #e2e8f0' }} onClick={() => fileInputRef.current?.click()}>
                {firstName.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Button variant="subtle" size="xs" leftSection={<Camera size={14} strokeWidth={1.8} />}
                c="#2d7d9a" onClick={() => fileInputRef.current?.click()}>
                Update Picture
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </Group>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput label="First Name" placeholder="Enter your first name" value={firstName}
                  onChange={(e) => setFirstName(e.currentTarget.value)} required size="md" disabled={loading} />

                <TextInput label="Last Name" placeholder="Enter your last name" value={lastName}
                  onChange={(e) => setLastName(e.currentTarget.value)} size="md" disabled={loading} />

                <DateOfBirthInput
                  label="Birthday"
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  size="md"
                  disabled={loading}
                />

                <TextInput label="Address" placeholder="Enter your home address" value={address}
                  onChange={(e) => setAddress(e.currentTarget.value)} size="md" disabled={loading} />

                <TextInput label="Email" placeholder="Enter your email" type="email" value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)} required size="md" disabled={loading} />

                <TextInput label="Phone" placeholder="Enter your phone number" type="tel" value={phone}
                  onChange={(e) => setPhone(e.currentTarget.value)} size="md" disabled={loading} />

                <TextInput label="Current Provider" placeholder="If none, type NA" value={currentProvider}
                  onChange={(e) => setCurrentProvider(e.currentTarget.value)} size="md" disabled={loading} />

                <Box mt={8}>
                  <Button type="submit" size="md" loading={loading} loaderProps={{ type: 'oval' }}
                    style={{ backgroundColor: '#2d7d9a', minWidth: 160 }}>
                    {loading ? 'Saving...' : 'Update Profile'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="insurance">
          <InsuranceWizard onSkip={onBack} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

// ─── View mode ────────────────────────────────────────────────────────────────

function ViewMode({ onUpdateAccount }: { onUpdateAccount: () => void }) {
  const router = useRouter();
  const { profile } = useGetMyProfile();

  return (
    <Box>
      <Box mb={24}>
        <Title order={2} fw={700} c="#1e293b" fz={22}>My Account Settings</Title>
        <Text size="sm" c="dimmed" mt={4}>Manage your profile and insurance information</Text>
      </Box>

      <Box p={28} mb={32} style={{ backgroundColor: '#2d7d9a', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <Group gap={20} align="center">
          <Avatar src={profile?.avatarUrl ?? null} alt={profile?.fullName ?? 'Patient'} size={80} radius="xl" style={{ border: '3px solid rgba(255,255,255,0.4)' }}>
            {profile?.fullName?.charAt(0) ?? 'P'}
          </Avatar>
          <Stack gap={6}>
            <Text fw={700} fz={20} c="white">{profile?.fullName ?? '—'}</Text>
            <Group gap={8}>
              <Badge color="gray" variant="filled" size="sm" style={{ backgroundColor: '#64748b' }}>Active Patient</Badge>
              <Badge color="gray" variant="outline" size="sm" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>{profile?.idLabel ?? '—'}</Badge>
            </Group>
            <Text size="sm" c="rgba(255,255,255,0.85)">Welcome back! Here&apos;s your dental health overview.</Text>
          </Stack>
        </Group>
        <Group gap={8} wrap="nowrap">
          <Button
            variant="outline"
            size="xs"
            style={{ borderColor: 'white', color: 'white', flex: 1 }}
            onClick={onUpdateAccount}
          >
            Update Account
          </Button>
          <Button
            size="xs"
            style={{ backgroundColor: '#38bdf8', color: '#0f172a', flex: 1 }}
            onClick={() => router.push('/patient/appointments')}
          >
            View Appointments
          </Button>
        </Group>
      </Box>

      <Box>
        <Title order={5} fw={600} c="#1e293b" mb={16}>Account Settings</Title>
        <Stack gap={12}>
          <Checkbox label="Appointment Reminders" checked readOnly size="sm" />
          <Checkbox label="Billing Notifications" checked readOnly size="sm" />
          <Checkbox label="Message Alerts" checked readOnly size="sm" />
        </Stack>
      </Box>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PatientProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  return isEditing
    ? <EditForm onBack={() => setIsEditing(false)} />
    : <ViewMode onUpdateAccount={() => setIsEditing(true)} />;
}
