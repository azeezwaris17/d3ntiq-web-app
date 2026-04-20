/**
 * NewsSection Component
 * 
 * A responsive grid/carousel component for displaying news articles
 * with consistent spacing, typography, and interaction patterns.
 */

'use client';
import React from 'react';

import { useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Title, SimpleGrid, Stack, Text, Button, Center, Box, Group, ActionIcon } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { ArrowRight, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/shared/components/base';
import { themeColors } from '@/shared/theme';
import { Section, Container, ComponentGroup } from '@/shared/components/layout';

// ============================================================================
// Types & Constants
// ============================================================================

export interface NewsArticle {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  slug: string;
  category?: string;
  publishedDate?: string;
  author?: string;
  url?: string;
}

export interface NewsSectionProps {
  badge: string;
  titlePrefix: string;
  titleSuffix: string;
  description: string;
  emptyStateMessage: string;
  articles: NewsArticle[];
}

// Constants for consistent styling
const CARD_BORDER_RADIUS = '12px';
const TRANSITION_DURATION = '0.2s';

// Typography scales using clamp for better responsiveness
const TYPOGRAPHY = {
  badge: { fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)' },
  sectionTitle: { fontSize: 'clamp(1rem, 2.5vw, 2rem)', },
  sectionDescription: { fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' },
  cardTitle: { fontSize: 'clamp(0.9375rem, 1.5vw, 1rem)' }, // 15px → 16px
  cardExcerpt: { fontSize: 'clamp(0.75rem, 1.2vw, 0.8125rem)' }, // 12px → 13px
  cardCategory: { fontSize: 'clamp(0.6875rem, 1vw, 0.75rem)' }, // 11px → 12px
  buttonText: { fontSize: 'clamp(0.75rem, 1vw, 0.875rem)' },
} as const;

// ============================================================================
// Subcomponents
// ============================================================================

interface ArticleCardProps {
  article: NewsArticle;
  colors: ReturnType<typeof themeColors>;
  variant?: 'grid' | 'carousel';
}

/**
 * Desktop article card with hover effects
 */
const DesktopArticleCard: React.FC<ArticleCardProps> = ({ article, colors }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        height: '100%',
        transition: `transform ${TRANSITION_DURATION} ease`,
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <Card
        variant="elevated"
        style={{
          height: '100%',
          overflow: 'hidden',
          backgroundColor: colors.neutral[0],
          border: `1px solid ${colors.neutral[2]}`,
          borderRadius: CARD_BORDER_RADIUS,
          transition: `box-shadow ${TRANSITION_DURATION} ease`,
          boxShadow: isHovered ? '0 12px 24px -8px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.02)',
        }}
      >
        <Stack gap="xs" style={{ height: '100%' }}>
          {/* Image */}
          <Box
            style={{
              position: 'relative',
              width: '100%',
              height: '160px',
              overflow: 'hidden',
              borderRadius: '8px',
              backgroundColor: colors.neutral[1],
            }}
          >
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ 
                objectFit: 'cover',
                transition: `transform ${TRANSITION_DURATION} ease`,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
              loading="lazy"
            />
          </Box>

          {/* Content */}
          <Stack gap={4} style={{ flex: 1, padding: '0 4px' }}>
            {article.category && (
              <Text
                size="xs"
                fw={600}
                tt="uppercase"
                style={{ letterSpacing: '0.5px' }}
                c={colors.primary[5]}
              >
                {article.category.replace(/-/g, ' ')}
              </Text>
            )}

            <Title
              order={3}
              lineClamp={2}
              style={TYPOGRAPHY.cardTitle}
              fw={500}
              lh={1.4}
              c={colors.neutral[9]}
            >
              {article.title}
            </Title>

            {article.excerpt && (
              <Text
                style={TYPOGRAPHY.cardExcerpt}
                lineClamp={3}
                lh={1.6}
                c={colors.neutral[6]}
              >
                {article.excerpt}
              </Text>
            )}
          </Stack>

          {/* Read More Button */}
          <Box style={{ padding: '8px 0 0' }}>
            <Button
              variant="filled"
              size="xs"
              component="a"
              href={article.url || article.slug}
              target="_blank"
              rel="noopener noreferrer"
              rightSection={<ArrowRight size={14} />}
              style={TYPOGRAPHY.buttonText}
              fw={500}
              styles={{
                root: {
                  backgroundColor: colors.primary[5],
                  height: '32px',
                  padding: '0 16px',
                  '&:hover': {
                    backgroundColor: colors.primary[6],
                    transform: 'translateX(2px)',
                  },
                },
              }}
            >
              Read More
            </Button>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

/**
 * Mobile carousel navigation dots
 */
const CarouselDots: React.FC<{
  total: number;
  active: number;
  onChange: (index: number) => void;
  colors: ReturnType<typeof themeColors>;
}> = ({ total, active, onChange, colors }) => (
  <Group justify="center" gap={6} mt="md">
    {Array.from({ length: total }).map((_, index) => (
      <Box
        key={index}
        onClick={() => onChange(index)}
        role="button"
        tabIndex={0}
        aria-label={`Go to slide ${index + 1}`}
        style={{
          width: index === active ? '28px' : '8px',
          height: '8px',
          borderRadius: '4px',
          backgroundColor: index === active ? colors.primary[5] : colors.neutral[3],
          cursor: 'pointer',
          transition: `all ${TRANSITION_DURATION} ease`,
          '&:hover': {
            backgroundColor: index === active ? colors.primary[6] : colors.neutral[4],
          },
        }}
      />
    ))}
  </Group>
);

// ============================================================================
// Main Component
// ============================================================================

export const NewsSection: React.FC<NewsSectionProps> = ({
  badge,
  titlePrefix,
  titleSuffix,
  description,
  emptyStateMessage,
  articles,
}) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Carousel navigation handlers
  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  }, [articles.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  }, [articles.length]);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Memoized empty state
  const emptyState = useMemo(() => (
    <Center style={{ minHeight: 200 }}>
      <Stack align="center" gap="md">
        <Info size={40} strokeWidth={1.5} color={colors.neutral[4]} />
        <Text size="lg" c={colors.neutral[6]}>
          {emptyStateMessage}
        </Text>
      </Stack>
    </Center>
  ), [emptyStateMessage, colors]);

  if (!articles.length) {
    return (
      <Section background="light">
        <Container size="xl" className="py-16">
          {emptyState}
        </Container>
      </Section>
    );
  }

  return (
    <Section background="light">
      <Container size="xl" className="py-16">
        <ComponentGroup direction="col" spacing="lg" align="center" className="w-full">

          {/* Section Header */}
          <ComponentGroup direction="col" spacing="sm" align="center" className="w-full max-w-2xl mx-auto">
            <Button
              variant="outline"
              size="xs"
              style={TYPOGRAPHY.badge}
              fw={600}
              styles={{
                root: {
                  borderColor: colors.neutral[3],
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  height: '28px',
                  padding: '0 16px',
                  color: colors.primary[5],
                  '&:hover': { backgroundColor: colors.primary[1] },
                },
              }}
            >
              {badge}
            </Button>

            <Title order={2} ta="center" style={TYPOGRAPHY.sectionTitle} fw={700} lh={1.2}>
              <Text component="span" inherit c={colors.primary[5]}>{titlePrefix}</Text>
              <Text component="span" inherit c={colors.neutral[8]}>{' '}{titleSuffix}</Text>
            </Title>

            <Text maw={600} ta="center" style={TYPOGRAPHY.sectionDescription} lh={1.6} c={colors.neutral[6]}>
              {description}
            </Text>
          </ComponentGroup>

          {/* Mobile Carousel */}
          <Box hiddenFrom="md" className="w-full">
            <Box style={{ position: 'relative' }}>
              <Group
                justify="space-between"
                style={{
                  position: 'absolute', top: '50%', left: 0, right: 0,
                  transform: 'translateY(-50%)', zIndex: 10, pointerEvents: 'none', padding: '0 8px',
                }}
              >
                <ActionIcon variant="filled" size="lg" radius="xl" onClick={handlePrevious} aria-label="Previous article"
                  style={{
                    pointerEvents: 'auto', backgroundColor: colors.neutral[0],
                    border: `1px solid ${colors.neutral[2]}`, color: colors.neutral[7],
                    width: 44, height: 44, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                >
                  <ChevronLeft size={20} />
                </ActionIcon>
                <ActionIcon variant="filled" size="lg" radius="xl" onClick={handleNext} aria-label="Next article"
                  style={{
                    pointerEvents: 'auto', backgroundColor: colors.primary[5],
                    color: 'white', width: 44, height: 44, boxShadow: '0 4px 12px rgba(0,0,0,0.16)',
                  }}
                >
                  <ChevronRight size={20} />
                </ActionIcon>
              </Group>

              <Box px="md">
                <Card variant="elevated" style={{ overflow: 'hidden', backgroundColor: colors.neutral[0], border: `1px solid ${colors.neutral[2]}`, borderRadius: CARD_BORDER_RADIUS }}>
                  <Stack gap={0}>
                    <Box style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden', backgroundColor: colors.neutral[1] }}>
                      <Image src={articles[activeIndex].image} alt={articles[activeIndex].title} fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
                    </Box>
                    <Stack gap="md" p="xl">
                      <Title order={3} fz={{ base: 18, md: 20 }} fw={600} lh={1.4} c={colors.neutral[9]}>
                        {articles[activeIndex].title}
                      </Title>
                      {articles[activeIndex].excerpt && (
                        <Text fz={{ base: 14, md: 16 }} lh={1.6} c={colors.neutral[6]}>
                          {articles[activeIndex].excerpt}
                        </Text>
                      )}
                      <Button variant="filled" size="md" component="a"
                        href={articles[activeIndex].url || articles[activeIndex].slug}
                        target="_blank" rel="noopener noreferrer"
                        rightSection={<ArrowRight size={16} />}
                        styles={{ root: { backgroundColor: colors.primary[5], height: '44px', padding: '0 24px', fontSize: '15px' } }}
                      >
                        Read More
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              </Box>

              <CarouselDots total={articles.length} active={activeIndex} onChange={handleDotClick} colors={colors} />
            </Box>
          </Box>

          {/* Desktop Grid */}
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="xl" visibleFrom="md" className="w-full">
            {articles.map((article) => (
              <DesktopArticleCard key={article.id} article={article} colors={colors} />
            ))}
          </SimpleGrid>

        </ComponentGroup>
      </Container>
    </Section>
  );
};

export default React.memo(NewsSection);