'use client';

/**
 * AppointmentBookingStep
 *
 * Step 6 of the dashboard Oral IQ wizard.
 * Dual-month calendar + time slot picker + appointment type selector.
 * Matches the "Book an Appointment" UI design.
 */

import { useState } from 'react';
import {
  Box, Text, Title, Stack, Group, Button, SimpleGrid, UnstyledButton,
} from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme';
import type { SelectedProvider } from '@/modules/oral-iq/presentation/OralIQPage';

export interface AppointmentBookingData {
  provider: SelectedProvider;
  date: Date;
  time: string;
  appointmentType: 'Routine Cleaning' | 'Follow-up' | 'Symptom';
}

export interface AppointmentBookingStepProps {
  provider: SelectedProvider;
  onConfirm: (data: AppointmentBookingData) => void;
  onBack: () => void;
  /** Pre-fill with existing appointment data (reschedule mode) */
  initialDate?: Date;
  initialTime?: string;
  initialType?: typeof APPOINTMENT_TYPES[number];
  /** If true, shows "Reschedule" instead of "Next" */
  isReschedule?: boolean;
}

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '1:00 PM',
  '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
];

const APPOINTMENT_TYPES = ['Routine Cleaning', 'Follow-up', 'Symptom'] as const;

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface MonthCalendarProps {
  year: number;
  month: number;
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  minDate: Date;
}

function MonthCalendar({ year, month, selectedDate, onSelect, minDate }: MonthCalendarProps) {
  const theme = useMantineTheme();
  const colors = themeColors(theme);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <Box style={{ flex: 1, minWidth: 220 }}>
      <Text fw={600} size="sm" ta="center" mb="sm">
        {MONTH_NAMES[month]} {year}
      </Text>
      <SimpleGrid cols={7} spacing={2}>
        {DAYS.map((d, i) => (
          <Text key={i} size="xs" fw={600} c="dimmed" ta="center" py={4}>{d}</Text>
        ))}
        {cells.map((day, idx) => {
          if (!day) return <Box key={idx} />;
          const date = new Date(year, month, day);
          date.setHours(0, 0, 0, 0);
          const isPast = date < minDate;
          const isSelected =
            selectedDate &&
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === day;
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          return (
            <UnstyledButton
              key={idx}
              disabled={isPast}
              onClick={() => !isPast && onSelect(date)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                margin: '0 auto',
                backgroundColor: isSelected
                  ? colors.primary[5]
                  : isToday
                  ? '#e0f2fe'
                  : 'transparent',
                color: isSelected ? '#fff' : isPast ? '#cbd5e1' : '#1e293b',
                fontWeight: isSelected || isToday ? 700 : 400,
                fontSize: 13,
                cursor: isPast ? 'not-allowed' : 'pointer',
              }}
            >
              {day}
            </UnstyledButton>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

export function AppointmentBookingStep({ provider, onConfirm, onBack, initialDate, initialTime, initialType, isReschedule = false }: AppointmentBookingStepProps) {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start calendar at the month of the initial date (or current month)
  const [calendarStart, setCalendarStart] = useState(() => {
    const d = initialDate || new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);
  const [selectedTime, setSelectedTime] = useState<string | null>(initialTime || null);
  const [appointmentType, setAppointmentType] = useState<typeof APPOINTMENT_TYPES[number]>(initialType || 'Symptom');

  // Track if user changed anything from the initial values
  const hasChanged = isReschedule && (
    selectedDate?.toDateString() !== initialDate?.toDateString() ||
    selectedTime !== initialTime ||
    appointmentType !== initialType
  );

  // Second month is always one ahead of first
  const secondMonth = calendarStart.month === 11
    ? { year: calendarStart.year + 1, month: 0 }
    : { year: calendarStart.year, month: calendarStart.month + 1 };

  function prevMonth() {
    setCalendarStart((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  }

  function nextMonth() {
    setCalendarStart((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  }

  const canGoBack = new Date(calendarStart.year, calendarStart.month, 1) > today;

  function handleConfirm() {
    if (!selectedDate || !selectedTime) return;
    onConfirm({ provider, date: selectedDate, time: selectedTime, appointmentType });
  }

  const isReady = selectedDate && selectedTime;

  return (
    <Box>
      <Stack gap={4} mb="xl">
        <Title order={3} fw={700} fz={22} c="#1e293b">Book an Appointment</Title>
        <Text size="sm" c="dimmed">Select a date and time for your appointment with {provider.name}</Text>
      </Stack>

      <Box
        p={{ base: 'md', md: 'xl' }}
        style={{ border: '1px solid #e2e8f0', borderRadius: 12, backgroundColor: '#fff' }}
      >
        {/* Dual calendar — stacks vertically on mobile */}
        <Group justify="space-between" align="flex-start" mb="xl" wrap="nowrap">
          <UnstyledButton onClick={prevMonth} disabled={!canGoBack} style={{ color: canGoBack ? '#1e293b' : '#cbd5e1', marginTop: 4 }}>
            <ChevronLeft size={20} />
          </UnstyledButton>

          <Group gap="xl" align="flex-start" style={{ flex: 1, justifyContent: 'center' }} wrap="wrap">
            <MonthCalendar
              year={calendarStart.year}
              month={calendarStart.month}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              minDate={today}
            />
            {/* Second month hidden on mobile — user navigates with arrows instead */}
            <Box visibleFrom="sm">
              <MonthCalendar
                year={secondMonth.year}
                month={secondMonth.month}
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                minDate={today}
              />
            </Box>
          </Group>

          <UnstyledButton onClick={nextMonth} style={{ color: '#1e293b', marginTop: 4 }}>
            <ChevronRight size={20} />
          </UnstyledButton>
        </Group>

        {/* Time slots */}
        <Box mb="xl">
          <Text fw={600} size="sm" mb="sm">Available Times</Text>
          <Group gap="sm" wrap="wrap">
            {TIME_SLOTS.map((slot) => (
              <UnstyledButton
                key={slot}
                onClick={() => setSelectedTime(slot)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: `1px solid ${selectedTime === slot ? colors.primary[5] : '#e2e8f0'}`,
                  backgroundColor: selectedTime === slot ? '#f0f9ff' : '#fff',
                  color: selectedTime === slot ? colors.primary[5] : '#374151',
                  fontWeight: selectedTime === slot ? 600 : 400,
                  fontSize: 13,
                }}
              >
                {slot}
              </UnstyledButton>
            ))}
          </Group>
        </Box>

        {/* Appointment type */}
        <Box mb="xl">
          <Text fw={600} size="sm" mb="sm">Appointment Type</Text>
          <Group gap="sm">
            {APPOINTMENT_TYPES.map((type) => (
              <Button
                key={type}
                size="sm"
                variant={appointmentType === type ? 'filled' : 'outline'}
                style={{
                  backgroundColor: appointmentType === type ? colors.primary[5] : 'transparent',
                  borderColor: appointmentType === type ? colors.primary[5] : '#e2e8f0',
                  color: appointmentType === type ? '#fff' : '#374151',
                }}
                onClick={() => setAppointmentType(type)}
              >
                {type}
              </Button>
            ))}
          </Group>
        </Box>

        {/* Selected summary */}
        {selectedDate && selectedTime && (
          <Box p="sm" bg="#f0f9ff" style={{ borderRadius: 8, border: '1px solid #bae6fd', marginBottom: 16 }}>
            <Text size="xs" fw={600} c={colors.primary[5]}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedTime}
            </Text>
            <Text size="xs" c="dimmed" mt={2}>{provider.name} · {appointmentType}</Text>
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <Group justify="space-between" mt="xl">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button
          bg={colors.primary[5]}
          disabled={!isReady}
          onClick={handleConfirm}
        >
          {isReschedule ? (hasChanged ? 'Reschedule' : 'Next') : 'Next'}
        </Button>
      </Group>
    </Box>
  );
}
