import type { Metadata } from 'next';
import { howItWorksData } from '@/modules/public-pages/how-it-works/infrastructure/data/howItWorksData';
import { HowItWorksPage } from '@/modules/public-pages/how-it-works/presentation/HowItWorksPage';

export const metadata: Metadata = {
  title: 'How It Works – DENTIQ',
  description:
    'See how DENTIQ transforms the dental experience for patients and providers — from symptom assessment to appointment and beyond.',
};

export default function HowItWorksRoutePage() {
  return <HowItWorksPage content={howItWorksData} />;
}
