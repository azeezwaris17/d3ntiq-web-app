/**
 * ProviderDemoSection Component
 * Call-to-action section for dentists showcasing the provider dashboard
 */
'use client';
import React from 'react';

import Image from 'next/image';
import {
  Box,
  Container,
  Title,
  Text,
  Button,
  Stack,
  Badge,
  Grid,
  AspectRatio,
  Center,
} from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowRight, IconPlayerPlay } from '@tabler/icons-react';
import { themeColors } from '@/shared/theme';

export interface ProviderDemoSectionProps {
  badge?: string;
  title?: string;
  highlightedText?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  videoThumbnail?: string;
  onVideoClick?: () => void;
}

export const ProviderDemoSection: React.FC<ProviderDemoSectionProps> = ({
  badge = 'PROVIDER EXCLUSIVE',
  title = 'Built for Dentists Who Want',
  highlightedText = 'Smarter Patient Conversations',
  description = 'Access comprehensive patient profiles before they even sit in the chair. Streamline diagnostic workflows and enhance consultations.',
  buttonText = 'See Provider Dashboard Demo',
  onButtonClick,
  videoThumbnail,
  onVideoClick,
}) => {
  const theme = useMantineTheme();
  const colors = themeColors(theme);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      window.location.href = '/providers/demo';
    }
  };

  return (
    <Box component="section" bg="white" py={{ base: 48, md: 64 }}>
      <Container size="xl">
        <Box
          bg="#0F172A"
          px={isMobile ? 24 : 40}
          py={isMobile ? 24 : 40}
          style={{
            borderRadius: 40,
            overflow: 'hidden',
          }}
        >
          <Grid gutter={32} align="center">
            {/* Left content */}
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Stack gap="lg">
                <Badge
                  variant="light"
                  size="sm"
                  leftSection={
                    <Box
                      w={6}
                      h={6}
                      style={{
                        borderRadius: '50%',
                        backgroundColor: '#06B6D4',
                      }}
                    />
                  }
                  styles={{
                    root: {
                      backgroundColor: 'rgba(6, 182, 212, 0.1)',
                      color: '#06B6D4',
                      fontSize: isMobile ? 12 : 14,
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      paddingLeft: 10,
                      paddingRight: 14,
                      height: 28,
                      width: 'fit-content',
                    },
                  }}
                >
                  {badge}
                </Badge>

                <Title
                  order={2}
                  style={{
                    fontSize: isMobile ? 28 : 38,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: colors.neutral[0],
                  }}
                >
                  {title}{' '}
                  <Text component="span" inherit c="#06B6D4">
                    {highlightedText}
                  </Text>
                </Title>

                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.6,
                    maxWidth: 500,
                    fontSize: isMobile ? 15 : 18,
                    fontWeight: 400,
                  }}
                >
                  {description}
                </Text>

                <Button
                  size="md"
                  onClick={handleButtonClick}
                  rightSection={<IconArrowRight size={16} />}
                  styles={{
                    root: {
                      backgroundColor: '#06B6D4',
                      color: '#0F172A',
                      fontSize: isMobile ? 14 : 16,
                      fontWeight: 600,
                      paddingLeft: 24,
                      paddingRight: 24,
                      height: 42,
                      borderRadius: 6,
                      width: 'fit-content',
                      '&:hover': {
                        backgroundColor: '#22D3EE',
                      },
                    },
                  }}
                >
                  {buttonText}
                </Button>
              </Stack>
            </Grid.Col>

            {/* Right content – video preview */}
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <AspectRatio ratio={16 / 10}>
                <Box
                  pos="relative"
                  onClick={onVideoClick}
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    cursor: onVideoClick ? 'pointer' : 'default',
                  }}
                >
                  {videoThumbnail ? (
                    <Image
                      src={videoThumbnail}
                      alt="Provider Dashboard Demo"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Center w="100%" h="100%">
                      <Box w={120} h={120} opacity={0.3}>
                        <svg viewBox="0 0 200 200" fill="none">
                          <circle cx="100" cy="60" r="35" stroke="#06B6D4" strokeWidth="3" fill="none" />
                          <path d="M100 95 Q95 120, 90 160" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" fill="none" />
                        </svg>
                      </Box>
                    </Center>
                  )}

                  {/* Play button overlay */}
                  <Center
                    pos="absolute"
                    top="50%"
                    left="50%"
                    style={{
                      transform: 'translate(-50%, -50%)',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: '#06B6D4',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(6, 182, 212, 0.4)',
                    }}
                  >
                    <IconPlayerPlay size={20} color="#0F172A" fill="#0F172A" style={{ marginLeft: 2 }} />
                  </Center>
                </Box>
              </AspectRatio>
            </Grid.Col>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};