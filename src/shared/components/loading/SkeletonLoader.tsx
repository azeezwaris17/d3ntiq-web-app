import React from 'react';
import { Box, Skeleton, Stack } from '@mantine/core';

export interface SimpleSkeletonProps {
  count?: number;
  height?: number;
  // Optional type hint from callers (ignored visually)
  type?: string;
}

export const CardSkeleton: React.FC<SimpleSkeletonProps> = ({ count = 1 }) => (
  <Stack gap="sm">
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index}>
        <Skeleton height={160} radius="md" />
        <Skeleton height={18} width="70%" mt="xs" />
        <Skeleton height={14} width="90%" mt={4} />
      </Box>
    ))}
  </Stack>
);

export const AppointmentCardSkeleton: React.FC<SimpleSkeletonProps> = ({ count = 1 }) => (
  <Stack gap="sm">
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index}>
        <Skeleton height={24} width="60%" />
        <Skeleton height={18} width="80%" mt={4} />
        <Skeleton height={14} width="40%" mt={4} />
      </Box>
    ))}
  </Stack>
);

export const ListItemSkeleton: React.FC<SimpleSkeletonProps> = ({ count = 1, height = 18 }) => (
  <Stack gap={4}>
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} height={height} width={index === 0 ? '70%' : '40%'} />
    ))}
  </Stack>
);

export const MultipleCardsSkeleton: React.FC<SimpleSkeletonProps> = ({ count = 3 }) => (
  <Stack gap="md">
    {Array.from({ length: count }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </Stack>
);

export const RecommendationSkeleton: React.FC = () => (
  <Stack gap="sm">
    <Skeleton height={20} width="40%" />
    <Skeleton height={16} width="90%" />
    <Skeleton height={16} width="85%" />
    <Skeleton height={16} width="80%" />
  </Stack>
);

