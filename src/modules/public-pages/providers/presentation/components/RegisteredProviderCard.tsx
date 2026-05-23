'use client';

/**
 * RegisteredProviderCard
 *
 * Displays a D3NTIQ-registered provider in search results.
 * Visually distinct from Google results with a teal border and
 * the D3NTIQ Verified badge to communicate platform membership.
 *
 * Shows:
 *   - Open Now / Closed badge (based on provider's saved working hours)
 *   - 5.0 star rating (all D3NTIQ providers default to 5.0)
 *   - Address, phone, specialty
 */

import { Stack, Group, Text, Button, Card, Box, Badge, Avatar } from '@mantine/core';
import { Phone, MapPin, Star } from 'lucide-react';
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
        <Group gap="sm" wrap="nowrap" mt={compact ? 0 : 4} style={{ paddingRight: compact ? 0 : 110 }}>
          {/* Avatar with provider initials — matches the Google provider card style */}
          {!compact && (
            <Avatar
              size={44}
              radius="xl"
              style={{
                flexShrink:      0,
                backgroundColor: colors.primary[5],
                color:           '#fff',
                fontWeight:      700,
                fontSize:        14,
              }}
            >
              {provider.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </Avatar>
          )}

          <Stack gap={2} style={{ minWidth: 0 }}>
            <Text fw={700} size={compact ? 'xs' : 'sm'} lineClamp={1}>
              {provider.name}
            </Text>
            <Text size="xs" c={colors.primary[5]} lineClamp={1}>
              {provider.specialty}
            </Text>
          </Stack>
        </Group>

        {/* Address, phone, then rating + Open/Closed badge */}
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

            {/* Rating + Open/Closed badge — rendered just after phone */}
            <Group gap={8} align="center" mt={2}>
              <Group gap={3} align="center">
                <Star size={11} color="#f59e0b" fill="#f59e0b" />
                <Text size="xs" fw={600} c="#1e293b">
                  {provider.rating.toFixed(1)}
                </Text>
              </Group>

              {provider.isOpenNow === true && (
                <Badge size="xs" color="green" variant="light">Open Now</Badge>
              )}
              {provider.isOpenNow === false && (
                <Badge size="xs" color="red" variant="light">Closed</Badge>
              )}
            </Group>
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
