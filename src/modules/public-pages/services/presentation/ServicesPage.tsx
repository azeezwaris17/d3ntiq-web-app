'use client';
import React from 'react';

import type { ServicesPageContent } from '../domain/entities/Service';
import {
  ServicesHeroSection,
  PatientAcquisitionFlowSection,
  ServicesTestimonialsSection,
  EducatedPatientsImpactSection,
  ServicesFinalCtaSection,
} from './components';
import { BrandServices, NewsSection } from '@/shared/components/sections';

export interface ServicesPageProps {
  content: ServicesPageContent;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ content }) => {
  return (
    <div className="min-h-screen">
      <ServicesHeroSection hero={content.hero} />

      {/* Patient Services */}
      <BrandServices
        badge={content.patientServices.badge}
        title={content.patientServices.title}
        description={content.patientServices.description}
        features={content.patientServices.services}
      />

      {/* Provider Services */}
      <BrandServices
        badge={content.providerServices.badge}
        title={content.providerServices.title}
        description={content.providerServices.description}
        features={content.providerServices.services}
      />

      <PatientAcquisitionFlowSection flow={content.conversionFlow} />
      <ServicesTestimonialsSection testimonials={content.testimonials} />
      <EducatedPatientsImpactSection impact={content.educatedPatientsImpact} />
      <ServicesFinalCtaSection cta={content.finalCta} />

      {/* News Section - Using static data for now (client component limitation) */}
      <NewsSection
        badge={content.news.badge}
        titlePrefix={content.news.titlePrefix}
        titleSuffix={content.news.titleSuffix}
        description={content.news.description}
        emptyStateMessage={content.news.emptyStateMessage}
        articles={content.news.articles}
      />
    </div>
  );
};
