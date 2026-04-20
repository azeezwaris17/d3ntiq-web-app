/**
 * NewsArticle Entity
 *
 * Core domain entity representing a dental industry news article.
 * This entity is independent of data sources (RSS feeds, APIs, manual curation).
 */

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: NewsSource;
  publishedDate: Date;
  category: NewsCategory;
  imageUrl?: string;
  isFeatured?: boolean;
  readCount?: number;
  author?: string;
  tags?: string[];
}

export interface NewsSource {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  rssUrl?: string;
  description?: string;
}

export type NewsCategory = 'industry-news' | 'clinical-research' | 'practice-business' | 'all';

export interface NewsCategoryInfo {
  id: NewsCategory;
  label: string;
  description: string;
}
