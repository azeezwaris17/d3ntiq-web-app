import React from 'react';
import type { AboutPageContent } from '../domain/entities/AboutPageContent';
import {
  AboutHeroSection,
  MissionStorySection,
  FounderStorySection,
  WhyChooseUsSection,
  TestimonialsSection,
} from './components';

export interface AboutPageProps {
  content: AboutPageContent;
}

export const AboutPage: React.FC<AboutPageProps> = ({ content }) => {
  return (
    <div className="min-h-screen">
      <AboutHeroSection hero={content.hero} />
      <MissionStorySection />
      <FounderStorySection founderStory={content.founderStory} />
      <WhyChooseUsSection whyChooseUs={content.helpingSection} />
      <TestimonialsSection testimonials={content.testimonials} />
    </div>
  );
};
