/**
 * Providers Page Data (Frontend source of truth)
 *
 * All Providers page copy/content should live here.
 */
import type { ProvidersPageContent } from '../../domain/entities/Provider';

export const providersData: ProvidersPageContent = {
  hero: {
    badge: 'We are offering the',
    title: 'Trusted Providers In Dental Care',
    description:
      'Receive Tailored Care With OralIQ Profile Sent Securely To Your Provider',
    backgroundImage: '/images/provider-page-hero-bg.jpg',
  },
  search: {
    title: 'Find a Local Provider Near You',
    description: 'Find dental providers near you who accept your insurance.',
    buttons: {
      findDentist: 'Find a Dentist',
      bookAppointment: 'Book an Appointment',
      smileBrighter: 'Smile Brighter',
    },
    searchButtonText: 'Search',
  },
  providerFeatures: {
    title: 'Are you a Provider?',
    subtitle: 'Software for Providers',
    description: 'Suitable softwares curated for your needs',
    ctaButton: 'Contact Us',
    brand: {
      prefix: 'D3NT',
      suffix: 'IQ',
    },
    features: [
      {
        title: 'Practice Management Tools',
        description:
          'Comprehensive tools to manage your dental practice efficiently and streamline operations.',
        icon: 'Users',
      },
      {
        title: 'Patient Record System',
        description:
          'Digital patient records system for easy access, management, and secure storage.',
        icon: 'FileText',
      },
      {
        title: 'Billing & Insurance Management',
        description:
          'Simplify insurance processes with seamless integration and automated claim handling.',
        icon: 'DollarSign',
      },
      {
        title: 'Analytics & Reporting',
        description:
          'Track patient trends, performance metrics, and financial analytics in real-time.',
        icon: 'MessageCircle',
      },
    ],
  },
};
