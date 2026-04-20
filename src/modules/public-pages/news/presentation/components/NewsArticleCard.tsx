'use client';

/**
 * NewsArticleCard Component
 *
 * Displays a single news article in card format.
 */
import { Card, Image, Text, Badge, Group, Stack, Button } from '@mantine/core';
import { IconExternalLink, IconCalendar } from '@tabler/icons-react';
import type { NewsArticle } from '../../domain/entities/NewsArticle';

interface NewsArticleCardProps {
  article: NewsArticle;
  variant?: 'default' | 'compact';
}

export function NewsArticleCard({ article, variant = 'default' }: NewsArticleCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(article.publishedDate);

  const categoryColors: Record<string, string> = {
    'industry-news': 'blue',
    'clinical-research': 'green',
    'practice-business': 'orange',
    all: 'gray',
  };

  const categoryLabels: Record<string, string> = {
    'industry-news': 'Industry News',
    'clinical-research': 'Clinical Research',
    'practice-business': 'Practice & Business',
    all: 'All News',
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="h-full transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <Card.Section>
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            height={variant === 'compact' ? 140 : 180}
            alt={article.title}
            fallbackSrc="/images/news/placeholder.jpg"
          />
        ) : (
          <div
            className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100"
            style={{ height: variant === 'compact' ? 140 : 180 }}
          >
            <Image
              src={article.source.logoUrl}
              alt={article.source.name}
              width={120}
              height={60}
              fit="contain"
              fallbackSrc="/images/news/placeholder-logo.png"
            />
          </div>
        )}
      </Card.Section>

      <Stack gap="sm" mt="md">
        <Group justify="space-between" align="flex-start">
          <Image
            src={article.source.logoUrl}
            alt={article.source.name}
            width={80}
            height={30}
            fit="contain"
            fallbackSrc="/images/news/placeholder-logo.png"
          />
          <Badge color={categoryColors[article.category]} variant="light" size="sm">
            {categoryLabels[article.category]}
          </Badge>
        </Group>

        <Text
          fw={600}
          size={variant === 'compact' ? 'sm' : 'md'}
          lineClamp={2}
          className="min-h-[2.5rem]"
        >
          {article.title}
        </Text>

        <Group gap="xs">
          <IconCalendar size={14} className="text-gray-500" />
          <Text size="xs" c="dimmed">
            {formattedDate}
          </Text>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={3} className="flex-grow">
          {article.summary}
        </Text>

        <Button
          component="a"
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="light"
          fullWidth
          rightSection={<IconExternalLink size={16} />}
          mt="auto"
        >
          Read More
        </Button>
      </Stack>
    </Card>
  );
}
