'use client';

import { useState } from 'react';
import { Box, Text, Title, Stack, Group, Button, Switch } from '@mantine/core';
import { CalendarCheck, Mail, Smartphone } from 'lucide-react';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme';
import type { AppointmentBookingData } from './AppointmentBookingStep';

export interface AppointmentRescheduledStepProps {
  booking: AppointmentBookingData;
  onViewAll: () => void;
}

export function AppointmentRescheduledStep({ booking, onViewAll }: AppointmentRescheduledStepProps) {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);

  const formattedDate = booking.date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const d = booking.date.getDate();
  const suffix = d === 1 || d === 21 || d === 31 ? 'st' : d === 2 || d === 22 ? 'nd' : d === 3 || d === 23 ? 'rd' : 'th';
  const ordinalDate = `${d}${suffix} of ${booking.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

  return (
    <Box>
      <Stack gap={4} mb="xl">
        <Title order={3} fw={700} fz={22} c="#1e293b">Appointment Rescheduled</Title>
        <Text size="sm" c="dimmed">Your appointment has been successfully rescheduled</Text>
      </Stack>

      <Box
        p={{ base: 'lg', md: 'xl' }}
        style={{
          border: '1px solid #e2e8f0', borderRadius: 12, backgroundColor: '#fff',
          maxWidth: 560, margin: '0 auto',
        }}
      >
        {/* Icon */}
        <Box ta="center" mb="lg">
          <Box
            style={{
              width: 56, height: 56, borderRadius: '50%',
              backgroundColor: '#dcfce7',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
            }}
          >
            <CalendarCheck size={28} color="#16a34a" />
          </Box>
        </Box>

        <Title order={3} ta="center" fw={700} c="#16a34a" mb={8}>
          Appointment Rescheduled
        </Title>
        <Text size="sm" ta="center" c="dimmed" mb="xl">
          Your appointment has been rescheduled to the {ordinalDate}
        </Text>

        {/* New appointment details */}
        <Box p="md" style={{ border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 20 }}>
          <Group justify="space-between" align="flex-start" mb={8}>
            <Text size="sm" fw={600} c={colors.primary[5]}>Purpose for Appointment</Text>
            <Text size="sm" c="dimmed">{booking.appointmentType}</Text>
          </Group>
          {booking.provider.address && (
            <Text size="sm" c="#374151" mb={4}>{booking.provider.address}</Text>
          )}
          <Group gap={6}>
            <Text size="xs" c="dimmed">🕐</Text>
            <Text size="xs" c="dimmed">{formattedDate} at {booking.time}</Text>
          </Group>
        </Box>

        {/* Reminder preferences */}
        <Box mb="xl">
          <Text size="sm" fw={600} c={colors.primary[5]} mb="sm">Reminder Preferences</Text>
          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <Mail size={16} color="#64748b" />
                <Text size="sm">Email Notifications</Text>
              </Group>
              <Switch checked={emailNotif} onChange={(e) => setEmailNotif(e.currentTarget.checked)} color={colors.primary[5]} />
            </Group>
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <Smartphone size={16} color="#64748b" />
                <Text size="sm">SMS Notifications</Text>
              </Group>
              <Switch checked={smsNotif} onChange={(e) => setSmsNotif(e.currentTarget.checked)} color={colors.primary[5]} />
            </Group>
          </Stack>
        </Box>

        <Button variant="outline" fullWidth color={colors.primary[5]} onClick={onViewAll}>
          View all appointments
        </Button>
      </Box>
    </Box>
  );
}
