/**
 * GetNewsByCategory Use Case
 *
 * Application layer use case for fetching news by category.
 */
import type { INewsRepository } from '../../domain/repositories/INewsRepository';
import type { NewsArticle, NewsCategory } from '../../domain/entities/NewsArticle';

export class GetNewsByCategory {
  constructor(private newsRepository: INewsRepository) {}

  async execute(category: NewsCategory): Promise<NewsArticle[]> {
    return this.newsRepository.getArticlesByCategory(category);
  }
}
