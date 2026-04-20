'use client';

/**
 * NewsSection Component
 *
 * Main container for displaying news articles with filtering, search, and featured content.
 */
import { useState, useEffect, useCallback } from 'react';
import { Container, Title, Text, Stack, SimpleGrid, Group, Loader, Center } from '@mantine/core';
import type { NewsArticle, NewsCategory } from '../../domain/entities/NewsArticle';
import { NewsArticleCard } from './NewsArticleCard';
import { FeaturedArticle } from './FeaturedArticle';
import { TrendingNews } from './TrendingNews';
import { NewsSearchBar } from './NewsSearchBar';
import { NewsCategoryTabs } from './NewsCategoryTabs';
import { newsRepository } from '../../infrastructure/repositories/NewsRepository';
import { GetLatestNews } from '../../application/use-cases/GetLatestNews';
import { GetNewsByCategory } from '../../application/use-cases/GetNewsByCategory';
import { SearchNews } from '../../application/use-cases/SearchNews';

interface NewsSectionProps {
  variant?: 'compact' | 'full';
  maxArticles?: number;
  showCategories?: boolean;
  showSearch?: boolean;
  showFeatured?: boolean;
  showTrending?: boolean;
}

export function NewsSection({
  variant = 'full',
  maxArticles = 9,
  showCategories = true,
  showSearch = true,
  showFeatured = true,
  showTrending = true,
}: NewsSectionProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [trendingArticles, setTrendingArticles] = useState<NewsArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Initialize use cases
  const getLatestNews = new GetLatestNews(newsRepository);
  const getNewsByCategory = new GetNewsByCategory(newsRepository);
  const searchNews = new SearchNews(newsRepository);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allArticles, featured, trending] = await Promise.all([
          getLatestNews.execute(maxArticles),
          newsRepository.getFeaturedArticle(),
          newsRepository.getTrendingArticles(5),
        ]);

        setArticles(allArticles);
        setFeaturedArticle(featured);
        setTrendingArticles(trending);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [maxArticles]);

  // Handle category change
  const handleCategoryChange = useCallback(
    (category: NewsCategory) => {
      setActiveCategory(category);
      setSearchQuery('');
      setLoading(true);

      void (async () => {
        try {
          const filteredArticles = await getNewsByCategory.execute(category);
          setArticles(filteredArticles.slice(0, maxArticles));
        } catch (error) {
          console.error('Error filtering by category:', error);
        } finally {
          setLoading(false);
        }
      })();
    },
    [maxArticles]
  );

  // Handle search
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        // Reset to category view
        handleCategoryChange(activeCategory);
        return;
      }

      setLoading(true);
      void (async () => {
        try {
          const searchResults = await searchNews.execute(query);
          setArticles(searchResults.slice(0, maxArticles));
        } catch (error) {
          console.error('Error searching news:', error);
        } finally {
          setLoading(false);
        }
      })();
    },
    [maxArticles, activeCategory, handleCategoryChange]
  );

  if (loading && articles.length === 0) {
    return (
      <Center py="xl">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <div className="text-center">
          <Text size="sm" fw={600} c="blue" tt="uppercase" mb="xs">
            Latest News
          </Text>
          <Title order={2} mb="md">
            <span className="text-blue-600">D3NTAL</span> NEWS
          </Title>
          <Text size="lg" c="dimmed" maw={700} mx="auto">
            Stay informed with the latest dental health news and practice insights — from patient
            engagement to operations and revenue cycle workflows.
          </Text>
        </div>

        {/* Featured Article */}
        {showFeatured && featuredArticle && variant === 'full' && (
          <FeaturedArticle article={featuredArticle} />
        )}

        {/* Search and Category Filters */}
        <Group justify="space-between" align="flex-start" wrap="wrap">
          {showCategories && (
            <NewsCategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          )}
          {showSearch && <NewsSearchBar onSearch={handleSearch} />}
        </Group>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Articles Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <Center py="xl">
                <Loader size="md" />
              </Center>
            ) : articles.length === 0 ? (
              <Center py="xl">
                <Text c="dimmed">
                  {searchQuery
                    ? `No articles found for "${searchQuery}"`
                    : 'No articles available at this time.'}
                </Text>
              </Center>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" verticalSpacing="lg">
                {articles.map((article) => (
                  <NewsArticleCard
                    key={article.id}
                    article={article}
                    variant={variant === 'compact' ? 'compact' : 'default'}
                  />
                ))}
              </SimpleGrid>
            )}
          </div>

          {/* Sidebar - Trending */}
          {showTrending && variant === 'full' && (
            <div className="lg:col-span-1">
              <TrendingNews articles={trendingArticles} />
            </div>
          )}
        </div>
      </Stack>
    </Container>
  );
}
