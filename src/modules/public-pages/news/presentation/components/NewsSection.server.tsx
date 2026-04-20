/**
 * NewsSection Server Component
 *
 * Server-side wrapper for fetching RSS news and rendering with existing UI.
 * This component fetches data on the server and passes it to the client component.
 */
import { newsRepository } from '../../infrastructure/repositories/NewsRepository';
import { NewsSection as SharedNewsSection } from '@/shared/components/sections';
import type { NewsArticle as SharedNewsArticle } from '@/shared/components/sections/NewsSection';
import type { NewsArticle } from '../../domain/entities/NewsArticle';

interface NewsSectionServerProps {
  maxArticles?: number;
  category?: 'all' | 'industry-news' | 'clinical-research' | 'practice-business';
  useCategoryRotation?: boolean;
  categories?: Array<'industry-news' | 'clinical-research' | 'practice-business'>;
}

/**
 * Convert our NewsArticle to the format expected by SharedNewsSection
 */
function convertToSharedFormat(article: NewsArticle): SharedNewsArticle {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.summary,
    image: article.imageUrl || '/images/news/placeholder.svg',
    slug: article.url, // Use the actual article URL
    url: article.url, // Also pass as url field
    category: article.category,
    publishedDate: article.publishedDate.toISOString(),
    author: article.author || article.source.name,
  };
}

export async function NewsSectionServer({
  maxArticles = 6,
  category = 'all',
  useCategoryRotation = false,
  categories = ['clinical-research', 'practice-business', 'industry-news'],
}: NewsSectionServerProps) {
  try {
    let articles: NewsArticle[];

    // Use category rotation if enabled
    if (useCategoryRotation && categories.length > 0) {
      // Get one article from each category in rotation
      articles = await newsRepository.getArticlesByCategories(categories.slice(0, maxArticles));
    } else if (category === 'all') {
      articles = await newsRepository.getLatestArticles(maxArticles);
    } else {
      articles = await newsRepository.getArticlesByCategory(category);
    }

    // Convert to shared format
    const sharedArticles = articles.slice(0, maxArticles).map(convertToSharedFormat);

    return (
      <SharedNewsSection
        badge="Latest News"
        titlePrefix="D3NTAL"
        titleSuffix="NEWS"
        description="Stay informed with the latest dental health news and practice insights — from patient engagement to operations and revenue cycle workflows."
        emptyStateMessage="Check back soon for the latest dental health news and updates."
        articles={sharedArticles}
      />
    );
  } catch (error) {
    console.error('Error fetching news for section:', error);

    // Fallback to empty state
    return (
      <SharedNewsSection
        badge="Latest News"
        titlePrefix="D3NTAL"
        titleSuffix="NEWS"
        description="Stay informed with the latest dental health news and practice insights — from patient engagement to operations and revenue cycle workflows."
        emptyStateMessage="Unable to load news at this time. Please check back later."
        articles={[]}
      />
    );
  }
}
