/**
 * Service Entity and ServicesPageContent Entity
 *
 * This file defines the core data structures for services content in the Domain layer.
 * It includes individual service entities, service categories, and the complete services page content structure.
 *
 * Service represents a single service offering (patient or provider).
 * ServiceCategory groups related services together.
 * ServicesPageContent represents the complete services page including hero, patient services, provider services, and testimonials.
 *
 * As Domain Entities, these interfaces:
 * - Define the shape and structure of services data
 * - Are independent of data sources (API, database, mock)
 * - Contain business rules about what services data must include
 * - Are used across all layers (Application, Infrastructure, Presentation)
 *
 * The entities follow Domain-Driven Design principles by:
 * - Separating individual service structure from page-level content
 * - Supporting categorization (patient vs provider services)
 * - Ensuring type safety with category unions ('patient' | 'provider')
 * - Maintaining consistency across service listings and detail pages
 */
export interface Service {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  category: 'patient' | 'provider';
  slug?: string;
  detailedDescription?: string;
  features?: string[];
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  badge: string;
  services: Service[];
}

export interface ServicesNewsArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  category: string;
  publishedDate: string;
}

export interface ServicesPageContent {
  hero: {
    badge: string;
    title: string;
    description: string;
    backgroundImage: string;
    ctaButtons: {
      moreDetails: { text: string; link: string };
      bookDemo: { text: string; link: string };
    };
  };
  patientServices: ServiceCategory;
  providerServices: ServiceCategory;
  conversionFlow: {
    title: string;
    descriptionPrefix: string;
    highlightedProduct: string;
    descriptionSuffix: string;
    steps: Array<{
      id: string;
      title: string;
      description: string;
      icon: 'globe' | 'analysis' | 'lead' | 'booking';
    }>;
  };
  news: {
    badge: string;
    titlePrefix: string;
    titleSuffix: string;
    description: string;
    emptyStateMessage: string;
    articles: ServicesNewsArticle[];
  };
  testimonials: {
    badge: string;
    title: string;
    description: string;
    quote: string;
    author: string;
    authorRole?: string;
    profiles: string[];
    highlightedProfileIndex?: number;
  };
  educatedPatientsImpact: {
    title: string;
    metrics: Array<{
      id: string;
      value: string;
      label: string;
      description: string;
    }>;
    source: string;
  };
  finalCta: {
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
}
