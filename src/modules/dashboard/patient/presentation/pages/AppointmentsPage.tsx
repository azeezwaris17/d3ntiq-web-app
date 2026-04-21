'use client';

import { useState, useEffect } from 'react';
import {
  Box, Text, Title, Stack, Group, Button, Tabs, Badge, Divider,
  Menu, ActionIcon, Modal, Loader, SimpleGrid,
} from '@mantine/core';
import {
  Calendar, Clock, MapPin, Phone, MoreVertical, Edit, X, CheckCircle,
  AlertCircle, ChevronRight, Plus, ChevronLeft, Stethoscope, User,
} from 'lucide-react';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme/mantine-theme';
import { useQuery, useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import {
  GET_MY_APPOINTMENTS,
  CANCEL_APPOINTMENT,
} from '@/modules/appointments/infrastructure/graphql/appointments.graphql';
import { notifications } from '@mantine/notifications';

interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  appointmentDate: string;
  appointmentTime: string;
  type: 'ROUTINE_CLEANING' | 'FOLLOW_UP' | 'SYMPTOM' | 'EMERGENCY' | 'CONSULTATION';
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  providerName: string;
  providerSpecialty: string;
  providerAddress?: string;
  providerPhone?: string;
  oralIQData?: any;
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

function formatAppointmentType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

// ─── Appointment Card ─────────────────────────────────────────────────────────

interface AppointmentCardProps {
  appointment: Appointment;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (id: string) => void;
  onViewDetails: (appointment: Appointment) => void;
}

function AppointmentCard({ appointment, onReschedule, onCancel, onViewDetails }: AppointmentCardProps) {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  const isUpcoming = appointment.status === 'PENDING' || appointment.status === 'CONFIRMED';
  const isPast = appointment.status === 'COMPLETED';
  const isCancelled = appointment.status === 'CANCELLED';
  const statusLabel = appointment.status.toLowerCase().replace(/_/g, ' ');
  const statusIcon = isUpcoming ? <CheckCircle size={14} /> : isCancelled ? <X size={14} /> : <AlertCircle size={14} />;

  return (
    <Box
      p="lg"
      style={{
        border: '1px solid #e2e8f0', borderRadius: 12, backgroundColor: '#fff',
        transition: 'all 0.2s ease', cursor: 'pointer',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = colors.primary[5]; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
      onClick={() => onViewDetails(appointment)}
    >
      <Group justify="space-between" align="flex-start" mb="md">
        <Stack gap={2}>
          <Text fw={700} size="sm" c="#1e293b">{appointment.providerName}</Text>
          <Text size="xs" c={colors.primary[5]}>{appointment.providerSpecialty}</Text>
        </Stack>
        <Group gap="xs">
          <Badge size="sm" variant="light" color={isUpcoming ? 'blue' : isPast ? 'gray' : 'red'} leftSection={statusIcon} style={{ textTransform: 'capitalize' }}>
            {statusLabel}
          </Badge>
          {isUpcoming && (
            <Menu position="bottom-end" shadow="md">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<Edit size={14} />} onClick={(e) => { e.stopPropagation(); onReschedule?.(appointment); }}>
                  Reschedule
                </Menu.Item>
                <Menu.Item leftSection={<X size={14} />} color="red" onClick={(e) => { e.stopPropagation(); onCancel?.(appointment.id); }}>
                  Cancel
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Group>

      <Stack gap="xs" mb="md">
        <Group gap="xs"><Calendar size={14} color="#64748b" /><Text size="xs" c="dimmed">{formattedDate}</Text></Group>
        <Group gap="xs"><Clock size={14} color="#64748b" /><Text size="xs" c="dimmed">{appointment.appointmentTime}</Text></Group>
        {appointment.providerAddress && <Group gap="xs"><MapPin size={14} color="#64748b" /><Text size="xs" c="dimmed" lineClamp={1}>{appointment.providerAddress}</Text></Group>}
        {appointment.providerPhone && <Group gap="xs"><Phone size={14} color="#64748b" /><Text size="xs" c="dimmed">{appointment.providerPhone}</Text></Group>}
      </Stack>

      <Divider mb="sm" />
      <Group justify="flex-end">
        <Group gap={4}>
          <Text size="xs" c={colors.primary[5]} fw={600}>View Details</Text>
          <ChevronRight size={14} color={colors.primary[5]} />
        </Group>
      </Group>
    </Box>
  );
}

// ─── Appointment Details View ─────────────────────────────────────────────────

interface AppointmentDetailsProps {
  appointment: Appointment;
  onBack: () => void;
  onCancelClick: (id: string) => void;
  onRescheduleClick: (appointment: Appointment) => void;
  isCancelling: boolean;
}

function AppointmentDetails({ appointment, onBack, onCancelClick, onRescheduleClick, isCancelling }: AppointmentDetailsProps) {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const isUpcoming = appointment.status === 'PENDING' || appointment.status === 'CONFIRMED';
  const oralIQ = appointment.oralIQData;
  const formData = oralIQ?.formData;
  const result = oralIQ?.result;
  const selectionLabels: string[] = oralIQ?.selectionLabels || [];
  const conditions: string[] = result?.matchedConditions?.map((c: any) => c.name) || [];

  return (
    <Box>
      <Group mb="xl">
        <Button variant="subtle" color="gray" leftSection={<ChevronLeft size={16} />} onClick={onBack} px={0}>
          Back to Appointments
        </Button>
      </Group>

      <Stack gap={4} mb="xl">
        <Title order={3} fw={700} fz={22} c="#1e293b">Appointment Details</Title>
        <Text size="sm" c="dimmed">Full details of your appointment</Text>
      </Stack>

      <Box p={{ base: 'lg', md: 'xl' }} style={{ border: '1px solid #e2e8f0', borderRadius: 12, backgroundColor: '#fff' }}>
        <Stack gap="xl">

          {/* Oral IQ Summary */}
          {oralIQ && (formData || conditions.length > 0) && (
            <Box>
              <Group gap="sm" mb="md">
                <Stethoscope size={18} color={colors.primary[5]} />
                <Text fw={600} size="sm" c={colors.primary[5]}>Symptom Assessment</Text>
              </Group>
              <Box p="md" bg="#f8fafc" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <Stack gap="sm">
                  {selectionLabels.length > 0 && (
                    <Group gap="xs">
                      <Text size="xs" fw={600} c="dimmed" style={{ minWidth: 130 }}>Selected Areas:</Text>
                      <Text size="xs">{selectionLabels.join(', ')}</Text>
                    </Group>
                  )}
                  {formData?.symptomTypes && formData.symptomTypes.length > 0 && (
                    <Group gap="xs">
                      <Text size="xs" fw={600} c="dimmed" style={{ minWidth: 130 }}>Symptom Types:</Text>
                      <Text size="xs">{formData.symptomTypes.map((s: string) => s.replace(/-/g, ' ')).join(', ')}</Text>
                    </Group>
                  )}
                  {formData?.painLevel != null && (
                    <Group gap="xs">
                      <Text size="xs" fw={600} c="dimmed" style={{ minWidth: 130 }}>Pain Level:</Text>
                      <Text size="xs">{formData.painLevel}/10</Text>
                    </Group>
                  )}
                  {formData?.duration && (
                    <Group gap="xs">
                      <Text size="xs" fw={600} c="dimmed" style={{ minWidth: 130 }}>Duration:</Text>
                      <Text size="xs">{formData.duration.replace(/-/g, ' ')}</Text>
                    </Group>
                  )}
                  {conditions.length > 0 && (
                    <Group gap="xs" align="flex-start">
                      <Text size="xs" fw={600} c="dimmed" style={{ minWidth: 130 }}>AI Matched Conditions:</Text>
                      <Text size="xs" style={{ flex: 1 }}>{conditions.join(', ')}</Text>
                    </Group>
                  )}
                </Stack>
              </Box>
            </Box>
          )}

          {oralIQ && <Divider />}

          {/* Provider Details */}
          <Box>
            <Group gap="sm" mb="md">
              <User size={18} color={colors.primary[5]} />
              <Text fw={600} size="sm" c={colors.primary[5]}>Provider Details</Text>
            </Group>
            <Box p="md" bg="#f8fafc" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <Stack gap="sm">
                <Text size="sm" fw={700} c="#1e293b">{appointment.providerName}</Text>
                <Text size="xs" c={colors.primary[5]}>{appointment.providerSpecialty}</Text>
                {appointment.providerAddress && <Group gap="xs"><MapPin size={14} color="#64748b" /><Text size="xs" c="dimmed">{appointment.providerAddress}</Text></Group>}
                {appointment.providerPhone && <Group gap="xs"><Phone size={14} color="#64748b" /><Text size="xs" c="dimmed">{appointment.providerPhone}</Text></Group>}
              </Stack>
            </Box>
          </Box>

          <Divider />

          {/* Appointment Details */}
          <Box>
            <Group gap="sm" mb="md">
              <Calendar size={18} color={colors.primary[5]} />
              <Text fw={600} size="sm" c={colors.primary[5]}>Appointment Details</Text>
            </Group>
            <Box p="md" bg="#f8fafc" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <Stack gap="sm">
                <Group gap="xs"><Calendar size={14} color="#64748b" /><Text size="xs">{formattedDate}</Text></Group>
                <Group gap="xs"><Clock size={14} color="#64748b" /><Text size="xs">{appointment.appointmentTime}</Text></Group>
                <Group gap="xs">
                  <Text size="xs" fw={600} c="dimmed">Type:</Text>
                  <Text size="xs">{formatAppointmentType(appointment.type)}</Text>
                </Group>
                <Group gap="xs">
                  <Text size="xs" fw={600} c="dimmed">Status:</Text>
                  <Badge size="xs" variant="light" color={isUpcoming ? 'blue' : appointment.status === 'COMPLETED' ? 'gray' : 'red'} style={{ textTransform: 'capitalize' }}>
                    {appointment.status.toLowerCase()}
                  </Badge>
                </Group>
              </Stack>
            </Box>
          </Box>

          {appointment.cancellationReason && (
            <>
              <Divider />
              <Box>
                <Text fw={600} size="sm" c="red" mb="sm">Cancellation Reason</Text>
                <Box p="md" bg="#fff5f5" style={{ borderRadius: 8, border: '1px solid #fecaca' }}>
                  <Text size="xs" c="dimmed">{appointment.cancellationReason}</Text>
                </Box>
              </Box>
            </>
          )}
        </Stack>
      </Box>

      {/* Bottom actions — on mobile only show Cancel + Reschedule (Back is at the top) */}
      {isUpcoming && (
        <Group justify="flex-end" mt="xl" gap="sm">
          <Button variant="light" color="blue" leftSection={<Edit size={16} />} onClick={() => onRescheduleClick(appointment)}>
            Reschedule
          </Button>
          <Button color="red" variant="light" leftSection={<X size={16} />} onClick={() => onCancelClick(appointment.id)} loading={isCancelling} loaderProps={{ type: 'oval' }}>
            {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
          </Button>
        </Group>
      )}
    </Box>
  );
}

// ─── Reschedule Modal ─────────────────────────────────────────────────────────

interface RescheduleModalProps {
  appointment: Appointment | null;
  opened: boolean;
  onClose: () => void;
  onConfirm: (appointment: Appointment) => void;
}

function RescheduleModal({ appointment, opened, onClose, onConfirm }: RescheduleModalProps) {
  if (!appointment) return null;
  return (
    <Modal opened={opened} onClose={onClose} title="Reschedule Appointment" centered>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          To reschedule your appointment with <strong>{appointment.providerName}</strong>, you'll be taken to the booking flow to select a new date and time.
        </Text>
        <Box p="md" bg="#f8fafc" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <Stack gap="xs">
            <Group gap="xs">
              <Calendar size={14} color="#64748b" />
              <Text size="xs" c="dimmed">
                {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
            </Group>
            <Group gap="xs">
              <Clock size={14} color="#64748b" />
              <Text size="xs" c="dimmed">{appointment.appointmentTime}</Text>
            </Group>
          </Stack>
        </Box>
        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={onClose}>Keep Current</Button>
          <Button bg="#548CA1" onClick={() => onConfirm(appointment)}>Proceed to Reschedule</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function PatientAppointmentsPage() {
  const theme = useMantineTheme();
  const colors = themeColors(theme);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [detailsAppointment, setDetailsAppointment] = useState<Appointment | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [tokenReady, setTokenReady] = useState(false);

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

  const { data: appointmentsData, loading: appointmentsLoading, refetch: refetchAppointments } = useQuery<{ myAppointments: Appointment[] }>(
    GET_MY_APPOINTMENTS, { fetchPolicy: 'cache-and-network', skip: !tokenReady }
  );

  const [cancelAppointmentMutation, { loading: cancelLoading }] = useMutation(CANCEL_APPOINTMENT, {
    onCompleted: () => {
      notifications.show({ title: 'Appointment Cancelled', message: 'Your appointment has been cancelled successfully', color: 'green' });
      setCancelModalOpen(false);
      setCancelAppointmentId(null);
      setDetailsAppointment(null);
      refetchAppointments();
    },
    onError: (error) => {
      notifications.show({ title: 'Error', message: error.message || 'Failed to cancel appointment', color: 'red' });
    },
  });

  const appointments: Appointment[] = appointmentsData?.myAppointments || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments.filter((a) => {
    const d = new Date(a.appointmentDate);
    return (a.status === 'PENDING' || a.status === 'CONFIRMED') && d >= today;
  });
  const pastAppointments = appointments.filter((a) => {
    const d = new Date(a.appointmentDate);
    return a.status === 'COMPLETED' || (d < today && a.status !== 'CANCELLED');
  });
  const cancelledAppointments = appointments.filter((a) => a.status === 'CANCELLED');

  function handleCancelClick(id: string) {
    setCancelAppointmentId(id);
    setCancelModalOpen(true);
  }

  function confirmCancel() {
    if (!cancelAppointmentId) return;
    cancelAppointmentMutation({
      variables: { input: { appointmentId: cancelAppointmentId, cancellationReason: 'Cancelled by patient' } },
    });
  }

  function handleRescheduleClick(appointment: Appointment) {
    setRescheduleAppointment(appointment);
    setRescheduleModalOpen(true);
  }

  function confirmReschedule(appointment: Appointment) {
    setRescheduleModalOpen(false);
    sessionStorage.setItem('rescheduleAppointmentId', appointment.id);
    sessionStorage.setItem('rescheduleProviderId', appointment.providerId);
    sessionStorage.setItem('rescheduleProviderName', appointment.providerName);
    sessionStorage.setItem('rescheduleProviderSpecialty', appointment.providerSpecialty);
    sessionStorage.setItem('rescheduleProviderAddress', appointment.providerAddress || '');
    sessionStorage.setItem('rescheduleProviderPhone', appointment.providerPhone || '');
    sessionStorage.setItem('rescheduleAppointmentDate', appointment.appointmentDate);
    sessionStorage.setItem('rescheduleAppointmentTime', appointment.appointmentTime);
    sessionStorage.setItem('rescheduleAppointmentType', appointment.type);
    if (appointment.oralIQData) {
      sessionStorage.setItem('rescheduleOralIQData', JSON.stringify(appointment.oralIQData));
    }
    router.push('/patient/oral-iq?reschedule=true');
  }

  if (appointmentsLoading) {
    return (
      <Box ta="center" py="xl">
        <Loader size="lg" />
        <Text size="sm" c="dimmed" mt="md">Loading appointments...</Text>
      </Box>
    );
  }

  // ── Details view ──
  if (detailsAppointment) {
    return (
      <>
        <AppointmentDetails
          appointment={detailsAppointment}
          onBack={() => setDetailsAppointment(null)}
          onCancelClick={handleCancelClick}
          onRescheduleClick={handleRescheduleClick}
          isCancelling={cancelLoading}
        />
        <Modal opened={cancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Cancel Appointment" centered>
          <Stack gap="md">
            <Text size="sm">Are you sure you want to cancel this appointment? This action cannot be undone.</Text>
            <Group justify="flex-end" gap="sm">
              <Button variant="outline" onClick={() => setCancelModalOpen(false)} disabled={cancelLoading}>Keep Appointment</Button>
              <Button color="red" onClick={confirmCancel} loading={cancelLoading}>Cancel Appointment</Button>
            </Group>
          </Stack>
        </Modal>
        <RescheduleModal appointment={rescheduleAppointment} opened={rescheduleModalOpen} onClose={() => setRescheduleModalOpen(false)} onConfirm={confirmReschedule} />
      </>
    );
  }

  // ── List view ──
  return (
    <Box>
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={4}>
          <Title order={2} fw={700} c="#1e293b" fz={22}>My Appointments</Title>
          <Text size="sm" c="dimmed">Manage your dental appointments</Text>
        </Stack>
        <Button bg={colors.primary[5]} leftSection={<Plus size={16} />} onClick={() => router.push('/patient/oral-iq')}>
          New Appointment
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={(v) => setActiveTab(v || 'upcoming')}>
        <Tabs.List
          mb="xl"
          style={{ overflowX: 'auto', flexWrap: 'nowrap' }}
        >
          <Tabs.Tab value="upcoming" leftSection={<Calendar size={16} />} style={{ fontWeight: activeTab === 'upcoming' ? 600 : 400 }}>
            Upcoming ({upcomingAppointments.length})
          </Tabs.Tab>
          <Tabs.Tab value="past" leftSection={<CheckCircle size={16} />} style={{ fontWeight: activeTab === 'past' ? 600 : 400 }}>
            Past ({pastAppointments.length})
          </Tabs.Tab>
          <Tabs.Tab value="cancelled" leftSection={<X size={16} />} style={{ fontWeight: activeTab === 'cancelled' ? 600 : 400 }}>
            Cancelled ({cancelledAppointments.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="upcoming">
          {upcomingAppointments.length === 0 ? (
            <Box p="xl" ta="center" style={{ border: '1px dashed #e2e8f0', borderRadius: 12, backgroundColor: '#f8fafc' }}>
              <Calendar size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <Text size="sm" fw={600} c="dimmed" mb="xs">No upcoming appointments</Text>
              <Text size="xs" c="dimmed" mb="lg">Book your next dental appointment to get started</Text>
              <Button variant="outline" leftSection={<Calendar size={16} />} onClick={() => router.push('/patient/oral-iq')}>Book Appointment</Button>
            </Box>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {upcomingAppointments.map((a) => (
                <AppointmentCard key={a.id} appointment={a} onReschedule={handleRescheduleClick} onCancel={handleCancelClick} onViewDetails={setDetailsAppointment} />
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="past">
          {pastAppointments.length === 0 ? (
            <Box p="xl" ta="center" style={{ border: '1px dashed #e2e8f0', borderRadius: 12, backgroundColor: '#f8fafc' }}>
              <CheckCircle size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <Text size="sm" fw={600} c="dimmed">No past appointments</Text>
              <Text size="xs" c="dimmed">Your completed appointments will appear here</Text>
            </Box>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {pastAppointments.map((a) => (
                <AppointmentCard key={a.id} appointment={a} onViewDetails={setDetailsAppointment} />
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="cancelled">
          {cancelledAppointments.length === 0 ? (
            <Box p="xl" ta="center" style={{ border: '1px dashed #e2e8f0', borderRadius: 12, backgroundColor: '#f8fafc' }}>
              <X size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <Text size="sm" fw={600} c="dimmed">No cancelled appointments</Text>
              <Text size="xs" c="dimmed">Your cancelled appointments will appear here</Text>
            </Box>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {cancelledAppointments.map((a) => (
                <AppointmentCard key={a.id} appointment={a} onViewDetails={setDetailsAppointment} />
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>
      </Tabs>

      <Modal opened={cancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Cancel Appointment" centered>
        <Stack gap="md">
          <Text size="sm">Are you sure you want to cancel this appointment? This action cannot be undone.</Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={() => setCancelModalOpen(false)} disabled={cancelLoading}>Keep Appointment</Button>
            <Button color="red" onClick={confirmCancel} loading={cancelLoading}>Cancel Appointment</Button>
          </Group>
        </Stack>
      </Modal>

      <RescheduleModal appointment={rescheduleAppointment} opened={rescheduleModalOpen} onClose={() => setRescheduleModalOpen(false)} onConfirm={confirmReschedule} />
    </Box>
  );
}
