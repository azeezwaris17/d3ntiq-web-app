/**
 * INewsRepository Interface
 *
 * Defines the contract for fetching news articles.
 * Implementations can fetch from RSS feeds, APIs, or static data.
 */
import type { NewsArticle, NewsCategory } from '../entities/NewsArticle';

export interface INewsRepository {
  /**
   * Fetch all news articles
   */
  getAllArticles(): Promise<NewsArticle[]>;

  /**
   * Fetch articles by category
   */
  getArticlesByCategory(category: NewsCategory): Promise<NewsArticle[]>;

  /**
   * Fetch featured article
   */
  getFeaturedArticle(): Promise<NewsArticle | null>;

  /**
   * Fetch trending articles (most read)
   */
  getTrendingArticles(limit?: number): Promise<NewsArticle[]>;

  /**
   * Search articles by keyword
   */
  searchArticles(query: string): Promise<NewsArticle[]>;

  /**
   * Fetch latest articles with limit
   */
  getLatestArticles(limit?: number): Promise<NewsArticle[]>;

  /**
   * Fetch articles by category rotation
   * Returns one article from each specified category
   */
  getArticlesByCategories(categories: NewsCategory[]): Promise<NewsArticle[]>;
}
