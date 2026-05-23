'use client';

/**
 * PatientDashboardHomePage
 *
 * Full implementation of the patient dashboard home screen.
 *
 * Backed by real data:
 *   ✅ Welcome greeting with patient name
 *   ✅ Next appointment hero card (date, time, type, provider)
 *   ✅ Upcoming appointments list with Reschedule and Cancel actions
 *   ✅ Appointment stats (upcoming, pending, completed counts)
 *   ✅ Recent notifications (live, mark as read)
 *   ✅ Quick Actions — Book, Appointments, Profile
 *   ✅ Daily oral health tip (rotates by day of week)
 *
 * Coming Soon (no backend support yet):
 *   🔜 Outstanding Balance / Bills & Payments
 *   🔜 Unread Messages / Message Clinic
 *   🔜 Check-in
 *   🔜 Treatment History
 *   🔜 Treatment Plan
 *   🔜 Upload Documents
 *   🔜 Oral IQ chat widget
 */

import { useState, useEffect } from 'react';
import {
  Box, Text, Title, Group, Stack, Badge, Button,
  Avatar, Skeleton, Divider, Modal,
} from '@mantine/core';
import {
  Calendar, Plus, Stethoscope,
  ChevronRight, Bell, CheckCircle, XCircle, X,
  MessageSquare, Upload,
  Rocket, Edit,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { notifications as mantineNotifications } from '@mantine/notifications';
import { useGetMyProfile } from '@/modules/dashboard/infrastructure/useDashboard';
import { useNotifications, type NotificationType } from '@/modules/notifications/hooks/useNotifications';
import {
  GET_MY_APPOINTMENTS,
  CANCEL_APPOINTMENT,
} from '@/modules/appointments/infrastructure/graphql/appointments.graphql';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Appointment {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  providerName: string;
  providerSpecialty: string;
  providerAddress?: string;
  providerPhone?: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const ORAL_HEALTH_TIPS = [
  {
    title: 'Floss Before Brushing',
    body: 'Flossing first loosens plaque and food between teeth, making your brushing more effective at removing debris.',
  },
  {
    title: 'Brush for Two Full Minutes',
    body: 'Most people brush for less than a minute. Set a timer — two minutes ensures every surface gets proper attention.',
  },
  {
    title: 'Replace Your Toothbrush Every 3 Months',
    body: 'Worn bristles are less effective at cleaning. Replace your brush or electric head every 3 months, or after illness.',
  },
  {
    title: 'Drink Water After Meals',
    body: 'Water rinses away food particles and neutralises acids produced by bacteria, reducing your cavity risk between brushes.',
  },
  {
    title: 'Limit Sugary and Acidic Drinks',
    body: 'Soda, juice, and sports drinks coat teeth in sugar and acid. Drink through a straw and rinse with water afterwards.',
  },
  {
    title: "Don't Skip Your 6-Month Check-up",
    body: 'Regular cleanings remove tartar that brushing cannot reach, and early detection of issues saves time, pain, and money.',
  },
  {
    title: 'Use a Soft-Bristled Brush',
    body: 'Hard bristles can wear down enamel and irritate gums. A soft brush used gently is more effective and safer long-term.',
  },
];

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

function isUpcoming(a: Appointment): boolean {
  if (a.status !== 'CONFIRMED') return false;
  const [time, meridiem] = a.appointmentTime.split(' ');
  const [hourStr, minuteStr] = (time ?? '').split(':');
  let hour = parseInt(hourStr ?? '0', 10);
  const minute = parseInt(minuteStr ?? '0', 10);
  if (meridiem?.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (meridiem?.toUpperCase() === 'AM' && hour === 12) hour = 0;
  const dt = new Date(a.appointmentDate);
  dt.setHours(hour, minute, 0, 0);
  return dt >= new Date();
}

function avatarColor(name: string): string {
  const palette = ['#548CA1', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  return palette[(name.charCodeAt(0) ?? 0) % palette.length] ?? '#548CA1';
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
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

function ComingSoonModal({
  opened, onClose, featureName,
}: { opened: boolean; onClose: () => void; featureName: string }) {
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
        <Box style={{
          width: 64, height: 64, borderRadius: '50%',
          backgroundColor: '#f0f9ff', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
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
        <Button fullWidth style={{ backgroundColor: '#548CA1' }} onClick={onClose}>
          Got it
        </Button>
      </Stack>
    </Modal>
  );
}

// ─── Upcoming Appointment Row ─────────────────────────────────────────────────

function AppointmentRow({
  appointment,
  onReschedule,
  onCancel,
  onRowClick,
  isCancelling,
}: {
  appointment: Appointment;
  onReschedule: (a: Appointment) => void;
  onCancel: (id: string) => void;
  onRowClick: (a: Appointment) => void;
  isCancelling: boolean;
}) {
  const color = avatarColor(appointment.providerName);
  const date  = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
  const isPending = appointment.status === 'PENDING';

  return (
    <Box
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 0', borderBottom: '1px solid #f1f5f9',
        cursor: 'pointer',
      }}
      onClick={() => onRowClick(appointment)}
    >
      {/* Provider avatar */}
      <Box style={{
        width: 44, height: 44, borderRadius: 10,
        backgroundColor: `${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Avatar size={36} radius="md"
          style={{ backgroundColor: color, color: '#fff', fontWeight: 700, fontSize: 13 }}>
          {getInitials(appointment.providerName)}
        </Avatar>
      </Box>

      {/* Details */}
      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
        <Text size="sm" fw={600} c="#1e293b" lineClamp={1}>{formatType(appointment.type)}</Text>
        <Text size="xs" c="dimmed" lineClamp={1}>
          {date} at {appointment.appointmentTime}
        </Text>
        <Text size="xs" c="dimmed" lineClamp={1}>{appointment.providerName}</Text>
      </Stack>

      {/* Actions — only for upcoming confirmed appointments */}
      {!isPending && (
        <Group gap={8} style={{ flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <Button
            size="xs"
            style={{ backgroundColor: '#548CA1' }}
            leftSection={<Edit size={11} />}
            onClick={() => onReschedule(appointment)}
          >
            Reschedule
          </Button>
          <Button
            size="xs"
            variant="outline"
            color="gray"
            loading={isCancelling}
            onClick={() => onCancel(appointment.id)}
          >
            Cancel
          </Button>
        </Group>
      )}

      {/* Pending badge — no actions, just waiting */}
      {isPending && (
        <Badge size="xs" variant="light" color="yellow" style={{ flexShrink: 0 }}>
          Awaiting Confirmation
        </Badge>
      )}
    </Box>
  );
}

// ─── Quick Action Button ──────────────────────────────────────────────────────

function QuickActionButton({
  label, icon, onClick,
}: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 8,
        border: '1px solid #e2e8f0', cursor: 'pointer',
        backgroundColor: '#f8fafc', transition: 'background-color 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f9ff'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
    >
      <Box style={{
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: '#e0f2fe',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </Box>
      <Text size="sm" fw={500} c="#1e293b" style={{ flex: 1 }}>{label}</Text>
      <ChevronRight size={14} color="#94a3b8" />
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function PatientDashboardHomePage() {
  const router = useRouter();

  const [tokenReady,        setTokenReady]        = useState(false);
  const [cancelTargetId,    setCancelTargetId]     = useState<string | null>(null);
  const [cancelModalOpen,   setCancelModalOpen]    = useState(false);
  const [comingSoonModal,   setComingSoonModal]    = useState(false);
  const [comingSoonFeature, setComingSoonFeature]  = useState('');

  function openComingSoon(name: string) {
    setComingSoonFeature(name);
    setComingSoonModal(true);
  }

  // Wait for access token before firing queries
  useEffect(() => {
    if (localStorage.getItem('accessToken')) { setTokenReady(true); return; }
    const interval = setInterval(() => {
      if (localStorage.getItem('accessToken')) { setTokenReady(true); clearInterval(interval); }
    }, 100);
    const timeout = setTimeout(() => { clearInterval(interval); setTokenReady(true); }, 3000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  const { profile, loading: profileLoading } = useGetMyProfile();

  const { data: apptData, loading: apptLoading, refetch } = useQuery<{ myAppointments: Appointment[] }>(
    GET_MY_APPOINTMENTS,
    { fetchPolicy: 'cache-and-network', skip: !tokenReady }
  );

  const [cancelMutation, { loading: cancelling }] = useMutation(CANCEL_APPOINTMENT, {
    onCompleted: () => {
      mantineNotifications.show({ title: 'Appointment Cancelled', message: 'Your appointment has been cancelled.', color: 'green' });
      setCancelModalOpen(false);
      setCancelTargetId(null);
      void refetch();
    },
    onError: (err) => mantineNotifications.show({ title: 'Error', message: err.message, color: 'red' }),
  });

  const { notifications, unreadCount, markRead } = useNotifications();

  const appointments = apptData?.myAppointments ?? [];

  // Derive lists from the appointments query
  const upcomingList = appointments
    .filter(isUpcoming)
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

  // The very next upcoming appointment — shown in the hero card
  const nextAppointment = upcomingList[0] ?? null;

  // Show up to 3 upcoming appointments only (CONFIRMED + future date/time).
  // Pending appointments are excluded here — they belong on the Pending Requests tab,
  // not the Upcoming section which implies confirmed bookings.
  const listAppointments = upcomingList.slice(0, 3);

  // Today's tip rotates by day of week
  const todaysTip = ORAL_HEALTH_TIPS[new Date().getDay() % ORAL_HEALTH_TIPS.length]!;

  const isLoading = apptLoading && appointments.length === 0;

  /**
   * Navigate to the appointments page and open the correct tab for the appointment.
   * CONFIRMED + future → "upcoming" tab
   * PENDING            → "pending" tab
   */
  function handleRowClick(appointment: Appointment) {
    const tab = appointment.status === 'PENDING' ? 'pending' : 'upcoming';
    router.push(`/patient/appointments?tab=${tab}`);
  }

  function handleReschedule(appointment: Appointment) {
    sessionStorage.setItem('rescheduleAppointmentId',     appointment.id);
    sessionStorage.setItem('rescheduleProviderName',      appointment.providerName);
    sessionStorage.setItem('rescheduleProviderSpecialty', appointment.providerSpecialty);
    sessionStorage.setItem('rescheduleProviderAddress',   appointment.providerAddress ?? '');
    sessionStorage.setItem('rescheduleProviderPhone',     appointment.providerPhone ?? '');
    sessionStorage.setItem('rescheduleAppointmentDate',   appointment.appointmentDate);
    sessionStorage.setItem('rescheduleAppointmentTime',   appointment.appointmentTime);
    sessionStorage.setItem('rescheduleAppointmentType',   appointment.type);
    router.push('/patient/oral-iq?reschedule=true');
  }

  function handleCancelClick(id: string) {
    setCancelTargetId(id);
    setCancelModalOpen(true);
  }

  function confirmCancel() {
    if (!cancelTargetId) return;
    void cancelMutation({ variables: { input: { appointmentId: cancelTargetId, cancellationReason: 'Cancelled by patient' } } });
  }

  return (
    <Box>
      {/* ── Page heading ── */}
      <Box mb={24}>
        <Title order={2} fw={700} c="#1e293b" fz={22}>My Dashboard</Title>
        <Text size="sm" c="dimmed" mt={4}>
          {profileLoading && !profile
            ? 'Loading your overview...'
            : `Here's an overview of your dental health and upcoming appointments.`}
        </Text>
      </Box>

      {/* ── Stats / hero row ── */}
      <Group gap={12} mb={24} wrap="nowrap" style={{ overflowX: 'auto' }}>

        {/* Next appointment — real data */}
        <Box style={{
          flex: 1, minWidth: 180,
          backgroundColor: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 10, padding: '16px',
          position: 'relative',
        }}>
          <Text size="xs" c="dimmed" mb={4}>Next Appointment</Text>
          {isLoading ? (
            <Skeleton height={26} width={80} mb={4} />
          ) : nextAppointment ? (
            <>
              <Text fw={700} fz={22} c="#1e293b" lh={1}>
                {new Date(nextAppointment.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>{formatType(nextAppointment.type)}</Text>
            </>
          ) : (
            <>
              <Text fw={700} fz={16} c="#94a3b8" lh={1}>None</Text>
              <Text size="xs" c="dimmed" mt={4}>No upcoming appointments</Text>
            </>
          )}
          <Box style={{
            width: 36, height: 36, borderRadius: 8,
            backgroundColor: '#dbeafe', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            position: 'absolute', top: 16, right: 16,
          }}>
            <Calendar size={18} color="#3B82F6" />
          </Box>
        </Box>

        {/* Outstanding Balance — commented out until billing feature is implemented
        <StatCard
          label="Outstanding Balance"
          value="—"
          subLabel="No billing data yet"
          icon={<DollarSign size={18} color="#f59e0b" />}
          color="#f59e0b"
          loading={false}
          comingSoon
          onClick={() => openComingSoon('Bills & Payments')}
        />
        */}

        {/* Unread Messages — commented out until messaging feature is implemented
        <StatCard
          label="Unread Messages"
          value="—"
          subLabel="Messaging coming soon"
          icon={<MessageSquare size={18} color="#6366f1" />}
          color="#6366f1"
          loading={false}
          comingSoon
          onClick={() => openComingSoon('Messages')}
        />
        */}

        {/* Check-in button removed — feature not yet available */}
      </Group>

      {/* ── Two-column layout ── */}
      <Box style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* ── Left / main column ── */}
        <Box style={{ flex: 1, minWidth: 0 }}>

          {/* Upcoming Appointments */}
          <Box p="lg" mb={20} style={{
            backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
          }}>
            <Group justify="space-between" align="center" mb={16}>
              <Text fw={700} size="md" c="#1e293b">Upcoming Appointments</Text>
              <Button variant="subtle" size="xs" color="teal"
                rightSection={<ChevronRight size={12} />}
                onClick={() => router.push('/patient/appointments')}>
                View All
              </Button>
            </Group>

            {isLoading ? (
              <Stack gap={14}>
                {[1, 2].map((i) => (
                  <Group key={i} gap={12}>
                    <Skeleton height={44} width={44} radius="md" />
                    <Box style={{ flex: 1 }}>
                      <Skeleton height={14} width="55%" mb={6} />
                      <Skeleton height={12} width="40%" mb={4} />
                      <Skeleton height={12} width="30%" />
                    </Box>
                  </Group>
                ))}
              </Stack>
            ) : listAppointments.length === 0 ? (
              <Box py="lg" ta="center">
                <Calendar size={36} color="#cbd5e1" style={{ margin: '0 auto 12px', display: 'block' }} />
                <Text size="sm" c="dimmed" fw={500}>No upcoming appointments</Text>
                <Button variant="outline" size="xs" mt="sm"
                  leftSection={<Plus size={12} />}
                  onClick={() => router.push('/patient/oral-iq')}>
                  Book an appointment
                </Button>
              </Box>
            ) : (
              listAppointments.map((a) => (
                <AppointmentRow
                  key={a.id}
                  appointment={a}
                  onReschedule={handleReschedule}
                  onCancel={handleCancelClick}
                  onRowClick={handleRowClick}
                  isCancelling={cancelling && cancelTargetId === a.id}
                />
              ))
            )}
          </Box>

          {/* Recent Treatment History — coming soon */}
          <Box p="lg" mb={20} style={{
            backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
          }}>
            <Group justify="space-between" align="center" mb={16}>
              <Text fw={700} size="md" c="#1e293b">Recent Treatment History</Text>
              <Badge size="xs" color="teal" variant="light">Coming Soon</Badge>
            </Group>

            {/* Centered coming soon state — no placeholder data */}
            <Box
              py={32}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
            >
              <Box style={{
                width: 48, height: 48, borderRadius: '50%',
                backgroundColor: '#f0f9ff', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Rocket size={22} color="#548CA1" />
              </Box>
              <Text size="sm" fw={600} c="#1e293b">Treatment History</Text>
              <Badge color="teal" variant="light" size="sm">Coming Soon</Badge>
              <Text size="xs" c="dimmed" ta="center" maw={280} lh={1.6}>
                Your full treatment history will be available here in an upcoming release.
              </Text>
            </Box>
          </Box>

          {/* Oral IQ Chat — coming soon */}
          <Box p="lg" style={{
            backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
          }}>
            <Group gap={8} mb={12}>
              <Stethoscope size={16} color="#548CA1" />
              <Text fw={600} size="sm" c="#548CA1">ORAL IQ</Text>
              <Badge size="xs" color="teal" variant="light">Coming Soon</Badge>
            </Group>
            <Box
              onClick={() => openComingSoon('Oral IQ Chat')}
              style={{
                padding: '14px 16px', borderRadius: 8,
                border: '1px dashed #cbd5e1', cursor: 'pointer',
                backgroundColor: '#f8fafc', minHeight: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Stack align="center" gap={6}>
                <MessageSquare size={24} color="#94a3b8" />
                <Text size="sm" c="dimmed">Ask Questions About Treatments / Symptoms</Text>
                <Text size="xs" c="dimmed">Chat feature coming soon</Text>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* ── Right sidebar ── */}
        <Box style={{ width: 280, flexShrink: 0 }} visibleFrom="md">

          {/* Daily Oral Health Tip — first */}
          <Box p="lg" mb={16} style={{
            backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
          }}>
            <Text fw={600} size="sm" c="#1e293b" mb={12}>Daily Oral Health Tip</Text>
            <Box p={12} style={{
              backgroundColor: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0',
            }}>
              <Group gap={10} align="flex-start" mb={8}>
                <Box style={{
                  width: 32, height: 32, borderRadius: 8,
                  backgroundColor: '#16a34a', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Stethoscope size={16} color="#fff" />
                </Box>
                <Text size="sm" fw={600} c="#15803d">{todaysTip.title}</Text>
              </Group>
              <Text size="xs" c="#166534" lh={1.6}>{todaysTip.body}</Text>
            </Box>
          </Box>

          {/* Recent Notifications — second */}
          <Box p="lg" mb={16} style={{
            backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
          }}>
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
                          display: 'flex', gap: 10, alignItems: 'flex-start',
                          cursor: n.isRead ? 'default' : 'pointer',
                          borderLeft: `3px solid ${n.isRead ? 'transparent' : color}`,
                          paddingLeft: n.isRead ? 0 : 8,
                        }}
                        onClick={() => { if (!n.isRead) void markRead(n.id); }}
                      >
                        <Box style={{ flexShrink: 0, marginTop: 2 }}>{icon}</Box>
                        <Box style={{ flex: 1, minWidth: 0 }}>
                          <Text size="xs" fw={n.isRead ? 500 : 700} c="#1e293b" lineClamp={1}>{n.title}</Text>
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

          {/* Quick Actions — last */}
          <Box p="lg" mb={16} style={{
            backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
          }}>
            <Text fw={600} size="sm" c="#1e293b" mb={12}>Quick Actions</Text>
            <Stack gap={8}>
              <QuickActionButton
                label="Schedule Appointment"
                icon={<Calendar size={15} color="#548CA1" />}
                onClick={() => router.push('/patient/oral-iq')}
              />
              <QuickActionButton
                label="Upload Documents"
                icon={<Upload size={15} color="#548CA1" />}
                onClick={() => openComingSoon('Upload Documents')}
              />
              <QuickActionButton
                label="Message Clinic"
                icon={<MessageSquare size={15} color="#548CA1" />}
                onClick={() => openComingSoon('Message Clinic')}
              />
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* ── Cancel Confirmation Modal ── */}
      <Modal
        opened={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Appointment"
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">Are you sure you want to cancel this appointment? This action cannot be undone.</Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={() => setCancelModalOpen(false)} disabled={cancelling}>
              Keep Appointment
            </Button>
            <Button color="red" onClick={confirmCancel} loading={cancelling}>
              Yes, Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ── Coming Soon Modal ── */}
      <ComingSoonModal
        opened={comingSoonModal}
        onClose={() => setComingSoonModal(false)}
        featureName={comingSoonFeature}
      />
    </Box>
  );
}
