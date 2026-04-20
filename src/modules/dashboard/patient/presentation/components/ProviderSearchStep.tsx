'use client';

/**
 * ProviderSearchStep
 *
 * Step 5 of the dashboard Oral IQ wizard.
 * Shows the provider search UI pre-populated with the patient's prior search.
 * The provider they originally selected is visually highlighted.
 * They can run a new search or select a different provider.
 *
 * D3NTIQ-registered providers are shown at the top with a verification badge.
 */

import { useState, useMemo } from 'react';
import {
  Box, Text, Title, Stack, Group, Button, TextInput, Paper, Card,
  Badge, Avatar, SimpleGrid, Pagination, Alert, ActionIcon,
  Select, Popover, Slider, Switch, Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Search, ArrowRight, Star, Phone, AlertCircle, SlidersHorizontal, X, CheckCircle2 } from 'lucide-react';
import { useMantineTheme } from '@mantine/core';
import { themeColors } from '@/shared/theme';
import { providerDiscoveryApiService } from '@/modules/public-pages/providers/infrastructure/provider-discovery-api.service';
import type {
  NearbyProvider,
  RegisteredProvider,
  SearchCenter,
} from '@/modules/public-pages/providers/domain/providers.types';
import type { SelectedProvider } from '@/modules/oral-iq/presentation/OralIQPage';
import { RegisteredProviderCard } from '@/modules/public-pages/providers/presentation/components/RegisteredProviderCard';

export interface ProviderSearchStepProps {
  /** Provider the patient originally selected before login */
  initialProvider: SelectedProvider | null;
  /** Search query used before login */
  initialQuery: string | null;
  /** Search results from before login */
  initialResults: SelectedProvider[] | null;
  onNext: (provider: SelectedProvider) => void;
  onBack: () => void;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  distance: string;
  address?: string;
  phone?: string | null;
  openNow?: boolean | null;
}

const PAGE_SIZE = 6;

function formatDistanceMiles(center: SearchCenter, p: NearbyProvider): string {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(p.latitude - center.latitude);
  const dLng = toRad(p.longitude - center.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 *
      Math.cos(toRad(center.latitude)) *
      Math.cos(toRad(p.latitude));
  return `${(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)} mi`;
}

export function ProviderSearchStep({
  initialProvider,
  initialQuery,
  initialResults,
  onNext,
  onBack,
}: ProviderSearchStepProps) {
  const theme = useMantineTheme();
  const colors = themeColors(theme);

  const [searchQuery, setSearchQuery] = useState(initialQuery ?? '');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialResults?.length);
  const [allProviders, setAllProviders] = useState<Provider[]>(
    initialResults?.map((p) => ({
      id: p.id,
      name: p.name,
      specialty: p.specialty,
      rating: 0,
      reviewCount: 0,
      distance: '',
      address: p.address,
      phone: p.phone,
    })) ?? []
  );
  const [registeredProviders, setRegisteredProviders] = useState<RegisteredProvider[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [errorVisible, { close: dismissError, open: showError }] = useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(initialProvider?.id ?? null);
  const [page, setPage] = useState(1);

  // Filters
  const [minRating, setMinRating] = useState<number | null>(null);
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);
  const [openNowFilter, setOpenNowFilter] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [filterOpen, { toggle: toggleFilter, close: closeFilter }] = useDisclosure(false);

  const handleSearch = async () => {
    const location = searchQuery.trim();
    if (!location) return;
    setIsSearching(true);
    setSearchError(null);
    dismissError();
    setPage(1);
    setMinRating(null);
    setSpecialtyFilter(null);
    setOpenNowFilter(false);
    setMaxDistance(50);
    try {
      const response = await providerDiscoveryApiService.getNearbyProviders({
        location,
        limit: 50,
        includeDetails: true,
      });
      const center = response.searchCenter;
      const providers: Provider[] = center
        ? response.providers.map((p) => ({
            id: p.id,
            name: p.name,
            specialty: p.specialty,
            rating: p.rating ?? 0,
            reviewCount: p.reviewCount ?? 0,
            distance: formatDistanceMiles(center, p),
            address: p.address,
            phone: p.phone ?? null,
            openNow: p.isOpenNow,
          }))
        : [];
      setAllProviders(providers);
      setHasSearched(true);
      if (providers.length > 0 && !selectedId) setSelectedId(providers[0].id);
      // Store D3NTIQ registered providers from the response
      setRegisteredProviders(response.registeredProviders ?? []);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Something went wrong');
      showError();
    } finally {
      setIsSearching(false);
    }
  };

  const specialtyOptions = useMemo(() => {
    const unique = [...new Set(allProviders.map((p) => p.specialty).filter(Boolean))];
    return unique.map((s) => ({ value: s, label: s }));
  }, [allProviders]);

  const filteredProviders = useMemo(() => {
    return allProviders.filter((p) => {
      if (minRating && p.rating < minRating) return false;
      if (specialtyFilter && p.specialty !== specialtyFilter) return false;
      if (openNowFilter && p.openNow !== true) return false;
      if (maxDistance < 50) {
        const miles = parseFloat(p.distance);
        if (!isNaN(miles) && miles * 1.60934 > maxDistance) return false;
      }
      return true;
    });
  }, [allProviders, minRating, specialtyFilter, openNowFilter, maxDistance]);

  const totalPages = Math.ceil(filteredProviders.length / PAGE_SIZE);
  const pagedProviders = filteredProviders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectedProvider = allProviders.find((p) => p.id === selectedId) ?? null;

  function handleBookNow() {
    if (!selectedProvider) return;
    onNext({
      id: selectedProvider.id,
      name: selectedProvider.name,
      specialty: selectedProvider.specialty,
      address: selectedProvider.address,
      phone: selectedProvider.phone ?? undefined,
    });
  }

  /**
   * Handles selecting a D3NTIQ registered provider.
   * Converts to SelectedProvider format and calls onNext.
   */
  function handleSelectRegistered(provider: RegisteredProvider) {
    onNext({
      id: provider.id,
      name: provider.name,
      specialty: provider.specialty,
      address: provider.address ?? undefined,
      phone: provider.phone ?? undefined,
    });
  }

  return (
    <Box>
      <Stack gap="md" mb="xl">
        <Title order={3} fw={600} fz={20} c="#1e293b">Find a Provider</Title>
        <Text size="sm" c="dimmed">
          {initialProvider
            ? `You previously selected ${initialProvider.name}. You can keep this selection or choose another provider.`
            : 'Search for a dental provider near you.'}
        </Text>
      </Stack>

      {/* Search bar */}
      <Paper p="md" withBorder mb="lg">
        <Group gap="sm">
          <TextInput
            placeholder="Search by name, specialty, ZIP or city..."
            leftSection={<Search size={16} />}
            style={{ flex: 1 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            bg={colors.primary[5]}
            rightSection={!isSearching ? <ArrowRight size={16} /> : undefined}
            onClick={handleSearch}
            loading={isSearching}
            loaderProps={{ type: 'oval' }}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </Group>
      </Paper>

      {errorVisible && searchError && (
        <Alert
          color="red"
          variant="light"
          icon={<AlertCircle size={16} />}
          title="Couldn't find providers"
          withCloseButton
          onClose={dismissError}
          mb="md"
        >
          {searchError}
        </Alert>
      )}

      {/* Results */}
      {hasSearched && (
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Text size="sm" c="dimmed" fw={600}>
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </Text>

            {/* Filter popover */}
            <Popover
              opened={filterOpen}
              onClose={closeFilter}
              position="bottom-end"
              shadow="md"
              width={280}
              withArrow
              closeOnClickOutside
            >
              <Popover.Target>
                <Box style={{ position: 'relative', display: 'inline-flex' }}>
                  <ActionIcon
                    variant={filterOpen || minRating || specialtyFilter || openNowFilter || maxDistance < 50 ? 'filled' : 'light'}
                    color={colors.primary[5]}
                    size="md"
                    radius="md"
                    onClick={toggleFilter}
                    aria-label="Filters"
                  >
                    <SlidersHorizontal size={16} />
                  </ActionIcon>
                  {(minRating || specialtyFilter || openNowFilter || maxDistance < 50) && (
                    <Box style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.secondary[4] }} />
                  )}
                </Box>
              </Popover.Target>
              <Popover.Dropdown p={0}>
                <Group justify="space-between" px="md" py="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                  <Text fw={600} size="sm">Filters</Text>
                  <Group gap={6}>
                    <Button size="xs" variant="subtle" color="gray" onClick={() => { setMinRating(null); setSpecialtyFilter(null); setOpenNowFilter(false); setMaxDistance(50); setPage(1); }}>Clear all</Button>
                    <ActionIcon size="xs" variant="subtle" color="gray" onClick={closeFilter}><X size={14} /></ActionIcon>
                  </Group>
                </Group>
                <Box p="md" style={{ maxHeight: 340, overflowY: 'auto' }}>
                  <Stack gap="lg">
                    <Stack gap={6}>
                      <Text size="xs" fw={600} c="dimmed">SPECIALTY</Text>
                      <Select placeholder="All specialties" size="xs" clearable value={specialtyFilter} onChange={(v) => { setSpecialtyFilter(v); setPage(1); }} data={specialtyOptions} />
                    </Stack>
                    <Divider />
                    <Stack gap={6}>
                      <Text size="xs" fw={600} c="dimmed">MIN RATING</Text>
                      <Group gap={4}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <ActionIcon key={star} size="sm" variant="transparent" onClick={() => { setMinRating(minRating === star ? null : star); setPage(1); }}>
                            <Star size={20} fill={minRating !== null && star <= minRating ? '#F59E0B' : 'none'} color={minRating !== null && star <= minRating ? '#F59E0B' : '#9ca3af'} />
                          </ActionIcon>
                        ))}
                      </Group>
                    </Stack>
                    <Divider />
                    <Switch label={<Text size="xs" fw={600}>Open Now</Text>} size="sm" checked={openNowFilter} onChange={(e) => { setOpenNowFilter(e.currentTarget.checked); setPage(1); }} color={colors.primary[5]} />
                    <Divider />
                    <Stack gap={10}>
                      <Group justify="space-between">
                        <Text size="xs" fw={600} c="dimmed">MAX DISTANCE</Text>
                        <Text size="xs" c={colors.primary[5]} fw={600}>{maxDistance < 50 ? `${maxDistance} km` : 'Any'}</Text>
                      </Group>
                      <Box pb="md">
                        <Slider min={1} max={50} step={1} value={maxDistance} onChange={(v) => { setMaxDistance(v); setPage(1); }} color={colors.primary[5]} size="sm" marks={[{ value: 5, label: '5km' }, { value: 25, label: '25km' }, { value: 50, label: 'Any' }]} />
                      </Box>
                    </Stack>
                  </Stack>
                </Box>
              </Popover.Dropdown>
            </Popover>
          </Group>

          {/* All providers in one flat list — D3NTIQ registered first, then Google */}
          {registeredProviders.length > 0 && (
            <Stack gap="sm" mb="md">
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {registeredProviders.map((provider) => (
                  <RegisteredProviderCard
                    key={provider.id}
                    provider={provider}
                    isSelected={selectedId === provider.id}
                    onSelect={(p) => setSelectedId(p.id)}
                    onBook={handleSelectRegistered}
                  />
                ))}
              </SimpleGrid>
            </Stack>
          )}

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {pagedProviders.map((provider) => {
              const isSelected = provider.id === selectedId;
              const isOriginal = provider.id === initialProvider?.id;
              return (
                <Card
                  key={provider.id}
                  radius="lg"
                  p="md"
                  withBorder
                  style={{
                    cursor: 'pointer',
                    borderColor: isSelected ? colors.primary[5] : isOriginal ? '#bae6fd' : undefined,
                    borderWidth: isSelected || isOriginal ? 2 : 1,
                    backgroundColor: isSelected ? '#f0f9ff' : isOriginal ? '#f8fbff' : undefined,
                    position: 'relative',
                  }}
                  onClick={() => setSelectedId(provider.id)}
                >
                  {/* "Previously selected" badge */}
                  {isOriginal && (
                    <Badge
                      size="xs"
                      color="blue"
                      variant="light"
                      style={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      Your pick
                    </Badge>
                  )}
                  {/* Selected checkmark */}
                  {isSelected && (
                    <Box style={{ position: 'absolute', top: 8, left: 8 }}>
                      <CheckCircle2 size={18} color={colors.primary[5]} fill="#e0f2fe" />
                    </Box>
                  )}

                  <Stack gap="sm" mt={isSelected || isOriginal ? 8 : 0}>
                    <Group gap="sm" wrap="nowrap">
                      <Avatar size={44} radius="xl" style={{ flexShrink: 0 }} />
                      <Stack gap={2} style={{ minWidth: 0 }}>
                        <Text fw={700} size="sm" lineClamp={1}>{provider.name}</Text>
                        <Text size="xs" c={colors.primary[5]} lineClamp={1}>{provider.specialty}</Text>
                        {provider.address && <Text size="xs" c="dimmed" lineClamp={2}>{provider.address}</Text>}
                        {provider.phone && (
                          <Group gap={4}>
                            <Phone size={10} color={colors.neutral[6]} />
                            <Text size="xs" c="dimmed">{provider.phone}</Text>
                          </Group>
                        )}
                      </Stack>
                    </Group>
                    <Group gap={6} wrap="wrap">
                      {provider.openNow === true && <Badge color="green" variant="light" size="xs">Open Now</Badge>}
                      {provider.openNow === false && <Badge color="red" variant="light" size="xs">Closed</Badge>}
                      {provider.rating > 0 && (
                        <Group gap={3}>
                          <Star size={11} fill="#F59E0B" color="#F59E0B" />
                          <Text size="xs" fw={600}>{provider.rating.toFixed(1)}</Text>
                          <Text size="xs" c="dimmed">({provider.reviewCount})</Text>
                        </Group>
                      )}
                      {provider.distance && <Text size="xs" c="dimmed">{provider.distance}</Text>}
                    </Group>
                    <Button
                      size="xs"
                      fullWidth
                      variant={isSelected ? 'filled' : 'light'}
                      color={colors.primary[5]}
                      onClick={(e) => { e.stopPropagation(); setSelectedId(provider.id); }}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </Button>
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>

          {totalPages > 1 && (
            <Group justify="center">
              <Pagination total={totalPages} value={page} onChange={setPage} size="sm" color={colors.primary[5]} />
            </Group>
          )}
        </Stack>
      )}

      {/* Navigation */}
      <Group justify="space-between" mt="xl">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button
          bg={colors.primary[5]}
          disabled={!selectedProvider}
          onClick={handleBookNow}
        >
          Book Appointment with {selectedProvider?.name ?? '...'}
        </Button>
      </Group>
    </Box>
  );
}
