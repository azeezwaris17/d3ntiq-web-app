'use client';

/**
 * AppointmentConfirmedStep
 *
 * Final step — shows the confirmation card matching the design.
 */

import { useState } from 'react';
import {
  Box, Text, Title, Stack, Group, Button, Switch,
} from '@mantine/core';
import { CheckCircle2, Mail, Smartphone } from 'lucide-react';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme';
import type { AppointmentBookingData } from './AppointmentBookingStep';

export interface AppointmentConfirmedStepProps {
  booking: AppointmentBookingData;
  onReschedule: () => void;
  onCancel: () => void;
  onViewAll: () => void;
}

export function AppointmentConfirmedStep({
  booking,
  onReschedule,
  onCancel,
  onViewAll,
}: AppointmentConfirmedStepProps) {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);

  const formattedDate = booking.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const ordinalDate = (() => {
    const d = booking.date.getDate();
    const suffix = d === 1 || d === 21 || d === 31 ? 'st' : d === 2 || d === 22 ? 'nd' : d === 3 || d === 23 ? 'rd' : 'th';
    return `${d}${suffix} of ${booking.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  })();

  return (
    <Box>
      <Stack gap={4} mb="xl">
        <Title order={3} fw={700} fz={22} c="#1e293b">Book an Appointment</Title>
        <Text size="sm" c="dimmed">Select a date and time for your appointment</Text>
      </Stack>

      <Box
        p={{ base: 'lg', md: 'xl' }}
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          backgroundColor: '#fff',
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        {/* Check icon */}
        <Box ta="center" mb="lg">
          <Box
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            <CheckCircle2 size={28} color={colors.primary[5]} />
          </Box>
        </Box>

        <Title order={3} ta="center" fw={700} c={colors.primary[5]} mb={8}>
          Appointment Confirmed
        </Title>
        <Text size="sm" ta="center" c="dimmed" mb="xl">
          You have successfully booked an appointment for the {ordinalDate}
        </Text>

        {/* Appointment details */}
        <Box
          p="md"
          style={{ border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 20 }}
        >
          <Group justify="space-between" align="flex-start" mb={8}>
            <Text size="sm" fw={600} c={colors.primary[5]}>Purpose for Appointment</Text>
            <Text size="sm" c="dimmed">{booking.appointmentType}</Text>
          </Group>
          {booking.provider.address && (
            <Text size="sm" c="#374151" mb={4}>{booking.provider.address}</Text>
          )}
          <Group gap={6}>
            <Text size="xs" c="dimmed">🕐</Text>
            <Text size="xs" c="dimmed">
              {formattedDate} at {booking.time}
            </Text>
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
              <Switch
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.currentTarget.checked)}
                color={colors.primary[5]}
              />
            </Group>
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <Smartphone size={16} color="#64748b" />
                <Text size="sm">SMS Notifications</Text>
              </Group>
              <Switch
                checked={smsNotif}
                onChange={(e) => setSmsNotif(e.currentTarget.checked)}
                color={colors.primary[5]}
              />
            </Group>
          </Stack>
        </Box>

        {/* Actions */}
        <Group gap="sm" mb="md">
          <Button
            style={{ flex: 1, backgroundColor: colors.primary[5] }}
            onClick={onReschedule}
          >
            Reschedule
          </Button>
          <Button
            variant="subtle"
            color="gray"
            style={{ flex: 1 }}
            onClick={onCancel}
          >
            Cancel Appointment
          </Button>
        </Group>

        <Button
          variant="outline"
          fullWidth
          color={colors.primary[5]}
          onClick={onViewAll}
        >
          View all appointments
        </Button>
      </Box>
    </Box>
  );
}
