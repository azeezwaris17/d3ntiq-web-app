/**
 * DateOfBirthInput
 *
 * A clean date-of-birth selector using three dropdowns: Day, Month, Year.
 * Also accepts manual text entry in DD/MM/YYYY format via a text input toggle.
 *
 * Usage:
 *   <DateOfBirthInput value={dob} onChange={setDob} required />
 */
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Group, Select, Text, TextInput, ActionIcon, Tooltip } from '@mantine/core';
import { Keyboard } from 'lucide-react';

export interface DateOfBirthInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const MONTHS = [
  { value: '1',  label: 'January' },
  { value: '2',  label: 'February' },
  { value: '3',  label: 'March' },
  { value: '4',  label: 'April' },
  { value: '5',  label: 'May' },
  { value: '6',  label: 'June' },
  { value: '7',  label: 'July' },
  { value: '8',  label: 'August' },
  { value: '9',  label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const currentYear = new Date().getFullYear();

// Years from current year back to 1900
const YEARS = Array.from({ length: currentYear - 1899 }, (_, i) => {
  const y = currentYear - i;
  return { value: String(y), label: String(y) };
});

// Days 1–31 (filtered dynamically based on month/year)
function getDaysInMonth(month: number | null, year: number | null): number {
  if (!month) return 31;
  if (!year) return new Date(2000, month, 0).getDate();
  return new Date(year, month, 0).getDate();
}

function parseDDMMYYYY(input: string): Date | null {
  const parts = input.split('/');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y || y < 1900 || y > currentYear) return null;
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) return null;
  return date;
}

export const DateOfBirthInput: React.FC<DateOfBirthInputProps> = ({
  value,
  onChange,
  label = 'Birthday',
  required = false,
  disabled = false,
  error,
  size = 'md',
}) => {
  const [day, setDay] = useState<string | null>(value ? String(value.getDate()) : null);
  const [month, setMonth] = useState<string | null>(value ? String(value.getMonth() + 1) : null);
  const [year, setYear] = useState<string | null>(value ? String(value.getFullYear()) : null);
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [manualError, setManualError] = useState('');

  // Sync internal dropdowns when value is set externally (e.g. pre-fill from API)
  useEffect(() => {
    if (value) {
      setDay(String(value.getDate()));
      setMonth(String(value.getMonth() + 1));
      setYear(String(value.getFullYear()));
    }
  }, [value]);

  // Sync dropdowns → parent
  useEffect(() => {
    if (day && month && year) {
      const d = new Date(Number(year), Number(month) - 1, Number(day));
      if (!isNaN(d.getTime())) {
        onChange(d);
        return;
      }
    }
    onChange(null);
  }, [day, month, year]);

  // When month/year changes, reset day if it exceeds the new max
  const maxDay = getDaysInMonth(month ? Number(month) : null, year ? Number(year) : null);
  const dayOptions = Array.from({ length: maxDay }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1).padStart(2, '0'),
  }));

  // If selected day exceeds new max, reset it
  useEffect(() => {
    if (day && Number(day) > maxDay) setDay(null);
  }, [maxDay]);

  function handleManualChange(val: string) {
    setManualInput(val);
    setManualError('');

    // Auto-insert slashes
    const digits = val.replace(/\D/g, '');
    let formatted = digits;
    if (digits.length > 2) formatted = digits.slice(0, 2) + '/' + digits.slice(2);
    if (digits.length > 4) formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4, 8);
    setManualInput(formatted);

    if (formatted.length === 10) {
      const parsed = parseDDMMYYYY(formatted);
      if (parsed) {
        setDay(String(parsed.getDate()));
        setMonth(String(parsed.getMonth() + 1));
        setYear(String(parsed.getFullYear()));
        onChange(parsed);
        setManualError('');
      } else {
        setManualError('Invalid date. Use DD/MM/YYYY format.');
        onChange(null);
      }
    }
  }

  return (
    <Box>
      {/* Label */}
      <Group gap={4} mb={6} align="center">
        <Text size="sm" fw={500} component="label">
          {label}
          {required && <Text component="span" c="red" ml={2}>*</Text>}
        </Text>
        <Tooltip
          label={manualMode ? 'Switch to dropdowns' : 'Type date manually (DD/MM/YYYY)'}
          position="right"
          withArrow
        >
          <ActionIcon
            variant="subtle"
            size="xs"
            color="gray"
            onClick={() => {
              setManualMode((m) => !m);
              setManualError('');
            }}
            disabled={disabled}
          >
            <Keyboard size={13} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {manualMode ? (
        /* Manual text entry */
        <TextInput
          placeholder="DD/MM/YYYY"
          value={manualInput}
          onChange={(e) => handleManualChange(e.currentTarget.value)}
          size={size}
          disabled={disabled}
          error={manualError || error}
          maxLength={10}
          styles={{ input: { letterSpacing: '0.05em' } }}
        />
      ) : (
        /* Three-dropdown mode */
        <Group gap={8} wrap="nowrap">
          <Select
            placeholder="Day"
            data={dayOptions}
            value={day}
            onChange={setDay}
            size={size}
            disabled={disabled}
            searchable
            style={{ flex: 1 }}
            styles={{ input: { textAlign: 'center' } }}
          />
          <Select
            placeholder="Month"
            data={MONTHS}
            value={month}
            onChange={setMonth}
            size={size}
            disabled={disabled}
            searchable
            style={{ flex: 2 }}
          />
          <Select
            placeholder="Year"
            data={YEARS}
            value={year}
            onChange={setYear}
            size={size}
            disabled={disabled}
            searchable
            style={{ flex: 1.5 }}
            styles={{ input: { textAlign: 'center' } }}
          />
        </Group>
      )}

      {/* Error from parent */}
      {error && !manualMode && (
        <Text size="xs" c="red" mt={4}>{error}</Text>
      )}
    </Box>
  );
};
