/**
 * Fallback News Data
 *
 * Manual curated news articles used as fallback when RSS feeds fail.
 * Update this periodically with latest news.
 */
import type { NewsArticle } from '../../domain/entities/NewsArticle';
import { newsSources } from './newsSourcesData';

export const fallbackNewsData: NewsArticle[] = [
  {
    id: 'fallback-1',
    title: 'ADA Releases New Guidelines for Dental Imaging',
    summary:
      'The American Dental Association has published updated guidelines for dental radiography, emphasizing patient safety and diagnostic accuracy.',
    url: 'https://www.ada.org/en/publications/ada-news',
    source: newsSources[0], // ADA News
    publishedDate: new Date('2026-02-10'),
    category: 'clinical-research',
    imageUrl: '/images/news/dental-imaging.jpg',
    isFeatured: true,
  },
  {
    id: 'fallback-2',
    title: 'Digital Dentistry Adoption Reaches All-Time High',
    summary:
      'New survey data shows that 78% of dental practices have adopted at least one digital technology, with CAD/CAM systems leading the way.',
    url: 'https://www.drbicuspid.com',
    source: newsSources[1], // DrBicuspid
    publishedDate: new Date('2026-02-08'),
    category: 'practice-business',
    imageUrl: '/images/news/digital-dentistry.jpg',
  },
  {
    id: 'fallback-3',
    title: 'Study: AI Shows Promise in Early Cavity Detection',
    summary:
      'Researchers demonstrate that artificial intelligence can detect early-stage cavities with 95% accuracy, potentially revolutionizing preventive care.',
    url: 'https://www.insidedentistry.net',
    source: newsSources[4], // Inside Dentistry
    publishedDate: new Date('2026-02-05'),
    category: 'clinical-research',
    imageUrl: '/images/news/ai-dentistry.jpg',
  },
  {
    id: 'fallback-4',
    title: 'Practice Management Software Market Grows 15%',
    summary:
      'The dental practice management software market continues strong growth as practices seek efficiency and better patient communication tools.',
    url: 'https://www.dentaleconomics.com',
    source: newsSources[2], // Dental Economics
    publishedDate: new Date('2026-02-03'),
    category: 'practice-business',
    imageUrl: '/images/news/practice-software.jpg',
  },
  {
    id: 'fallback-5',
    title: 'New Biomaterial Shows Promise for Tooth Regeneration',
    summary:
      'Clinical trials begin for innovative biomaterial that may enable natural tooth regeneration, offering alternative to traditional implants.',
    url: 'https://www.dental-tribune.com',
    source: newsSources[3], // Dental Tribune
    publishedDate: new Date('2026-02-01'),
    category: 'clinical-research',
    imageUrl: '/images/news/tooth-regeneration.jpg',
  },
  {
    id: 'fallback-6',
    title: 'Patient Communication Tools Boost Treatment Acceptance',
    summary:
      'Practices using visual treatment planning tools report 40% increase in case acceptance rates and improved patient satisfaction.',
    url: 'https://www.dentaleconomics.com',
    source: newsSources[2], // Dental Economics
    publishedDate: new Date('2026-01-28'),
    category: 'practice-business',
    imageUrl: '/images/news/patient-communication.jpg',
  },
  {
    id: 'fallback-7',
    title: 'Latest Innovations in Clear Aligner Technology',
    summary:
      'New materials and AI-driven treatment planning are making clear aligners more effective and accessible for complex orthodontic cases.',
    url: 'https://www.dentalproductshopper.com',
    source: newsSources[5], // Dental Product Shopper
    publishedDate: new Date('2026-01-25'),
    category: 'industry-news',
    imageUrl: '/images/news/clear-aligners.jpg',
  },
  {
    id: 'fallback-8',
    title: 'Teledentistry Regulations Updated in 12 States',
    summary:
      'State dental boards expand teledentistry guidelines, making remote consultations and follow-ups more accessible to patients.',
    url: 'https://www.ada.org/en/publications/ada-news',
    source: newsSources[0], // ADA News
    publishedDate: new Date('2026-01-22'),
    category: 'industry-news',
    imageUrl: '/images/news/teledentistry.jpg',
  },
  {
    id: 'fallback-9',
    title: 'Periodontal Disease Linked to Cardiovascular Health',
    summary:
      'Long-term study confirms strong correlation between periodontal health and heart disease, emphasizing importance of preventive care.',
    url: 'https://www.insidedentistry.net',
    source: newsSources[4], // Inside Dentistry
    publishedDate: new Date('2026-01-20'),
    category: 'clinical-research',
    imageUrl: '/images/news/periodontal-health.jpg',
  },
];
