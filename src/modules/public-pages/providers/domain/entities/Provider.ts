/**
 * ProviderFeature Value Object and ProvidersPageContent Entity
 *
 * This file defines the core data structures for providers page content in the Domain layer.
 * It includes provider features and the complete providers page content structure.
 *
 * ProviderFeature represents a single feature/benefit for providers.
 * ProvidersPageContent represents the complete providers page including hero section, search functionality, and provider features.
 *
 * As Domain Entities/Value Objects, these interfaces:
 * - Define the shape and structure of providers page data
 * - Are independent of data sources (API, database, mock)
 * - Contain business rules about what providers page data must include
 * - Are used across all layers (Application, Infrastructure, Presentation)
 *
 * The entities follow Domain-Driven Design principles by:
 * - Separating individual feature structure from page-level content
 * - Supporting dynamic icon mapping for features
 * - Ensuring type safety and consistency across provider-related operations
 */
export interface ProviderFeature {
  title: string;
  description: string;
  icon: string;
}

export interface ProvidersPageContent {
  hero: {
    badge: string;
    title: string;
    description: string;
    backgroundImage: string;
  };
  search: {
    title: string;
    description: string;
    buttons: {
      findDentist: string;
      bookAppointment: string;
      smileBrighter: string;
    };
    searchButtonText: string;
  };
  providerFeatures: {
    title: string;
    subtitle: string;
    description: string;
    ctaButton: string;
    brand: {
      prefix: string;
      suffix: string;
    };
    features: ProviderFeature[];
  };
}
