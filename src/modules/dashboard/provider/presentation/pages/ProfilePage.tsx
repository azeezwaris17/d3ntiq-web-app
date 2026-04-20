'use client';
import React from 'react';

import { useRef, useState } from 'react';
import {
  Box, Title, Text, Stack, TextInput, Select, Button,
  Avatar, Group, Notification, Badge,
} from '@mantine/core';
import { CheckCircle, XCircle, Camera, ArrowLeft } from 'lucide-react';
import { useGetMyProfile, useUpdateProviderProfile } from '@/modules/dashboard/infrastructure/useDashboard';

const SPECIALTIES = [
  'General Dentistry', 'Orthodontics', 'Periodontics',
  'Endodontics', 'Pediatric Dentistry', 'Oral Surgery',
];

// ─── Edit form ────────────────────────────────────────────────────────────────

interface EditFormProps {
  onBack: () => void;
}

function EditForm({ onBack }: EditFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useGetMyProfile();
  const { updateProviderProfile, loading } = useUpdateProviderProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [practiceName, setPracticeName] = useState('');
  const [address, setAddress]     = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);

  // Pre-fill form once the profile query resolves
  React.useEffect(() => {
    if (!profile) return;
    const parts = profile.fullName.split(' ');
    setFirstName(parts[0] ?? '');
    setLastName(parts.slice(1).join(' '));
    setEmail(profile.email);
    setPhone(profile.phone ?? '');
    setSpecialty(profile.specialty ?? null);
    setPracticeName(profile.practiceName ?? '');
    setAddress(profile.address ?? '');
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
      await updateProviderProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        specialty: specialty ?? undefined,
        practiceName: practiceName.trim() || undefined,
        address: address.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    }
  }

  return (
    <Box>
      {/* Heading with back button */}
      <Group gap={12} mb={24} align="center">
        <Button
          variant="subtle"
          size="xs"
          leftSection={<ArrowLeft size={14} strokeWidth={1.8} />}
          c="#64748b"
          onClick={onBack}
        >
          Back
        </Button>
        <Box>
          <Title order={2} fw={700} c="#1e293b" fz={22}>Update Profile</Title>
          <Text size="sm" c="dimmed" mt={2}>Edit your provider account details</Text>
        </Box>
      </Group>

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

        {/* Avatar */}
        <Group gap={16} mb={24} align="center">
          <Avatar
            src={avatarPreview} alt="Profile picture" size={72} radius="xl" color="teal"
            style={{ cursor: 'pointer', border: '2px solid #e2e8f0' }}
            onClick={() => fileInputRef.current?.click()}
          >
            {firstName.charAt(0).toUpperCase() || 'D'}
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
            <TextInput label="Email" placeholder="Enter your email" type="email" value={email}
              onChange={(e) => setEmail(e.currentTarget.value)} required size="md" disabled={loading} />
            <TextInput label="Phone" placeholder="Enter your phone number" type="tel" value={phone}
              onChange={(e) => setPhone(e.currentTarget.value)} size="md" disabled={loading} />
            <TextInput label="Practice Name" placeholder="Enter your practice name" value={practiceName}
              onChange={(e) => setPracticeName(e.currentTarget.value)} size="md" disabled={loading} />
            <Select label="Practice Specialty" placeholder="Select specialty" data={SPECIALTIES}
              value={specialty} onChange={setSpecialty} size="md" disabled={loading} />
            <TextInput label="Practice Address" placeholder="Enter your practice address" value={address}
              onChange={(e) => setAddress(e.currentTarget.value)} size="md" disabled={loading} />
            <Box mt={8}>
              <Button type="submit" size="md" loading={loading} loaderProps={{ type: 'oval' }}
                style={{ backgroundColor: '#2d7d9a', minWidth: 160 }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}

// ─── View mode ────────────────────────────────────────────────────────────────

interface ViewModeProps {
  onUpdateProfile: () => void;
}

function ViewMode({ onUpdateProfile }: ViewModeProps) {
  const { profile } = useGetMyProfile();
  return (
    <Box>
      <Box mb={24}>
        <Title order={2} fw={700} c="#1e293b" fz={22}>My Profile</Title>
        <Text size="sm" c="dimmed" mt={4}>Your provider account details</Text>
      </Box>

      <Box p={28} style={{ backgroundColor: '#2d7d9a', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <Group gap={20} align="center">
          <Avatar src={profile?.avatarUrl ?? null} alt={profile?.fullName ?? 'Provider'} size={80} radius="xl" style={{ border: '3px solid rgba(255,255,255,0.4)' }}>
            {profile?.fullName?.charAt(0) ?? 'D'}
          </Avatar>
          <Stack gap={6}>
            <Text fw={700} fz={20} c="white">{profile?.fullName ?? '—'}</Text>
            <Group gap={8}>
              <Badge color="teal" variant="filled" size="sm" style={{ backgroundColor: '#0d9488' }}>Active Provider</Badge>
              <Badge color="gray" variant="outline" size="sm" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>
                {profile?.idLabel ?? '—'}
              </Badge>
            </Group>
          </Stack>
        </Group>
        <Button variant="outline" size="sm" style={{ borderColor: 'white', color: 'white', minWidth: 160 }} onClick={onUpdateProfile}>
          Update Profile
        </Button>
      </Box>
    </Box>
  );
}

// ─── Exported page ────────────────────────────────────────────────────────────

export function ProviderProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <EditForm onBack={() => setIsEditing(false)} />;
  }

  return <ViewMode onUpdateProfile={() => setIsEditing(true)} />;
}
