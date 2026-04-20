/**
 * BrandServices Component (Shared)
 *
 * Displays "For Patients" / "For Providers" feature card sections.
 * Desktop: 3 cards in a row, each card is fully clickable → opens ServiceDetailModal
 * Mobile: Carousel with navigation arrows and dots
 */
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Title, Text, SimpleGrid, Box, Group, ActionIcon } from '@mantine/core';
import {
  Activity,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react';
import { Section, Container, ComponentGroup } from '@/shared/components/layout';
import { ServiceDetailModal } from '@/modules/public-pages/services/presentation/components/ServiceDetailModal';

export interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  icon?: string;
  slug?: string;
}

export interface BrandServicesProps {
  badge: string;
  title: string;
  subtitle?: string;
  description: string;
  features: Feature[];
}

/** Render D3NT with superscript IQ inline */
const BrandName: React.FC = () => (
  <span style={{ fontWeight: 700, color: '#0c2140' }}>
    D3NT<sup style={{ fontSize: '0.6em', verticalAlign: 'super', fontWeight: 700 }}>IQ</sup>
  </span>
);

/** Replace the literal token D3NT¹Q (unicode superscript) with the JSX component */
const renderDescriptionWithBrand = (text: string): React.ReactNode => {
  const parts = text.split(/(D3NT\u1D35Q)/g);
  return parts.map((part, i) =>
    part === 'D3NT\u1D35Q' ? <BrandName key={i} /> : part
  );
};

const getFeatureIcon = (featureTitle: string) => {
  const lower = featureTitle.toLowerCase();
  if (lower.includes('symptom') || lower.includes('analysis')) return Activity;
  if (lower.includes('recommendation')) return ClipboardList;
  if (lower.includes('confident') || lower.includes('informed')) return ShieldCheck;
  if (lower.includes('prepared')) return UserRoundCheck;
  if (lower.includes('show rate')) return CalendarDays;
  if (lower.includes('retention')) return UsersRound;
  return ClipboardList;
};

export const BrandServices: React.FC<BrandServicesProps> = ({
  badge,
  title,
  description,
  features,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const handlePrevious = () =>
    setActiveIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  const handleNext = () =>
    setActiveIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));

  const handleCardClick = (feature: Feature) => {
    setSelectedSlug(feature.slug || feature.id);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setSelectedSlug(null);
  };

  const renderFeatureCard = (feature: Feature) => {
    const Icon = getFeatureIcon(feature.title);
    return (
      <Box
        key={feature.id}
        pos="relative"
        h={380}
        w="100%"
        onClick={() => handleCardClick(feature)}
        style={{
          overflow: 'hidden',
          borderRadius: 12,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(15,23,42,0.14)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        {/* Background image — top ~60% */}
        <Box pos="absolute" top={0} left={0} right={0} style={{ height: '62%' }}>
          <Image
            src={feature.image}
            alt={feature.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
          />
        </Box>

        {/* White content panel — bottom ~45%, overlapping image */}
        <Box
          pos="absolute"
          left={12}
          right={12}
          bottom={12}
          style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: '20px 20px 18px 20px',
            boxShadow: '0 8px 24px rgba(15,23,42,0.10)',
          }}
        >
          {/* Icon */}
          <Box
            mb={12}
            w={40}
            h={40}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              background: '#eef6f9',
            }}
          >
            <Icon size={20} strokeWidth={1.8} color="#548CA4" />
          </Box>

          {/* Title */}
          <Title
            order={3}
            fw={700}
            c="#0c2140"
            lh={1.3}
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', letterSpacing: '-0.01em' }}
          >
            {feature.title}
          </Title>

          {/* Description */}
          <Text
            mt={6}
            lh={1.5}
            c="#64748b"
            style={{ fontSize: 'clamp(0.75rem, 1.3vw, 0.85rem)' }}
          >
            {feature.description}
          </Text>
        </Box>
      </Box>
    );
  };

  return (
    <Section background="#ffffff">
      <Container size="xl" className="py-16 md:py-20">
        <ComponentGroup direction="col" spacing="lg" align="center" className="w-full">

          {/* Header */}
          <ComponentGroup direction="col" spacing="sm" align="center" className="w-full max-w-3xl mx-auto">
            {/* Badge — teal underlined link style */}
            <Text
              style={{
                fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
                fontWeight: 500,
                color: '#548CA4',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                letterSpacing: '0.01em',
              }}
            >
              {badge}
            </Text>

            {/* Large bold title */}
            <Title
              order={2}
              ta="center"
              fw={800}
              lh={1.05}
              c="#0c2140"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}
            >
              {title}
            </Title>

            {/* Description with D3NTIQ brand rendering */}
            <Text
              maw={680}
              ta="center"
              lh={1.65}
              fw={400}
              c="#5f6c7b"
              style={{ fontSize: 'clamp(0.875rem, 1.4vw, 1rem)' }}
            >
              {renderDescriptionWithBrand(description)}
            </Text>
          </ComponentGroup>

          {/* Mobile carousel */}
          <Box hiddenFrom="md" className="w-full">
            <Box style={{ position: 'relative', paddingBottom: '2.5rem' }}>
              <Group
                justify="space-between"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              >
                <ActionIcon
                  variant="filled"
                  size="md"
                  radius="xl"
                  onClick={handlePrevious}
                  style={{
                    pointerEvents: 'auto',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#425466',
                    width: 36,
                    height: 36,
                  }}
                >
                  <ChevronLeft size={18} />
                </ActionIcon>
                <ActionIcon
                  variant="filled"
                  size="md"
                  radius="xl"
                  onClick={handleNext}
                  style={{
                    pointerEvents: 'auto',
                    backgroundColor: '#548CA4',
                    color: 'white',
                    width: 36,
                    height: 36,
                  }}
                >
                  <ChevronRight size={18} />
                </ActionIcon>
              </Group>
              <Box style={{ padding: '0 1.5rem' }}>
                {renderFeatureCard(features[activeIndex])}
              </Box>
              <Group justify="center" gap="xs" mt="lg">
                {features.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    style={{
                      width: index === activeIndex ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: index === activeIndex ? '#548CA4' : '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </Group>
            </Box>
          </Box>

          {/* Desktop grid */}
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing={20} visibleFrom="md" className="w-full">
            {features.map((feature) => renderFeatureCard(feature))}
          </SimpleGrid>

        </ComponentGroup>
      </Container>

      <ServiceDetailModal slug={selectedSlug} opened={modalOpened} onClose={handleCloseModal} />
    </Section>
  );
};
