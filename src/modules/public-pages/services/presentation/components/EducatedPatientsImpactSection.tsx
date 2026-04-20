'use client';
import React from 'react';

import { Box, Container, SimpleGrid, Stack, Text } from '@mantine/core';
import type { ServicesPageContent } from '../../domain/entities/Service';

export interface EducatedPatientsImpactSectionProps {
  impact?: ServicesPageContent['educatedPatientsImpact'];
}

export const EducatedPatientsImpactSection: React.FC<EducatedPatientsImpactSectionProps> = ({
  impact,
}) => {
  const safeImpact: ServicesPageContent['educatedPatientsImpact'] = impact ?? {
    title: 'Why Educated Patients Matter',
    metrics: [
      {
        id: 'patient-readiness',
        value: '85%',
        label: 'Patient Readiness Rate',
        description:
          'Patients who understand their condition are significantly more likely to follow recommended treatments',
      },
      {
        id: 'roi',
        value: '2.4x',
        label: 'ROI for Practices',
        description: 'Better informed patients show higher engagement and long-term care adherence',
      },
      {
        id: 'consultation-time',
        value: '30m',
        label: 'Avg. Consultation Time Saved',
        description: 'Educated patients reduce consultation time and improve clinical efficiency',
      },
    ],
    source: 'Source: Performance metrics collected by Health Align 2023 and Oral Data Insights.',
  };

  return (
    <Box
      component="section"
      className="relative overflow-hidden py-[86px] md:py-[94px]"
      style={{ backgroundColor: '#4d9bb2' }}
    >
      <Box className="from-[#58a8bf]/48 absolute inset-0 bg-gradient-to-b via-[#4f9fb6]/40 to-[#4593aa]/50" />

      <Container size="xl" px="xl" className="relative z-10">
        <Stack gap={44} align="center">
          <Text
            ta="center"
            className="text-[56px] font-bold leading-tight tracking-[-0.02em] text-[#0d1b35]"
          >
            {safeImpact.title}
          </Text>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing={{ base: 26, md: 24 }} className="w-full">
            {safeImpact.metrics.map((metric) => (
              <Stack key={metric.id} gap={10} align="center" className="text-center">
                <Text className="text-[60px] font-extrabold leading-none tracking-[-0.02em] text-[#7ec7dc]">
                  {metric.value}
                </Text>
                <Text className="text-[20px] font-semibold text-[#35586b]">{metric.label}</Text>
                <Text className="max-w-[360px] text-[15px] font-medium leading-[1.65] text-[#36596b]">
                  {metric.description}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>

          <Text className="pt-2 text-center text-[15px] font-medium text-[#6fb6ca]">
            {safeImpact.source}
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};
