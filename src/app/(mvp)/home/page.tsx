import type { Metadata } from 'next';
import { Suspense } from 'react';
import { homepageData } from '@/modules/public-pages/homepage/infrastructure/data/homepageData';
import { Homepage } from '@/modules/public-pages/homepage/presentation/Homepage';
import { NewsSectionServer } from '@/modules/public-pages/news/presentation/components/NewsSection.server';

export const metadata: Metadata = {
  title: 'DENTIQ – Smarter Dental Care, Built on Clarity and Trust',
  description:
    'DENTIQ combines interactive 3D tools, secure communication, and intelligent workflows to make dental care transparent, accessible, and patient-centered.',
};

export default async function PublicHomePage() {
  return (
    <Homepage
      content={homepageData}
      newsSection={
        <Suspense fallback={null}>
          <NewsSectionServer
            maxArticles={3}
            useCategoryRotation={true}
            categories={['clinical-research', 'practice-business', 'industry-news']}
          />
        </Suspense>
      }
    />
  );
}
