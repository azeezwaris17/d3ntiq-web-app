'use client';
import React from 'react';

import Link from 'next/link';
import { Box, Button, Group, Stack, Text, Title } from '@mantine/core';
import { ShieldCheck, Star, Heart } from 'lucide-react';
import type { AboutPageContent } from '../../domain/entities/AboutPageContent';

export interface AboutHeroSectionProps {
  hero: AboutPageContent['hero'];
}

const BULLET_ICONS = [Star, ShieldCheck, Heart];
const BULLET_COLORS = ['#f6c90e', '#a8d8e8', '#f6c90e'];

export const AboutHeroSection: React.FC<AboutHeroSectionProps> = ({ hero }) => {
  return (
    <Box
      component="section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '62vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Background image */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('${hero.backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Teal-blue gradient overlay — matches screenshot tone */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(105deg, rgba(30,90,110,0.82) 0%, rgba(40,110,130,0.60) 45%, rgba(60,140,160,0.30) 100%)',
        }}
      />

      {/* Content — left-aligned, sits near the bottom */}
      <Box
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          padding: 'clamp(40px, 6vw, 80px) clamp(24px, 6vw, 80px)',
          paddingBottom: 'clamp(48px, 7vw, 88px)',
        }}
      >
        <Stack gap={16} style={{ maxWidth: 520 }}>

          {/* Badge row — line + label */}
          <Group gap={12} align="center">
            <Box
              style={{
                width: 40,
                height: 1.5,
                backgroundColor: 'rgba(255,255,255,0.75)',
              }}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.04em',
                color: 'rgba(255,255,255,0.90)',
              }}
            >
              {hero.badge}
            </Text>
          </Group>

          {/* Title */}
          <Title
            order={1}
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              whiteSpace: 'pre-line',
            }}
          >
            {hero.title}
          </Title>

          {/* Bullet points */}
          {hero.points && hero.points.length > 0 && (
            <Stack gap={8} mt={4}>
              {hero.points.map((point, index) => {
                const Icon = BULLET_ICONS[index % BULLET_ICONS.length];
                const color = BULLET_COLORS[index % BULLET_COLORS.length];
                return (
                  <Group key={point} gap={10} align="center">
                    <Icon size={14} color={color} strokeWidth={2} />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.92)',
                        lineHeight: 1.4,
                      }}
                    >
                      {point}
                    </Text>
                  </Group>
                );
              })}
            </Stack>
          )}

          {/* Single CTA — Register now */}
          <Group mt={8}>
            <Button
              component={Link}
              href="/register?role=patient"
              variant="outline"
              size="sm"
              style={{
                borderColor: 'rgba(255,255,255,0.85)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 500,
                height: 38,
                paddingLeft: 20,
                paddingRight: 20,
                borderRadius: 6,
                backgroundColor: 'transparent',
              }}
              styles={{
                root: {
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    borderColor: '#ffffff',
                  },
                },
              }}
            >
              Register now
            </Button>
          </Group>

        </Stack>
      </Box>
    </Box>
  );
};
