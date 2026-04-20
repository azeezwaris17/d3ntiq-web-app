/**
 * Services Page Data (Frontend source of truth)
 *
 * All Services page copy/content should live here.
 */
import type { ServicesPageContent, Service } from '../../domain/entities/Service';

const patientServices: Service[] = [
  {
    id: 'patient-portal',
    title: 'Patient Portal',
    description: 'Securely manage appointments, view treatment plans, and billing.',
    link: '/services/patient-portal',
    image: '/images/services/patient-portal.jpg',
    category: 'patient',
    slug: 'patient-portal',
    detailedDescription:
      'Our centralized digital gateway empowers patients to take full ownership of their oral health journey through a secure, user-friendly interface accessible from any device. It serves as a single source of truth where users can explore their dental history, view personalized educational content, and track their progress toward a healthier smile. By putting clinical information at their fingertips, we transform the patient from a passive observer into an active, informed participant in their own care.',
    features: [
      'View and manage upcoming appointments',
      'Access complete treatment history and plans',
      'Interactive 3D dental models and visualizations',
      'Secure document upload and storage',
      'Online bill payment and insurance tracking',
      'Direct messaging with your dental team',
      'Appointment reminders and notifications',
      'Family account management',
    ],
  },
  {
    id: 'appointment-scheduling',
    title: 'Appointment Scheduling',
    description: 'Book, reschedule, or cancel appointments with ease.',
    link: '/services/appointment-scheduling',
    image: '/images/services/appointment-scheduling.jpg',
    category: 'patient',
    slug: 'appointment-scheduling',
    detailedDescription:
      'Our frictionless booking system is designed to eliminate the administrative friction often associated with dental visits for both the patient and the clinic staff. Patients can easily view available slots, book consultations, and receive automated reminders that keep them engaged with their care schedule. By streamlining the coordination of visits, D3NTIQ ensures that the journey from the initial inquiry to the follow-up appointment is as smooth and professional as possible.',
    features: [
      'Real-time availability checking',
      'Book appointments 24/7 online',
      'Easy rescheduling and cancellation',
      'Automated appointment reminders',
      'Multi-location support',
      'Provider preference selection',
      'Recurring appointment scheduling',
      'Integration with your calendar',
    ],
  },
  {
    id: 'insurance-upload',
    title: 'Insurance Upload',
    description: 'Easily upload your insurance documents and track claims.',
    link: '/services/insurance-upload',
    image: '/images/services/insurance-upload.jpg',
    category: 'patient',
    slug: 'insurance-upload',
    detailedDescription:
      'Simplify insurance management with our streamlined upload and tracking system. Securely submit insurance cards and documents, track claim statuses in real-time, and understand your coverage and benefits at a glance. Our system automatically verifies eligibility and estimates your out-of-pocket costs, so you always know what to expect before your visit.',
    features: [
      'Secure document upload and storage',
      'Real-time insurance verification',
      'Automated benefits checking',
      'Claims status tracking',
      'Coverage breakdown and explanations',
      'Out-of-pocket cost estimates',
      'Multiple insurance plan management',
      'Digital insurance card access',
    ],
  },
  {
    id: 'secure-messaging',
    title: 'Secure Messaging',
    description: 'Communicate securely with your dental team.',
    link: '/services/secure-messaging',
    image: '/images/services/secure-messaging.jpg',
    category: 'patient',
    slug: 'secure-messaging',
    detailedDescription:
      'Stay connected with your dental care team through our HIPAA-compliant secure messaging platform. Ask questions, request prescription refills, share concerns, and receive timely responses - all while maintaining the highest standards of privacy and security. No more playing phone tag or waiting days for answers to simple questions.',
    features: [
      'HIPAA-compliant encrypted messaging',
      'Direct communication with providers',
      'Attach photos and documents',
      'Message history and archiving',
      'Quick response times',
      'Prescription refill requests',
      'Post-treatment check-ins',
      'Multi-device synchronization',
    ],
  },
  {
    id: 'doctor-notes',
    title: 'Access to Dentist Notes',
    description: 'Review post-treatment care instructions anytime.',
    link: '/services/doctor-notes',
    image: '/images/services/doctor-notes.jpg',
    category: 'patient',
    slug: 'doctor-notes',
    detailedDescription:
      'We bridge the communication divide by providing patients with transparent, easy-to-understand summaries of their clinical visits and diagnoses. We translate complex medical jargon into clear, actionable insights so that patients truly understand the "why" behind their treatment recommendations. This level of transparency eliminates the confusion typically felt after a visit, fostering a deeper sense of trust and confidence in the provider’s expertise.',
    features: [
      'Visit summaries and clinical notes access',
      'Post-treatment instructions and reminders',
      'Plain-language explanations of diagnoses',
      'Recommendations and follow-up plan visibility',
      'Secure access from any device',
    ],
  },
];

const providerServices: Service[] = [
  {
    id: 'treatment-planning',
    title: 'Treatment Planning & Tracking',
    description: 'Build multi-stage plans with cost estimates and approvals.',
    link: '/services/treatment-planning',
    image: '/images/services/treatment-planning.jpg',
    category: 'provider',
    slug: 'treatment-planning',
    detailedDescription:
      'We transform abstract care plans into interactive, visual roadmaps that help patients see exactly what their dental journey entails. By combining 3D tools with intelligent tracking, D3NTIQ allows patients to visualize procedure outcomes and monitor their progress at every clinical milestone. This visual approach simplifies complex treatment paths, making it easy for patients to understand the value of their care and what to expect at each step.',
    features: [
      'Interactive, visual treatment roadmaps',
      'Multi-stage plan creation and approvals',
      'Cost estimate generation and tracking',
      'Progress tracking across milestones',
      '3D visualization support',
    ],
  },
  {
    id: 'user-roles',
    title: 'User Roles & Permissions',
    description: 'Control access for staff with different responsibilities.',
    link: '/services/user-roles',
    image: '/images/services/user-roles.jpg',
    category: 'provider',
    slug: 'user-roles',
    detailedDescription:
      'D3NTIQ ensures the highest level of data integrity and security by offering granular access controls tailored to every member of the dental team. Administrators can define specific roles for front-desk staff, hygienists, and lead dentists, ensuring that sensitive patient information is only visible to authorized personnel. This secure architecture not only protects patient privacy but also streamlines the internal workflow by presenting each team member with only the tools relevant to their role.',
    features: [
      'Granular role-based access controls',
      'Configurable permissions per role',
      'Audit-friendly access patterns',
      'Reduced operational risk and improved privacy',
    ],
  },
  {
    id: 'reporting-analytics',
    title: 'Reporting & Analytics',
    description: 'Track patient trends, performance, and financials.',
    link: '/services/reporting-analytics',
    image: '/images/services/reporting-analytics.jpg',
    category: 'provider',
    slug: 'reporting-analytics',
    detailedDescription:
      "D3NTIQ provides providers with high-level dashboards that translate practice data into actionable business and clinical intelligence. These tools track essential metrics such as patient engagement, treatment acceptance rates, and overall practice health to help clinics optimize their daily operations. By using these insights, providers can make data-driven decisions that improve both the patient experience and the clinic's long-term efficiency.",
    features: [
      'High-level dashboards for key metrics',
      'Patient engagement and acceptance tracking',
      'Practice performance visibility',
      'Financial and operational reporting',
      'Decision support via trends and insights',
    ],
  },
];

export const servicesData: ServicesPageContent = {
  hero: {
    badge: 'Our Services',
    title: 'Our Comprehensive\nDental Services',
    description:
      'We provide a suite of dental services, including appointments, treatment planning, medical records, insurance processing, secure communication, and mobile access.',
    backgroundImage: '/images/services-page-hero-bg.jpg',
    ctaButtons: {
      moreDetails: {
        text: 'More Details',
        link: '/services/learn-more',
      },
      bookDemo: {
        text: 'Book Demo',
        link: '/contact',
      },
    },
  },
  patientServices: {
    id: 'patient',
    title: 'For Patients',
    description:
      "Experience seamless dental care management with our comprehensive patient portal. Interactive 3D tools, access to doctor's notes, and secure communication keep you informed and confident.",
    badge: 'Our Services',
    services: patientServices,
  },
  providerServices: {
    id: 'provider',
    title: 'For Providers',
    description:
      'Strong patient relationships are the foundation of great dentistry. D3NTIQ gives you powerful tools to streamline workflows, create transparent treatment plans, and communicate more effectively with patients.',
    badge: 'Our Services',
    services: providerServices,
  },
  conversionFlow: {
    title: 'Acquire Better Patients Before They Walk In',
    descriptionPrefix: 'Instead of cold leads or confused patients,',
    highlightedProduct: 'Oral IQ',
    descriptionSuffix: 'delivers informed patients ready for meaningful consultations',
    steps: [
      {
        id: 'website-visitor',
        title: 'Website Visitor',
        description: 'Browsing for dental solutions online.',
        icon: 'globe',
      },
      {
        id: 'oral-iq-analysis',
        title: 'Oral IQ Analysis',
        description: 'AI-driven symptom screening and education.',
        icon: 'analysis',
      },
      {
        id: 'informed-lead',
        title: 'Informed Lead',
        description: 'Patient understands value and procedure.',
        icon: 'lead',
      },
      {
        id: 'appointment-booking',
        title: 'Appointment Booking',
        description: 'High-intent conversion to your schedule.',
        icon: 'booking',
      },
    ],
  },
  news: {
    badge: 'Latest News',
    titlePrefix: 'Latest',
    titleSuffix: 'News',
    description:
      'Stay informed with the latest dental insights and expert advice — from patient engagement to operations and modern dental care.',
    emptyStateMessage: 'Check back soon for the latest articles.',
    articles: [],
  },
  testimonials: {
    badge: 'Testimonials',
    title: 'Testimonials',
    description: 'Aliquam lacinia diam quis lacus euismod',
    quote:
      'Posuere cras morbi tellus ipsum eu pharetra. Semper sit leo dignissim tincidunt quisque vulputate sed sociis. Dignissim vitae porttitor odio risus praesent. Non commodo nibh enim dolor ut.',
    author: 'Debs A. George',
    authorRole: 'Clinic Specialist',
    highlightedProfileIndex: 2,
    profiles: [
      '/images/testimonials/testimonial-1.jpg',
      '/images/testimonials/testimonial-2.jpg',
      '/images/testimonials/testimonial-3.jpg',
      '/images/testimonials/testimonial-4.jpg',
      '/images/testimonials/testimonial-5.jpg',
    ],
  },
  educatedPatientsImpact: {
    title: 'Why Educated Patients Matter',
    metrics: [
      {
        id: 'patient-readiness',
        value: '85%',
        label: 'Patient Readiness Rate',
        description:
          'Patients who understand their condition are significantly more likely to follow recommended treatments',
      },
      {
        id: 'roi',
        value: '2.4x',
        label: 'ROI for Practices',
        description: 'Better informed patients show higher engagement and long-term care adherence',
      },
      {
        id: 'consultation-time',
        value: '30m',
        label: 'Avg. Consultation Time Saved',
        description: 'Educated patients reduce consultation time and improve clinical efficiency',
      },
    ],
    source: 'Source: Performance metrics collected by Health Align 2023 and Oral Data Insights.',
  },
  finalCta: {
    title: 'Start Turning Website Visitors\nInto Informed Dental Patients',
    description:
      'See how Oral IQ can help your practice acquire, educate, and retain more patients',
    primaryButtonText: 'Book a Demo',
    primaryButtonLink: '/contact',
    secondaryButtonText: 'Explore the Oral IQ Platform',
    secondaryButtonLink: '/oral-iq',
  },
};
