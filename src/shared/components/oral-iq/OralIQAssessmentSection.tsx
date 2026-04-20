'use client';
import React from 'react';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Group,
  Progress,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  Center,
  Grid,
} from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { Stethoscope } from 'lucide-react'; // For the recommendation icons
import { themeColors, type ThemeColors } from '@/shared/theme';
import type { HomepageContent } from '@/modules/public-pages/homepage/domain/entities/HomepageContent';
import { InteractiveMouthModel2 } from './InteractiveMouthModel2';

type OralIqStep = 2 | 3 | 4;

export interface OralIQAssessmentSectionProps {
  content: HomepageContent['oralIQ']['modal'];
  selectedTooth: { index: number; isUpper: boolean } | null;
  onComplete?: () => void;
}

const HeaderSection: React.FC<{ step: number; colors: ThemeColors }> = ({
  step,
  colors: _colors,
}) => (
  <Stack align="center" gap={4} mb={40}>
    <Title 
    order={1} 
    style={{ display: 'flex', 
    alignItems: 'baseline', 
    gap: '8px',
    fontSize: 'clamp(1rem, 2.5vw, 2rem)',
    }}
    >
      <Text component="span" inherit fw={700}  c="#548CA1">
        ORAL
      </Text>
      <Text 
      component="sup" 
      fw={700} 
      size="1.2rem" 
      c="#7CC2D9" 
      style={{ top: '-1.2em' }}
      >
        IQ
      </Text>
      <Text component="span" inherit fw={700}  c="#548CA1" ml={4}>
        – Interactive Dental Assessment
      </Text>
    </Title>
    
    <Text size="lg" c="dimmed">
      Understand symptoms. Visualize care. Communicate clearly with your dentist
    </Text>

    <Box w="100%" maw={900} mt={30}>
      <Text size="sm" c="#548CA1" fw={600} mb={10}>
        Step {step} of 4
      </Text>
      <Progress
        value={(step / 4) * 100}
        size="md"
        radius="xs"
        color="#548CA1"
        style={{ backgroundColor: '#E9ECEF' }}
      />
    </Box>
  </Stack>
);

export const OralIQAssessmentSection: React.FC<OralIQAssessmentSectionProps> = ({
  content,
  selectedTooth,
  onComplete,
}) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const colors = themeColors(theme);
  const [step, setStep] = useState<OralIqStep>(2);

  const handleComplete = useCallback(() => {
    if (onComplete) onComplete();
    else router.push('/providers');
  }, [onComplete, router]);

  // CSS for the primary buttons
  const primaryBtnStyles = {
    backgroundColor: '#548CA1',
    '&:hover': { backgroundColor: '#436f82' },
  };

  return (
    <Box component="section" py={60} bg="white">
      <Container size="xl">
        <HeaderSection step={step} colors={colors} />

        {/* STEP 2: Symptoms */}
        {step === 2 && (
          <Box>
            <Grid gutter={60} align="flex-start">
              {/* Left Column - Form */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="lg">
                  <Title order={2} fw={700} size="1.5rem" c="#1A202C">
                    Describe Your Symptoms
                  </Title>

                  <Stack gap="md">
                    {/* Symptom Type */}
                    <Box>
                      <Text size="sm" fw={600} mb={8} c="#1A202C">
                        Symptom Type
                      </Text>
                      <Select
                        placeholder="Select symptom"
                        data={['Pain', 'Sensitivity', 'Bleeding']}
                        size="lg"
                        radius="md"
                        styles={{
                          input: {
                            borderColor: '#E2E8F0',
                            '&:focus': {
                              borderColor: '#548CA1',
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Pain Level */}
                    <Box>
                      <Text size="sm" fw={600} mb={8} c="#1A202C">
                        Pain Level (1-10)
                      </Text>
                      <TextInput
                        placeholder="Enter pain level"
                        size="lg"
                        radius="md"
                        styles={{
                          input: {
                            borderColor: '#E2E8F0',
                            '&:focus': {
                              borderColor: '#548CA1',
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Duration */}
                    <Box>
                      <Text size="sm" fw={600} mb={8} c="#1A202C">
                        Duration
                      </Text>
                      <Select
                        placeholder="Enter duration"
                        data={['1-3 days', '1 week', 'Chronic']}
                        size="lg"
                        radius="md"
                        styles={{
                          input: {
                            borderColor: '#E2E8F0',
                            '&:focus': {
                              borderColor: '#548CA1',
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Specific Sensations */}
                    <Box>
                      <Text size="sm" fw={600} mb={8} c="#1A202C">
                        Specific Sensations
                      </Text>
                      <Textarea
                        placeholder=""
                        size="xl"
                        // minRows={5}
                        radius="md"
                        styles={{
                          input: {
                            borderColor: '#E2E8F0',
                            '&:focus': {
                              borderColor: '#548CA1',
                            },
                          },
                        }}
                      />
                    </Box>
                  </Stack>

                  {/* Disclaimer */}
                  <Text size="sm" c="#718096" mt="md">
                    <Text component="span" fw={700} c="#548CA1">
                      DISCLAIMER:
                    </Text>{' '}
                    This tool does not provide a diagnosis, if opted, information will be shared
                    with your provider to support care
                  </Text>

                  {/* Buttons */}
                  <Group mt="xl" gap="md">
                    <Button
                      variant="outline"
                      size="lg"
                      radius="md"
                      style={{
                        flex: 1,
                        borderColor: '#548CA1',
                        color: '#548CA1',
                        '&:hover': {
                          backgroundColor: '#F7FAFC',
                        },
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      radius="md"
                      onClick={() => setStep(3)}
                      style={{
                        flex: 1,
                        backgroundColor: '#548CA1',
                        '&:hover': {
                          backgroundColor: '#436f82',
                        },
                      }}
                    >
                      Proceed
                    </Button>
                  </Group>
                </Stack>
              </Grid.Col>

              {/* Right Column - 3D Model */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Center>
                  <Box
                    style={{
                      width: '100%',
                      maxWidth: 500,
                      aspectRatio: '1',
                      borderRadius: '50%',
                      background:
                        'radial-gradient(circle at center, rgba(255,255,255,0.98) 0%, #FFFFFF 30%, rgba(219,232,253,0.4) 70%, rgba(180,220,240,0.3) 100%)',
                      boxShadow: '0 20px 60px rgba(84, 140, 161, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 40,
                    }}
                  >
                    <InteractiveMouthModel2
                      variant="default"
                      selectedTooth={selectedTooth}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </Box>
                </Center>
              </Grid.Col>
            </Grid>
          </Box>
        )}

        {/* STEP 3: Treatment Options */}
        {step === 3 && (
          <Stack gap="xl" maw={1000} mx="auto">
            <Title order={2} fw={700}>
              Treatment Options
            </Title>
            <Stack gap="md">
              {content.treatmentOptions.cards.map((t) => (
                <Group
                  key={t.id}
                  wrap="nowrap"
                  p="lg"
                  style={{
                    border: '1px solid #E9ECEF',
                    borderRadius: '8px',
                  }}
                >
                  <Stack style={{ flex: 1 }} gap="xs">
                    <Text fw={700} size="lg">
                      {t.title}
                    </Text>
                    <Text size="sm" c="dimmed" mb="xs">
                      {t.description}
                    </Text>
                    <Button
                      variant="filled"
                      color="#E9ECEF"
                      c="black"
                      size="xs"
                      w="fit-content"
                      radius="sm"
                    >
                      Learn More
                    </Button>
                  </Stack>
                  <Box
                    w={240}
                    h={140}
                    style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}
                  >
                    <Image src={t.imageSrc} alt={t.title} fill className="object-cover" />
                  </Box>
                </Group>
              ))}
            </Stack>

            <Group justify="center" mt={30}>
              <Button
                variant="outline"
                color="#548CA1"
                size="lg"
                radius="md"
                onClick={() => setStep(2)}
              >
                Back
              </Button>

              <Button size="lg" radius="md" style={primaryBtnStyles} onClick={() => setStep(4)}>
                Proceed
              </Button>
            </Group>
          </Stack>
        )}

        {/* STEP 4: Personalized Recommendations */}
        {step === 4 && (
          <Stack gap={40} maw={800} mx="auto">
            <Box>
              <Title order={2} fw={700} mb="sm">
                Personalized Recommendations
              </Title>
              <Text c="dimmed">Based on your symptom assessment, we recommend the following:</Text>
            </Box>

            <Stack gap="xl">
              <Text fw={700} size="lg">
                Potential Solutions
              </Text>
              {[
                {
                  label: 'General Dentistry',
                  desc: 'For issues like tooth decay, cavities, or fillings.',
                },
                { label: 'Periodontics', desc: 'For gum disease, gingivitis, or periodontitis.' },
                { label: 'Endodontics', desc: 'For root canals or other endodontic procedures.' },
              ].map((sol) => (
                <Group key={sol.label} wrap="nowrap" align="flex-start">
                  <Box p={12} bg="#F1F3F5" style={{ borderRadius: '8px' }}>
                    <Stethoscope size={24} color="#495057" />
                  </Box>
                  <Box>
                    <Text fw={700}>{sol.label}</Text>
                    <Text size="sm" c="#548CA1">
                      {sol.desc}
                    </Text>
                  </Box>
                </Group>
              ))}
            </Stack>

            <Stack gap="sm">
              <Text fw={700} size="lg">
                Next Steps
              </Text>
              <Text size="sm" c="dimmed">
                Schedule an appointment with a dentist specializing in the recommended areas. Be
                prepared to discuss your symptoms in detail and any relevant medical history. Follow
                any pre-appointment instructions provided by the dentist&apos;s office.
              </Text>
            </Stack>

            <Stack gap="sm">
              <Text fw={700} size="lg">
                General Oral Health Advice
              </Text>
              <Text size="sm" c="dimmed">
                Maintain a consistent oral hygiene routine, including brushing twice a day, flossing
                daily, and using an antiseptic mouthwash. Limit sugary foods and drinks. Consider
                using a fluoride toothpaste and mouthwash. Schedule regular check-ups and cleanings
                with your dentist, even if you don&apos;t have any current symptoms.
              </Text>
            </Stack>

            <Group justify="center" mt={30}>
              <Button
                variant="outline"
                color="#548CA1"
                size="lg"
                px={40}
                radius="md"
                onClick={() => setStep(3)}
              >
                Back
              </Button>
              <Button
                size="lg"
                radius="md"
                px={40}
                style={primaryBtnStyles}
                onClick={handleComplete}
              >
                Find a Dentist
              </Button>
            </Group>
          </Stack>
        )}
      </Container>
    </Box>
  );
};
