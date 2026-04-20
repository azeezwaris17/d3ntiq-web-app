'use client';
import React from 'react';

import Image from 'next/image';
import { Box, Button, Container, Group, Stack, Text } from '@mantine/core';
import type { HomepageContent } from '../../domain/entities/HomepageContent';

interface HeroSectionProps {
  hero: HomepageContent['hero'];
}

const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  return (
    <Box
      pos="relative"
      h="auto"
      mih={600}
      display="flex"
      py={{ base: 80, md: 96 }}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
        
      {/* Background Image */}
      <Image
        src={hero.backgroundImage}
        alt="Dental clinic background"
        fill
        priority
        style={{
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* Gradient Overlay - More subtle */}
      <Box
        pos="absolute"
        inset={0}
        style={{
          background:
            'linear-gradient(90deg, rgba(12,42,48,0.8) 0%, rgba(12,42,48,0.6) 40%, rgba(12,42,48,0.2) 70%, rgba(12,42,48,0.02) 100%)',
          zIndex: 1,
        }}
      />



      {/* Content */}
      <Container size="lg" px={{ base: 'md', md: 'xl' }} pos="relative" style={{ zIndex: 2 }}>
        <Stack gap="md" align="center" ta="center">
          {/* Badge */}
          <Box
            bg="rgba(91,154,173,0.15)"
            c="#9BD0DE"
            px={12}
            py={4}
            fz={{ base: 12, md: 14 }}
            style={{
              borderRadius: 999,
              letterSpacing: 1,
              fontWeight: 600,
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9BD0DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            {hero.badgeText}
          </Box>

          {/* Headline */}
          <Stack gap={2}>
            <Text
              fw={700}
              // fz={{ base: 30, md: 48 }}
              lh={1.1}
              c="white"
              style={{ 
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                letterSpacing: '-0.02em'
             
              }}
            >
              {hero.headingLineOne}
            </Text>

            <Text
              fw={700}
              lh={1.1}
              c="white"
              style={{ 
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                letterSpacing: '-0.02em' 
              }}
            >
              {hero.headingLineTwoPrefix}{' '}
              <span style={{ color: '#63C6D9' }}>{hero.headingLineTwoAccent}</span>
            </Text>

            <Text
              fw={700}
              lh={1.1}
              c="white"
              style={{ 
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                letterSpacing: '-0.02em' 
              }}
            >
              {hero.headingLineThree}
            </Text>
          </Stack>

          {/* Description */}
          <Text
            c="#E2E8F0"
            maw={{ base: 320, md: 560 }}
            lh={1.6}
            // fz={{ base: 15, md: 20 }}
            fw={400}
            style={{ 
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            }}
          >
            <span style={{ color: '#63C6D9', fontWeight: 600 }}>{hero.descriptionAccent}</span>{' '}
            {hero.description}
          </Text>

          {/* CTA Buttons */}
          <Group
            mt="sm"
            gap={12}
            justify="center"
            wrap="wrap"
            // style={{ width: '100%', maxWidth: 480 }}
          >
            <Button
              component="a"
              href={hero.primaryCtaLink}
              radius="lg"
              size="sm"
              // style={{ flex: '1 1 160px' }}
              styles={{
                root: {
                  background: '#63C6D9',
                  color: '#07353F',
                  '&:hover': { background: '#4fb3c8' },
                },
              }}
            >
              {hero.primaryCtaText}
            </Button>

            <Button
              component="a"
              href={hero.secondaryCtaLink}
              radius="lg"
              size="sm"
              variant="default"
              // style={{ flex: '1 1 160px' }}
              styles={{
                root: {
                  background: 'white',
                  color: '#1A202C',
                  '&:hover': { background: 'rgba(255,255,255,0.9)' },
                },
              }}
            >
              {hero.secondaryCtaText}
            </Button>
          </Group>
        </Stack>
      </Container>



    </Box>
  );
};

export default HeroSection;