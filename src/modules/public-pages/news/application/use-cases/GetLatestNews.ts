/**
 * GetLatestNews Use Case
 *
 * Application layer use case for fetching latest news articles.
 */
import type { INewsRepository } from '../../domain/repositories/INewsRepository';
import type { NewsArticle } from '../../domain/entities/NewsArticle';

export class GetLatestNews {
  constructor(private newsRepository: INewsRepository) {}

  async execute(limit?: number): Promise<NewsArticle[]> {
    return this.newsRepository.getLatestArticles(limit);
  }
}
