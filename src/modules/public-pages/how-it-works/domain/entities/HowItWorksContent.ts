/**
 * HowItWorksContent Entity
 *
 * This file defines the core data structure for the how-it-works page content in the Domain layer.
 */

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface CoreBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HowItWorksContent {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    backgroundImage: string;
    stats: {
      label: string;
      value: string;
    };
    visualImage: string;
  };
  journey: {
    title: string;
    description: string;
    tabs: {
      providers: string;
      patients: string;
    };
    steps: {
      forProviders: JourneyStep[];
      forPatients: JourneyStep[];
    };
  };
  benefits: {
    badge: string;
    title: string;
    description: string;
    items: CoreBenefit[];
  };
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    backgroundColor: string;
  };
}
