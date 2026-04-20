/**
 * ServiceCard Component
 *
 * This file contains a reusable presentation component that displays a single service
 * as a card in a grid layout. It's used in services listings for both patient and provider services.
 *
 * How it works:
 * 1. Receives a Service entity as props
 * 2. Renders a card with service image, title, description, and "Learn More" link
 * 3. Uses Next.js Image component for optimized image loading with error fallback
 * 4. Links to the individual service detail page using the service slug or link
 * 5. Displays service category information (patient or provider)
 *
 * As a Presentation Component, this file:
 * - Is a presentational/dumb component (receives data via props, no business logic)
 * - Handles only UI rendering and navigation
 * - Is reusable across different contexts (patient services, provider services)
 * - Follows the Single Responsibility Principle (renders service card only)
 * - Uses CSS variables for theme-aware styling (dark/light mode support)
 *
 * The component is client-side only ('use client') for interactivity and uses
 * Next.js Image component for optimized image loading with graceful error handling.
 */
'use client';
import React from 'react';

import Image from 'next/image';
import { Title, Text, Stack, Anchor } from '@mantine/core';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/shared/components/base';
import Link from 'next/link';
import type { Service } from '../../domain/entities/Service';
import { typography } from '@/shared/theme/typography';

export interface ServiceCardProps {
  service: Service;
  onOpenDetail?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onOpenDetail }) => {
  const handleOpen = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onOpenDetail) {
      return;
    }
    event.preventDefault();
    onOpenDetail(service);
  };

  return (
    <Card variant="interactive" className="h-full">
      <Stack gap="md">
        <div
          className="relative mb-4 overflow-hidden rounded-t-lg bg-secondary-light-100"
          style={{ height: '192px' }}
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <Stack gap="sm">
          <Title
            order={3}
            style={{
              fontSize: typography.scale.heading.h4,
              fontWeight: typography.weights.semibold,
              lineHeight: typography.lineHeights.snug,
              color: 'var(--text-primary)',
            }}
          >
            {service.title}
          </Title>
          <Text
            style={{
              fontSize: typography.scale.body.md,
              fontWeight: typography.weights.regular,
              lineHeight: typography.lineHeights.relaxed,
              color: 'var(--text-secondary)',
            }}
          >
            {service.description}
          </Text>
          <Anchor
            href={service.link}
            c="primary-400"
            className="group inline-flex items-center hover:text-primary-dark-300"
            component={Link}
            onClick={handleOpen}
            style={{
              fontSize: typography.scale.body.lg,
              fontWeight: typography.weights.medium,
            }}
          >
            Learn More
            <ArrowRight
              size={16}
              className="ml-2 transform transition-transform group-hover:translate-x-1"
            />
          </Anchor>
        </Stack>
      </Stack>
    </Card>
  );
};
