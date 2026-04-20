/**
 * About Page Data (Frontend source of truth)
 *
 * All About page copy/content should live here.
 */
import type { AboutPageContent } from '../../domain/entities/AboutPageContent';

export const aboutData: AboutPageContent = {
  hero: {
    badge: 'Know More About Us',
    title: 'Building Trust, By\nInforming Patients',
    subtitle: 'Enhancing Lives',
    description:
      "At D3NTIQ, we're dedicated to enhancing patient trust through knowledge and engagement.",
    points: [
      'Restore Trust',
      'Simplify Dental Knowledge',
      'Strengthen Doctor–Patient Relationships',
    ],
    backgroundImage: '/images/about-page-hero-bg.jpg',
    ctaButtons: {
      moreDetails: {
        text: 'More Details',
        link: '/services',
      },
      bookDemo: {
        text: 'Book Demo',
        link: '/contact',
      },
    },
  },
  learnMore: {
    title: 'Learn More About Us',
    description:
      'At D3NTIQ, our mission is to restore trust, clarity, and confidence in dentistry through technology. We are building a platform that empowers both patients and providers by transforming complex dental information into clear, visual, and actionable insights. By combining interactive 3D tools, secure communication, and intelligent clinical workflows, D3NTIQ makes dental care more transparent, accessible, and patient-centered—without disrupting the provider’s practice.',
    images: {
      teamScrubs: '/images/about/team-scrubs.jpg',
      dentalModel: '/images/about/dental-model.jpg',
      anatomicalModel: '/images/about/anatomical-model.jpg',
    },
    imageAlts: {
      teamScrubs: 'D3NTIQ Team in Scrubs',
      dentalModel: 'Dental Model',
      anatomicalModel: 'Anatomical Dental Model',
    },
    content: {
      paragraph1:
        'For too long, patients have struggled with limited access to understandable information about dental treatments, symptoms, and care plans. D3NTIQ fills this gap by giving patients a dedicated portal where they can explore treatment options, visualize procedures, ask informed questions, and manage their dental journey with confidence. Our platform bridges the information divide by simplifying clinical data and making it easy for patients to understand what’s happening, why it matters, and what comes next.',
      paragraph2:
        'D3NTIQ was created by a father-and-son team who experienced these challenges firsthand. Dr. Oluleke Jeboda, a practicing dentist, recognized the need for a centralized digital portal that could educate patients, streamline scheduling, and reduce day-to-day friction in the clinic. He partnered with his son, Tobi Jeboda, to combine clinical expertise with modern technology—resulting in D3NTIQ: a solution built from real practice needs, designed to strengthen the doctor–patient relationship and bring trust back to dentistry.',
    },
  },

  founderStory: {
    title: 'The Founder Story',
    image: {
      src: '/images/about/founder-story.jpg',
      alt: 'D3NTIQ founders',
    },
    quote: 'We wanted to put the dentist and\npatient at the forefront',
    description:
      'D3NTIQ was created by a father-and-son team who experienced these challenges firsthand. Dr. Oluleke Jeboda, a practicing dentist, recognized the need for a centralized digital portal that could educate patients, remove confusion and increase patient confidence. He partnered with his son, Tobi Jeboda, to combine clinical expertise with modern technology—resulting in D3NTIQ a solution built from real practice needs, designed to strengthen the doctor–patient relationship and restore trust.',
  },

  helpingSection: {
    badge: 'Why Choose Us',
    title: 'The Future of Patient-Centered Dentistry',
    description:
      'D3NTIQ is the only platform that combines interactive 3-D visualization, patient-driven symptom assessment and real time provider insight—turning dental care into a transparent, collaborative experience that rebuilds trust between patients and dentists.',
    image: {
      src: '/images/about/professional-stomatologist-inspecting-oral-cavity-of-teenager.jpg',
      alt: 'Dental check-up in progress',
    },
    stats: {
      dentalCare: {
        label: 'Dental and Mouth Care',
        value: 95,
      },
      cosmeticTreatment: {
        label: 'Cosmetic Treatment',
        value: 87,
      },
    },
    consultation: {
      title: "Don't Hesitate to Schedule Consultation",
      description:
        'D3NTIQ helps patients and providers connect before the appointment ever begins. With interactive 3D visuals, symptom assessment tools, and clear treatment explanations, patients arrive informed—and dentists save valuable chair time.',
      dayLabels: {
        weekdays: 'Monday - Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
      },
      hours: {
        weekdays: '8AM - 10PM',
        saturday: '8AM - 10PM',
        sunday: '8AM - 10PM',
      },
      phoneNumber: '+01234 567 890',
      callButtonText: 'Request Demo',
      footerTagline: 'Designed by dentists. Built for patients.',
    },
  },
  testimonials: {
    title: 'Hear our Clients Speak',
    badge: 'Testimonial',
    description:
      'Real experiences from patients and providers who use D3NTIQ every day.',
    items: [
      {
        id: 'testimonial-1',
        name: 'Sarah Mitchell',
        rating: 5,
        text: 'D3NTIQ completely changed how I approach dental visits. I finally understood my treatment plan before sitting in the chair — no more anxiety or confusion.',
      },
      {
        id: 'testimonial-2',
        name: 'Dr. James Okafor',
        rating: 5,
        text: 'As a dentist, the biggest challenge has always been patient communication. D3NTIQ bridges that gap beautifully — patients arrive informed and ready.',
      },
      {
        id: 'testimonial-3',
        name: 'Priya Nair',
        rating: 4,
        text: 'The symptom assessment tool is incredibly intuitive. I described my issue before my appointment and my dentist already had a plan ready when I arrived.',
      },
      {
        id: 'testimonial-4',
        name: 'Carlos Reyes',
        rating: 5,
        text: 'I used to dread dental appointments because I never knew what to expect. With D3NTIQ, I feel like an active participant in my own care.',
      },
      {
        id: 'testimonial-5',
        name: 'Dr. Amara Diallo',
        rating: 5,
        text: 'Our practice has seen a noticeable drop in no-shows since integrating D3NTIQ. Patients who are informed are patients who show up.',
      },
    ],
  },
  team: {
    title: 'Meet D3NT',
    subtitle: 'IQ',
    headingSuffix: 'Team',
    description:
      'At D3NT IQ we are dedicated to providing exceptional dental care with a focus on patient comfort and satisfaction.',
    teamDescription:
      'Our team of experienced and compassionate dental professionals is committed to delivering the best possible care.',
    members: [
      {
        name: 'Dr. Sarah Johnson',
        role: 'Chief Dental Officer',
        image: '/images/team/placeholder-1.jpg',
      },
      {
        name: 'Dr. Michael Chen',
        role: 'Lead Orthodontist',
        image: '/images/team/placeholder-2.jpg',
      },
      {
        name: 'Dr. Emily Rodriguez',
        role: 'Pediatric Dentist',
        image: '/images/team/placeholder-3.jpg',
      },
      {
        name: 'Dr. James Wilson',
        role: 'Oral Surgeon',
        image: '/images/team/placeholder-4.jpg',
      },
    ],
  },
};
