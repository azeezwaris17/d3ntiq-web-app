'use client';
import React from 'react';

import { Box, Title, Text, Button, Group, Card } from '@mantine/core';
import { PageSection } from '@/shared/components/layout';

export interface CTASectionProps {
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  backgroundColor?: string; // Optional since we'll use the specific image color
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  backgroundColor = '#4E899B', // Updated to match screenshot teal
}) => {
  return (
    <Box component="section" py={80} style={{ backgroundColor: 'white' }}>
      <PageSection>
        <Card
          radius={40} // Increased radius to match the screenshot
          padding={0}
          style={{
            backgroundColor: backgroundColor,
            border: 'none',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)', // Added soft shadow seen in UI
          }}
        >
          <Box py={{ base: 60, md: 80 }} px={{ base: 20, md: 40 }}>
            <Title
              order={2}
              mb={24}
              style={{
                fontSize: '48px', // Matched heading size
                fontWeight: 800,
                lineHeight: 1.1,
                color: 'white',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </Title>

            <Text
              maw={640} // Constrained width to match the visual flow
              mx="auto"
              mb={40}
              style={{
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {description}
            </Text>

            <Group justify="center" gap="md" className="flex-col sm:flex-row">
              <Button
                variant="filled"
                size="xl"
                radius="lg"
                px={36}
                styles={{
                  root: {
                    backgroundColor: 'white',
                    color: '#00A3FF', // Primary blue text color on white button
                    fontSize: '16px',
                    fontWeight: 700,
                    height: '60px',
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                    },
                  },
                }}
              >
                {primaryButtonText}
              </Button>

              <Button
                variant="outline"
                size="xl"
                radius="lg"
                px={36}
                styles={{
                  root: {
                    borderColor: 'rgba(255, 255, 255, 0.3)', // Subtle border as seen in UI
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 700,
                    height: '60px',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                }}
              >
                {secondaryButtonText}
              </Button>
            </Group>
          </Box>
        </Card>
      </PageSection>
    </Box>
  );
};
