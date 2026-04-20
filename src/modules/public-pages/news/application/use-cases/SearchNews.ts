/**
 * SearchNews Use Case
 *
 * Application layer use case for searching news articles.
 */
import type { INewsRepository } from '../../domain/repositories/INewsRepository';
import type { NewsArticle } from '../../domain/entities/NewsArticle';

export class SearchNews {
  constructor(private newsRepository: INewsRepository) {}

  async execute(query: string): Promise<NewsArticle[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return this.newsRepository.searchArticles(query.trim());
  }
}
