/**
 * AboutPageContent Entity
 *
 * This file defines the core data structure for the about page content in the Domain layer.
 * It represents the complete about page data model including hero section, team information,
 * testimonials, and consultation details.
 *
 * As a Domain Entity, this interface:
 * - Defines the shape and structure of about page data
 * - Is independent of data sources (API, database, mock)
 * - Contains business rules about what about page data must include
 * - Is used across all layers (Application, Infrastructure, Presentation)
 *
 * The entity aggregates value objects (TeamMember) and defines nested structures
 * for testimonials, team sections, and consultation information, following
 * Domain-Driven Design principles.
 */
import { TeamMember } from '../value-objects/TeamMember';

export interface AboutTestimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
}

export interface AboutPageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    points?: string[];
    backgroundImage: string;
    ctaButtons: {
      moreDetails: {
        text: string;
        link: string;
      };
      bookDemo: {
        text: string;
        link: string;
      };
    };
  };
  learnMore: {
    title: string;
    description: string;
    images: {
      teamScrubs: string;
      dentalModel: string;
      anatomicalModel: string;
    };
    imageAlts: {
      teamScrubs: string;
      dentalModel: string;
      anatomicalModel: string;
    };
    content: {
      paragraph1: string;
      paragraph2: string;
    };
  };
  founderStory: {
    title: string;
    image: {
      src: string;
      alt: string;
    };
    quote: string;
    description?: string;
  };
  team: {
    title: string;
    subtitle: string;
    headingSuffix: string;
    description: string;
    teamDescription: string;
    members: TeamMember[];
  };
  helpingSection: {
    badge: string;
    title: string;
    description: string;
    image: {
      src: string;
      alt: string;
    };
    stats: {
      dentalCare: {
        label: string;
        value: number;
      };
      cosmeticTreatment: {
        label: string;
        value: number;
      };
    };
    consultation: {
      title: string;
      description: string;
      dayLabels: {
        weekdays: string;
        saturday: string;
        sunday: string;
      };
      hours: {
        weekdays: string;
        saturday: string;
        sunday: string;
      };
      phoneNumber: string;
      callButtonText: string;
      /** Centered tagline below the CTA button, e.g. "Designed by dentists. Built for patients." */
      footerTagline?: string;
    };
  };
  testimonials: {
    title: string;
    badge: string;
    description: string;
    items: AboutTestimonial[];
  };
}
