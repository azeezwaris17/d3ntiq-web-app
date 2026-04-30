/**
 * News Sources Configuration
 *
 * Defines all dental industry news sources with their RSS feeds.
 */
import type { NewsSource } from '../../domain/entities/NewsArticle';

export const newsSources: NewsSource[] = [
  {
    id: 'ada-news',
    name: 'ADA News',
    logoUrl: '/images/news-sources/ada-logo.png',
    websiteUrl: 'https://www.ada.org/en/publications/ada-news',
    rssUrl: '', // ❌ NO PUBLIC RSS FEED - Needs alternative or manual content
    description: 'Authoritative updates on clinical standards and dental policy',
  },
  {
    id: 'ask-the-dentist',
    name: 'Ask the Dentist',
    logoUrl: '/images/news-sources/ask-the-dentist-logo.png',
    websiteUrl: 'https://askthedentist.com',
    rssUrl: 'https://askthedentist.com/feed/', // ✅ VERIFIED WORKING
    description: 'Health begins in the mouth - Expert dental advice from Dr. Mark Burhenne',
  },
  {
    id: 'dental-economics',
    name: 'Dental Economics',
    logoUrl: '/images/news-sources/dental-economics-logo.png',
    websiteUrl: 'https://www.dentaleconomics.com',
    rssUrl: '', // ❌ NO PUBLIC RSS FEED - Needs alternative or manual content
    description: 'Practice management and industry health news',
  },
  {
    id: 'dental-tribune',
    name: 'Dental Tribune',
    logoUrl: '/images/news-sources/dental-tribune-logo.png',
    websiteUrl: 'https://www.dental-tribune.com',
    rssUrl: 'https://www.dental-tribune.com/news/feed', // ✅ VERIFIED WORKING
    description: 'International dental news and clinical updates',
  },
  {
    id: 'inside-dentistry',
    name: 'Inside Dentistry',
    logoUrl: '/images/news-sources/inside-dentistry-logo.png',
    websiteUrl: 'https://www.insidedentistry.net',
    rssUrl: '', // ⚠️ NEEDS TESTING - Try /feed or /rss.xml
    description: 'Clinical techniques and treatment news',
  },
  {
    id: 'dental-product-shopper',
    name: 'Dental Product Shopper',
    logoUrl: '/images/news-sources/dental-product-shopper-logo.png',
    websiteUrl: 'https://www.dentalproductshopper.com',
    rssUrl: '', // ❌ NO PUBLIC RSS FEED - Needs alternative or manual content
    description: 'Product releases and industry insights',
  },
];

export const newsCategories = [
  {
    id: 'all' as const,
    label: 'All News',
    description: 'All dental industry news and updates',
  },
  {
    id: 'industry-news' as const,
    label: 'Latest Dental Industry News',
    description: 'Breaking news, policy updates, and industry trends',
  },
  {
    id: 'clinical-research' as const,
    label: 'Clinical Research Highlights',
    description: 'Latest research findings and clinical studies',
  },
  {
    id: 'practice-business' as const,
    label: 'Practice & Business Trends',
    description: 'Practice management, business strategies, and operational insights',
  },
];
