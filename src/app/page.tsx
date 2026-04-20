import type { Metadata } from 'next';
import { LandingPage } from '@/modules/public-pages/landing/presentation/LandingPage';

export const metadata: Metadata = {
  title: 'Welcome to D3NTIQ – Intelligent Dental Solution',
  description: 'Choose your experience: Patient assessment with AI-driven Oral IQ or Provider portal.',
};

export default function RootPage() {
  return <LandingPage />;
}
