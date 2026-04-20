/**
 * NewsArticle Value Object
 *
 * This file defines a value object representing a news article or blog post preview.
 * It contains the essential information needed to display articles in lists and cards.
 *
 * As a Domain Value Object, this interface:
 * - Represents a reusable data structure for news/blog content
 * - Is used in homepage news sections and blog listings
 * - Ensures type safety and consistency across the application
 * - Separates concerns by defining what article data looks like, not where it comes from
 *
 * This value object is used by:
 * - Homepage news section
 * - Blog page listings
 * - News/article card components
 */
export interface NewsArticle {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  slug: string;
  category?: string;
  publishedDate?: string;
  author?: string;
}
