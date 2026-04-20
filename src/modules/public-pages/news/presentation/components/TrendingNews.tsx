'use client';

/**
 * TrendingNews Component
 *
 * Displays trending/most read articles in a compact list format.
 */
import { Card, Stack, Text, Group, Badge, Anchor } from '@mantine/core';
import { IconTrendingUp, IconExternalLink } from '@tabler/icons-react';
import type { NewsArticle } from '../../domain/entities/NewsArticle';

interface TrendingNewsProps {
  articles: NewsArticle[];
}

export function TrendingNews({ articles }: TrendingNewsProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group mb="md">
        <IconTrendingUp size={24} className="text-orange-500" />
        <Text fw={600} size="lg">
          Trending Now
        </Text>
        <Badge color="orange" variant="light" size="sm">
          Most Read This Week
        </Badge>
      </Group>

      <Stack gap="md">
        {articles.map((article, index) => (
          <div key={article.id} className="border-b border-gray-200 pb-3 last:border-0">
            <Group gap="xs" mb="xs">
              <Badge size="xs" variant="filled" color="orange">
                #{index + 1}
              </Badge>
              <Text size="xs" c="dimmed">
                {article.source.name}
              </Text>
            </Group>

            <Anchor
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline hover:underline"
            >
              <Group gap="xs" align="flex-start">
                <Text size="sm" fw={500} lineClamp={2} className="flex-1">
                  {article.title}
                </Text>
                <IconExternalLink size={14} className="mt-1 flex-shrink-0 text-gray-400" />
              </Group>
            </Anchor>

            <Text size="xs" c="dimmed" mt="xs">
              {new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
              }).format(article.publishedDate)}
            </Text>
          </div>
        ))}
      </Stack>
    </Card>
  );
}
