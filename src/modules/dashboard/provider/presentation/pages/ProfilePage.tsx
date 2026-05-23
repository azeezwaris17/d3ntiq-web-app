'use client';

/**
 * ProviderProfilePage
 *
 * Tabs:
 *   Profile    — view and edit name, email, phone, specialty, practice name, address
 *   Availability — set working days and hours so patients know when to book
 *   Security   — change password
 *
 * View mode shows all public-facing details with a skeleton while loading.
 * Edit mode is a form pre-filled from the current profile.
 */

import React, { useRef, useState } from 'react';
import {
  Box, Title, Text, Tabs, Stack, TextInput, Select, Button,
  Avatar, Group, Notification, Badge, Skeleton, Checkbox, Divider,
} from '@mantine/core';
import { CheckCircle, XCircle, Camera, ArrowLeft, User, Clock, Lock, MapPin, Phone, Stethoscope, Building } from 'lucide-react';
import { useGetMyProfile, useUpdateProviderProfile, useUpdateProviderAvailability } from '@/modules/dashboard/infrastructure/useDashboard';
import { ChangePasswordForm } from '@/modules/dashboard/shared/components/ChangePasswordForm';

// ─── Constants ────────────────────────────────────────────────────────────────

const SPECIALTIES = [
  'General Dentistry', 'Orthodontics', 'Periodontics',
  'Endodontics', 'Pediatric Dentistry', 'Oral Surgery',
  'Prosthodontics', 'Cosmetic Dentistry',
];

/**
 * The days of the week shown in the availability grid.
 * Each day can be toggled on/off and given a start/end time.
 */
const WEEK_DAYS = [
  { key: 'monday',    label: 'Monday' },
  { key: 'tuesday',  label: 'Tuesday' },
  { key: 'wednesday',label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday',   label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday',   label: 'Sunday' },
];

/** Default working hours shown when a day is first enabled */
const DEFAULT_START = '09:00';
const DEFAULT_END   = '17:00';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DaySchedule {
  enabled:   boolean;
  startTime: string;
  endTime:   string;
}

type WeekSchedule = Record<string, DaySchedule>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a default schedule with Mon–Fri enabled, weekends off */
function defaultSchedule(): WeekSchedule {
  return Object.fromEntries(
    WEEK_DAYS.map(({ key }) => [
      key,
      {
        enabled:   key !== 'saturday' && key !== 'sunday',
        startTime: DEFAULT_START,
        endTime:   DEFAULT_END,
      },
    ])
  );
}

/** Small info row used in the view mode detail card */
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <Group gap={10} align="flex-start">
      <Box style={{ color: '#548CA1', flexShrink: 0, marginTop: 2 }}>{icon}</Box>
      <Box>
        <Text size="xs" c="dimmed">{label}</Text>
        <Text size="sm" c="#1e293b" fw={500}>{value}</Text>
      </Box>
    </Group>
  );
}

// ─── Skeleton loading state ───────────────────────────────────────────────────

/**
 * Shown while the profile query is in flight.
 * Prevents a blank flash before data arrives.
 */
function ProfileSkeleton() {
  return (
    <Box>
      {/* Hero banner skeleton */}
      <Skeleton height={140} radius={12} mb={24} />
      {/* Detail card skeleton */}
      <Box p={24} style={{ border: '1px solid #e2e8f0', borderRadius: 12 }}>
        <Skeleton height={14} width="30%" mb={16} />
        <Stack gap={12}>
          <Skeleton height={14} width="60%" />
          <Skeleton height={14} width="50%" />
          <Skeleton height={14} width="45%" />
          <Skeleton height={14} width="55%" />
        </Stack>
      </Box>
    </Box>
  );
}

// ─── View mode ────────────────────────────────────────────────────────────────

interface ViewModeProps {
  onEdit: () => void;
}

function ViewMode({ onEdit }: ViewModeProps) {
  const { profile, loading } = useGetMyProfile();

  // Show skeleton while the first load is in progress
  if (loading && !profile) return <ProfileSkeleton />;

  return (
    <Box>
      {/* Hero banner */}
      <Box
        p={28}
        mb={24}
        style={{
          backgroundColor: '#2d7d9a',
          borderRadius:    12,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          gap:             24,
          flexWrap:        'wrap',
        }}
      >
        <Group gap={20} align="center">
          <Avatar
            src={profile?.avatarUrl ?? null}
            alt={profile?.fullName ?? 'Provider'}
            size={80}
            radius="xl"
            style={{ border: '3px solid rgba(255,255,255,0.4)' }}
          >
            {profile?.fullName?.charAt(0) ?? 'D'}
          </Avatar>
          <Stack gap={6}>
            <Text fw={700} fz={20} c="white">{profile?.fullName ?? '—'}</Text>
            <Group gap={8}>
              <Badge
                color="teal"
                variant="filled"
                size="sm"
                style={{ backgroundColor: '#0d9488' }}
              >
                Active Provider
              </Badge>
              <Badge
                color="gray"
                variant="outline"
                size="sm"
                style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
              >
                {profile?.idLabel ?? '—'}
              </Badge>
            </Group>
            {profile?.specialty && (
              <Text size="sm" c="rgba(255,255,255,0.85)">{profile.specialty}</Text>
            )}
          </Stack>
        </Group>
        <Button
          variant="outline"
          size="sm"
          style={{ borderColor: 'white', color: 'white', minWidth: 140 }}
          onClick={onEdit}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Practice details card */}
      <Box p={24} style={{ border: '1px solid #e2e8f0', borderRadius: 12, backgroundColor: '#fff' }}>
        <Text fw={600} size="sm" c="#1e293b" mb={16}>Practice Information</Text>
        <Stack gap={14}>
          <InfoRow icon={<Building size={15} />}    label="Practice Name" value={profile?.practiceName} />
          <InfoRow icon={<Stethoscope size={15} />} label="Specialty"     value={profile?.specialty} />
          <InfoRow icon={<MapPin size={15} />}      label="Address"       value={profile?.address} />
          <InfoRow icon={<Phone size={15} />}       label="Phone"         value={profile?.phone} />
          <InfoRow icon={<User size={15} />}        label="Email"         value={profile?.email} />
        </Stack>

        {/* Prompt to fill in missing info */}
        {!profile?.practiceName && !profile?.address && (
          <Box mt={16} p={12} bg="#f8fafc" style={{ borderRadius: 8, border: '1px dashed #cbd5e1' }}>
            <Text size="xs" c="dimmed" ta="center">
              Your practice details are incomplete. Patients see this information when searching for providers.{' '}
              <Text
                component="span"
                size="xs"
                c="#2d7d9a"
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={onEdit}
              >
                Update your profile
              </Text>
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─── Availability tab ─────────────────────────────────────────────────────────

/**
 * AvailabilityTab
 *
 * Lets the provider set which days they work and their hours for each day.
 * The schedule is saved to the database via the updateProviderProfile mutation
 * so it persists across devices and is used to compute the Open Now / Closed
 * badge on the provider search card.
 */
function AvailabilityTab() {
  const { profile }                          = useGetMyProfile();
  const { saveAvailability, loading: saving } = useUpdateProviderAvailability();

  /**
   * Initialise from the database value if available, otherwise use the
   * default Mon–Fri 09:00–17:00 schedule.
   */
  const [schedule, setSchedule] = useState<WeekSchedule>(() => {
    if (profile?.workingHours) {
      return profile.workingHours as WeekSchedule;
    }
    return defaultSchedule();
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError,   setSaveError]   = useState('');

  // When the profile loads for the first time, sync the schedule from the DB
  React.useEffect(() => {
    if (profile?.workingHours) {
      setSchedule(profile.workingHours as WeekSchedule);
    }
  }, [profile?.workingHours]);

  function toggleDay(dayKey: string) {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey]!, enabled: !prev[dayKey]!.enabled },
    }));
  }

  function updateTime(dayKey: string, field: 'startTime' | 'endTime', value: string) {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey]!, [field]: value },
    }));
  }

  async function handleSave() {
    setSaveError('');
    try {
      await saveAvailability(schedule);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save availability.');
    }
  }

  return (
    <Box maw={560}>
      <Box mb={20}>
        <Text fw={600} size="sm" c="#1e293b">Working Hours</Text>
        <Text size="xs" c="dimmed" mt={4}>
          Set the days and hours you are available for appointments.
          Patients will see an Open Now / Closed badge based on these hours.
        </Text>
      </Box>

      {saveSuccess && (
        <Notification
          icon={<CheckCircle size={18} />}
          color="teal"
          title="Availability saved!"
          mb="md"
          withCloseButton={false}
        >
          Your working hours have been updated and are now visible to patients.
        </Notification>
      )}

      {saveError && (
        <Notification
          icon={<XCircle size={18} />}
          color="red"
          title="Save failed"
          mb="md"
          onClose={() => setSaveError('')}
        >
          {saveError}
        </Notification>
      )}

      <Stack gap={0}>
        {WEEK_DAYS.map(({ key, label }, index) => {
          const day = schedule[key]!;
          return (
            <Box key={key}>
              <Group justify="space-between" align="center" py={14} px={4} wrap="nowrap">
                <Checkbox
                  label={
                    <Text size="sm" fw={day.enabled ? 600 : 400} c={day.enabled ? '#1e293b' : '#94a3b8'}>
                      {label}
                    </Text>
                  }
                  checked={day.enabled}
                  onChange={() => toggleDay(key)}
                  color="#2d7d9a"
                  style={{ minWidth: 120 }}
                />
                {day.enabled ? (
                  <Group gap={8} align="center" wrap="nowrap">
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => updateTime(key, 'startTime', e.target.value)}
                      style={{
                        padding: '6px 10px', borderRadius: 6,
                        border: '1px solid #e2e8f0', fontSize: 13,
                        color: '#1e293b', backgroundColor: '#f8fafc', outline: 'none',
                      }}
                    />
                    <Text size="xs" c="dimmed">to</Text>
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => updateTime(key, 'endTime', e.target.value)}
                      style={{
                        padding: '6px 10px', borderRadius: 6,
                        border: '1px solid #e2e8f0', fontSize: 13,
                        color: '#1e293b', backgroundColor: '#f8fafc', outline: 'none',
                      }}
                    />
                  </Group>
                ) : (
                  <Text size="xs" c="dimmed">Unavailable</Text>
                )}
              </Group>
              {index < WEEK_DAYS.length - 1 && <Divider />}
            </Box>
          );
        })}
      </Stack>

      <Box mt={24}>
        <Button
          size="md"
          loading={saving}
          loaderProps={{ type: 'oval' }}
          onClick={() => void handleSave()}
          style={{ backgroundColor: '#2d7d9a', minWidth: 160 }}
        >
          {saving ? 'Saving...' : 'Save Availability'}
        </Button>
      </Box>
    </Box>
  );
}

// ─── Edit form ────────────────────────────────────────────────────────────────

function EditForm({ onBack }: { onBack: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile }  = useGetMyProfile();
  const { updateProviderProfile, loading } = useUpdateProviderProfile();

  const [firstName,    setFirstName]    = useState('');
  const [lastName,     setLastName]     = useState('');
  const [email,        setEmail]        = useState('');
  const [phone,        setPhone]        = useState('');
  const [specialty,    setSpecialty]    = useState<string | null>(null);
  const [practiceName, setPracticeName] = useState('');
  const [address,      setAddress]      = useState('');
  const [avatarPreview,setAvatarPreview]= useState<string | null>(null);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState(false);

  // Pre-fill the form once the profile query resolves
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
    if (!email.trim())     return setError('Email address is required.');
    try {
      await updateProviderProfile({
        firstName:    firstName.trim(),
        lastName:     lastName.trim(),
        email:        email.trim(),
        phone:        phone.trim() || undefined,
        specialty:    specialty ?? undefined,
        practiceName: practiceName.trim() || undefined,
        address:      address.trim() || undefined,
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
          <Title order={2} fw={700} c="#1e293b" fz={22}>Account Settings</Title>
          <Text size="sm" c="dimmed" mt={2}>Manage your profile, availability, and security</Text>
        </Box>
      </Group>

      <Tabs defaultValue="profile" variant="underline">
        <Tabs.List mb={24}>
          <Tabs.Tab value="profile"      leftSection={<User size={14} strokeWidth={1.8} />}>Profile</Tabs.Tab>
          <Tabs.Tab value="availability" leftSection={<Clock size={14} strokeWidth={1.8} />}>Availability</Tabs.Tab>
          <Tabs.Tab value="security"     leftSection={<Lock size={14} strokeWidth={1.8} />}>Security</Tabs.Tab>
        </Tabs.List>

        {/* ── Profile tab ── */}
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

            {/* Avatar */}
            <Group gap={16} mb={24} align="center">
              <Avatar
                src={avatarPreview}
                alt="Profile picture"
                size={72}
                radius="xl"
                color="teal"
                style={{ cursor: 'pointer', border: '2px solid #e2e8f0' }}
                onClick={() => fileInputRef.current?.click()}
              >
                {firstName.charAt(0).toUpperCase() || 'D'}
              </Avatar>
              <Button
                variant="subtle"
                size="xs"
                leftSection={<Camera size={14} strokeWidth={1.8} />}
                c="#2d7d9a"
                onClick={() => fileInputRef.current?.click()}
              >
                Update Picture
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
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
        </Tabs.Panel>

        {/* ── Availability tab ── */}
        <Tabs.Panel value="availability">
          <AvailabilityTab />
        </Tabs.Panel>

        {/* ── Security tab ── */}
        <Tabs.Panel value="security">
          <ChangePasswordForm />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProviderProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing
    ? <EditForm onBack={() => setIsEditing(false)} />
    : <ViewMode onEdit={() => setIsEditing(true)} />;
}
