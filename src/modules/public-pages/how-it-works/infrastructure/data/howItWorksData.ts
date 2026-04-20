/**
 * How It Works Page Data (Frontend source of truth)
 *
 * All how-it-works page copy/content should live here.
 */
import type { HowItWorksContent } from '../../domain/entities/HowItWorksContent';

export const howItWorksData: HowItWorksContent = {
  hero: {
    badge: 'NEW: AI-TRIAGE INTEGRATION',
    title: 'How D3NTIQ Works',
    description:
      'D3NTIQ bridges the gap between patients and providers with smart assessments, interactive visuals, and secure data sharing — all before you sit in the chair.',
    primaryButtonText: 'Get Started Now',
    secondaryButtonText: 'Watch Demo',
    backgroundImage: '/images/homepage-hero-bg.jpg',
    stats: {
      label: 'GROWTH',
      value: '+24% Patients',
    },
    visualImage: '/images/how-it-works/hero-img.png',
  },
  journey: {
    title: 'Your 4-Step Journey',
    description:
      'Follow these simple steps to transform how you manage your oral health and connect with experts.',
    tabs: {
      providers: 'For Providers',
      patients: 'For Patients',
    },
    steps: {
      forProviders: [
        {
          id: 'receive-oral-iq',
          title: 'Receive Oral IQ',
          description:
            'Get instant alerts on your provider dashboard when a patient completes their AI-driven symptom assessment.',
          image: '/images/services/patient-portal.jpg',
        },
        {
          id: 'review-structured-data',
          title: 'Review Structured Data',
          description:
            'Access clear symptom summaries with interactive 3D tooth highlights and triaged data before the patient even arrives.',
          image: '/images/services/doctor-notes.jpg',
        },
        {
          id: 'plan-treatment',
          title: 'Plan Treatment',
          description:
            'Streamline chairside planning using our intuitive tablet-based clinical charting tools and diagnostic AI assistance.',
          image: '/images/services/treatment-planning.jpg',
        },
        {
          id: 'track-outcomes',
          title: 'Track Outcomes',
          description:
            'Monitor patient health progression and practice growth with integrated clinical metrics and longitudinal tracking.',
          image: '/images/services/reporting-analytics.jpg',
        },
      ],
      forPatients: [
        {
          id: 'complete-oral-iq',
          title: 'Complete Oral IQ',
          description:
            'Use our interactive 3D mouth model to pinpoint symptoms and receive instant AI-powered guidance.',
          image: '/images/services/patient-portal.jpg',
        },
        {
          id: 'get-recommendations',
          title: 'Get Recommendations',
          description:
            'Receive personalized treatment suggestions and educational resources based on your symptoms.',
          image: '/images/services/treatment-planning.jpg',
        },
        {
          id: 'find-provider',
          title: 'Find a Provider',
          description:
            'Search our network of verified dental professionals and book appointments directly through the platform.',
          image: '/images/services/appointment-scheduling.jpg',
        },
        {
          id: 'track-health',
          title: 'Track Your Health',
          description:
            'Monitor your oral health journey with progress tracking and automated follow-up reminders.',
          image: '/images/services/reporting-analytics.jpg',
        },
      ],
    },
  },
  benefits: {
    badge: 'CORE BENEFITS',
    title: 'Technology That Understands Your Practice',
    description:
      'Stop juggling between clinical tasks and patient management. D3NTIQ automates the busywork so you can focus on the smile.',
    items: [
      {
        id: 'efficient-triage',
        title: 'Efficient Triage',
        description:
          'Categorize patient needs and emergency severity before they even sit in the chair. Save hours on intake and prioritize clinical urgency.',
        icon: 'clipboard-list',
      },
      {
        id: 'seamless-integration',
        title: 'Seamless Integration',
        description:
          'No more data silos. D3NTIQ connects directly with your existing PMS, syncing patient histories, schedules, and clinical notes instantly.',
        icon: 'link',
      },
      {
        id: 'retention-focused',
        title: 'Retention Focused',
        description:
          'Automated follow-ups that sound personal, not robotic. Increase case acceptance and keep your appointment book full with AI outreach.',
        icon: 'heart',
      },
    ],
  },
  cta: {
    title: 'Ready to Get Started?',
    description:
      'Join thousands of patients and providers making dental health more transparent, accessible, and efficient.',
    primaryButtonText: 'Complete Your Oral IQ',
    secondaryButtonText: 'Find a Provider',
    backgroundColor: '#5A8FA3',
  },
};
