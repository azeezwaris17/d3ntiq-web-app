'use client';

/**
 * RegisteredProviderCard
 *
 * Displays a D3NTIQ-registered provider in search results.
 * Visually distinct from Google results with a teal border and
 * the D3NTIQ Verified badge to communicate platform membership.
 */

import { Stack, Group, Text, Button, Card, Box } from '@mantine/core';
import { Phone, MapPin } from 'lucide-react';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme';
import type { RegisteredProvider } from '../../domain/providers.types';
import { D3ntiqVerifiedBadge } from './D3ntiqVerifiedBadge';

interface RegisteredProviderCardProps {
  provider: RegisteredProvider;
  isSelected: boolean;
  onSelect: (provider: RegisteredProvider) => void;
  /** Called when user clicks "Book Appointment" (public page flow) */
  onBook?: (provider: RegisteredProvider) => void;
  /** Shows a loading spinner on the book button */
  isBooking?: boolean;
  /** Compact mode for map popups */
  compact?: boolean;
}

export function RegisteredProviderCard({
  provider,
  isSelected,
  onSelect,
  onBook,
  isBooking = false,
  compact = false,
}: RegisteredProviderCardProps) {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  return (
    <Card
      radius="lg"
      p="md"
      withBorder
      style={{
        cursor: 'pointer',
        // Teal border to visually distinguish from Google results
        borderColor: isSelected ? colors.primary[5] : '#7dd3fc',
        borderWidth: isSelected ? 2 : 1.5,
        backgroundColor: isSelected ? '#f0f9ff' : '#f8fbff',
        position: 'relative',
      }}
      onClick={() => onSelect(provider)}
    >
      {/* Verification badge — top right corner */}
      <Box style={{ position: 'absolute', top: 8, right: 8 }}>
        <D3ntiqVerifiedBadge size="sm" />
      </Box>

      <Stack gap="sm" mt={compact ? 0 : 4}>
        {/* Provider name and specialty */}
        <Stack gap={2} style={{ paddingRight: 110 }}>
          <Text fw={700} size={compact ? 'xs' : 'sm'} lineClamp={1}>
            {provider.name}
          </Text>
          <Text size="xs" c={colors.primary[5]} lineClamp={1}>
            {provider.specialty}
          </Text>
        </Stack>

        {/* Address and phone */}
        {!compact && (
          <Stack gap={4}>
            {provider.address && (
              <Group gap={4} wrap="nowrap">
                <MapPin size={11} color="#64748b" style={{ flexShrink: 0 }} />
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {provider.address}
                </Text>
              </Group>
            )}
            {provider.phone && (
              <Group gap={4}>
                <Phone size={11} color="#64748b" />
                <Text size="xs" c="dimmed">
                  {provider.phone}
                </Text>
              </Group>
            )}
          </Stack>
        )}

        {/* Action button */}
        {!compact && onBook && (
          <Button
            size="xs"
            bg={colors.primary[5]}
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onBook(provider);
            }}
            loading={isBooking}
            loaderProps={{ type: 'oval' }}
          >
            {isBooking ? 'Redirecting...' : 'Book Appointment'}
          </Button>
        )}

        {!compact && !onBook && (
          <Button
            size="xs"
            fullWidth
            variant={isSelected ? 'filled' : 'light'}
            color={colors.primary[5]}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(provider);
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        )}
      </Stack>
    </Card>
  );
}
