'use client';
import React from 'react';

import Image from 'next/image';
import { Box, Container, Text } from '@mantine/core';
import { UserRound } from 'lucide-react';
import type { ServicesPageContent } from '../../domain/entities/Service';

export interface ServicesTestimonialsSectionProps {
  testimonials: ServicesPageContent['testimonials'];
}

export const ServicesTestimonialsSection: React.FC<ServicesTestimonialsSectionProps> = ({
  testimonials,
}) => {
  const profiles = testimonials.profiles?.length
    ? testimonials.profiles
    : Array.from({ length: 5 }, () => '');
  const activeIndex = Math.min(
    Math.max(testimonials.highlightedProfileIndex ?? 2, 0),
    Math.max(profiles.length - 1, 0)
  );

  return (
    <Box component="section" className="bg-[#f3f5f8] py-[92px] md:py-[108px]">
      <Container size="xl" px="xl">
        <Box className="mx-auto max-w-[980px] text-center">
          <Text className="text-[56px] font-bold tracking-[-0.02em] text-[#1f2937]">
            {testimonials.title}
          </Text>
          <Text className="mt-[6px] text-[14px] font-medium text-[#5b6472]">
            {testimonials.description}
          </Text>

          <Text className="mt-7 text-[130px] font-extrabold leading-[0.62] text-[#d8dde3]">“</Text>

          <Text className="mx-auto mt-1 max-w-[980px] text-[40px] font-semibold leading-[1.58] tracking-[-0.01em] text-[#242c37]">
            {testimonials.quote}
          </Text>

          <Text className="mt-10 text-[20px] font-semibold text-[#2f3742]">
            {testimonials.author}
          </Text>
          <Text className="mt-1 text-[15px] font-medium text-[#5d6672]">
            {testimonials.authorRole ?? 'Clinic Specialist'}
          </Text>

          <Box className="mt-9 flex items-center justify-center gap-7">
            {profiles.map((profile, index) => {
              const isActive = index === activeIndex;
              return (
                <Box
                  key={`${profile}-${index}`}
                  className="relative overflow-hidden rounded-full"
                  style={{
                    width: isActive ? 72 : 68,
                    height: isActive ? 72 : 68,
                    opacity: isActive ? 1 : 0.34,
                    transform: isActive ? 'scale(1)' : 'scale(0.93)',
                    transition: 'all 220ms ease',
                    border: isActive ? '2px solid rgba(255,255,255,0.8)' : 'none',
                    boxShadow: isActive ? '0 8px 20px -12px rgba(31,41,55,0.6)' : 'none',
                    background:
                      'linear-gradient(180deg, rgba(224,229,236,1) 0%, rgba(209,216,224,1) 100%)',
                  }}
                  aria-hidden={!isActive}
                >
                  {profile ? (
                    <Image src={profile} alt="" fill className="object-cover" />
                  ) : (
                    <Box className="flex h-full w-full items-center justify-center">
                      <UserRound size={32} color="#9ca3af" />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
