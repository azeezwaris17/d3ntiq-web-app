/**
 * NewsRepository Implementation
 *
 * Fetches news articles from RSS feeds with caching and fallback to manual data.
 */
import type { INewsRepository } from '../../domain/repositories/INewsRepository';
import type { NewsArticle, NewsCategory } from '../../domain/entities/NewsArticle';
import { newsSources } from '../data/newsSourcesData';
import { fetchAllRSSFeeds } from '../services/rssParser';
import { fallbackNewsData } from '../data/fallbackNewsData';

export class NewsRepository implements INewsRepository {
  private cachedArticles: NewsArticle[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  /**
   * Get all articles with caching
   */
  async getAllArticles(): Promise<NewsArticle[]> {
    // Check if cache is still valid
    if (this.cachedArticles && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      return this.cachedArticles;
    }

    try {
      // Fetch from RSS feeds
      const articles = await fetchAllRSSFeeds(newsSources);

      if (articles.length > 0) {
        this.cachedArticles = articles;
        this.cacheTimestamp = Date.now();
        return articles;
      }

      // Fallback to manual data if RSS fails
      console.warn('RSS feeds returned no articles, using fallback data');
      return fallbackNewsData;
    } catch (error) {
      console.error('Error fetching news articles:', error);
      return fallbackNewsData;
    }
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(category: NewsCategory): Promise<NewsArticle[]> {
    const allArticles = await this.getAllArticles();

    if (category === 'all') {
      return allArticles;
    }

    return allArticles.filter((article) => article.category === category);
  }

  /**
   * Get featured article (most recent from ADA News or first article)
   */
  async getFeaturedArticle(): Promise<NewsArticle | null> {
    const allArticles = await this.getAllArticles();

    if (allArticles.length === 0) {
      return null;
    }

    // Try to find a featured article
    const featured = allArticles.find((article) => article.isFeatured);
    if (featured) {
      return featured;
    }

    // Otherwise, return most recent from ADA News
    const adaArticle = allArticles.find((article) => article.source.id === 'ada-news');
    if (adaArticle) {
      return { ...adaArticle, isFeatured: true };
    }

    // Fallback to most recent article
    return { ...allArticles[0], isFeatured: true };
  }

  /**
   * Get trending articles (simulated with most recent for now)
   */
  async getTrendingArticles(limit: number = 5): Promise<NewsArticle[]> {
    const allArticles = await this.getAllArticles();

    // For now, return most recent articles
    // In the future, this could track actual read counts
    return allArticles.slice(0, limit);
  }

  /**
   * Search articles by keyword
   */
  async searchArticles(query: string): Promise<NewsArticle[]> {
    const allArticles = await this.getAllArticles();
    const lowerQuery = query.toLowerCase();

    return allArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.summary.toLowerCase().includes(lowerQuery) ||
        article.source.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get latest articles with limit
   */
  async getLatestArticles(limit: number = 10): Promise<NewsArticle[]> {
    const allArticles = await this.getAllArticles();
    return allArticles.slice(0, limit);
  }

  /**
   * Get articles by category rotation
   * Returns one article from each specified category
   */
  async getArticlesByCategories(categories: NewsCategory[]): Promise<NewsArticle[]> {
    const allArticles = await this.getAllArticles();
    const result: NewsArticle[] = [];

    for (const category of categories) {
      // Find first article matching this category
      const article = allArticles.find((a) => a.category === category && !result.includes(a));

      if (article) {
        result.push(article);
      }
    }

    // If we don't have enough articles, fill with any available articles
    if (result.length < categories.length) {
      const remaining = allArticles.filter((a) => !result.includes(a));
      result.push(...remaining.slice(0, categories.length - result.length));
    }

    return result;
  }
}

// Export singleton instance
export const newsRepository = new NewsRepository();
