import type { Metadata } from 'next';
import { aboutData } from '@/modules/public-pages/about/infrastructure/data/aboutData';
import { AboutPage } from '@/modules/public-pages/about/presentation/AboutPage';

export const metadata: Metadata = {
  title: 'About Us – DENTIQ',
  description:
    'Learn about the team and mission behind DENTIQ — building a more transparent, patient-centered dental care experience.',
};

export default function AboutRoutePage() {
  return <AboutPage content={aboutData} />;
}
