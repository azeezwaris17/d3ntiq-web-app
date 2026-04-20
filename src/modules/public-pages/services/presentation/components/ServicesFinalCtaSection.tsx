'use client';
import React from 'react';

import Link from 'next/link';
import { Box, Button, Container, Stack, Text } from '@mantine/core';
import type { ServicesPageContent } from '../../domain/entities/Service';

export interface ServicesFinalCtaSectionProps {
  cta?: ServicesPageContent['finalCta'];
}

export const ServicesFinalCtaSection: React.FC<ServicesFinalCtaSectionProps> = ({ cta }) => {
  const safeCta: ServicesPageContent['finalCta'] = cta ?? {
    title: 'Start Turning Website Visitors\nInto Informed Dental Patients',
    description:
      'See how Oral IQ can help your practice acquire, educate, and retain more patients',
    primaryButtonText: 'Book a Demo',
    primaryButtonLink: '/contact',
    secondaryButtonText: 'Explore the Oral IQ Platform',
    secondaryButtonLink: '/oral-iq',
  };

  return (
    <Box component="section" className="bg-[#f5f7f8] py-[92px] md:py-[108px]">
      <Container size="xl" px="xl">
        <Box
          className="relative mx-auto max-w-[1040px] overflow-hidden rounded-[24px] px-6 py-[72px] text-center md:px-12 md:py-[88px]"
          style={{
            background: 'linear-gradient(135deg, #4d9bb2 0%, #3a7d92 100%)',
            boxShadow: '0 20px 40px -12px rgba(58, 125, 146, 0.35)',
          }}
        >
          {/* Subtle gradient overlay */}
          <Box className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />

          <Stack gap={24} align="center" className="relative z-10">
            <Text className="whitespace-pre-line text-[36px] font-bold leading-[1.15] tracking-[-0.02em] text-white md:text-[44px]">
              {safeCta.title}
            </Text>

            <Text className="mx-auto max-w-[600px] text-[17px] font-medium leading-[1.6] text-[#e0f2f7]">
              {safeCta.description}
            </Text>

            <Box className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                component={Link}
                href={safeCta.primaryButtonLink}
                size="lg"
                h={52}
                radius="md"
                className="min-w-[180px] bg-white text-[15px] font-bold text-[#3a7d92] hover:bg-[#f0f9fb]"
                styles={{
                  root: {
                    backgroundColor: 'white',
                    color: '#3a7d92',
                    '&:hover': {
                      backgroundColor: '#f0f9fb',
                    },
                  },
                }}
              >
                {safeCta.primaryButtonText}
              </Button>

              <Button
                component={Link}
                href={safeCta.secondaryButtonLink}
                variant="outline"
                size="lg"
                h={52}
                radius="md"
                className="min-w-[240px] border-white/40 text-[15px] font-bold text-white hover:bg-white/10"
                styles={{
                  root: {
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  },
                }}
              >
                {safeCta.secondaryButtonText}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
