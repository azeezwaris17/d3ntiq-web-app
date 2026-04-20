/**
 * ContactFormData Entity and ContactPageContent Entity
 *
 * This file defines the core data structures for contact page content in the Domain layer.
 * It includes contact form data, contact information, and the complete contact page content structure.
 *
 * ContactFormData represents the data submitted through the contact form.
 * ContactInfo represents the company's contact information (email, phone, address, social media).
 * ContactPageContent represents the complete contact page including hero section, contact info, and form configuration.
 *
 * As Domain Entities, these interfaces:
 * - Define the shape and structure of contact page data
 * - Are independent of data sources (API, database, mock)
 * - Contain business rules about what contact data must include
 * - Are used across all layers (Application, Infrastructure, Presentation)
 *
 * The entities follow Domain-Driven Design principles by:
 * - Separating form data structure from page content structure
 * - Ensuring type safety for form submissions
 * - Maintaining consistency across contact-related operations
 */
export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  message: string;
}

export interface ContactInfo {
  email: string;
  mobileNumber: string;
  contactNumber: string;
  address: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

export interface ContactPageContent {
  hero: {
    badge: string;
    title: string;
    description: string;
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
  section: {
    badge: string;
    title: string;
  };
  contactInfo: ContactInfo;
  form: {
    title: string;
    fields: {
      fullNamePlaceholder: string;
      emailPlaceholder: string;
      phonePlaceholder: string;
      addressPlaceholder: string;
      messagePlaceholder: string;
      mobileFullNamePlaceholder: string;
      mobileEmailPlaceholder: string;
      mobilePhonePlaceholder: string;
      mobileAddressPlaceholder: string;
      mobileMessagePlaceholder: string;
    };
    submitButtonText: string;
    notifications: {
      successTitle: string;
      successMessage: string;
      errorTitle: string;
      errorMessage: string;
    };
  };
  labels: {
    email: string;
    mobileNumber: string;
    contactNumber: string;
    address: string;
  };
  map: {
    embedUrl: string;
    title: string;
  };
}
