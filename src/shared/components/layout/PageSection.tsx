import React from 'react';
/**
 * PageSection
 *
 * Shared layout primitive that standardizes horizontal padding and vertical rhythm

 */

import { Box } from '@mantine/core';

export interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageSection: React.FC<PageSectionProps> = ({ children, className = '' }) => {
  return (
    <Box
      component="section"
      className={`px-6 py-16 md:px-10 md:py-20 lg:px-20 lg:py-24 xl:px-40 ${className}`}
    >
      {children}
    </Box>
  );
};
