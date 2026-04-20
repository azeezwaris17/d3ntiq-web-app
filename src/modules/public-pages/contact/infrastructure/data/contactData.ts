/**
 * Contact Page Data (Frontend source of truth)
 *
 * All Contact page copy/content should live here.
 */
import type { ContactPageContent } from '../../domain/entities/ContactFormData';

export const contactData: ContactPageContent = {
  hero: {
    badge: 'Get in Touch',
    title: 'We Want To Hear From You',
    description:
      "Discover how we can transform your dental practice. Our team is here to answer your questions, provide personalized demos, and help you streamline your clinic's operations. Get in touch with us today!",
    backgroundImage: '/images/contact-page-hero-bg.jpg',
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
  section: {
    badge: 'Contact Us',
    title: 'Get in Touch',
  },
  contactInfo: {
    email: 'example@gmail.com',
    mobileNumber: '+1 (200) 11223345',
    contactNumber: '+1 (200) 11223345',
    address: 'No 1, Avenue Street, Adjacent White Tower, United Kingdom.',
    socialMedia: {
      facebook: 'https://facebook.com/dentiq',
      twitter: 'https://twitter.com/dentiq',
      linkedin: 'https://linkedin.com/company/dentiq',
      instagram: 'https://instagram.com/dentiq',
    },
  },
  labels: {
    email: 'Email Address',
    mobileNumber: 'Mobile Number',
    contactNumber: 'Contact Number',
    address: 'Address',
  },
  form: {
    title: 'Have a Question? Send a Message',
    fields: {
      fullNamePlaceholder: 'Full Name',
      emailPlaceholder: 'Email',
      phonePlaceholder: 'Phone number',
      addressPlaceholder: 'Address',
      messagePlaceholder: 'Message',
      mobileFullNamePlaceholder: 'Nombre',
      mobileEmailPlaceholder: 'Email',
      mobilePhonePlaceholder: 'Telefono',
      mobileAddressPlaceholder: 'Direccion',
      mobileMessagePlaceholder: 'Problema',
    },
    submitButtonText: 'Submit',
    notifications: {
      successTitle: 'Success',
      successMessage: 'Your message has been sent successfully!',
      errorTitle: 'Error',
      errorMessage: 'Failed to send message. Please try again.',
    },
  },
  map: {
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841321915747!2d-73.98811768459398!3d40.75889597932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus',
    title: 'D3NT Location Map',
  },
};
