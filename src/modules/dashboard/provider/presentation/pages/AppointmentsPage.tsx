'use client';

/**
 * ProviderAppointmentsPage
 *
 * Appointment lifecycle from the PROVIDER's perspective:
 *
 *  ┌─────────────────────────────────────────────────────────────────┐
 *  │  Patient books → PENDING (appears in provider's Requests tab)   │
 *  │    ├─ Provider accepts → CONFIRMED (moves to Schedule tab)      │
 *  │    │    ├─ Appointment date passes → COMPLETED (Past tab)       │
 *  │    │    └─ Patient cancels → CANCELLED                          │
 *  │    ├─ Provider declines → CANCELLED                             │
 *  │    └─ Patient cancels before response → CANCELLED               │
 *  └─────────────────────────────────────────────────────────────────┘
 *
 * Tabs:
 *   Requests   — PENDING appointments waiting for the provider to accept or decline
 *   Schedule   — CONFIRMED appointments that haven't happened yet
 *   Past       — COMPLETED appointments (date has passed)
 *   Cancelled  — CANCELLED or NO_SHOW appointments
 */

import { useState, useEffect, useRef } from 'react';
import {
  Box, Text, Title, Stack, Group, Button, Tabs, Badge,
  Modal, Loader, Avatar, Divider, ActionIcon,
} from '@mantine/core';
import {
  Calendar, CheckCircle, X,
  AlertCircle, ChevronRight, Check,
} from 'lucide-react';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme/mantine-theme';
import { useQuery, useMutation } from '@apollo/client/react';
import { notifications } from '@mantine/notifications';
import { useNotifications } from '@/modules/notifications/hooks/useNotifications';
import {
  GET_PROVIDER_APPOINTMENTS,
  ACCEPT_APPOINTMENT,
  DECLINE_APPOINTMENT,
  COMPLETE_APPOINTMENT,
  MARK_APPOINTMENT_NO_SHOW,
} from '@/modules/appointments/infrastructure/graphql/appointments.graphql';
import { useDashboardSearch } from '@/modules/dashboard/layout/context/DashboardSearchContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  providerName: string;
  providerSpecialty: string;
  providerAddress?: string;
  providerPhone?: string;
  oralIQData?: {
    formData?: { symptomTypes?: string[]; painLevel?: number };
    result?: { matchedConditions?: Array<{ name: string }> };
  };
  patientNotes?: string;
  providerNotes?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatType(type: string): string {
  const labels: Record<string, string> = {
    ROUTINE_CLEANING: 'Routine Cleaning',
    FOLLOW_UP: 'Follow-up',
    SYMPTOM: 'Symptom Assessment',
    EMERGENCY: 'Emergency',
    CONSULTATION: 'Consultation',
  };
  return labels[type] ?? type.replace(/_/g, ' ');
}

/**
 * Determines which tab an appointment belongs to on the PROVIDER side.
 *
 * Rules:
 *   PENDING                              → "requests"
 *   CONFIRMED + date in the future       → "schedule"
 *   CONFIRMED + date in the past         → "past"  (auto-completed)
 *   COMPLETED                            → "past"
 *   CANCELLED or NO_SHOW                 → "cancelled"
 */
function getTab(appointment: Appointment): 'requests' | 'schedule' | 'past' | 'cancelled' {
  const { status, appointmentDate, appointmentTime } = appointment;

  if (status === 'CANCELLED' || status === 'NO_SHOW') return 'cancelled';
  if (status === 'COMPLETED') return 'past';
  if (status === 'PENDING') return 'requests';

  // CONFIRMED — check whether the appointment time has already passed
  const [time, meridiem] = appointmentTime.split(' ');
  const [hourStr, minuteStr] = (time ?? '').split(':');
  let hour = parseInt(hourStr ?? '0', 10);
  const minute = parseInt(minuteStr ?? '0', 10);
  if (meridiem?.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (meridiem?.toUpperCase() === 'AM' && hour === 12) hour = 0;

  const apptDateTime = new Date(appointmentDate);
  apptDateTime.setHours(hour, minute, 0, 0);

  return apptDateTime < new Date() ? 'past' : 'schedule';
}

/** Deterministic avatar colour from patient ID */
function getAvatarColor(patientId: string): string {
  const palette = ['#548CA1', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  return palette[patientId.charCodeAt(0) % palette.length] ?? '#548CA1';
}

/** Short display name derived from patientId (until patient profile lookup is added) */
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

// ─── Appointment Row (used in Requests and Schedule tabs) ─────────────────────

interface AppointmentRowProps {
  appointment: Appointment;
  isSelected: boolean;
  onSelect: (a: Appointment) => void;
  /** Show Accept / Decline buttons — only for PENDING requests */
  showActions?: boolean;
  onAccept?: (id: string) => void;
  onDecline?: (a: Appointment) => void;
  isAccepting?: boolean;
}

function AppointmentRow({
  appointment,
  isSelected,
  onSelect,
  showActions,
  onAccept,
  onDecline,
  isAccepting,
}: AppointmentRowProps) {
  const patientName  = getPatientName(appointment);
  const avatarColor  = getAvatarColor(appointment.patientId);

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => onSelect(appointment)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(appointment); }}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             14,
        padding:         '14px 20px',
        backgroundColor: isSelected ? '#EFF6FF' : '#fff',
        borderLeft:      `4px solid ${isSelected ? '#3B82F6' : '#548CA1'}`,
        borderBottom:    '1px solid #f1f5f9',
        transition:      'background-color 0.15s',
        cursor:          'pointer',
        width:           '100%',
      }}
      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#fff'; }}
    >
        {/* Time */}
        <Text fw={600} size="sm" c={isSelected ? '#3B82F6' : '#548CA1'} style={{ minWidth: 80, fontVariantNumeric: 'tabular-nums' }}>
          {appointment.appointmentTime}
        </Text>

        {/* Avatar */}
        <Avatar size={40} radius="xl" style={{ backgroundColor: avatarColor, color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
          {getInitials(patientName)}
        </Avatar>

        {/* Name + type */}
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Text fw={600} size="sm" c="#1e293b" lineClamp={1}>{patientName}</Text>
          <Text size="xs" c="#64748b" lineClamp={1}>{formatType(appointment.type)}</Text>
        </Stack>

        {/* Accept / Decline buttons for pending requests */}
        {showActions && (
          <Group gap={8} onClick={(e) => e.stopPropagation()}>
            <Button size="xs" color="green" variant="light" leftSection={<Check size={12} />}
              loading={isAccepting} onClick={() => onAccept?.(appointment.id)}>
              Accept
            </Button>
            <Button size="xs" color="red" variant="light" leftSection={<X size={12} />}
              onClick={() => onDecline?.(appointment)}>
              Decline
            </Button>
          </Group>
        )}

        {/* View Details chevron — always visible */}
        <ActionIcon variant="subtle" color="gray" size="sm" title="View details">
          <ChevronRight size={16} color="#548CA1" />
        </ActionIcon>
    </Box>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

/** Colour per appointment status */
function statusBadgeColor(status: string): string {
  switch (status) {
    case 'PENDING':   return 'yellow';
    case 'CONFIRMED': return 'blue';
    case 'COMPLETED': return 'gray';
    case 'CANCELLED':
    case 'NO_SHOW':   return 'red';
    default:          return 'gray';
  }
}

/** Human-readable status label */
function statusLabel(status: string): string {
  switch (status) {
    case 'PENDING':   return 'Awaiting Confirmation';
    case 'CONFIRMED': return 'Confirmed';
    case 'COMPLETED': return 'Completed';
    case 'CANCELLED': return 'Cancelled';
    case 'NO_SHOW':   return 'No Show';
    default:          return status;
  }
}

function DetailPanel({ appointment }: { appointment: Appointment }) {
  const patientName   = getPatientName(appointment);
  const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const conditions    = appointment.oralIQData?.result?.matchedConditions?.map((c) => c.name) ?? [];
  const symptomTypes  = appointment.oralIQData?.formData?.symptomTypes ?? [];
  const painLevel     = appointment.oralIQData?.formData?.painLevel;

  /**
   * Extract patient contact details from patientNotes if present.
   * Format expected: "Name | phone: 555-1234 | email: patient@example.com"
   * Falls back gracefully if the format isn't present.
   */
  const phoneMatch = appointment.patientNotes
    ? /phone:\s*([^\s|]+)/i.exec(appointment.patientNotes)
    : null;
  const emailMatch = appointment.patientNotes
    ? /email:\s*([^\s|]+)/i.exec(appointment.patientNotes)
    : null;
  const patientPhone = phoneMatch?.[1];
  const patientEmail = emailMatch?.[1];

  return (
    <Stack gap="md">

      {/* Status badge */}
      <Group gap="xs">
        <Badge size="sm" variant="light" color={statusBadgeColor(appointment.status)}>
          {statusLabel(appointment.status)}
        </Badge>
        <Text size="xs" c="dimmed">{formatType(appointment.type)}</Text>
      </Group>

      {/* Patient info — name, ID, and contact details */}
      <Box p="sm" bg="#f8fafc" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <Text size="xs" fw={700} c="#548CA1" mb={6}>Patient</Text>
        <Text size="sm" fw={600} c="#1e293b">{patientName}</Text>
        <Text size="xs" c="dimmed" mb={patientPhone || patientEmail ? 6 : 0}>
          ID: {appointment.patientId.slice(0, 8).toUpperCase()}
        </Text>
        {/* Contact details — shown when available */}
        {patientPhone && (
          <Text size="xs" c="#548CA1">📞 {patientPhone}</Text>
        )}
        {patientEmail && (
          <Text size="xs" c="#548CA1">✉ {patientEmail}</Text>
        )}
        {/* Prompt when no contact info is available */}
        {!patientPhone && !patientEmail && (
          <Text size="xs" c="dimmed" mt={4} style={{ fontStyle: 'italic' }}>
            No contact details on file
          </Text>
        )}
      </Box>

      {/* Date & Time */}
      <Box p="sm" bg="#f8fafc" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <Text size="xs" fw={700} c="#548CA1" mb={4}>Date & Time</Text>
        <Text size="sm" c="#1e293b">{formattedDate}</Text>
        <Text size="sm" c="#1e293b">{appointment.appointmentTime}</Text>
      </Box>

      {/* Oral IQ summary */}
      {(symptomTypes.length > 0 || conditions.length > 0) && (
        <Box p="sm" bg="#f8fafc" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <Text size="xs" fw={700} c="#548CA1" mb={4}>Symptom Assessment</Text>
          {symptomTypes.length > 0 && (
            <Text size="xs" c="dimmed">Symptoms: {symptomTypes.join(', ')}</Text>
          )}
          {painLevel != null && (
            <Text size="xs" c="dimmed">Pain level: {painLevel}/10</Text>
          )}
          {conditions.length > 0 && (
            <Text size="xs" c="dimmed">Possible conditions: {conditions.join(', ')}</Text>
          )}
        </Box>
      )}

      {/* Patient notes */}
      {appointment.patientNotes && (
        <Box p="sm" bg="#f8fafc" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <Text size="xs" fw={700} c="#548CA1" mb={4}>Patient Notes</Text>
          <Text size="xs" c="#1e293b">{appointment.patientNotes}</Text>
        </Box>
      )}

      {/* Cancellation reason */}
      {appointment.cancellationReason && (
        <Box p="sm" bg="#fff5f5" style={{ borderRadius: 8, border: '1px solid #fecaca' }}>
          <Text size="xs" fw={700} c="red" mb={4}>Cancellation Reason</Text>
          <Text size="xs" c="dimmed">{appointment.cancellationReason}</Text>
        </Box>
      )}
    </Stack>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: string }) {
  const messages: Record<string, { icon: React.ReactNode; title: string; body: string }> = {
    requests:  { icon: <AlertCircle size={40} color="#cbd5e1" />, title: 'No pending requests', body: 'New appointment requests from patients will appear here.' },
    schedule:  { icon: <Calendar size={40} color="#cbd5e1" />,    title: 'No upcoming appointments', body: 'Accepted appointments will appear here.' },
    past:      { icon: <CheckCircle size={40} color="#cbd5e1" />, title: 'No past appointments', body: 'Completed appointments will appear here.' },
    cancelled: { icon: <X size={40} color="#cbd5e1" />,           title: 'No cancelled appointments', body: 'Declined or cancelled appointments will appear here.' },
  };
  const msg = messages[tab] ?? messages.requests;

  return (
    <Box py="xl" ta="center">
      <Box style={{ margin: '0 auto 12px', display: 'flex', justifyContent: 'center' }}>{msg.icon}</Box>
      <Text size="sm" c="dimmed" fw={500}>{msg.title}</Text>
      <Text size="xs" c="dimmed" mt={4}>{msg.body}</Text>
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ProviderAppointmentsPage() {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  const [activeTab, setActiveTab] = useState<string>('requests');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [declineTarget, setDeclineTarget] = useState<Appointment | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [tokenReady, setTokenReady] = useState(false);

  /**
   * Read the shared search query from the dashboard context.
   *
   * The topbar writes to this context whenever the user types.
   * This page reads it and uses it to filter the appointments list below.
   *
   * Fields searched:
   *   - Patient name  (e.g. "John", "Patient A3F2")
   *   - Appointment type (e.g. "cleaning", "emergency")
   *   - Appointment date (e.g. "March", "2026")
   */
  const { query } = useDashboardSearch();

  /**
   * Date filter state:
   *   dropdownOpen  — controls the custom date dropdown visibility
   *   pickedDate    — date selected inside the dropdown (not yet applied), "YYYY-MM-DD"
   *   appliedDate   — the date actively filtering the current tab (null = no filter)
   *
   * Flow:
   *   "Go to date" clicked  → dropdown opens immediately
   *   User picks a date     → pickedDate updates, Filter button enables
   *   "Filter" clicked      → appliedDate set, dropdown closes, button → "Clear filter"
   *   "Clear" (in dropdown) → pickedDate reset, no filter applied yet
   *   "Clear filter" button → appliedDate cleared, back to "Go to date"
   */
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pickedDate, setPickedDate] = useState<string>('');
  const [appliedDate, setAppliedDate] = useState<Date | null>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // Wait for the access token before firing the query
  useEffect(() => {
    if (localStorage.getItem('accessToken')) { setTokenReady(true); return; }
    const interval = setInterval(() => {
      if (localStorage.getItem('accessToken')) { setTokenReady(true); clearInterval(interval); }
    }, 100);
    const timeout = setTimeout(() => { clearInterval(interval); setTokenReady(true); }, 3000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  // Close the date dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const { data, loading, refetch } = useQuery<{ myProviderAppointments: Appointment[] }>(
    GET_PROVIDER_APPOINTMENTS,
    {
      fetchPolicy: 'cache-and-network',
      skip:        !tokenReady,
      pollInterval: 30_000, // baseline: refresh every 30 seconds
    },
  );

  /**
   * Reactive refresh — when the notification bell detects a new unread
   * notification (unread count goes up), immediately refetch appointments
   * so the Requests tab updates without waiting for the next poll cycle.
   */
  const { unreadCount } = useNotifications();
  const prevUnreadCount = useRef(unreadCount);
  useEffect(() => {
    if (unreadCount > prevUnreadCount.current && tokenReady) {
      void refetch();
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount, tokenReady, refetch]);

  const [acceptMutation, { loading: accepting }] = useMutation(ACCEPT_APPOINTMENT, {
    onCompleted: () => {
      notifications.show({ title: 'Appointment Accepted', message: 'The appointment has been confirmed and added to your schedule.', color: 'green' });
      setSelectedAppointment(null);
      void refetch();
    },
    onError: (err) => notifications.show({ title: 'Error', message: err.message, color: 'red' }),
  });

  const [declineMutation, { loading: declining }] = useMutation(DECLINE_APPOINTMENT, {
    onCompleted: () => {
      notifications.show({ title: 'Appointment Declined', message: 'The appointment request has been declined.', color: 'orange' });
      setDeclineTarget(null);
      setDeclineReason('');
      setSelectedAppointment(null);
      void refetch();
    },
    onError: (err) => notifications.show({ title: 'Error', message: err.message, color: 'red' }),
  });

  const [completeMutation, { loading: completing }] = useMutation(COMPLETE_APPOINTMENT, {
    onCompleted: () => {
      notifications.show({ title: 'Appointment Completed', message: 'The appointment has been marked as completed.', color: 'teal' });
      setSelectedAppointment(null);
      void refetch();
    },
    onError: (err) => notifications.show({ title: 'Error', message: err.message, color: 'red' }),
  });

  const [noShowMutation, { loading: markingNoShow }] = useMutation(MARK_APPOINTMENT_NO_SHOW, {
    onCompleted: () => {
      notifications.show({ title: 'Marked as No Show', message: 'The appointment has been marked as no-show.', color: 'orange' });
      setSelectedAppointment(null);
      void refetch();
    },
    onError: (err) => notifications.show({ title: 'Error', message: err.message, color: 'red' }),
  });

  const appointments = data?.myProviderAppointments ?? [];

  /**
   * matchesSearch — returns true if the appointment matches the current
   * search query typed in the topbar.
   *
   * Searches across:
   *   - Patient name   → "John", "Patient A3F2"
   *   - Appointment type → "cleaning", "emergency", "follow"
   *   - Appointment date → "March", "2026", "15"
   *
   * Case-insensitive. Empty query always returns true (show everything).
   *
   * To search additional fields in the future, just add more conditions here.
   */
  function matchesSearch(a: Appointment): boolean {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      getPatientName(a).toLowerCase().includes(q) ||
      formatType(a.type).toLowerCase().includes(q) ||
      new Date(a.appointmentDate).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      }).toLowerCase().includes(q)
    );
  }

  /**
   * Apply the selected date as the active filter and close the dropdown.
   */
  function handleApplyFilter() {
    if (!pickedDate) return;
    const [year, month, day] = pickedDate.split('-').map(Number);
    setAppliedDate(new Date(year!, month! - 1, day!));
    setDropdownOpen(false);
  }

  /** Clear the active filter and reset the picker. */
  function handleClearFilter() {
    setAppliedDate(null);
    setPickedDate('');
    setDropdownOpen(false);
  }

  /**
   * Apply the "Go to date" filter on top of the tab grouping.
   * If a date is applied, only appointments on that exact calendar date are shown.
   */
  function matchesSelectedDate(a: Appointment): boolean {
    if (!appliedDate) return true;
    const apptDate = new Date(a.appointmentDate);
    return (
      apptDate.getFullYear() === appliedDate.getFullYear() &&
      apptDate.getMonth() === appliedDate.getMonth() &&
      apptDate.getDate() === appliedDate.getDate()
    );
  }

  // Sort each group by appointment date, applying both the date filter and the search filter
  const byTab = {
    requests:  appointments.filter((a) => getTab(a) === 'requests'  && matchesSelectedDate(a) && matchesSearch(a)).sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()),
    schedule:  appointments.filter((a) => getTab(a) === 'schedule'  && matchesSelectedDate(a) && matchesSearch(a)).sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()),
    past:      appointments.filter((a) => getTab(a) === 'past'      && matchesSelectedDate(a) && matchesSearch(a)).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()),
    cancelled: appointments.filter((a) => getTab(a) === 'cancelled' && matchesSelectedDate(a) && matchesSearch(a)).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()),
  };

  function handleAccept(appointmentId: string) {
    void acceptMutation({ variables: { appointmentId } });
  }

  function handleDeclineConfirm() {
    if (!declineTarget) return;
    void declineMutation({ variables: { input: { appointmentId: declineTarget.id, declineReason: declineReason || 'Declined by provider' } } });
  }

  if (loading && appointments.length === 0) {
    return (
      <Box ta="center" py="xl">
        <Loader size="lg" color={colors.primary[5]} />
        <Text size="sm" c="dimmed" mt="md">Loading appointments...</Text>
      </Box>
    );
  }

  const tabConfig = [
    { value: 'requests',  label: 'Requests',  count: byTab.requests.length },
    { value: 'schedule',  label: 'Schedule',  count: byTab.schedule.length },
    { value: 'past',      label: 'Past',       count: byTab.past.length },
    { value: 'cancelled', label: 'Cancelled',  count: byTab.cancelled.length },
  ];

  const currentList = byTab[activeTab as keyof typeof byTab] ?? [];

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={4}>
          <Title order={2} fw={700} c="#1e293b" fz={24}>Appointments</Title>
          <Text size="sm" c="#64748b">Manage patient appointment requests and your schedule</Text>
        </Stack>

        {/* ── Date filter button + dropdown ── */}
        <Box style={{ position: 'relative' }} ref={dateDropdownRef}>

          {/* Single toggle button — label changes based on filter state */}
          <Button
            variant={appliedDate ? 'filled' : 'outline'}
            color={appliedDate ? 'teal' : 'gray'}
            size="sm"
            leftSection={<Calendar size={14} />}
            onClick={() => {
              if (appliedDate) {
                // "Clear filter" — wipe the filter immediately, no dropdown needed
                handleClearFilter();
              } else {
                // "Go to date" — open the dropdown
                setDropdownOpen((o) => !o);
              }
            }}
          >
            {appliedDate
              ? `Clear filter: ${appliedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : 'Go to date'}
          </Button>

          {/* Dropdown — opens immediately when "Go to date" is clicked */}
          {dropdownOpen && (
            <Box
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                zIndex: 200,
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                padding: '14px 16px',
                minWidth: 240,
              }}
            >
              <Text size="xs" fw={600} c="#374151" mb={8}>Select a date</Text>
              <input
                type="date"
                value={pickedDate}
                onChange={(e) => setPickedDate(e.target.value)}
                autoFocus
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 14,
                  color: '#1e293b',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  cursor: 'pointer',
                  marginBottom: 10,
                }}
              />
              <Group gap="sm">
                <Button
                  size="xs"
                  color="teal"
                  disabled={!pickedDate}
                  onClick={handleApplyFilter}
                  style={{ flex: 1 }}
                >
                  Filter
                </Button>
                <Button
                  size="xs"
                  variant="subtle"
                  color="gray"
                  onClick={() => { setPickedDate(''); setDropdownOpen(false); }}
                  style={{ flex: 1 }}
                >
                  Clear
                </Button>
              </Group>
            </Box>
          )}
        </Box>
      </Group>

      {/* Tabs + content card */}
      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden' }}>

        {/* Tab bar */}
        <Box px="lg" pt="lg">
          <Tabs value={activeTab} onChange={(v) => { setActiveTab(v ?? 'requests'); setSelectedAppointment(null); }}>
            <Tabs.List style={{ borderBottom: '1px solid #e2e8f0' }}>
              {tabConfig.map((tab) => (
                <Tabs.Tab
                  key={tab.value}
                  value={tab.value}
                  rightSection={
                    tab.count > 0 ? (
                      <Badge size="xs" variant="filled" color={activeTab === tab.value ? 'blue' : 'gray'} circle>
                        {tab.count}
                      </Badge>
                    ) : undefined
                  }
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </Box>

        {/* Count */}
        <Box px="lg" py="md">
          <Text fw={600} size="md" c="#1e293b">
            {activeTab === 'requests' ? 'Pending Requests' : activeTab === 'schedule' ? 'Upcoming Schedule' : activeTab === 'past' ? 'Past Appointments' : 'Cancelled Appointments'}
          </Text>
          <Text size="xs" c="#64748b" mt={2}>
            {currentList.length} appointment{currentList.length !== 1 ? 's' : ''}
          </Text>
        </Box>

        {/* List + detail panel side by side */}
        <Box style={{ display: 'flex' }}>

          {/* Appointment rows */}
          <Box style={{ flex: 1, minWidth: 0 }}>
            {currentList.length === 0 ? (
              <EmptyState tab={activeTab} />
            ) : (
              currentList.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  isSelected={selectedAppointment?.id === appointment.id}
                  onSelect={setSelectedAppointment}
                  showActions={activeTab === 'requests'}
                  onAccept={handleAccept}
                  onDecline={setDeclineTarget}
                  isAccepting={accepting}
                />
              ))
            )}
          </Box>

          {/* Detail panel — slides in when a row is selected */}
          {selectedAppointment && (
            <Box
              p="lg"
              style={{
                width: 300,
                flexShrink: 0,
                borderLeft: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
              }}
            >
              <Group justify="space-between" mb="md">
                <Text fw={600} size="sm" c="#1e293b">Appointment Details</Text>
                <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => setSelectedAppointment(null)}>
                  <X size={14} />
                </ActionIcon>
              </Group>
              <DetailPanel appointment={selectedAppointment} />

              {/* Accept / Decline inline in detail panel for pending requests */}
              {getTab(selectedAppointment) === 'requests' && (
                <>
                  <Divider my="md" />
                  <Stack gap="sm">
                    <Button
                      fullWidth
                      color="green"
                      leftSection={<Check size={14} />}
                      loading={accepting}
                      onClick={() => handleAccept(selectedAppointment.id)}
                    >
                      Accept Appointment
                    </Button>
                    <Button
                      fullWidth
                      color="red"
                      variant="light"
                      leftSection={<X size={14} />}
                      onClick={() => setDeclineTarget(selectedAppointment)}
                    >
                      Decline Appointment
                    </Button>
                  </Stack>
                </>
              )}

              {/* Complete / No Show actions for confirmed appointments in the Schedule tab */}
              {getTab(selectedAppointment) === 'schedule' && (
                <>
                  <Divider my="md" />
                  <Stack gap="sm">
                    <Button
                      fullWidth
                      color="teal"
                      leftSection={<CheckCircle size={14} />}
                      loading={completing}
                      onClick={() => void completeMutation({ variables: { appointmentId: selectedAppointment.id } })}
                    >
                      Mark as Completed
                    </Button>
                    <Button
                      fullWidth
                      color="orange"
                      variant="light"
                      leftSection={<AlertCircle size={14} />}
                      loading={markingNoShow}
                      onClick={() => void noShowMutation({ variables: { appointmentId: selectedAppointment.id } })}
                    >
                      Mark as No Show
                    </Button>
                  </Stack>
                </>
              )}
            </Box>
          )}
        </Box>

        {/* Pagination placeholder */}
        <Divider />
        <Box px="lg" py="md">
          <Text size="xs" c="#64748b">
            {currentList.length} appointment{currentList.length !== 1 ? 's' : ''} total
          </Text>
        </Box>
      </Box>

      {/* Decline Confirmation Modal */}
      <Modal
        opened={!!declineTarget}
        onClose={() => { setDeclineTarget(null); setDeclineReason(''); }}
        title="Decline Appointment"
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to decline this appointment request from{' '}
            <strong>{declineTarget ? getPatientName(declineTarget) : ''}</strong>?
          </Text>
          <Box>
            <Text size="xs" fw={600} mb={4}>Reason (optional)</Text>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Schedule conflict, not available on this date..."
              rows={3}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                fontSize: 13,
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </Box>
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={() => { setDeclineTarget(null); setDeclineReason(''); }} disabled={declining}>
              Keep Request
            </Button>
            <Button color="red" onClick={handleDeclineConfirm} loading={declining}>
              Decline
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
