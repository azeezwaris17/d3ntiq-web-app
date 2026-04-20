'use client';

/**
 * NewsCategoryTabs Component
 *
 * Tab navigation for filtering news by category.
 */
import { Tabs } from '@mantine/core';
import type { NewsCategory } from '../../domain/entities/NewsArticle';
import { newsCategories } from '../../infrastructure/data/newsSourcesData';

interface NewsCategoryTabsProps {
  activeCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

export function NewsCategoryTabs({ activeCategory, onCategoryChange }: NewsCategoryTabsProps) {
  return (
    <Tabs
      value={activeCategory}
      onChange={(value) => onCategoryChange(value as NewsCategory)}
      variant="pills"
      radius="md"
    >
      <Tabs.List>
        {newsCategories.map((category) => (
          <Tabs.Tab key={category.id} value={category.id}>
            {category.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
