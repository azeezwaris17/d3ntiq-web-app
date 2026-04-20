import React from 'react';
import type { HowItWorksContent } from '../domain/entities/HowItWorksContent';
import { HowItWorksHeroSection, JourneySection, BenefitsSection } from './components';

export interface HowItWorksPageProps {
  content: HowItWorksContent;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ content }) => {
  return (
    <div className="min-h-screen">
      <HowItWorksHeroSection hero={content.hero} />
      <JourneySection />
      <BenefitsSection />
    </div>
  );
};
