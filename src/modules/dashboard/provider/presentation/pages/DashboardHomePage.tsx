'use client';

/**
 * ProviderDashboardHomePage
 *
 * The landing page a provider sees when they log in.
 *
 * Sections backed by real data:
 *   ✅ Welcome greeting with provider name and specialty
 *   ✅ Stats row — today's appointments, pending requests, confirmed today
 *   ✅ Today's schedule — appointments booked for today
 *   ✅ Recent notifications
 *
 * Sections shown as "Coming Soon" (no backend support yet):
 *   🔜 Revenue Today — no billing model
 *   🔜 Active Treatment Plans — no treatment plan model
 *   🔜 Clinical Tools (Odontogram, X-Rays, SOAP Notes, Image Tools)
 */

import { useState, useEffect } from 'react';
import {
  Box, Text, Title, Group, Stack, Badge, Button,
  Avatar, Skeleton, Divider, Modal,
} from '@mantine/core';
import {
  Calendar, ChevronRight, Bell, CheckCircle,
  XCircle, X, Clock, Users,
  FileText, Scan, ClipboardList, ImageIcon, Rocket,
  LayoutDashboard,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { useGetMyProfile } from '@/modules/dashboard/infrastructure/useDashboard';
import { useNotifications, type NotificationType } from '@/modules/notifications/hooks/useNotifications';
import { GET_PROVIDER_APPOINTMENTS } from '@/modules/appointments/infrastructure/graphql/appointments.graphql';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Appointment {
  id: string;
  patientId: string;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  providerName: string;
  patientNotes?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatType(type: string): string {
  const labels: Record<string, string> = {
    ROUTINE_CLEANING: 'Routine Cleaning',
    FOLLOW_UP:        'Follow-up',
    SYMPTOM:          'Symptom Assessment',
    EMERGENCY:        'Emergency',
    CONSULTATION:     'Consultation',
  };
  return labels[type] ?? type.replace(/_/g, ' ');
}

/** Returns true if the appointment is scheduled for today */
function isToday(dateStr: string): boolean {
  const appt  = new Date(dateStr);
  const today = new Date();
  return (
    appt.getFullYear() === today.getFullYear() &&
    appt.getMonth()    === today.getMonth()    &&
    appt.getDate()     === today.getDate()
  );
}

/** Parses "10:30 AM" into a sortable number for ordering today's schedule */
function timeToMinutes(timeStr: string): number {
  const [time, meridiem] = timeStr.split(' ');
  const [hourStr, minuteStr] = (time ?? '').split(':');
  let hour = parseInt(hourStr ?? '0', 10);
  const minute = parseInt(minuteStr ?? '0', 10);
  if (meridiem?.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (meridiem?.toUpperCase() === 'AM' && hour === 12) hour = 0;
  return hour * 60 + minute;
}

/** Derives a short patient display name from patientNotes or patientId */
function getPatientName(appointment: Appointment): string {
  if (appointment.patientNotes) {
    const match = /^([A-Z][a-z]+ [A-Z][a-z]+)/.exec(appointment.patientNotes);
    if (match) return match[1];
  }
  return `Patient ${appointment.patientId.slice(0, 6).toUpperCase()}`;
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function avatarColor(id: string): string {
  const palette = ['#548CA1', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  return palette[id.charCodeAt(0) % palette.length] ?? '#548CA1';
}

function notificationMeta(type: NotificationType): { color: string; icon: React.ReactNode } {
  switch (type) {
    case 'APPOINTMENT_BOOKED':
      return { color: '#3B82F6', icon: <Calendar size={14} color="#3B82F6" /> };
    case 'APPOINTMENT_ACCEPTED':
      return { color: '#10b981', icon: <CheckCircle size={14} color="#10b981" /> };
    case 'APPOINTMENT_DECLINED':
      return { color: '#ef4444', icon: <XCircle size={14} color="#ef4444" /> };
    case 'APPOINTMENT_CANCELLED':
      return { color: '#f59e0b', icon: <X size={14} color="#f59e0b" /> };
    default:
      return { color: '#64748b', icon: <Bell size={14} color="#64748b" /> };
  }
}

function relativeTime(isoString: string): string {
  const diffMs  = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1)  return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

// ─── Coming Soon Modal ────────────────────────────────────────────────────────

/**
 * Shown when a provider clicks on a feature that isn't built yet.
 * Gives a clear, friendly message instead of a broken or empty state.
 */
function ComingSoonModal({
  opened,
  onClose,
  featureName,
}: {
  opened: boolean;
  onClose: () => void;
  featureName: string;
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="sm"
      title={null}
      withCloseButton={false}
      styles={{ body: { padding: '32px 28px' } }}
    >
      <Stack align="center" gap="md">
        {/* Rocket icon */}
        <Box
          style={{
            width:           64,
            height:          64,
            borderRadius:    '50%',
            backgroundColor: '#f0f9ff',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}
        >
          <Rocket size={28} color="#548CA1" />
        </Box>

        <Box ta="center">
          <Text fw={700} fz={18} c="#1e293b" mb={6}>{featureName}</Text>
          <Badge color="teal" variant="light" size="sm" mb={12}>Coming Soon</Badge>
          <Text size="sm" c="dimmed" lh={1.6}>
            This feature is currently in development and will be available in an upcoming release.
            We're working hard to bring you the best experience possible.
          </Text>
        </Box>

        <Button
          fullWidth
          style={{ backgroundColor: '#548CA1' }}
          onClick={onClose}
        >
          Got it
        </Button>
      </Stack>
    </Modal>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon, color, loading, comingSoon, onClick,
}: {
  label:      string;
  value:      string | number;
  icon:       React.ReactNode;
  color:      string;
  loading:    boolean;
  comingSoon?: boolean;
  onClick?:   () => void;
}) {
  return (
    <Box
      onClick={onClick}
      style={{
        flex:            1,
        minWidth:        0,
        backgroundColor: '#fff',
        border:          '1px solid #e2e8f0',
        borderRadius:    10,
        padding:         '16px',
        display:         'flex',
        alignItems:      'center',
        gap:             14,
        cursor:          onClick ? 'pointer' : 'default',
        position:        'relative',
        overflow:        'hidden',
      }}
    >
      {/* Coloured icon bubble */}
      <Box
        style={{
          width:           44,
          height:          44,
          borderRadius:    10,
          backgroundColor: `${color}18`,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          flexShrink:      0,
        }}
      >
        {icon}
      </Box>

      <Box style={{ flex: 1, minWidth: 0 }}>
        {loading ? (
          <Skeleton height={24} width={48} mb={4} />
        ) : (
          <Text fw={700} fz={22} c="#1e293b" lh={1}>{value}</Text>
        )}
        <Text size="xs" c="dimmed" mt={2}>{label}</Text>
      </Box>

      {/* Coming soon badge — overlaid in the top-right corner */}
      {comingSoon && (
        <Badge
          size="xs"
          color="teal"
          variant="light"
          style={{ position: 'absolute', top: 8, right: 8 }}
        >
          Soon
        </Badge>
      )}
    </Box>
  );
}

// ─── Schedule Row ─────────────────────────────────────────────────────────────

/**
 * A single appointment row in Today's Schedule.
 * Highlights the current/next appointment with a yellow left border.
 */
function ScheduleRow({
  appointment,
  isNext,
  onClick,
}: {
  appointment: Appointment;
  isNext:      boolean;
  onClick:     () => void;
}) {
  const patientName = getPatientName(appointment);
  const color       = avatarColor(appointment.patientId);

  return (
    <Box
      onClick={onClick}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             14,
        padding:         '12px 16px',
        backgroundColor: isNext ? '#fffbeb' : '#fff',
        borderLeft:      `4px solid ${isNext ? '#f59e0b' : '#e2e8f0'}`,
        borderBottom:    '1px solid #f1f5f9',
        cursor:          'pointer',
        transition:      'background-color 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isNext ? '#fef9c3' : '#f8fafc'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isNext ? '#fffbeb' : '#fff'; }}
    >
      {/* Time */}
      <Text
        fw={600}
        size="sm"
        c={isNext ? '#d97706' : '#548CA1'}
        style={{ minWidth: 72, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}
      >
        {appointment.appointmentTime}
      </Text>

      {/* Patient avatar */}
      <Avatar
        size={36}
        radius="xl"
        style={{ backgroundColor: color, color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}
      >
        {getInitials(patientName)}
      </Avatar>

      {/* Patient name + appointment type */}
      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
        <Text size="sm" fw={600} c="#1e293b" lineClamp={1}>{patientName}</Text>
        <Text size="xs" c="dimmed" lineClamp={1}>{formatType(appointment.type)}</Text>
      </Stack>

      {/* Status badge */}
      <Badge
        size="xs"
        variant="light"
        color={appointment.status === 'CONFIRMED' ? 'blue' : 'yellow'}
        style={{ flexShrink: 0 }}
      >
        {appointment.status === 'CONFIRMED' ? 'Confirmed' : 'Pending'}
      </Badge>

      <ChevronRight size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
    </Box>
  );
}

// ─── Clinical Tool Button ─────────────────────────────────────────────────────

function ClinicalToolButton({
  label,
  icon,
  onClick,
}: {
  label:   string;
  icon:    React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      style={{
        flex:            '1 1 calc(50% - 6px)',
        minWidth:        0,
        padding:         '16px 12px',
        backgroundColor: '#f8fafc',
        border:          '1px solid #e2e8f0',
        borderRadius:    10,
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        gap:             8,
        cursor:          'pointer',
        transition:      'background-color 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f9ff'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
    >
      {icon}
      <Text size="xs" fw={500} c="#374151" ta="center">{label}</Text>
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ProviderDashboardHomePage() {
  const router = useRouter();

  const [tokenReady,       setTokenReady]       = useState(false);
  const [comingSoonModal,  setComingSoonModal]   = useState(false);
  const [comingSoonFeature,setComingSoonFeature] = useState('');

  // Wait for the access token before firing queries
  useEffect(() => {
    if (localStorage.getItem('accessToken')) { setTokenReady(true); return; }
    const interval = setInterval(() => {
      if (localStorage.getItem('accessToken')) { setTokenReady(true); clearInterval(interval); }
    }, 100);
    const timeout = setTimeout(() => { clearInterval(interval); setTokenReady(true); }, 3000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  const { profile, loading: profileLoading } = useGetMyProfile();

  const { data: apptData, loading: apptLoading } = useQuery<{ myProviderAppointments: Appointment[] }>(
    GET_PROVIDER_APPOINTMENTS,
    { fetchPolicy: 'cache-and-network', skip: !tokenReady }
  );

  const { notifications, unreadCount, markRead } = useNotifications();

  const appointments = apptData?.myProviderAppointments ?? [];

  // Derive stats from the appointments list
  const todayAppointments = appointments
    .filter((a) => isToday(a.appointmentDate) && (a.status === 'CONFIRMED' || a.status === 'PENDING'))
    .sort((a, b) => timeToMinutes(a.appointmentTime) - timeToMinutes(b.appointmentTime));

  const pendingCount   = appointments.filter((a) => a.status === 'PENDING').length;

  /**
   * Determine which appointment in today's schedule is "next" —
   * the first one whose time hasn't passed yet.
   */
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const nextApptId = todayAppointments.find(
    (a) => timeToMinutes(a.appointmentTime) >= nowMinutes
  )?.id;

  const isLoading = apptLoading && appointments.length === 0;

  // Provider's first name for the greeting
  const firstName = profile?.fullName?.split(' ')[0] ?? '';
  const displayName = profile?.fullName
    ? (profile.specialty ? `Dr. ${firstName}` : firstName)
    : '';

  /** Opens the coming soon modal for a named feature */
  function openComingSoon(featureName: string) {
    setComingSoonFeature(featureName);
    setComingSoonModal(true);
  }

  return (
    <Box>
      {/* ── Page heading ── */}
      <Box mb={24}>
        {profileLoading && !profile ? (
          <Skeleton height={28} width={260} mb={6} />
        ) : (
          <Title order={2} fw={700} c="#1e293b" fz={22}>
            Provider Dashboard
          </Title>
        )}
        <Text size="sm" c="dimmed" mt={4}>
          Welcome back{displayName ? `, ${displayName}` : ''}. Here's your practice overview for today.
        </Text>
      </Box>

      {/* ── Stats row ── */}
      <Group gap={12} mb={24} wrap="nowrap" style={{ overflowX: 'auto' }}>
        <StatCard
          label="Today's Patients"
          value={isLoading ? '—' : todayAppointments.length}
          icon={<Users size={20} color="#3B82F6" />}
          color="#3B82F6"
          loading={isLoading}
        />
        <StatCard
          label="Pending Requests"
          value={isLoading ? '—' : pendingCount}
          icon={<Clock size={20} color="#f59e0b" />}
          color="#f59e0b"
          loading={isLoading}
          onClick={() => router.push('/provider/appointments')}
        />
        {/* Revenue Today — commented out until billing feature is implemented
        <StatCard
          label="Revenue Today"
          value="—"
          icon={<DollarSign size={20} color="#10b981" />}
          color="#10b981"
          loading={false}
          comingSoon
          onClick={() => openComingSoon('Revenue Tracking')}
        />
        */}
        {/* CEU Tracker — commented out until CEU feature is implemented
        <StatCard
          label="CEU Tracker"
          value="—"
          icon={<ClipboardList size={20} color="#8b5cf6" />}
          color="#8b5cf6"
          loading={false}
          comingSoon
          onClick={() => openComingSoon('CEU Tracker')}
        />
        */}
      </Group>

      {/* ── Two-column layout ── */}
      <Box style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* ── Left / main column ── */}
        <Box style={{ flex: 1, minWidth: 0 }}>

          {/* Today's Schedule */}
          <Box
            style={{
              backgroundColor: '#fff',
              border:          '1px solid #e2e8f0',
              borderRadius:    12,
              overflow:        'hidden',
            }}
          >
            {/* Header */}
            <Box px="lg" pt="lg" pb="md" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <Group justify="space-between" align="center">
                <Box>
                  <Text fw={700} size="md" c="#1e293b">Today's Schedule</Text>
                  {!isLoading && (
                    <Text size="xs" c="dimmed" mt={2}>
                      {todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''} scheduled
                    </Text>
                  )}
                </Box>
                <Button
                  variant="subtle"
                  size="xs"
                  color="teal"
                  rightSection={<ChevronRight size={12} />}
                  onClick={() => router.push('/provider/appointments')}
                >
                  View all
                </Button>
              </Group>
            </Box>

            {/* Schedule rows */}
            {isLoading ? (
              <Box p="lg">
                <Stack gap={12}>
                  {[1, 2, 3].map((i) => (
                    <Group key={i} gap={12}>
                      <Skeleton height={14} width={60} />
                      <Skeleton height={36} width={36} radius="xl" />
                      <Box style={{ flex: 1 }}>
                        <Skeleton height={14} width="55%" mb={6} />
                        <Skeleton height={12} width="35%" />
                      </Box>
                    </Group>
                  ))}
                </Stack>
              </Box>
            ) : todayAppointments.length === 0 ? (
              <Box py={40} ta="center">
                <Calendar size={36} color="#cbd5e1" style={{ margin: '0 auto 12px', display: 'block' }} />
                <Text size="sm" c="dimmed" fw={500}>No appointments scheduled for today</Text>
                <Text size="xs" c="dimmed" mt={4}>
                  New patient bookings will appear here automatically.
                </Text>
              </Box>
            ) : (
              <>
                {todayAppointments.map((a) => (
                  <ScheduleRow
                    key={a.id}
                    appointment={a}
                    isNext={a.id === nextApptId}
                    onClick={() => router.push('/provider/appointments')}
                  />
                ))}
              </>
            )}

            {/* Footer link */}
            {todayAppointments.length > 0 && (
              <Box
                px="lg"
                py={12}
                style={{ borderTop: '1px solid #f1f5f9', textAlign: 'center' }}
              >
                <Button
                  variant="subtle"
                  size="xs"
                  color="gray"
                  fullWidth
                  onClick={() => router.push('/provider/appointments')}
                >
                  View all schedules
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Right sidebar ── */}
        <Box style={{ width: 280, flexShrink: 0 }} visibleFrom="md">

          {/* Recent Notifications — first in sidebar */}
          <Box
            p="lg"
            mb={16}
            style={{
              backgroundColor: '#fff',
              border:          '1px solid #e2e8f0',
              borderRadius:    12,
            }}
          >
            <Group justify="space-between" align="center" mb={12}>
              <Text fw={600} size="sm" c="#1e293b">Recent Notifications</Text>
              {unreadCount > 0 && (
                <Badge size="xs" color="red" variant="filled">{unreadCount} new</Badge>
              )}
            </Group>

            {notifications.length === 0 ? (
              <Box py="md" ta="center">
                <Bell size={24} color="#cbd5e1" style={{ margin: '0 auto 8px', display: 'block' }} />
                <Text size="xs" c="dimmed">No notifications yet</Text>
              </Box>
            ) : (
              <Stack gap={0}>
                {notifications.slice(0, 4).map((n, i) => {
                  const { color, icon } = notificationMeta(n.type);
                  return (
                    <Box key={n.id}>
                      <Box
                        py={10}
                        style={{
                          display:     'flex',
                          gap:         10,
                          alignItems:  'flex-start',
                          cursor:      n.isRead ? 'default' : 'pointer',
                          borderLeft:  `3px solid ${n.isRead ? 'transparent' : color}`,
                          paddingLeft: n.isRead ? 0 : 8,
                        }}
                        onClick={() => { if (!n.isRead) void markRead(n.id); }}
                      >
                        <Box style={{ flexShrink: 0, marginTop: 2 }}>{icon}</Box>
                        <Box style={{ flex: 1, minWidth: 0 }}>
                          <Text size="xs" fw={n.isRead ? 500 : 700} c="#1e293b" lineClamp={1}>
                            {n.title}
                          </Text>
                          <Text size="xs" c="dimmed" lineClamp={2} mt={2}>{n.message}</Text>
                          <Text size="xs" c="dimmed" mt={2}>{relativeTime(n.createdAt)}</Text>
                        </Box>
                      </Box>
                      {i < Math.min(notifications.length, 4) - 1 && <Divider />}
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>

          {/* Active Treatment Plans — coming soon */}
          <Box
            p="lg"
            mb={16}
            style={{
              backgroundColor: '#fff',
              border:          '1px solid #e2e8f0',
              borderRadius:    12,
            }}
          >
            <Group justify="space-between" align="center" mb={12}>
              <Text fw={600} size="sm" c="#1e293b">Active Treatment Plans</Text>
              <Badge size="xs" color="teal" variant="light">Coming Soon</Badge>
            </Group>

            {[
              { name: 'Treatment Plans', sub: 'Patient treatment tracking' },
              { name: 'Progress Notes',  sub: 'Clinical documentation' },
            ].map(({ name, sub }) => (
              <Box
                key={name}
                onClick={() => openComingSoon('Active Treatment Plans')}
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  gap:             10,
                  padding:         '10px 0',
                  borderBottom:    '1px solid #f1f5f9',
                  cursor:          'pointer',
                  opacity:         0.6,
                }}
              >
                <Box
                  style={{
                    width:           32,
                    height:          32,
                    borderRadius:    6,
                    backgroundColor: '#f1f5f9',
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    flexShrink:      0,
                  }}
                >
                  <FileText size={14} color="#94a3b8" />
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text size="xs" fw={600} c="#64748b" lineClamp={1}>{name}</Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>{sub}</Text>
                </Box>
              </Box>
            ))}

            <Button
              fullWidth
              variant="outline"
              size="xs"
              mt={12}
              color="gray"
              onClick={() => openComingSoon('Active Treatment Plans')}
            >
              Manage All Plans
            </Button>
          </Box>

          {/* Clinical Tools — coming soon */}
          <Box
            p="lg"
            mb={16}
            style={{
              backgroundColor: '#fff',
              border:          '1px solid #e2e8f0',
              borderRadius:    12,
            }}
          >
            <Group justify="space-between" align="center" mb={12}>
              <Text fw={600} size="sm" c="#1e293b">Clinical Tools</Text>
              <Badge size="xs" color="teal" variant="light">Coming Soon</Badge>
            </Group>

            <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {[
                { label: 'Odontogram',  icon: <LayoutDashboard size={20} color="#548CA1" /> },
                { label: 'X-Rays',      icon: <Scan size={20} color="#548CA1" /> },
                { label: 'SOAP Notes',  icon: <ClipboardList size={20} color="#548CA1" /> },
                { label: 'Image Tools', icon: <ImageIcon size={20} color="#548CA1" /> },
              ].map(({ label, icon }) => (
                <ClinicalToolButton
                  key={label}
                  label={label}
                  icon={icon}
                  onClick={() => openComingSoon(label)}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Coming Soon Modal ── */}
      <ComingSoonModal
        opened={comingSoonModal}
        onClose={() => setComingSoonModal(false)}
        featureName={comingSoonFeature}
      />
    </Box>
  );
}
