'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Box, Card, Container, Group, Stack, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Star } from 'lucide-react';
import type { AboutPageContent } from '../../domain/entities/AboutPageContent';

export interface TestimonialsSectionProps {
  testimonials: AboutPageContent['testimonials'];
}

const STAR_COLOR = '#F59E0B';
const DOT_ACTIVE = '#3a8fa3';
const DOT_INACTIVE = '#d1d5db';

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const safeActive = useMemo(
    () => Math.min(Math.max(activeIndex, 0), testimonials.items.length - 1),
    [activeIndex, testimonials.items.length]
  );

  useEffect(() => { setActiveIndex(0); }, [isMobile]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!top) return;
        const idx = Number((top.target as HTMLElement).getAttribute('data-index'));
        if (!Number.isNaN(idx)) setActiveIndex(idx);
      },
      { root, threshold: [0.55, 0.75] }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [testimonials.items.length]);

  const handleDot = (index: number) => {
    itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    setActiveIndex(index);
  };

  return (
    <Box
      component="section"
      py={{ base: 64, md: 80 }}
      style={{ backgroundColor: '#f4f8fb', width: '100%' }}
    >
      <Container size="xl">

        {/* Header */}
        <Stack gap={10} align="center" mb={48}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#3a8fa3',
              letterSpacing: '0.04em',
            }}
          >
            {testimonials.badge}
          </Text>

          <Title
            order={2}
            ta="center"
            fw={800}
            c="#0c2140"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', letterSpacing: '-0.02em' }}
          >
            {testimonials.title}
          </Title>

          {/* D3NT IQ brand line */}
          <Text fw={700} c="#0c2140" style={{ fontSize: 14 }}>
            D3NT<sup style={{ fontSize: '0.62em', verticalAlign: 'super', color: '#3a8fa3' }}>IQ</sup>
          </Text>
        </Stack>

        {/* Scrollable cards */}
        <Box maw={1100} mx="auto">
          <div
            ref={scrollerRef}
            style={{
              display: 'flex',
              gap: 20,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: 8,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              justifyContent: isMobile ? undefined : 'center',
            }}
          >
            {testimonials.items.map((item, index) => (
              <div
                key={item.id}
                data-index={index}
                ref={(el) => { itemRefs.current[index] = el; }}
                style={{
                  flexShrink: 0,
                  scrollSnapAlign: 'center',
                  width: isMobile ? 'min(300px, 88%)' : 320,
                }}
              >
                <Card
                  padding="xl"
                  radius="lg"
                  style={{
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 12px rgba(15,23,42,0.07)',
                    border: 'none',
                    minHeight: 200,
                  }}
                >
                  <Stack gap={12}>
                    {/* Name + stars on same row */}
                    <Group justify="space-between" align="center" wrap="nowrap">
                      <Text fw={600} c="#0c2140" style={{ fontSize: 15 }}>
                        {item.name}
                      </Text>
                      <Group gap={3}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < item.rating ? STAR_COLOR : 'none'}
                            stroke={STAR_COLOR}
                            strokeWidth={1.5}
                          />
                        ))}
                      </Group>
                    </Group>

                    {/* Review text */}
                    <Text lh={1.65} c="#64748b" style={{ fontSize: 13.5 }}>
                      {item.text}
                    </Text>
                  </Stack>
                </Card>
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          <Group justify="center" gap={8} mt={28}>
            {testimonials.items.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDot(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === safeActive ? DOT_ACTIVE : DOT_INACTIVE,
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              />
            ))}
          </Group>
        </Box>

      </Container>
    </Box>
  );
};
