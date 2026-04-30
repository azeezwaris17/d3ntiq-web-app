'use client';
import React from 'react';

import dynamic from 'next/dynamic';
import type { HomepageContent } from '../domain/entities/HomepageContent';
import HeroSection from './components/HeroSection';
import { PracticeRegistrationSection } from './components';
import { BrandServices } from '@/shared/components/sections';
import { Box } from '@mantine/core';

// Lazy-load the heavy OralIQ section — keeps it out of the initial bundle
const OralIQSection = dynamic(
  () => import('./components/OralIQSection').then((m) => ({ default: m.OralIQSection })),
  { ssr: false, loading: () => <Box style={{ minHeight: 400 }} /> }
);

export interface HomepageProps {
  content: HomepageContent;
  /** Server-rendered news section passed in from the page so it stays a Server Component */
  newsSection?: React.ReactNode;
}

export const Homepage: React.FC<HomepageProps> = ({ content, newsSection }) => {
  const { hero, oralIQ, forPatients, forProviders, practiceRegistration } = content;

  return (
    <div className="min-h-screen">
      <HeroSection hero={hero} />
      <OralIQSection oralIQ={oralIQ} />
      <BrandServices
        key="for-patients"
        badge={forPatients.badge}
        title={forPatients.title}
        description={forPatients.description}
        features={forPatients.features}
      />
      <BrandServices
        key="for-providers"
        badge={forProviders.badge}
        title={forProviders.title}
        description={forProviders.description}
        features={forProviders.features}
      />
      <PracticeRegistrationSection practiceRegistration={practiceRegistration} />
      {newsSection}
    </div>
  );
};
