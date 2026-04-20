'use client';

import { useState, useMemo } from 'react';
import {
  TextInput, Button, Group, Stack, Text, Avatar, Paper, Card,
  Badge, Title, Flex, Box, Alert, Select, SimpleGrid, Pagination,
  SegmentedControl, useMantineTheme, Popover, Slider, Switch, Divider, ActionIcon,
} from '@mantine/core';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { AlertCircle, Search, ArrowRight, Star, List, Map, Phone, SlidersHorizontal, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Section, Container, ComponentGroup } from '@/shared/components/layout';
import { InteractiveMap, type MapMarker } from './InteractiveMap';
import { themeColors } from '@/shared/theme';
import { providerDiscoveryApiService } from '../../infrastructure/provider-discovery-api.service';
import type {
  NearbyProvider,
  RegisteredProvider,
  SearchCenter,
} from '@/modules/public-pages/providers/domain/providers.types';
import { oralIQSession } from '@/modules/oral-iq/infrastructure/oral-iq-session';
import { RegisteredProviderCard } from './RegisteredProviderCard';

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  distance: string;
  latitude: number;
  longitude: number;
  insurances: string[];
  phone?: string | null;
  address?: string;
  openNow?: boolean | null;
}

const PAGE_SIZE = 6;
const PAGE_SIZE_MOBILE = 3;

// Reusable provider card — used in both list and map popup
const ProviderCard = ({
  provider,
  colors,
  compact = false,
  onBook,
  isBooking = false,
}: {
  provider: Provider;
  colors: ReturnType<typeof themeColors>;
  compact?: boolean;
  onBook?: (provider: Provider) => void;
  isBooking?: boolean;
}) => (
  <Stack gap="sm">
    <Group gap="sm" wrap="nowrap">
      <Avatar size={compact ? 40 : 48} radius="xl" style={{ flexShrink: 0 }} />
      <Stack gap={2} style={{ minWidth: 0 }}>
        <Text fw={700} size={compact ? 'xs' : 'sm'} lineClamp={1}>{provider.name}</Text>
        <Text size="xs" c={colors.primary[5]} lineClamp={1}>{provider.specialty}</Text>
        {provider.address && (
          <Text size="xs" c="dimmed" lineClamp={compact ? 1 : 2}>{provider.address}</Text>
        )}
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
      <Group gap={3}>
        <Star size={11} fill="#F59E0B" color="#F59E0B" />
        <Text size="xs" fw={600}>{provider.rating.toFixed(1)}</Text>
        <Text size="xs" c="dimmed">({provider.reviewCount})</Text>
      </Group>
      <Text size="xs" c="dimmed">{provider.distance}</Text>
    </Group>

    {!compact && (
      <Button 
        size="xs" 
        bg={colors.primary[5]} 
        fullWidth 
        onClick={() => onBook?.(provider)}
        loading={isBooking}
        loaderProps={{ type: 'oval' }}
      >
        {isBooking ? 'Redirecting...' : 'Book Appointment'}
      </Button>
    )}
  </Stack>
);

export const ProviderSearchMapSection = () => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter();

  const handleBook = (provider: Provider) => {
    // Set loading state
    setBookingProviderId(provider.id);
    
    // Save the selected provider so the dashboard can display it after login
    oralIQSession.saveBookingProvider({
      id: provider.id,
      name: provider.name,
      specialty: provider.specialty,
      address: provider.address ?? '',
      phone: provider.phone ?? '',
    });

    // After login, send the patient straight to their Oral IQ dashboard page
    sessionStorage.setItem('redirectAfterLogin', '/patient/oral-iq');

    // Correct patient login route
    router.push('/login?role=patient');
  };

  /**
   * Handles booking a D3NTIQ-registered provider.
   * Same flow as Google providers — saves to session and redirects to login.
   */
  const handleBookRegistered = (provider: RegisteredProvider) => {
    setBookingProviderId(provider.id);

    oralIQSession.saveBookingProvider({
      id: provider.id,
      name: provider.name,
      specialty: provider.specialty,
      address: provider.address ?? '',
      phone: provider.phone ?? '',
    });

    sessionStorage.setItem('redirectAfterLogin', '/patient/oral-iq');
    router.push('/login?role=patient');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [registeredProviders, setRegisteredProviders] = useState<RegisteredProvider[]>([]);
  const [searchCenter, setSearchCenter] = useState<SearchCenter | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [errorVisible, { close: dismissError, open: showError }] = useDisclosure(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);
  const [openNowFilter, setOpenNowFilter] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [filterOpen, { toggle: toggleFilter, close: closeFilter }] = useDisclosure(false);
  const [page, setPage] = useState(1);
  const [bookingProviderId, setBookingProviderId] = useState<string | null>(null);

  const formatDistanceMiles = (center: SearchCenter, provider: NearbyProvider): string => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 3958.8;
    const dLat = toRad(provider.latitude - center.latitude);
    const dLng = toRad(provider.longitude - center.longitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLng / 2) ** 2 * Math.cos(toRad(center.latitude)) * Math.cos(toRad(provider.latitude));
    return `${(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)} mi`;
  };

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
            latitude: p.latitude,
            longitude: p.longitude,
            insurances: [],
            address: p.address,
            phone: p.phone ?? null,
            openNow: p.isOpenNow,
          }))
        : [];
      setAllProviders(providers);
      setSearchCenter(center);
      setHasSearched(true);
      if (providers.length > 0) setSelectedProviderId(providers[0].id);
      // Store registered providers from the response
      setRegisteredProviders(response.registeredProviders ?? []);
      // Persist search so the dashboard can restore it after login
      oralIQSession.saveProviderSearch(location, providers.map((p) => ({
        id: p.id,
        name: p.name,
        specialty: p.specialty,
        address: p.address ?? '',
        phone: p.phone ?? '',
      })));
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
      // distance filter: parse numeric miles from "X.X mi"
      if (maxDistance < 50) {
        const miles = parseFloat(p.distance);
        const km = miles * 1.60934;
        if (!isNaN(km) && km > maxDistance) return false;
      }
      return true;
    });
  }, [allProviders, minRating, specialtyFilter, openNowFilter, maxDistance]);

  const totalPages = Math.ceil(filteredProviders.length / (isMobile ? PAGE_SIZE_MOBILE : PAGE_SIZE));
  const pagedProviders = filteredProviders.slice((page - 1) * (isMobile ? PAGE_SIZE_MOBILE : PAGE_SIZE), page * (isMobile ? PAGE_SIZE_MOBILE : PAGE_SIZE));

  const mapMarkers: MapMarker[] = filteredProviders.map((p) => ({
    id: p.id,
    longitude: p.longitude,
    latitude: p.latitude,
    color: selectedProviderId === p.id ? 'teal' : 'blue',
    address: p.address ?? p.name,
  }));

  const providerById = useMemo(() => {
    const lookup: Record<string, Provider> = {};
    allProviders.forEach((p) => { lookup[p.id] = p; });
    return lookup;
  }, [allProviders]);

  const mapCenter: [number, number] = searchCenter
    ? [searchCenter.longitude, searchCenter.latitude]
    : [-73.968, 40.7489];

  return (
    <Section background="light">
      <Container size="xl" className="py-10 lg:py-16">
        <ComponentGroup direction="col" spacing="sm" className="w-full">

          {/* Heading */}
          <ComponentGroup direction="col" spacing="sm" className="w-full">
            <Title order={2} fz={{ base: 24, md: 32 }}>Find a Local Provider Near You</Title>
            <Text c="dimmed" fz={{ base: 14, md: 16 }}>
              Find dental providers near you who accept your insurance.
            </Text>
          </ComponentGroup>

          {/* Search */}
          <ComponentGroup direction="col" spacing="sm" className="w-full">
            <Paper p={{ base: 'md', md: 'lg' }} withBorder w="100%">
              <Flex gap="sm" direction={{ base: 'column', xs: 'row' } as any}>
                <TextInput
                  placeholder="Search by dentist name, specialty, ZIP code or city..."
                  leftSection={<Search size={16} />}
                  size={isMobile ? 'md' : 'lg'}
                  style={{ flex: 1 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  size={isMobile ? 'md' : 'lg'}
                  radius="md"
                  bg={colors.primary[5]}
                  rightSection={!isSearching ? <ArrowRight size={16} /> : undefined}
                  onClick={handleSearch}
                  loading={isSearching}
                  loaderProps={{ type: 'oval' }}
                  fullWidth={isMobile}
                >
                  {isSearching ? 'Searching...' : 'Find Providers'}
                </Button>
              </Flex>
            </Paper>

            {errorVisible && searchError && (
              <Alert
                color={searchError.includes('limit') ? 'orange' : 'red'}
                variant="light"
                icon={<AlertCircle size={16} />}
                title={searchError.includes('limit') ? 'Search limit reached' : "Couldn't find providers"}
                withCloseButton
                onClose={dismissError}
                maw={900}
              >
                {searchError}
              </Alert>
            )}
          </ComponentGroup>

          {/* Results */}
          {hasSearched && (
            <Stack gap="md" w="100%">

              {/* Toolbar */}
              <Flex justify="space-between" align="center" wrap="wrap" gap="sm">
                <Group gap="sm">
                  <Text fw={600} size="sm" c="dimmed">
                    {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
                  </Text>

                  {/* Filter popover */}
                  <Popover
                    opened={filterOpen}
                    onClose={closeFilter}
                    position="bottom-start"
                    shadow="md"
                    width={300}
                    withArrow
                    closeOnClickOutside
                    closeOnEscape
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
                          <Box
                            style={{
                              position: 'absolute', top: -4, right: -4,
                              width: 8, height: 8, borderRadius: '50%',
                              backgroundColor: colors.secondary[4],
                            }}
                          />
                        )}
                      </Box>
                    </Popover.Target>

                    <Popover.Dropdown p={0}>
                      {/* Header */}
                      <Group justify="space-between" px="md" py="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                        <Text fw={600} size="sm">Filters</Text>
                        <Group gap={6}>
                          <Button
                            size="xs"
                            variant="subtle"
                            color="gray"
                            onClick={() => {
                              setMinRating(null);
                              setSpecialtyFilter(null);
                              setOpenNowFilter(false);
                              setMaxDistance(50);
                              setPage(1);
                            }}
                          >
                            Clear all
                          </Button>
                          <ActionIcon size="xs" variant="subtle" color="gray" onClick={closeFilter} aria-label="Close filters">
                            <X size={14} />
                          </ActionIcon>
                        </Group>
                      </Group>

                      {/* Scrollable body */}
                      <Box
                        p="md"
                        style={{ maxHeight: 380, overflowY: 'auto' }}
                      >
                        <Stack gap="lg">

                          {/* Specialty */}
                          <Stack gap={6}>
                            <Text size="xs" fw={600} c="dimmed">SPECIALTY</Text>
                            <Select
                              placeholder="All specialties"
                              size="xs"
                              clearable
                              value={specialtyFilter}
                              onChange={(v) => { setSpecialtyFilter(v); setPage(1); }}
                              data={specialtyOptions}
                            />
                          </Stack>

                          <Divider />

                          {/* Rating */}
                          <Stack gap={6}>
                            <Text size="xs" fw={600} c="dimmed">MIN RATING</Text>
                            <Group gap={4}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <ActionIcon
                                  key={star}
                                  size="sm"
                                  variant="transparent"
                                  onClick={() => { setMinRating(minRating === star ? null : star); setPage(1); }}
                                >
                                  <Star
                                    size={20}
                                    fill={minRating !== null && star <= minRating ? '#F59E0B' : 'none'}
                                    color={minRating !== null && star <= minRating ? '#F59E0B' : '#9ca3af'}
                                  />
                                </ActionIcon>
                              ))}
                              {minRating && <Text size="xs" c="dimmed">{minRating}+ stars</Text>}
                            </Group>
                          </Stack>

                          <Divider />

                          {/* Open Now */}
                          <Switch
                            label={<Text size="xs" fw={600}>Open Now</Text>}
                            size="sm"
                            checked={openNowFilter}
                            onChange={(e) => { setOpenNowFilter(e.currentTarget.checked); setPage(1); }}
                            color={colors.primary[5]}
                          />

                          <Divider />

                          {/* Distance */}
                          <Stack gap={10}>
                            <Group justify="space-between">
                              <Text size="xs" fw={600} c="dimmed">MAX DISTANCE</Text>
                              <Text size="xs" c={colors.primary[5]} fw={600}>
                                {maxDistance < 50 ? `${maxDistance} km` : 'Any'}
                              </Text>
                            </Group>
                            <Box pb="md">
                              <Slider
                                min={1}
                                max={50}
                                step={1}
                                value={maxDistance}
                                onChange={(v) => { setMaxDistance(v); setPage(1); }}
                                color={colors.primary[5]}
                                size="sm"
                                marks={[
                                  { value: 5, label: '5km' },
                                  { value: 10, label: '10km' },
                                  { value: 25, label: '25km' },
                                  { value: 50, label: 'Any' },
                                ]}
                              />
                            </Box>
                          </Stack>

                        </Stack>
                      </Box>
                    </Popover.Dropdown>
                  </Popover>
                </Group>

                {/* Hide map toggle on mobile */}
                {!isMobile && (
                  <SegmentedControl
                    size="xs"
                    value={view}
                    onChange={(v) => setView(v as 'list' | 'map')}
                    data={[
                      { value: 'list', label: <Group gap={4}><List size={13} /><span>List</span></Group> },
                      { value: 'map', label: <Group gap={4}><Map size={13} /><span>Map</span></Group> },
                    ]}
                  />
                )}
              </Flex>

              {/* List view — always shown on mobile */}
              {(view === 'list' || isMobile) && (
                <Stack gap="lg">

                  {/* All providers in one flat list — D3NTIQ registered first, then Google */}
                  {pagedProviders.length === 0 && registeredProviders.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">No providers match your filters.</Text>
                  ) : (
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                      {/* D3NTIQ registered providers rendered first */}
                      {registeredProviders.map((provider) => (
                        <RegisteredProviderCard
                          key={provider.id}
                          provider={provider}
                          isSelected={selectedProviderId === provider.id}
                          onSelect={(p) => setSelectedProviderId(p.id)}
                          onBook={handleBookRegistered}
                          isBooking={bookingProviderId === provider.id}
                        />
                      ))}
                      {/* Google providers follow */}
                      {pagedProviders.map((provider) => (
                        <Card
                          key={provider.id}
                          radius="lg"
                          p="md"
                          withBorder
                          style={{
                            cursor: 'pointer',
                            borderColor: selectedProviderId === provider.id ? colors.primary[5] : undefined,
                            borderWidth: selectedProviderId === provider.id ? 2 : 1,
                          }}
                          onClick={() => setSelectedProviderId(provider.id)}
                        >
                          <ProviderCard provider={provider} colors={colors} onBook={handleBook} isBooking={bookingProviderId === provider.id} />
                        </Card>
                      ))}
                    </SimpleGrid>
                  )}

                  {totalPages > 1 && (
                    <Group justify="center">
                      <Pagination
                        total={totalPages}
                        value={page}
                        onChange={setPage}
                        size="sm"
                        color={colors.primary[5]}
                      />
                    </Group>
                  )}
                </Stack>
              )}

              {/* Map view — desktop only */}
              {view === 'map' && !isMobile && (
                <Box style={{ width: '100%', height: 600, borderRadius: 16, overflow: 'hidden' }}>
                  <InteractiveMap
                    markers={mapMarkers}
                    initialCenter={mapCenter}
                    initialZoom={13}
                    selectedMarkerId={selectedProviderId}
                    onMarkerSelect={(id) => setSelectedProviderId(id)}
                    renderPopup={(markerId) => {
                      const provider = providerById[markerId];
                      if (!provider) return null;
                      return (
                        <Box p="sm" style={{ minWidth: 220 }}>
                          <ProviderCard provider={provider} colors={colors} compact />
                        </Box>
                      );
                    }}
                  />
                </Box>
              )}

            </Stack>
          )}

        </ComponentGroup>
      </Container>
    </Section>
  );
};
