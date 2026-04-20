import React from 'react';
import type { ContactPageContent } from '../domain/entities/ContactFormData';
import { ContactHeroSection, GetInTouchSection } from './components';

export interface ContactPageProps {
  content: ContactPageContent;
}

export const ContactPage: React.FC<ContactPageProps> = ({ content }) => {
  return (
    <div className="min-h-screen">
      <ContactHeroSection hero={content.hero} />
      <GetInTouchSection content={content} />
    </div>
  );
};
