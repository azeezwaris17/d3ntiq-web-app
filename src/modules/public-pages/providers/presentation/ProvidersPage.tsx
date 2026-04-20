import React from 'react';
import type { ProvidersPageContent } from '../domain/entities/Provider';
import { ProvidersHeroSection } from './components';
// import { TrustIndicatorsSection } from './components/TrustIndicatorsSection';
// import { ProviderDemoSection } from './components/ProviderDemoSection';
// import { ProviderImpactSection } from './components/ProviderImpactSection';
import { ProviderSearchMapSection } from './components/ProviderSearchMapSection';

export interface ProvidersPageProps {
  content: ProvidersPageContent;
}

export const ProvidersPage: React.FC<ProvidersPageProps> = ({ content }) => {
  return (
    <div className="min-h-screen">
      <ProvidersHeroSection hero={content.hero} />
      <ProviderSearchMapSection />
      {/* <TrustIndicatorsSection /> */}
      {/* <ProviderDemoSection /> */}
      {/* <ProviderImpactSection /> */}
    </div>
  );
};
