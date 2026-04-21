'use client';

/**
 * ProviderAppointmentsPage
 *
 * Displays all appointments assigned to the authenticated provider.
 *
 * Layout (matches design screenshots):
 * - Header: "All Appointments" title + subtitle
 * - Filter tabs: All | Today | This week | This month | Go to date
 * - Appointment count
 * - Appointment list rows with time, patient avatar, name, type, action icons
 * - Clicking a row shows a detail panel on the right
 * - Pagination at the bottom
 */

import { useState, useMemo, useEffect } from 'react';
import {
  Box, Text, Title, Group, Stack, Avatar,
  ActionIcon, Loader, Pagination, UnstyledButton, Divider,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Stethoscope, FileText, Calendar } from 'lucide-react';
import { useMantineTheme } from '@mantine/core';
import { useQuery } from '@apollo/client/react';
import { themeColors } from '@/shared/theme';
import { GET_PROVIDER_APPOINTMENTS } from '@/modules/appointments/infrastructure/graphql/appointments.graphql';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Appointment {
  id: string;
  patientId: string;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  status: string;
  providerName: string;
  providerSpecialty: string;
  providerAddress?: string;
  providerPhone?: string;
  oralIQData?: {
    formData?: {
      symptomTypes?: string[];
    };
    result?: {
      matchedConditions?: Array<{ name: string }>;
    };
  };
  patientNotes?: string;
  createdAt: string;
}

type FilterTab = 'all' | 'today' | 'week' | 'month';

const PAGE_SIZE = 8;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts appointment type enum to a human-readable label.
 * e.g. "ROUTINE_CLEANING" → "Routine Cleaning & Checkup"
 */
function formatAppointmentType(type: string): string {
  const labels: Record<string, string> = {
    ROUTINE_CLEANING: 'Routine Cleaning & Checkup',
    FOLLOW_UP: 'Follow-up Consultation',
    SYMPTOM: 'Symptom Assessment',
    EMERGENCY: 'Emergency Visit',
    CONSULTATION: 'Consultation',
  };
  return labels[type] ?? type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Returns the left-border color for an appointment row based on time.
 * Morning (before noon) → teal, Afternoon → yellow/amber, Evening → blue.
 */
function getTimeAccentColor(time: string): string {
  const hour = parseInt(time.split(':')[0] ?? '9', 10);
  const isPM = time.toLowerCase().includes('pm');
  const hour24 = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;

  if (hour24 < 12) return '#548CA1'; // morning — teal
  if (hour24 < 17) return '#F59E0B'; // afternoon — amber
  return '#6366f1'; // evening — indigo
}

/**
 * Returns the text color for the time label.
 */
function getTimeTextColor(time: string): string {
  const hour = parseInt(time.split(':')[0] ?? '9', 10);
  const isPM = time.toLowerCase().includes('pm');
  const hour24 = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;

  if (hour24 < 12) return '#548CA1';
  if (hour24 < 17) return '#D97706';
  return '#6366f1';
}

/**
 * Returns the background color for an appointment row.
 * Afternoon appointments get a subtle yellow tint (matches screenshot).
 */
function getRowBackground(time: string): string {
  const hour = parseInt(time.split(':')[0] ?? '9', 10);
  const isPM = time.toLowerCase().includes('pm');
  const hour24 = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;

  if (hour24 >= 12 && hour24 < 17) return '#FFFBEB'; // amber tint for afternoon
  return '#ffffff';
}

/**
 * Generates a deterministic avatar color from a patient name.
 */
function getAvatarColor(name: string): string {
  const colors = ['#548CA1', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index] ?? '#548CA1';
}

/**
 * Extracts initials from a full name.
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Derives a display name for the patient from available data.
 * Since we only store patientId (not name), we use a placeholder
 * until a patient profile lookup is implemented.
 */
function getPatientDisplayName(appointment: Appointment): string {
  // Use patientNotes as a hint if it contains a name, otherwise use a placeholder
  if (appointment.patientNotes) {
    const match = /^([A-Z][a-z]+ [A-Z][a-z]+)/.exec(appointment.patientNotes);
    if (match) return match[1];
  }
  // Fallback: derive from patientId (first 8 chars as identifier)
  return `Patient ${appointment.patientId.slice(0, 6).toUpperCase()}`;
}

// ─── Appointment Row ──────────────────────────────────────────────────────────

interface AppointmentRowProps {
  appointment: Appointment;
  isSelected: boolean;
  onSelect: (appointment: Appointment) => void;
}

function AppointmentRow({ appointment, isSelected, onSelect }: AppointmentRowProps) {
  const patientName = getPatientDisplayName(appointment);
  const accentColor = getTimeAccentColor(appointment.appointmentTime);
  const timeColor = getTimeTextColor(appointment.appointmentTime);
  const rowBg = getRowBackground(appointment.appointmentTime);
  const avatarColor = getAvatarColor(patientName);

  return (
    <UnstyledButton
      onClick={() => onSelect(appointment)}
      style={{ width: '100%' }}
    >
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '14px 20px',
          backgroundColor: isSelected ? '#EFF6FF' : rowBg,
          borderLeft: `4px solid ${isSelected ? '#3B82F6' : accentColor}`,
          borderBottom: '1px solid #f1f5f9',
          transition: 'background-color 0.15s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = rowBg;
        }}
      >
        {/* Time */}
        <Text
          fw={600}
          size="sm"
          style={{
            color: isSelected ? '#3B82F6' : timeColor,
            minWidth: 80,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {appointment.appointmentTime}
        </Text>

        {/* Patient avatar */}
        <Avatar
          size={40}
          radius="xl"
          style={{
            backgroundColor: avatarColor,
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            marginRight: 14,
            flexShrink: 0,
          }}
        >
          {getInitials(patientName)}
        </Avatar>

        {/* Patient name + appointment type */}
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Text fw={600} size="sm" c="#1e293b" lineClamp={1}>
            {patientName}
          </Text>
          <Text size="xs" c="#64748b" lineClamp={1}>
            {formatAppointmentType(appointment.type)}
          </Text>
        </Stack>

        {/* Action icons */}
        <Group gap={8} style={{ flexShrink: 0 }}>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            title="View dental chart"
            onClick={(e) => e.stopPropagation()}
          >
            <Stethoscope size={16} color="#548CA1" />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            title="View notes"
            onClick={(e) => e.stopPropagation()}
          >
            <FileText size={16} color="#548CA1" />
          </ActionIcon>
        </Group>
      </Box>
    </UnstyledButton>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
  appointment: Appointment;
}

function DetailPanel({ appointment }: DetailPanelProps) {
  const patientName = getPatientDisplayName(appointment);
  const appointmentDate = new Date(appointment.appointmentDate);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const category = appointment.oralIQData?.result?.matchedConditions?.[0]?.name ?? 'General';

  return (
    <Box
      p="lg"
      style={{
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        minWidth: 240,
      }}
    >
      <Stack gap="md">
        <DetailRow label="Patient Name:" value={patientName} />
        <DetailRow
          label="Time & Date:"
          value={`${appointment.appointmentTime}, ${formattedDate}`}
        />
        <DetailRow
          label="Appointment Purpose:"
          value={formatAppointmentType(appointment.type)}
        />
        <DetailRow label="Category:" value={category} />
      </Stack>
    </Box>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Group gap="sm" align="flex-start">
      <Text size="sm" fw={600} c="#374151" style={{ minWidth: 140 }}>
        {label}
      </Text>
      <Text size="sm" c="#1e293b">
        {value}
      </Text>
    </Group>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

interface FilterTabsProps {
  active: FilterTab;
  onChange: (tab: FilterTab) => void;
}

function FilterTabs({ active, onChange }: FilterTabsProps) {
  const tabs: Array<{ key: FilterTab; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This week' },
    { key: 'month', label: 'This month' },
  ];

  return (
    <Group gap={0} style={{ borderBottom: '1px solid #e2e8f0' }}>
      {tabs.map((tab) => (
        <UnstyledButton
          key={tab.key}
          onClick={() => onChange(tab.key)}
          px="md"
          py="sm"
          style={{
            fontSize: 14,
            fontWeight: active === tab.key ? 600 : 400,
            color: active === tab.key ? '#548CA1' : '#64748b',
            borderBottom: active === tab.key ? '2px solid #548CA1' : '2px solid transparent',
            marginBottom: -1,
            transition: 'all 0.15s ease',
          }}
        >
          {tab.label}
        </UnstyledButton>
      ))}

      {/* Go to date — right aligned */}
      <Box style={{ flex: 1 }} />
      <UnstyledButton
        px="md"
        py="sm"
        style={{ fontSize: 14, color: '#548CA1', fontWeight: 500 }}
      >
        <Group gap={6}>
          <Calendar size={14} />
          <Text size="sm" c="#548CA1" fw={500}>Go to date</Text>
        </Group>
      </UnstyledButton>
    </Group>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ProviderAppointmentsPage() {
  const theme = useMantineTheme();
  const colors = themeColors(theme);
  const isMobile = useMediaQuery('(max-width: 768px)') ?? false;

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [page, setPage] = useState(1);
  const [tokenReady, setTokenReady] = useState(false);

  // Wait for auth token before firing query
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setTokenReady(true);
      return;
    }
    const interval = setInterval(() => {
      if (localStorage.getItem('accessToken')) {
        setTokenReady(true);
        clearInterval(interval);
      }
    }, 100);
    const timeout = setTimeout(() => { clearInterval(interval); setTokenReady(true); }, 3000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  const { data, loading } = useQuery<{ myProviderAppointments: Appointment[] }>(
    GET_PROVIDER_APPOINTMENTS,
    {
      skip: !tokenReady,
      fetchPolicy: 'cache-and-network',
    }
  );

  const allAppointments = data?.myProviderAppointments ?? [];

  // Filter appointments based on active tab
  const filteredAppointments = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);

    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart.getTime() + 7 * 86400000);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    switch (activeFilter) {
      case 'today':
        return allAppointments.filter((a) => {
          const d = new Date(a.appointmentDate);
          return d >= todayStart && d < todayEnd;
        });
      case 'week':
        return allAppointments.filter((a) => {
          const d = new Date(a.appointmentDate);
          return d >= weekStart && d < weekEnd;
        });
      case 'month':
        return allAppointments.filter((a) => {
          const d = new Date(a.appointmentDate);
          return d >= monthStart && d <= monthEnd;
        });
      default:
        return allAppointments;
    }
  }, [allAppointments, activeFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / PAGE_SIZE));
  const pagedAppointments = filteredAppointments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Reset page when filter changes
  const handleFilterChange = (tab: FilterTab) => {
    setActiveFilter(tab);
    setPage(1);
    setSelectedAppointment(null);
  };

  // Tab label for the schedule heading
  const scheduleLabel =
    activeFilter === 'today'
      ? "Today's Schedule"
      : activeFilter === 'week'
      ? "This Week's Schedule"
      : activeFilter === 'month'
      ? "This Month's Schedule"
      : 'All Appointments';

  if (loading && allAppointments.length === 0) {
    return (
      <Box ta="center" py="xl">
        <Loader size="lg" color={colors.primary[5]} />
        <Text size="sm" c="dimmed" mt="md">Loading appointments...</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Page Header ── */}
      <Stack gap={4} mb="xl">
        <Title order={2} fw={700} c="#1e293b" fz={24}>
          All Appointments
        </Title>
        <Text size="sm" c="#64748b">
          A list of scheduled dentist visits appointed to you
        </Text>
      </Stack>

      {/* ── Main Content Card ── */}
      <Box
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          backgroundColor: '#fff',
          overflow: 'hidden',
        }}
      >
        {/* Filter tabs */}
        <Box px="lg" pt="lg">
          <FilterTabs active={activeFilter} onChange={handleFilterChange} />
        </Box>

        {/* Schedule heading + count */}
        <Box px="lg" py="md">
          <Text fw={600} size="md" c="#1e293b">
            {scheduleLabel}
          </Text>
          <Text size="xs" c="#64748b" mt={2}>
            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} scheduled
          </Text>
        </Box>

        {/* ── Appointment list + detail panel ── */}
        <Box style={{ display: 'flex', gap: 0 }}>
          {/* Appointment rows */}
          <Box style={{ flex: 1, minWidth: 0 }}>
            {pagedAppointments.length === 0 ? (
              <Box py="xl" ta="center">
                <Calendar size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
                <Text size="sm" c="dimmed" fw={500}>No appointments found</Text>
                <Text size="xs" c="dimmed" mt={4}>
                  {activeFilter === 'today'
                    ? 'No appointments scheduled for today'
                    : 'No appointments match the selected filter'}
                </Text>
              </Box>
            ) : (
              pagedAppointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  isSelected={selectedAppointment?.id === appointment.id}
                  onSelect={setSelectedAppointment}
                />
              ))
            )}
          </Box>

          {/* Detail panel — side panel on desktop, bottom sheet on mobile */}
          {selectedAppointment && !isMobile && (
            <Box
              p="lg"
              style={{
                width: 280,
                flexShrink: 0,
                borderLeft: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
              }}
            >
              <DetailPanel appointment={selectedAppointment} />
            </Box>
          )}
        </Box>

        {/* Mobile bottom sheet detail panel */}
        {selectedAppointment && isMobile && (
          <Box
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderTop: '2px solid #e2e8f0',
              borderRadius: '16px 16px 0 0',
              padding: '20px 16px 32px',
              zIndex: 300,
              boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
            }}
          >
            {/* Drag handle */}
            <Box
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#cbd5e1',
                margin: '0 auto 16px',
              }}
            />
            <Group justify="space-between" mb="md">
              <Text fw={600} size="sm" c="#1e293b">Appointment Details</Text>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => setSelectedAppointment(null)}
              >
                ✕
              </ActionIcon>
            </Group>
            <DetailPanel appointment={selectedAppointment} />
          </Box>
        )}

        {/* Backdrop for mobile bottom sheet */}
        {selectedAppointment && isMobile && (
          <Box
            onClick={() => setSelectedAppointment(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 299,
            }}
          />
        )}

        {/* ── Pagination footer ── */}
        <Divider />
        <Box
          px="lg"
          py="md"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text size="xs" c="#64748b">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredAppointments.length)}–
            {Math.min(page * PAGE_SIZE, filteredAppointments.length)} of{' '}
            {filteredAppointments.length} active plans
          </Text>
          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
            size="sm"
            color={colors.primary[5]}
            withEdges={false}
          />
        </Box>
      </Box>
    </Box>
  );
}
