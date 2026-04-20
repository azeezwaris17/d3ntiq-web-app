/**
 * Homepage Data (Frontend source of truth)
 *
 * All homepage copy/content should live here.
 */
import type { HomepageContent } from '../../domain/entities/HomepageContent';

export const homepageData: HomepageContent = {
  hero: {
    badgeText: 'ANALYSIS FOR MODERN PRACTICES',
    headingLineOne: 'Turn Patient',
    headingLineTwoPrefix: 'Symptoms Into',
    headingLineTwoAccent: 'Clinical Insight',
    headingLineThree: '—Before They Arrive.',
    descriptionAccent: 'Oral IQ',
    description:
      'transforms patient-reported symptoms into structured, actionable summaries — improving communication, show rates, and treatment acceptance.',
    primaryCtaText: 'Start Your Oral IQ Assessment',
    primaryCtaLink: '/oral-iq',
    secondaryCtaText: 'See How It Improves Your Practice',
    secondaryCtaLink: '/how-it-works',
    backgroundImage: '/images/homepage-hero-bg.jpg',
  },
  oralIQ: {
    title: 'ORAL',
    suptitle: 'IQ',
    subtitle: 'Symptom/Treatment Assessment',
    description:
      'Please interact with the 3D mouth model below to indicate your symptoms or ask questions about treatments. Click on the affected areas to provide details.',
    ctaButtonText: 'Proceed',
    selectToothAlertMessage: 'Please select a tooth on the mouth model to proceed.',
    modal: {
      assessment: {
        title: 'Describe Your Symptoms',
        symptomTypeLabel: 'Symptom Type',
        symptomTypePlaceholder: 'Select symptom',
        painLevelLabel: 'Pain Level (1-10)',
        painLevelPlaceholder: 'Enter pain level',
        durationLabel: 'Duration',
        durationPlaceholder: 'Enter duration',
        specificSensationsLabel: 'Specific Sensations',
        specificSensationsPlaceholder: 'Describe your symptoms in detail...',
        checkboxes: {
          sharpPain: 'Sharp pain',
          dullAche: 'Dull ache',
          throbbing: 'Throbbing',
        },
        mouthImageSrc: '/images/oral-iq-mouth-model.jpg',
        backButtonText: 'Back',
        proceedButtonText: 'Proceed',
      },
      symptomPicker: {
        title: 'Select a Symptom',
      },
      symptomCategories: [
        {
          id: 'pain-discomfort',
          title: 'Pain and Discomfort',
          bulletPoints: [
            'Toothache',
            'Sharp Pain',
            'Dull or Throbbing Pain',
            'Pain when chewing or biting',
            'Pain when releasing bite pressure',
            'Radiating pain (head, ear, jaw)',
            'Intermittent',
            'Constant pain',
          ],
        },
        {
          id: 'sensitivity',
          title: 'Sensitivity',
          bulletPoints: [
            'Sensitivity to cold',
            'Sensitivity to heat',
            'Sensitivity to pressure',
            'Sensitivity to sweet foods/drinks',
            'Sensitivity after dental treatment',
          ],
        },
        {
          id: 'swelling-inflammation',
          title: 'Swelling & Inflammation',
          bulletPoints: [
            'Gum Swelling',
            'Facial Swelling',
            'Localized Swelling near a tooth',
            'Red or inflamed gums',
            'Swelling with pain',
            'Swelling without pain',
          ],
        },
        {
          id: 'bleeding-gum-issues',
          title: 'Bleeding & Gum Issues',
          bulletPoints: [
            'Bleeding Gums',
            'Bleeding while brushing',
            'Bleeding while flossing',
            'Red or inflamed gums',
            'Gum recession',
            'Tender or sore gums',
            'Gum infection or abscess',
          ],
        },
        {
          id: 'infection-indicators',
          title: 'Infection Indicators',
          bulletPoints: ['Bad breath', 'Foul taste', 'Pus or discharge', 'Fever'],
        },
      ],
      durationPicker: {
        title: 'Primary Duration Options',
        groups: [
          {
            title: 'Short-Term (Acute)',
            options: ['Just started (today)', '1-3 days', '4-7 days'],
          },
          {
            title: 'Medium-Term (Subacute)',
            options: ['1-2 weeks', '2-4 weeks'],
          },
          {
            title: 'Long-Term (Chronic)',
            options: ['1-3 months', '3-6 months'],
          },
          {
            title: 'Unknown/Unsure',
            options: ['Not sure'],
          },
        ],
      },
      treatmentOptions: {
        title: 'Treatment Options',
        learnMoreButtonText: 'Learn More',
        backButtonText: 'Back',
        proceedButtonText: 'Proceed',
        cards: [
          {
            id: 'invisalign',
            title: 'Invisalign',
            description: 'Clear aligners to straighten teeth discreetly.',
            imageSrc: '/images/services/secure-messaging.jpg',
            learnMoreHref: '/services/learn-more',
          },
          {
            id: 'braces',
            title: 'Braces',
            description: 'Traditional braces for effective teeth straightening.',
            imageSrc: '/images/services/appointment-scheduling.jpg',
            learnMoreHref: '/services/learn-more',
          },
          {
            id: 'teeth-whitening',
            title: 'Teeth Whitening',
            description: 'Professional whitening treatments for a brighter smile.',
            imageSrc: '/images/services/patient-portal.jpg',
            learnMoreHref: '/services/learn-more',
          },
          {
            id: 'dental-implants',
            title: 'Dental Implants',
            description: 'Permanent solution for missing teeth.',
            imageSrc: '/images/services/treatment-planning.jpg',
            learnMoreHref: '/services/learn-more',
          },
          {
            id: 'root-canal',
            title: 'Root Canal',
            description: 'Treatment for infected tooth pulp.',
            imageSrc: '/images/services/doctor-notes.jpg',
            learnMoreHref: '/services/learn-more',
          },
          {
            id: 'veneers',
            title: 'Veneers',
            description: 'Thin shells to improve the appearance of teeth.',
            imageSrc: '/images/services/reporting-analytics.jpg',
            learnMoreHref: '/services/learn-more',
          },
        ],
      },
      recommendations: {
        title: 'Personalized Recommendations',
        introText: 'Based on your symptom assessment, we recommend the following:',
        potentialSolutionsTitle: 'Potential Solutions',
        items: [
          {
            title: 'General Dentistry',
            description: 'For issues like tooth decay, cavities, or fillings.',
          },
          {
            title: 'Periodontics',
            description: 'For gum disease, gingivitis, or periodontitis.',
          },
          {
            title: 'Endodontics',
            description: 'For root canals or other endodontic procedures.',
          },
        ],
        nextStepsTitle: 'Next Steps',
        nextStepsText:
          "Schedule an appointment with a dentist specializing in the recommended areas. Be prepared to discuss your symptoms in detail and any relevant medical history. Follow any pre-appointment instructions provided by the dentist's office.",
        oralHealthAdviceTitle: 'General Oral Health Advice',
        oralHealthAdviceText:
          "Maintain a consistent oral hygiene routine, including brushing twice a day, flossing daily, and using an antiseptic mouthwash. Limit sugary foods and drinks. Consider using a fluoride toothpaste and mouthwash. Schedule regular check-ups and cleanings with your dentist, even if you don't have any current symptoms.",
        backButtonText: 'Back',
        findDentistButtonText: 'Find a Dentist',
      },
    },
  },
  forPatients: {
    badge: 'Understand Your Dental Health Before Your Visit',
    title: 'For Patients',
    subtitle: 'Patient Services',
    description:
      "Your smile deserves more than just treatment\u2014It deserves trust. With D3NT\u1D35Q you gain  clear insights into your dental health through our interactive tools, easy access to  doctor's notes, and secure communication with your care team. No more confusion or  unanswered questions\u2014you'll always feel informed, supported, and confident in your  care.",
    features: [
      {
        id: 'symptom-analysis',
        title: 'Symptom Analysis',
        description: 'Advanced pre-visit screening algorithms that help patients articulate their dental concerns accurately.',
        image: '/images/services/patient-portal.jpg',
        link: '/services/patient-portal',
        slug: 'patient-portal',
      },
      {
        id: 'tailored-recommendations',
        title: 'Tailored Recommendations',
        description: 'Personalized care pathways curated specifically for individual dental profiles and urgency levels.',
        image: '/images/services/doctor-notes.jpg',
        link: '/services/doctor-notes',
        slug: 'doctor-notes',
      },
      {
        id: 'informed-confident',
        title: 'Informed & Confident',
        description: 'Enter every appointment with full clinical clarity, reducing anxiety and improving chair-side communication.',
        image: '/images/services/appointment-scheduling.jpg',
        link: '/services/appointment-scheduling',
        slug: 'appointment-scheduling',
      },
    ],
  },
  forProviders: {
    badge: 'Grow Your Practice With Better Patient Relationships',
    title: 'For Providers',
    subtitle: 'Provider Services',
    description:
      "Strong patient relationships are the foundation of great dentistry. Integrating D3NT\u1D35Q into your current workflows gives you the tools to grow your practice and communicate more effectively with patients.",
    features: [
      {
        id: 'better-prepared-patients',
        title: 'Better Prepared Patients',
        description: 'Patients arrive with a clearer understanding of potential treatments, reducing consultation time and increasing case acceptance.',
        image: '/images/services/treatment-planning.jpg',
        link: '/services/treatment-planning',
        slug: 'treatment-planning',
      },
      {
        id: 'increased-show-rate',
        title: 'Increased Show Rate',
        description: 'Enhanced pre-visit engagement leads to a 24% higher appointment attendance rate compared to traditional methods.',
        image: '/images/services/user-roles.jpg',
        link: '/services/user-roles',
        slug: 'user-roles',
      },
      {
        id: 'improved-retention',
        title: 'Improved Retention',
        description: 'Build long-term trust through a modern, digital-first experience that prioritizes patient education and transparency.',
        image: '/images/services/reporting-analytics.jpg',
        link: '/services/reporting-analytics',
        slug: 'reporting-analytics',
      },
    ],
  },
  practiceRegistration: {
    title: 'Register Your Practice',
    description: 'Enter your details to request a custom demo and start your journey.',
    workEmailLabel: 'Work Email',
    workEmailPlaceholder: 'name@practice.com',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '(555) 000-0000',
    specialtyLabel: 'Practice Specialty',
    specialtyPlaceholder: 'Select specialty',
    specialties: [
      'General Dentistry',
      'Orthodontics',
      'Periodontics',
      'Endodontics',
      'Pediatric Dentistry',
      'Oral Surgery',
    ],
    submitButtonText: 'Register Your Practice',
    legalText:
      'By registering, you agree to our Terms of Service and Privacy Policy. No credit card required.',
  },
  news: {
    badge: 'Latest News',
    titlePrefix: 'D3NTAL',
    titleSuffix: 'NEWS',
    description:
      'Stay informed with the latest dental health news and practice insights — from patient engagement to operations and revenue cycle workflows.',
    emptyStateMessage: 'Check back soon for the latest dental health news and updates.',
    articles: [
      {
        id: 'news-patient-portal',
        title: 'Patient Portals That Build Trust',
        excerpt:
          'See how transparent records, secure messaging, and clear summaries help patients feel in control of their care.',
        image: '/images/news/patient-portal.jpg',
        slug: 'patient-portals-build-trust',
        category: 'Patient Experience',
        publishedDate: '2026-01-10',
        author: 'D3NTIQ Team',
      },
      {
        id: 'news-scheduling',
        title: 'Scheduling That Removes Friction',
        excerpt:
          'A smoother scheduling workflow reduces cancellations and keeps patients engaged from inquiry to follow‑up.',
        image: '/images/news/appointment-scheduling.jpg',
        slug: 'scheduling-removes-friction',
        category: 'Operations',
        publishedDate: '2026-01-14',
        author: 'Clinical Ops',
      },
      {
        id: 'news-insurance',
        title: 'Insurance Clarity for Patients and Providers',
        excerpt:
          'Real‑time eligibility checks and benefit insights reduce surprises and speed up approvals.',
        image: '/images/news/insurance-integration.jpg',
        slug: 'insurance-clarity',
        category: 'Billing',
        publishedDate: '2026-01-18',
        author: 'Revenue Cycle',
      },
    ],
  },
};
