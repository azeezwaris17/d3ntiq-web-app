'use client';
import React from 'react';

import { Box, Container, Stack, Text, ThemeIcon } from '@mantine/core';
import { Brain, CheckCircle2, ClipboardList, Globe } from 'lucide-react';
import type { ServicesPageContent } from '../../domain/entities/Service';

export interface PatientAcquisitionFlowSectionProps {
  flow?: ServicesPageContent['conversionFlow'];
}

const iconByType = {
  globe: Globe,
  analysis: Brain,
  lead: ClipboardList,
  booking: CheckCircle2,
} as const;

export const PatientAcquisitionFlowSection: React.FC<PatientAcquisitionFlowSectionProps> = ({
  flow,
}) => {
  const safeFlow: ServicesPageContent['conversionFlow'] = flow ?? {
    title: 'Acquire Better Patients Before They Walk In',
    descriptionPrefix: 'Instead of cold leads or confused patients,',
    highlightedProduct: 'Oral IQ',
    descriptionSuffix: 'delivers informed patients ready for meaningful consultations',
    steps: [
      {
        id: 'website-visitor',
        title: 'Website Visitor',
        description: 'Browsing for dental solutions online.',
        icon: 'globe',
      },
      {
        id: 'oral-iq-analysis',
        title: 'Oral IQ Analysis',
        description: 'AI-driven symptom screening and education.',
        icon: 'analysis',
      },
      {
        id: 'informed-lead',
        title: 'Informed Lead',
        description: 'Patient understands value and procedure.',
        icon: 'lead',
      },
      {
        id: 'appointment-booking',
        title: 'Appointment Booking',
        description: 'High-intent conversion to your schedule.',
        icon: 'booking',
      },
    ],
  };

  return (
    <Box
      component="section"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #4d9db5 0%, #2f7389 38%, #1f5368 73%, #174052 100%)',
      }}
    >
      <Box className="to-[#0f3443]/38 absolute inset-0 bg-gradient-to-b from-transparent via-transparent" />

      <Container size="xl" px="xl" className="relative z-10 py-[94px] md:py-[104px]">
        <Stack gap={14} align="center">
          <Text
            ta="center"
            className="text-[50px] font-extrabold leading-[1.06] tracking-[-0.03em] text-white"
          >
            {safeFlow.title}
          </Text>

          <Text
            ta="center"
            className="mx-auto max-w-[840px] text-[17px] font-medium leading-[1.7] text-[#d3e5ec]"
          >
            {safeFlow.descriptionPrefix}{' '}
            <Text component="span" className="font-semibold text-[#4ad1f0]">
              {safeFlow.highlightedProduct}
            </Text>{' '}
            {safeFlow.descriptionSuffix}
          </Text>
        </Stack>

        <Box className="mx-auto mt-[66px] max-w-[1280px]">
          <Box className="relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-5">
            <Box className="pointer-events-none absolute left-[16%] right-[16%] top-[23px] hidden md:block">
              <Box className="grid grid-cols-3 gap-[104px]">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Box
                    key={index}
                    className="via-[#9ac5d3]/38 h-[2px] w-full rounded-full bg-gradient-to-r from-[#8bb9c8]/20 to-[#8bb9c8]/20"
                  />
                ))}
              </Box>
            </Box>

            {safeFlow.steps.map((step) => {
              const Icon = iconByType[step.icon];
              const isCompleted = step.icon === 'booking';

              return (
                <Stack key={step.id} align="center" gap={12}>
                  <ThemeIcon
                    size={54}
                    radius="xl"
                    className="shadow-[0_10px_20px_-12px_rgba(7,25,34,0.9)]"
                    styles={{
                      root: {
                        background: isCompleted
                          ? 'linear-gradient(180deg, #34db74 0%, #23be61 100%)'
                          : 'linear-gradient(180deg, #24b9ef 0%, #1899d2 100%)',
                      },
                    }}
                  >
                    <Icon size={24} color="#ffffff" strokeWidth={2.25} />
                  </ThemeIcon>

                  <Text
                    ta="center"
                    className={`text-[31px] font-bold leading-tight tracking-[-0.02em] ${isCompleted ? 'text-[#49de82]' : 'text-white'}`}
                  >
                    {step.title}
                  </Text>

                  <Text
                    ta="center"
                    className="max-w-[265px] text-[14px] font-medium leading-[1.65] text-[#bed4de]"
                  >
                    {step.description}
                  </Text>
                </Stack>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
