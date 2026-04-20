import React from 'react';
import { Box, Skeleton, Stack } from '@mantine/core';

export interface PageSkeletonProps {
  showHeader?: boolean;
  showStats?: boolean;
  statsCount?: number;
  showContent?: boolean;
  contentRows?: number;
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({
  showHeader = true,
  showStats = false,
  statsCount = 3,
  showContent = true,
  contentRows = 4,
}) => {
  return (
    <Box p="lg">
      <Stack gap="md">
        {showHeader && <Skeleton height={32} width="40%" radius="sm" />}

        {showStats && (
          <Box style={{ display: 'flex', gap: 16 }}>
            {Array.from({ length: statsCount }).map((_, index) => (
              <Skeleton key={index} height={80} width="100%" radius="md" />
            ))}
          </Box>
        )}

        {showContent && (
          <Stack gap="sm">
            {Array.from({ length: contentRows }).map((_, index) => (
              <Skeleton key={index} height={56} radius="sm" />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export { PageLoader } from './PageLoader';

