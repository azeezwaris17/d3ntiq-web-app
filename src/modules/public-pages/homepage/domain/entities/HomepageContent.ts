/**
 * HomepageContent Entity
 *
 * This file defines the core data structure for the homepage content in the Domain layer.
 * It represents the complete homepage data model including hero section, Oral IQ section,
 * patient features, provider features, and news articles.
 *
 * As a Domain Entity, this interface:
 * - Defines the shape and structure of homepage data
 * - Is independent of data sources (API, database, mock)
 * - Contains business rules about what homepage data must include
 * - Is used across all layers (Application, Infrastructure, Presentation)
 *
 * The entity aggregates value objects (Feature, NewsArticle) to compose the complete
 * homepage content structure, following Domain-Driven Design principles.
 */
import { Feature } from '../value-objects/Feature';
import { NewsArticle } from '../value-objects/NewsArticle';

export interface HomepageContent {
  hero: {
    badgeText: string;
    headingLineOne: string;
    headingLineTwoPrefix: string;
    headingLineTwoAccent: string;
    headingLineThree: string;
    descriptionAccent: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    backgroundImage: string;
  };
  oralIQ: {
    title: string;
    suptitle: string;
    subtitle: string;
    description: string;
    ctaButtonText: string;
    selectToothAlertMessage: string;
    modal: {
      assessment: {
        title: string;
        symptomTypeLabel: string;
        symptomTypePlaceholder: string;
        painLevelLabel: string;
        painLevelPlaceholder: string;
        durationLabel: string;
        durationPlaceholder: string;
        specificSensationsLabel: string;
        specificSensationsPlaceholder: string;
        checkboxes: {
          sharpPain: string;
          dullAche: string;
          throbbing: string;
        };
        mouthImageSrc: string;
        backButtonText: string;
        proceedButtonText: string;
      };
      symptomPicker: {
        title: string;
      };
      symptomCategories: Array<{
        id:
          | 'pain-discomfort'
          | 'sensitivity'
          | 'swelling-inflammation'
          | 'bleeding-gum-issues'
          | 'infection-indicators';
        title: string;
        bulletPoints: string[];
      }>;
      durationPicker: {
        title: string;
        groups: Array<{
          title: string;
          options: string[];
        }>;
      };
      treatmentOptions: {
        title: string;
        learnMoreButtonText: string;
        backButtonText: string;
        proceedButtonText: string;
        cards: Array<{
          id: string;
          title: string;
          description: string;
          imageSrc: string;
          learnMoreHref: string;
        }>;
      };
      recommendations: {
        title: string;
        introText: string;
        potentialSolutionsTitle: string;
        items: Array<{
          title: string;
          description: string;
        }>;
        nextStepsTitle: string;
        nextStepsText: string;
        oralHealthAdviceTitle: string;
        oralHealthAdviceText: string;
        backButtonText: string;
        findDentistButtonText: string;
      };
    };
  };
  forPatients: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    features: Feature[];
  };
  forProviders: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    features: Feature[];
  };
  practiceRegistration: {
    title: string;
    description: string;
    workEmailLabel: string;
    workEmailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    specialtyLabel: string;
    specialtyPlaceholder: string;
    specialties: string[];
    submitButtonText: string;
    legalText: string;
  };
  news: {
    badge: string;
    titlePrefix: string;
    titleSuffix: string;
    description: string;
    emptyStateMessage: string;
    articles: NewsArticle[];
  };
}
