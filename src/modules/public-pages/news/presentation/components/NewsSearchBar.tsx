'use client';

/**
 * NewsSearchBar Component
 *
 * Search input for filtering news articles by keyword.
 */
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';

interface NewsSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function NewsSearchBar({
  onSearch,
  placeholder = 'Search dental news...',
}: NewsSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <TextInput
      placeholder={placeholder}
      leftSection={<IconSearch size={16} />}
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.currentTarget.value)}
      size="md"
      radius="md"
      className="w-full max-w-md"
    />
  );
}
