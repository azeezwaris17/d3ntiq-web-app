/**
 * News API Route
 *
 * Server-side endpoint for fetching news articles from RSS feeds.
 * Provides caching and error handling.
 */
import { NextResponse } from 'next/server';
import { newsRepository } from '@/modules/public-pages/news/infrastructure/repositories/NewsRepository';

export const dynamic = 'force-dynamic';
export const revalidate = 21600; // Revalidate every 6 hours

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const trending = searchParams.get('trending');

    // Handle different query types
    if (featured === 'true') {
      const article = await newsRepository.getFeaturedArticle();
      return NextResponse.json({ article });
    }

    if (trending === 'true') {
      const articles = await newsRepository.getTrendingArticles(limit ? parseInt(limit) : 5);
      return NextResponse.json({ articles });
    }

    if (search) {
      const articles = await newsRepository.searchArticles(search);
      return NextResponse.json({ articles });
    }

    if (category && category !== 'all') {
      const articles = await newsRepository.getArticlesByCategory(category as any);
      const limitedArticles = limit ? articles.slice(0, parseInt(limit)) : articles;
      return NextResponse.json({ articles: limitedArticles });
    }

    // Default: get latest articles
    const articles = await newsRepository.getLatestArticles(limit ? parseInt(limit) : 10);
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error in news API route:', error);
    return NextResponse.json({ error: 'Failed to fetch news articles' }, { status: 500 });
  }
}
