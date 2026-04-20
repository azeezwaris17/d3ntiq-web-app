'use client';

/**
 * AppointmentReviewStep
 *
 * Summary step before final confirmation.
 * Shows oral-iq data, selected provider, and appointment details.
 */

import {
  Box, Text, Title, Stack, Group, Button, Divider,
} from '@mantine/core';
import { Calendar, Clock, User, MapPin, Phone, Stethoscope } from 'lucide-react';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme';
import type { AppointmentBookingData } from './AppointmentBookingStep';

export interface AppointmentReviewStepProps {
  booking: AppointmentBookingData;
  oralIQSummary: {
    selectedAreas: string[];
    symptomType: string;
    painLevel?: number | null;
    duration: string;
    conditions: string[];
  };
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
  confirmLabel?: string;
}

export function AppointmentReviewStep({
  booking,
  oralIQSummary,
  onConfirm,
  onBack,
  isLoading = false,
  confirmLabel = 'Confirm Appointment',
}: AppointmentReviewStepProps) {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  const formattedDate = booking.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box>
      <Stack gap={4} mb="xl">
        <Title order={3} fw={700} fz={22} c="#1e293b">Review Appointment</Title>
        <Text size="sm" c="dimmed">Please review all details before confirming your appointment</Text>
      </Stack>

      <Box
        p={{ base: 'lg', md: 'xl' }}
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          backgroundColor: '#fff',
        }}
      >
        <Stack gap="xl">
          {/* Oral IQ Summary */}
          <Box>
            <Group gap="sm" mb="md">
              <Stethoscope size={18} color={colors.primary[5]} />
              <Text fw={600} size="sm" c={colors.primary[5]}>Symptom Assessment</Text>
            </Group>
            <Box p="md" bg="#f8fafc" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <Stack gap="sm">
                <Stack gap={2}>
                  <Text size="xs" fw={600} c="dimmed">Selected Areas:</Text>
                  <Text size="xs">{oralIQSummary.selectedAreas.join(', ')}</Text>
                </Stack>
                <Stack gap={2}>
                  <Text size="xs" fw={600} c="dimmed">Symptom Type:</Text>
                  <Text size="xs">{oralIQSummary.symptomType}</Text>
                </Stack>
                {oralIQSummary.painLevel !== null && oralIQSummary.painLevel !== undefined && (
                  <Stack gap={2}>
                    <Text size="xs" fw={600} c="dimmed">Pain Level:</Text>
                    <Text size="xs">{oralIQSummary.painLevel}/10</Text>
                  </Stack>
                )}
                <Stack gap={2}>
                  <Text size="xs" fw={600} c="dimmed">Duration:</Text>
                  <Text size="xs">{oralIQSummary.duration}</Text>
                </Stack>
                {oralIQSummary.conditions.length > 0 && (
                  <Stack gap={2}>
                    <Text size="xs" fw={600} c="dimmed">AI Matched Conditions:</Text>
                    <Text size="xs">{oralIQSummary.conditions.join(', ')}</Text>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Box>

          <Divider />

          {/* Provider Details */}
          <Box>
            <Group gap="sm" mb="md">
              <User size={18} color={colors.primary[5]} />
              <Text fw={600} size="sm" c={colors.primary[5]}>Provider Details</Text>
            </Group>
            <Box p="md" bg="#f8fafc" style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <Stack gap="sm">
                <Text size="sm" fw={700} c="#1e293b">{booking.provider.name}</Text>
                <Text size="xs" c={colors.primary[5]}>{booking.provider.specialty}</Text>
                {booking.provider.address && (
                  <Group gap="xs">
                    <MapPin size={14} color="#64748b" />
                    <Text size="xs" c="dimmed">{booking.provider.address}</Text>
                  </Group>
                )}
                {booking.provider.phone && (
                  <Group gap="xs">
                    <Phone size={14} color="#64748b" />
                    <Text size="xs" c="dimmed">{booking.provider.phone}</Text>
                  </Group>
                )}
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
                <Group gap="xs">
                  <Calendar size={14} color="#64748b" />
                  <Text size="xs">{formattedDate}</Text>
                </Group>
                <Group gap="xs">
                  <Clock size={14} color="#64748b" />
                  <Text size="xs">{booking.time}</Text>
                </Group>
                <Group gap="xs">
                  <Text size="xs" fw={600} c="dimmed">Type:</Text>
                  <Text size="xs">{booking.appointmentType}</Text>
                </Group>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Navigation */}
      <Group justify="space-between" mt="xl">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>Back</Button>
        <Button
          bg={colors.primary[5]}
          onClick={onConfirm}
          loading={isLoading}
          loaderProps={{ type: 'oval' }}
        >
          {isLoading ? 'Processing...' : confirmLabel}
        </Button>
      </Group>
    </Box>
  );
}
