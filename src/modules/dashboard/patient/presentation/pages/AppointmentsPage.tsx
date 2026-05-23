'use client';

/**
 * PatientAppointmentsPage
 *
 * Appointment lifecycle from the PATIENT's perspective:
 *
 *  ┌─────────────────────────────────────────────────────────────────┐
 *  │  Patient books → PENDING                                        │
 *  │    ├─ Provider accepts → CONFIRMED                              │
 *  │    │    ├─ Appointment date passes → COMPLETED (Past tab)       │
 *  │    │    └─ Patient cancels → CANCELLED                          │
 *  │    ├─ Provider declines → CANCELLED                             │
 *  │    └─ Patient cancels before response → CANCELLED               │
 *  └─────────────────────────────────────────────────────────────────┘
 *
 * Tabs:
 *   Pending Requests  — PENDING appointments awaiting provider response
 *   Upcoming          — CONFIRMED appointments that haven't happened yet
 *   Past              — COMPLETED appointments (date has passed)
 *   Cancelled         — CANCELLED or NO_SHOW appointments
 *
 * Layout: same row-based list + side detail panel as the provider page.
 */

import { useState, useEffect, useRef } from 'react';
import {
  Box, Text, Title, Stack, Group, Button, Tabs, Badge,
  Modal, Loader, Divider, ActionIcon, Avatar,
} from '@mantine/core';
import {
  Calendar, CheckCircle, X, AlertCircle, ChevronRight,
  Plus, Edit,
} from 'lucide-react';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme/mantine-theme';
import { useQuery, useMutation } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import {
  GET_MY_APPOINTMENTS,
  CANCEL_APPOINTMENT,
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
    formData?: { symptomTypes?: string[]; painLevel?: number; duration?: string };
    result?: { matchedConditions?: Array<{ name: string }> };
    selectionLabels?: string[];
  };
  reminderPreference: string;
  reminderSent: boolean;
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
    FOLLOW_UP:        'Follow-up',
    SYMPTOM:          'Symptom Assessment',
    EMERGENCY:        'Emergency',
    CONSULTATION:     'Consultation',
  };
  return labels[type] ?? type.replace(/_/g, ' ');
}

/**
 * Determines which tab an appointment belongs to.
 *
 * Rules:
 *   PENDING + date in the future         → "pending"
 *   PENDING + date in the past           → "past"  (provider never responded)
 *   CONFIRMED + date in the future       → "upcoming"
 *   CONFIRMED + date in the past         → "past"  (auto-completed)
 *   COMPLETED                            → "past"
 *   CANCELLED or NO_SHOW                 → "cancelled"
 */
function getTab(a: Appointment): 'pending' | 'upcoming' | 'past' | 'cancelled' {
  const { status, appointmentDate, appointmentTime } = a;

  if (status === 'CANCELLED' || status === 'NO_SHOW') return 'cancelled';
  if (status === 'COMPLETED') return 'past';

  // Parse the appointment date+time into a comparable Date object
  const [time, meridiem] = appointmentTime.split(' ');
  const [hourStr, minuteStr] = (time ?? '').split(':');
  let hour = parseInt(hourStr ?? '0', 10);
  const minute = parseInt(minuteStr ?? '0', 10);
  if (meridiem?.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (meridiem?.toUpperCase() === 'AM' && hour === 12) hour = 0;
  const dt = new Date(appointmentDate);
  dt.setHours(hour, minute, 0, 0);
  const isPast = dt < new Date();

  if (status === 'PENDING') {
    // If the appointment date has passed and the provider never responded,
    // move it to the Past tab so it doesn't clutter Pending Requests.
    return isPast ? 'past' : 'pending';
  }

  // CONFIRMED — upcoming or past based on date
  return isPast ? 'past' : 'upcoming';
}

function statusBadgeColor(status: string, cancelledBy?: string): string {
  switch (status) {
    case 'PENDING':   return 'orange';
    case 'CONFIRMED': return 'blue';
    case 'COMPLETED': return 'teal';
    case 'CANCELLED': return cancelledBy === 'provider' ? 'red' : 'gray';
    case 'NO_SHOW':   return 'red';
    default:          return 'gray';
  }
}

/**
 * Returns a human-readable status label.
 *
 * Special cases:
 *   PENDING (past date)          → "Request Expired" — provider never responded
 *   CANCELLED by provider        → "Declined by Provider" — professional term for rejection
 *   CANCELLED by patient/system  → "Cancelled"
 */
function statusLabel(status: string, cancelledBy?: string, isPastDue?: boolean): string {
  switch (status) {
    case 'PENDING':
      return isPastDue ? 'Request Expired' : 'Awaiting Confirmation';
    case 'CONFIRMED': return 'Confirmed';
    case 'COMPLETED': return 'Completed';
    case 'CANCELLED':
      return cancelledBy === 'provider' ? 'Declined by Provider' : 'Cancelled';
    case 'NO_SHOW':   return 'No Show';
    default:          return status;
  }
}

/** Deterministic avatar colour from provider name */
function getAvatarColor(name: string): string {
  const palette = ['#548CA1', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  return palette[(name.charCodeAt(0) ?? 0) % palette.length] ?? '#548CA1';
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

// ─── Appointment Row ──────────────────────────────────────────────────────────

interface AppointmentRowProps {
  appointment:  Appointment;
  isSelected:   boolean;
  onSelect:     (a: Appointment) => void;
  onCancel?:    (id: string) => void;
  isCancelling?: boolean;
}

function AppointmentRow({ appointment, isSelected, onSelect, onCancel, isCancelling }: AppointmentRowProps) {
  const tab         = getTab(appointment);
  const avatarColor = getAvatarColor(appointment.providerName);
  const isPastDue   = appointment.status === 'PENDING' && tab === 'past';

  const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

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
      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = isSelected ? '#EFF6FF' : '#fff'; }}
    >
      {/* Date column */}
      <Text fw={600} size="sm" c={isSelected ? '#3B82F6' : '#548CA1'}
        style={{ minWidth: 90, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
        {formattedDate}
      </Text>

      {/* Provider avatar */}
      <Avatar size={40} radius="xl"
        style={{ backgroundColor: avatarColor, color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
        {getInitials(appointment.providerName)}
      </Avatar>

      {/* Provider name + type */}
      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
        <Text fw={600} size="sm" c="#1e293b" lineClamp={1}>{appointment.providerName}</Text>
        <Text size="xs" c="#64748b" lineClamp={1}>{formatType(appointment.type)}</Text>
      </Stack>

      {/* Status badge */}
      <Badge
        size="xs"
        variant="light"
        color={statusBadgeColor(appointment.status, appointment.cancelledBy)}
        style={{ flexShrink: 0 }}
      >
        {statusLabel(appointment.status, appointment.cancelledBy, isPastDue)}
      </Badge>

      {/* Cancel button — only for upcoming confirmed appointments */}
      {tab === 'upcoming' && (
        <ActionIcon
          variant="subtle"
          color="red"
          size="sm"
          title="Cancel appointment"
          onClick={(e) => { e.stopPropagation(); onCancel?.(appointment.id); }}
          loading={isCancelling}
        >
          <X size={14} />
        </ActionIcon>
      )}

      {/* View details chevron */}
      <ActionIcon variant="subtle" color="gray" size="sm" title="View details">
        <ChevronRight size={16} color="#548CA1" />
      </ActionIcon>
    </Box>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
  appointment:  Appointment;
  onClose:      () => void;
  onCancel:     (id: string) => void;
  onReschedule: (a: Appointment) => void;
  isCancelling: boolean;
}

function DetailPanel({ appointment, onClose, onCancel, onReschedule, isCancelling }: DetailPanelProps) {
  const theme       = useMantineTheme();
  const colors      = themeColors(theme);
  const tab         = getTab(appointment);
  const canCancel   = tab === 'pending' || tab === 'upcoming';

  /**
   * Reschedule is allowed when:
   *   - The appointment is CONFIRMED and upcoming (tab === 'upcoming'), OR
   *   - The appointment is PENDING but its date/time has already passed —
   *     the provider never responded, so the patient should be able to
   *     pick a new time rather than just cancel.
   */
  const isPendingPastDue = appointment.status === 'PENDING' && (() => {
    const [time, meridiem] = appointment.appointmentTime.split(' ');
    const [hourStr, minuteStr] = (time ?? '').split(':');
    let hour = parseInt(hourStr ?? '0', 10);
    const minute = parseInt(minuteStr ?? '0', 10);
    if (meridiem?.toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (meridiem?.toUpperCase() === 'AM' && hour === 12) hour = 0;
    const dt = new Date(appointment.appointmentDate);
    dt.setHours(hour, minute, 0, 0);
    return dt < new Date();
  })();

  const canReschedule = tab === 'upcoming' || isPendingPastDue;

  const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const oralIQ        = appointment.oralIQData;
  const conditions    = oralIQ?.result?.matchedConditions?.map((c) => c.name) ?? [];
  const symptomTypes  = oralIQ?.formData?.symptomTypes ?? [];
  const selectionLabels = oralIQ?.selectionLabels ?? [];

  return (
    <Box p="lg" style={{ width: 300, flexShrink: 0, borderLeft: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>

      {/* Panel header */}
      <Group justify="space-between" mb="md">
        <Text fw={600} size="sm" c="#1e293b">Appointment Details</Text>
        <ActionIcon variant="subtle" color="gray" size="sm" onClick={onClose}>
          <X size={14} />
        </ActionIcon>
      </Group>

      <Stack gap="md">

        {/* Status */}
        <Group gap="xs">
          <Badge size="sm" variant="light" color={statusBadgeColor(appointment.status, appointment.cancelledBy)}>
            {statusLabel(
              appointment.status,
              appointment.cancelledBy,
              appointment.status === 'PENDING' && getTab(appointment) === 'past'
            )}
          </Badge>
          <Text size="xs" c="dimmed">{formatType(appointment.type)}</Text>
        </Group>

        {/* Provider */}
        <Box p="sm" bg="#fff" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <Text size="xs" fw={700} c={colors.primary[5]} mb={4}>Provider</Text>
          <Text size="sm" fw={600} c="#1e293b">{appointment.providerName}</Text>
          <Text size="xs" c="dimmed">{appointment.providerSpecialty}</Text>
          {appointment.providerAddress && <Text size="xs" c="dimmed" mt={2}>{appointment.providerAddress}</Text>}
          {appointment.providerPhone   && <Text size="xs" c="dimmed">{appointment.providerPhone}</Text>}
        </Box>

        {/* Date & Time */}
        <Box p="sm" bg="#fff" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <Text size="xs" fw={700} c={colors.primary[5]} mb={4}>Date & Time</Text>
          <Text size="sm" c="#1e293b">{formattedDate}</Text>
          <Text size="sm" c="#1e293b">{appointment.appointmentTime}</Text>
        </Box>

        {/* Oral IQ summary */}
        {(selectionLabels.length > 0 || symptomTypes.length > 0 || conditions.length > 0) && (
          <Box p="sm" bg="#fff" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <Text size="xs" fw={700} c={colors.primary[5]} mb={4}>Symptom Assessment</Text>
            {selectionLabels.length > 0 && <Text size="xs" c="dimmed">Areas: {selectionLabels.join(', ')}</Text>}
            {symptomTypes.length > 0    && <Text size="xs" c="dimmed">Symptoms: {symptomTypes.join(', ')}</Text>}
            {oralIQ?.formData?.painLevel != null && <Text size="xs" c="dimmed">Pain level: {oralIQ.formData.painLevel}/10</Text>}
            {conditions.length > 0      && <Text size="xs" c="dimmed">Possible conditions: {conditions.join(', ')}</Text>}
          </Box>
        )}

        {/* Cancellation reason */}
        {appointment.cancellationReason && (
          <Box p="sm" bg="#fff5f5" style={{ borderRadius: 8, border: '1px solid #fecaca' }}>
            <Text size="xs" fw={700} c="red" mb={4}>Cancellation Reason</Text>
            <Text size="xs" c="dimmed">{appointment.cancellationReason}</Text>
          </Box>
        )}

        {/* Actions */}
        {canCancel && (
          <>
            <Divider />
            <Stack gap="sm">
              {canReschedule && (
                <Button fullWidth variant="light" color="blue" size="sm"
                  leftSection={<Edit size={14} />}
                  onClick={() => onReschedule(appointment)}>
                  Reschedule
                </Button>
              )}
              <Button fullWidth color="red" variant="light" size="sm"
                leftSection={<X size={14} />}
                loading={isCancelling}
                onClick={() => onCancel(appointment.id)}>
                Cancel Appointment
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ tab, onBook }: { tab: string; onBook: () => void }) {
  const messages: Record<string, { icon: React.ReactNode; title: string; body: string; showBook: boolean }> = {
    pending:   { icon: <AlertCircle size={40} color="#cbd5e1" />, title: 'No pending requests',      body: 'Appointments you book will appear here while waiting for provider confirmation.', showBook: true },
    upcoming:  { icon: <Calendar    size={40} color="#cbd5e1" />, title: 'No upcoming appointments', body: 'Confirmed appointments will appear here.',                                        showBook: true },
    past:      { icon: <CheckCircle size={40} color="#cbd5e1" />, title: 'No past appointments',     body: 'Completed appointments and expired requests will appear here.',                  showBook: false },
    cancelled: { icon: <X           size={40} color="#cbd5e1" />, title: 'No cancelled appointments',body: 'Cancelled or declined appointments will appear here.',                           showBook: false },
  };
  const msg = messages[tab] ?? messages.pending;

  return (
    <Box py="xl" ta="center">
      <Box style={{ margin: '0 auto 12px', display: 'flex', justifyContent: 'center' }}>{msg.icon}</Box>
      <Text size="sm" c="dimmed" fw={500}>{msg.title}</Text>
      <Text size="xs" c="dimmed" mt={4}>{msg.body}</Text>
      {msg.showBook && (
        <Button variant="outline" size="xs" mt="md" leftSection={<Plus size={14} />} onClick={onBook}>
          Book Appointment
        </Button>
      )}
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function PatientAppointmentsPage() {
  const theme  = useMantineTheme();
  const colors = themeColors(theme);
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * If the page is opened with ?tab=upcoming (or any valid tab value),
   * start on that tab. This is used by the dashboard home page when a
   * patient clicks an appointment row — they land directly on the right tab.
   * Falls back to 'pending' if no valid tab param is present.
   */
  const validTabs = ['pending', 'upcoming', 'past', 'cancelled'] as const;
  type TabValue = typeof validTabs[number];
  const tabParam = searchParams?.get('tab') as TabValue | null;
  const initialTab: TabValue = tabParam && validTabs.includes(tabParam) ? tabParam : 'pending';

  const [activeTab,          setActiveTab]          = useState<string>(initialTab);
  const [selectedAppointment,setSelectedAppointment]= useState<Appointment | null>(null);
  const [cancelModalOpen,    setCancelModalOpen]    = useState(false);
  const [cancelTargetId,     setCancelTargetId]     = useState<string | null>(null);
  const [tokenReady,         setTokenReady]         = useState(false);

  /**
   * Read the shared search query from the dashboard context.
   *
   * The topbar writes to this context whenever the user types.
   * This page reads it and uses it to filter the appointments list below.
   * No props, no callbacks — just read the context and filter.
   *
   * Fields searched:
   *   - Provider name  (e.g. "Dr. Smith")
   *   - Appointment type (e.g. "cleaning", "emergency")
   *   - Appointment date (e.g. "March", "2026")
   */
  const { query } = useDashboardSearch();

  /**
   * Date filter state:
   *   dropdownOpen — controls the custom date dropdown visibility
   *   pickedDate   — date selected inside the dropdown (not yet applied), "YYYY-MM-DD"
   *   appliedDate  — the date actively filtering the current tab (null = no filter)
   */
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pickedDate,   setPickedDate]   = useState<string>('');
  const [appliedDate,  setAppliedDate]  = useState<Date | null>(null);
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

  // Close the date dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const { data, loading, refetch } = useQuery<{ myAppointments: Appointment[] }>(
    GET_MY_APPOINTMENTS,
    { fetchPolicy: 'cache-and-network', skip: !tokenReady },
  );

  const [cancelMutation, { loading: cancelling }] = useMutation(CANCEL_APPOINTMENT, {
    onCompleted: () => {
      notifications.show({ title: 'Appointment Cancelled', message: 'Your appointment has been cancelled.', color: 'green' });
      setCancelModalOpen(false);
      setCancelTargetId(null);
      setSelectedAppointment(null);
      void refetch();
    },
    onError: (err) => notifications.show({ title: 'Error', message: err.message, color: 'red' }),
  });

  const appointments = data?.myAppointments ?? [];

  /**
   * matchesSearch — returns true if the appointment matches the current
   * search query typed in the topbar.
   *
   * Searches across:
   *   - Provider name  → "Dr. Smith", "City Dental"
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
      a.providerName.toLowerCase().includes(q) ||
      formatType(a.type).toLowerCase().includes(q) ||
      new Date(a.appointmentDate).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      }).toLowerCase().includes(q)
    );
  }

  /** Returns true if the appointment falls on the appliedDate (or no filter is set). */
  function matchesAppliedDate(a: Appointment): boolean {
    if (!appliedDate) return true;
    const d = new Date(a.appointmentDate);
    return (
      d.getFullYear() === appliedDate.getFullYear() &&
      d.getMonth()    === appliedDate.getMonth()    &&
      d.getDate()     === appliedDate.getDate()
    );
  }

  const byTab = {
    pending:   appointments.filter((a) => getTab(a) === 'pending'   && matchesAppliedDate(a) && matchesSearch(a)).sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()),
    upcoming:  appointments.filter((a) => getTab(a) === 'upcoming'  && matchesAppliedDate(a) && matchesSearch(a)).sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()),
    past:      appointments.filter((a) => getTab(a) === 'past'      && matchesAppliedDate(a) && matchesSearch(a)).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()),
    cancelled: appointments.filter((a) => getTab(a) === 'cancelled' && matchesAppliedDate(a) && matchesSearch(a)).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()),
  };

  function handleCancelClick(id: string) {
    setCancelTargetId(id);
    setCancelModalOpen(true);
  }

  function confirmCancel() {
    if (!cancelTargetId) return;
    void cancelMutation({ variables: { input: { appointmentId: cancelTargetId, cancellationReason: 'Cancelled by patient' } } });
  }

  function handleReschedule(appointment: Appointment) {
    sessionStorage.setItem('rescheduleAppointmentId',   appointment.id);
    sessionStorage.setItem('rescheduleProviderId',      appointment.providerId);
    sessionStorage.setItem('rescheduleProviderName',    appointment.providerName);
    sessionStorage.setItem('rescheduleProviderSpecialty', appointment.providerSpecialty);
    sessionStorage.setItem('rescheduleProviderAddress', appointment.providerAddress ?? '');
    sessionStorage.setItem('rescheduleProviderPhone',   appointment.providerPhone ?? '');
    sessionStorage.setItem('rescheduleAppointmentDate', appointment.appointmentDate);
    sessionStorage.setItem('rescheduleAppointmentTime', appointment.appointmentTime);
    sessionStorage.setItem('rescheduleAppointmentType', appointment.type);
    if (appointment.oralIQData) sessionStorage.setItem('rescheduleOralIQData', JSON.stringify(appointment.oralIQData));
    router.push('/patient/oral-iq?reschedule=true');
  }

  function handleApplyFilter() {
    if (!pickedDate) return;
    const [year, month, day] = pickedDate.split('-').map(Number);
    setAppliedDate(new Date(year!, month! - 1, day!));
    setDropdownOpen(false);
  }

  function handleClearFilter() {
    setAppliedDate(null);
    setPickedDate('');
    setDropdownOpen(false);
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
    { value: 'pending',   label: 'Pending Requests', count: byTab.pending.length },
    { value: 'upcoming',  label: 'Upcoming',          count: byTab.upcoming.length },
    { value: 'past',      label: 'Past',               count: byTab.past.length },
    { value: 'cancelled', label: 'Cancelled',          count: byTab.cancelled.length },
  ];

  const currentList = byTab[activeTab as keyof typeof byTab] ?? [];

  return (
    <Box>
      {/* ── Header ── */}
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={4}>
          <Title order={2} fw={700} c="#1e293b" fz={22}>My Appointments</Title>
          <Text size="sm" c="dimmed">Track and manage your dental appointments</Text>
        </Stack>
        <Group gap="sm">

          {/* Date filter */}
          <Box style={{ position: 'relative' }} ref={dateDropdownRef}>
            <Button
              variant={appliedDate ? 'filled' : 'outline'}
              color={appliedDate ? 'teal' : 'gray'}
              size="sm"
              leftSection={<Calendar size={14} />}
              onClick={() => { if (appliedDate) handleClearFilter(); else setDropdownOpen((o) => !o); }}
            >
              {appliedDate
                ? `Clear filter: ${appliedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : 'Go to date'}
            </Button>

            {dropdownOpen && (
              <Box style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 200,
                backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)', padding: '14px 16px', minWidth: 240,
              }}>
                <Text size="xs" fw={600} c="#374151" mb={8}>Select a date</Text>
                <input type="date" value={pickedDate} onChange={(e) => setPickedDate(e.target.value)} autoFocus
                  style={{ display: 'block', width: '100%', padding: '7px 10px', borderRadius: 6,
                    border: '1px solid #cbd5e1', fontSize: 14, color: '#1e293b',
                    backgroundColor: '#f8fafc', outline: 'none', cursor: 'pointer', marginBottom: 10 }} />
                <Group gap="sm">
                  <Button size="xs" color="teal" disabled={!pickedDate} onClick={handleApplyFilter} style={{ flex: 1 }}>Filter</Button>
                  <Button size="xs" variant="subtle" color="gray" onClick={() => { setPickedDate(''); setDropdownOpen(false); }} style={{ flex: 1 }}>Clear</Button>
                </Group>
              </Box>
            )}
          </Box>

          <Button bg={colors.primary[5]} leftSection={<Plus size={16} />} onClick={() => router.push('/patient/oral-iq')}>
            New Appointment
          </Button>
        </Group>
      </Group>

      {/* ── Tabs + content card ── */}
      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden' }}>

        {/* Tab bar */}
        <Box px="lg" pt="lg">
          <Tabs value={activeTab} onChange={(v) => { setActiveTab(v ?? 'pending'); setSelectedAppointment(null); }}>
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

        {/* Count row */}
        <Box px="lg" py="md">
          <Text fw={600} size="md" c="#1e293b">
            {activeTab === 'pending' ? 'Pending Requests' : activeTab === 'upcoming' ? 'Upcoming Appointments' : activeTab === 'past' ? 'Past Appointments' : 'Cancelled Appointments'}
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
              <EmptyState tab={activeTab} onBook={() => router.push('/patient/oral-iq')} />
            ) : (
              currentList.map((a) => (
                <AppointmentRow
                  key={a.id}
                  appointment={a}
                  isSelected={selectedAppointment?.id === a.id}
                  onSelect={setSelectedAppointment}
                  onCancel={handleCancelClick}
                  isCancelling={cancelling && cancelTargetId === a.id}
                />
              ))
            )}
          </Box>

          {/* Detail panel — slides in when a row is selected */}
          {selectedAppointment && (
            <DetailPanel
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointment(null)}
              onCancel={handleCancelClick}
              onReschedule={(a) => { setSelectedAppointment(null); handleReschedule(a); }}
              isCancelling={cancelling}
            />
          )}
        </Box>

        {/* Footer count */}
        <Divider />
        <Box px="lg" py="md">
          <Text size="xs" c="#64748b">
            {currentList.length} appointment{currentList.length !== 1 ? 's' : ''} total
          </Text>
        </Box>
      </Box>

      {/* Cancel Confirmation Modal */}
      <Modal opened={cancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Cancel Appointment" centered size="sm">
        <Stack gap="md">
          <Text size="sm">Are you sure you want to cancel this appointment? This action cannot be undone.</Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={() => setCancelModalOpen(false)} disabled={cancelling}>Keep Appointment</Button>
            <Button color="red" onClick={confirmCancel} loading={cancelling}>Yes, Cancel</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
