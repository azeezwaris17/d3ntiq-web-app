'use client';

/**
 * FeaturedArticle Component
 *
 * Displays the featured article of the day in a prominent format.
 */
import { Card, Image, Text, Badge, Group, Stack, Button, Title } from '@mantine/core';
import { IconExternalLink, IconCalendar, IconStar } from '@tabler/icons-react';
import type { NewsArticle } from '../../domain/entities/NewsArticle';

interface FeaturedArticleProps {
  article: NewsArticle;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(article.publishedDate);

  return (
    <Card
      shadow="md"
      padding="xl"
      radius="lg"
      withBorder
      className="bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <Badge leftSection={<IconStar size={14} />} color="yellow" variant="filled" size="lg" mb="md">
        Featured Article of the Day
      </Badge>

      <div className="grid gap-6 md:grid-cols-2">
        <Card.Section>
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              height={300}
              alt={article.title}
              radius="md"
              fallbackSrc="/images/news/placeholder.jpg"
            />
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded-md bg-white">
              <Image
                src={article.source.logoUrl}
                alt={article.source.name}
                width={200}
                height={100}
                fit="contain"
                fallbackSrc="/images/news/placeholder-logo.png"
              />
            </div>
          )}
        </Card.Section>

        <Stack gap="md" justify="space-between">
          <div>
            <Group mb="xs">
              <Image
                src={article.source.logoUrl}
                alt={article.source.name}
                width={100}
                height={40}
                fit="contain"
                fallbackSrc="/images/news/placeholder-logo.png"
              />
            </Group>

            <Title order={2} mb="sm" className="text-gray-900">
              {article.title}
            </Title>

            <Group gap="xs" mb="md">
              <IconCalendar size={16} className="text-gray-600" />
              <Text size="sm" c="dimmed">
                {formattedDate}
              </Text>
            </Group>

            <Text size="md" className="leading-relaxed text-gray-700">
              {article.summary}
            </Text>
          </div>

          <Button
            component="a"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            rightSection={<IconExternalLink size={18} />}
            className="w-full md:w-auto"
          >
            Read Full Article
          </Button>
        </Stack>
      </div>
    </Card>
  );
}
