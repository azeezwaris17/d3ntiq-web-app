'use client';

/**
 * PatientOralIQPage
 *
 * Full 7-step wizard for the patient dashboard:
 *
 *   0  Dental Map Selection   (pre-filled from session or draft)
 *   1  Symptom Form           (pre-filled from session or draft)
 *   2  Matched Conditions
 *   3  Treatment Options
 *   4  Personalized Recommendations
 *   5  Provider Search        (pre-filled with prior search + highlighted original pick)
 *   6  Appointment Booking    (calendar + time + type)
 *   7  Appointment Review     (summary before confirmation)
 *   8  Appointment Confirmed
 *
 * On mount, checks for draft parameter in URL. If present, loads draft from backend.
 * Otherwise, reads from sessionStorage.
 * Saves draft to backend as user progresses through steps.
 */

import { useEffect, useState } from 'react';
import { Box, Title, Text, Loader } from '@mantine/core';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_MY_APPOINTMENT_DRAFT,
  SAVE_APPOINTMENT_DRAFT,
  CREATE_APPOINTMENT,
} from '@/modules/appointments/infrastructure/graphql/appointments.graphql';
import { notifications } from '@mantine/notifications';
import {
  OralIQPage as OralIQAssessment,
  type SelectedProvider,
} from '@/modules/oral-iq/presentation/OralIQPage';
import type { OralIQAssessment as OralIQResult } from '@/modules/oral-iq/domain/entities/ai-treatment-recommendation.entity';
import type { MouthModelSelection } from '@/modules/oral-iq/domain/oral-iq.types';
import { oralIQSession } from '@/modules/oral-iq/infrastructure/oral-iq-session';
import { ProviderSearchStep } from '../components/ProviderSearchStep';
import { AppointmentBookingStep, type AppointmentBookingData } from '../components/AppointmentBookingStep';
import { AppointmentReviewStep } from '../components/AppointmentReviewStep';
import { AppointmentConfirmedStep } from '../components/AppointmentConfirmedStep';
import type { SymptomFormData } from '@/modules/oral-iq/domain/entities/ai-treatment-recommendation.entity';

type WizardPhase = 'oral-iq' | 'provider-search' | 'booking' | 'review' | 'confirmed';

export function PatientOralIQPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isDraftMode = searchParams?.get('draft') === 'true';
  
  const [phase, setPhase] = useState<WizardPhase>('oral-iq');
  const [isLoadingDraft, setIsLoadingDraft] = useState(isDraftMode);

  // Oral IQ data (restored from session or draft)
  const [initialResult, setInitialResult] = useState<OralIQResult | null>(null);
  const [initialSelection, setInitialSelection] = useState<MouthModelSelection | null>(null);
  const [initialFormData, setInitialFormData] = useState<Partial<import('@/modules/oral-iq/domain/entities/ai-treatment-recommendation.entity').SymptomFormData> | null>(null);
  const [initialDentalMapSelected, setInitialDentalMapSelected] = useState<string[]>([]);
  const [initialDentalMapGroups, setInitialDentalMapGroups] = useState<Record<string, string[]>>({});
  const [initialSelectionLabels, setInitialSelectionLabels] = useState<string[]>([]);

  // Store form data for the review step
  const [storedFormData, setStoredFormData] = useState<Partial<SymptomFormData> | null>(null);

  // Provider search data (restored from session or draft)
  const [initialProvider, setInitialProvider] = useState<SelectedProvider | null>(null);
  const [initialQuery, setInitialQuery] = useState<string | null>(null);
  const [initialResults, setInitialResults] = useState<SelectedProvider[] | null>(null);

  // Booking data
  const [bookingProvider, setBookingProvider] = useState<SelectedProvider | null>(null);
  const [bookingData, setBookingData] = useState<AppointmentBookingData | null>(null);

  // Latest oral-iq result (updated when patient re-runs assessment)
  const [currentResult, setCurrentResult] = useState<OralIQResult | null>(null);

  // Fetch draft if in draft mode
  const { data: draftQueryData, loading: draftQueryLoading, error: draftQueryError } = useQuery<{ myAppointmentDraft: any }>(
    GET_MY_APPOINTMENT_DRAFT,
    { skip: !isDraftMode, fetchPolicy: 'network-only' }
  );

  useEffect(() => {
    if (!isDraftMode) return;
    if (draftQueryLoading) return;
    if (draftQueryError) {
      setIsLoadingDraft(false);
      notifications.show({ title: 'Error', message: 'Failed to load draft. Starting fresh.', color: 'red' });
      return;
    }
    if (draftQueryData !== undefined) {
      if (draftQueryData?.myAppointmentDraft) loadDraftData(draftQueryData.myAppointmentDraft);
      setIsLoadingDraft(false);
    }
  }, [isDraftMode, draftQueryLoading, draftQueryData, draftQueryError]);

  // Save draft mutation
  const [saveDraftMutation] = useMutation(SAVE_APPOINTMENT_DRAFT);

  // Create appointment mutation
  const [createAppointmentMutation, { loading: isCreatingAppointment }] = useMutation(CREATE_APPOINTMENT, {
    onCompleted: () => {
      notifications.show({
        title: 'Appointment Booked!',
        message: 'Your appointment has been successfully booked',
        color: 'green',
      });
      // Clear session and draft after successful booking
      oralIQSession.clear();
      setPhase('confirmed');
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to book appointment',
        color: 'red',
      });
    },
  });

  // Load draft data into state
  function loadDraftData(draft: any) {
    const oralIQData = draft.oralIQData;
    
    if (oralIQData.result) {
      setInitialResult(oralIQData.result);
      setCurrentResult(oralIQData.result);
    }
    if (oralIQData.selection) setInitialSelection(oralIQData.selection);
    if (oralIQData.formData) {
      setInitialFormData(oralIQData.formData);
      setStoredFormData(oralIQData.formData);
    }
    if (oralIQData.dentalMapSelected) setInitialDentalMapSelected(oralIQData.dentalMapSelected);
    if (oralIQData.dentalMapGroups) setInitialDentalMapGroups(oralIQData.dentalMapGroups);
    if (oralIQData.selectionLabels) setInitialSelectionLabels(oralIQData.selectionLabels);
    
    if (draft.selectedProvider) setInitialProvider(draft.selectedProvider);
    if (draft.providerSearchQuery) setInitialQuery(draft.providerSearchQuery);
    if (draft.providerSearchResults) setInitialResults(draft.providerSearchResults);
    if (draft.bookingData) {
      setBookingData({
        provider: draft.selectedProvider,
        date: new Date(draft.bookingData.date),
        time: draft.bookingData.time,
        appointmentType: draft.bookingData.appointmentType,
      });
    }

    // Determine which phase to start at based on draft progress
    if (draft.bookingData) {
      setPhase('review');
    } else if (draft.selectedProvider) {
      setPhase('booking');
      setBookingProvider(draft.selectedProvider);
    } else if (draft.providerSearchResults) {
      setPhase('provider-search');
    } else {
      setPhase('oral-iq');
    }
  }

  // Save current progress as draft
  async function saveDraft(currentPhase: WizardPhase) {
    try {
      const oralIQData = {
        selection: initialSelection,
        dentalMapSelected: initialDentalMapSelected,
        dentalMapGroups: initialDentalMapGroups,
        selectionLabels: initialSelectionLabels,
        formData: storedFormData,
        result: currentResult,
      };

      await saveDraftMutation({
        variables: {
          input: {
            oralIQData,
            selectedProvider: bookingProvider || initialProvider,
            providerSearchQuery: initialQuery,
            providerSearchResults: initialResults,
            bookingData: bookingData ? {
              date: bookingData.date.toISOString(),
              time: bookingData.time,
              appointmentType: bookingData.appointmentType,
            } : null,
            currentStep: currentPhase === 'oral-iq' ? 0 : 
                        currentPhase === 'provider-search' ? 5 :
                        currentPhase === 'booking' ? 6 :
                        currentPhase === 'review' ? 7 : 8,
          },
        },
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }

  useEffect(() => {
    // If not in draft mode, load from sessionStorage
    if (!isDraftMode) {
      const session = oralIQSession.read();

      if (session.result) {
        setInitialResult(session.result);
        setCurrentResult(session.result);
      }
      if (session.selection) setInitialSelection(session.selection);
      if (session.formData) setInitialFormData(session.formData);
      if (session.dentalMapSelected) setInitialDentalMapSelected(session.dentalMapSelected);
      if (session.dentalMapGroups) setInitialDentalMapGroups(session.dentalMapGroups);
      if (session.selectionLabels) setInitialSelectionLabels(session.selectionLabels);
      if (session.formData) {
        setInitialFormData(session.formData);
        setStoredFormData(session.formData);
      }
      if (session.bookingProvider) setInitialProvider(session.bookingProvider);
      if (session.providerSearchQuery) setInitialQuery(session.providerSearchQuery);
      if (session.providerSearchResults) setInitialResults(session.providerSearchResults);
    }
  }, [isDraftMode]);

  // Called when patient clicks "Find a Dentist" from step 4 without a pre-selected provider
  function handleLocateProvider() {
    setPhase('provider-search');
  }

  // Provider search → booking
  function handleProviderSelected(provider: SelectedProvider) {
    setBookingProvider(provider);
    saveDraft('provider-search'); // Auto-save before moving to next phase
    setPhase('booking');
  }

  // Booking confirmed → go to review step
  function handleBookingConfirmed(data: AppointmentBookingData) {
    setBookingData(data);
    saveDraft('booking'); // Auto-save before moving to review
    setPhase('review');
  }

  // Final confirmation → create appointment in database
  async function handleFinalConfirm() {
    if (!bookingData || !bookingProvider) return;

    await createAppointmentMutation({
      variables: {
        input: {
          providerId: bookingProvider.id || 'provider-id-placeholder',
          appointmentDate: bookingData.date.toISOString(),
          appointmentTime: bookingData.time,
          type: bookingData.appointmentType.toUpperCase().replace(/[\s-]/g, '_'),
          providerName: bookingProvider.name,
          providerSpecialty: bookingProvider.specialty,
          providerAddress: bookingProvider.address,
          providerPhone: bookingProvider.phone,
          oralIQData: {
            selection: initialSelection,
            dentalMapSelected: initialDentalMapSelected,
            dentalMapGroups: initialDentalMapGroups,
            selectionLabels: initialSelectionLabels,
            formData: storedFormData,
            result: currentResult,
          },
          reminderPreference: 'EMAIL',
        },
      },
    });
  }

  // Reschedule — go back to booking step
  function handleReschedule() {
    setPhase('booking');
  }

  // Cancel — cancel the appointment and navigate to appointments page
  async function handleCancel() {
    // Since we just created it, we need the appointment ID
    // For now, just navigate to oral-iq start
    router.push('/patient/oral-iq');
  }

  // View all appointments — navigate to appointments page
  function handleViewAll() {
    router.push('/patient/appointments');
  }

  return (
    <Box>
      {/* Loading state while fetching draft */}
      {isLoadingDraft && (
        <Box ta="center" py="xl">
          <Loader size="lg" />
          <Text size="sm" c="dimmed" mt="md">Loading your appointment...</Text>
        </Box>
      )}

      {/* Header — only shown in oral-iq phase */}
      {!isLoadingDraft && phase === 'oral-iq' && (
        <Box mb={24}>
          <Title order={2} fw={700} c="#1e293b" fz={22}>Oral IQ Assessment</Title>
          <Text size="sm" c="dimmed" mt={4}>AI-powered dental symptom assessment</Text>
        </Box>
      )}

      {/* ── Phase: Oral IQ (steps 0–4) ── */}
      {!isLoadingDraft && phase === 'oral-iq' && (
        <OralIQAssessment
          selectedProvider={initialProvider}
          initialResult={initialResult}
          initialSelection={initialSelection}
          initialFormData={initialFormData}
          initialDentalMapSelected={initialDentalMapSelected}
          initialDentalMapGroups={initialDentalMapGroups}
          initialSelectionLabels={initialSelectionLabels}
          onBookNow={(provider) => {
            setBookingProvider(provider);
            setPhase('provider-search');
          }}
          onLocateProvider={handleLocateProvider}
        />
      )}

      {/* ── Phase: Provider Search (step 5) ── */}
      {!isLoadingDraft && phase === 'provider-search' && (
        <Box
          p={{ base: 'md', md: 28 }}
          bg="#fff"
          style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
        >
          <ProviderSearchStep
            initialProvider={initialProvider}
            initialQuery={initialQuery}
            initialResults={initialResults}
            onNext={handleProviderSelected}
            onBack={() => setPhase('oral-iq')}
          />
        </Box>
      )}

      {/* ── Phase: Appointment Booking (step 6) ── */}
      {!isLoadingDraft && phase === 'booking' && bookingProvider && (
        <Box
          p={{ base: 'md', md: 28 }}
          bg="#fff"
          style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
        >
          <AppointmentBookingStep
            provider={bookingProvider}
            onConfirm={handleBookingConfirmed}
            onBack={() => setPhase('provider-search')}
          />
        </Box>
      )}

      {/* ── Phase: Review (step 7) ── */}
      {!isLoadingDraft && phase === 'review' && bookingData && (
        <Box
          p={{ base: 'md', md: 28 }}
          bg="#fff"
          style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
        >
          <AppointmentReviewStep
            booking={bookingData}
            oralIQSummary={{
              selectedAreas: initialSelectionLabels,
              symptomTypes: storedFormData?.symptomTypes ?? [],
              painLevel: storedFormData?.painLevel,
              duration: storedFormData?.duration ?? 'Not specified',
              conditions: currentResult?.matchedConditions.map((c) => c.name) ?? [],
            }}
            onConfirm={handleFinalConfirm}
            onBack={() => setPhase('booking')}
            isLoading={isCreatingAppointment}
          />
        </Box>
      )}

      {/* ── Phase: Confirmed (step 8) ── */}
      {!isLoadingDraft && phase === 'confirmed' && bookingData && (
        <Box
          p={{ base: 'md', md: 28 }}
          bg="#fff"
          style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
        >
          <AppointmentConfirmedStep
            booking={bookingData}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
            onViewAll={handleViewAll}
          />
        </Box>
      )}
    </Box>
  );
}
