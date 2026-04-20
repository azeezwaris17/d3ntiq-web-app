import type { Metadata } from 'next';
import { providersData } from '@/modules/public-pages/providers/infrastructure/data/providersData';
import type { ProvidersPageContent } from '@/modules/public-pages/providers/domain/entities/Provider';
import { ProvidersPage } from '@/modules/public-pages/providers/presentation/ProvidersPage';

export const metadata: Metadata = {
  title: 'Find Dental Providers – DENTIQ Providers Network',
  description:
    'Discover trusted dental providers near you and explore how DENTIQ empowers modern dental practices.',
};

export default async function ProvidersRoutePage() {
  const content: ProvidersPageContent = providersData;
  return <ProvidersPage content={content} />;
}
