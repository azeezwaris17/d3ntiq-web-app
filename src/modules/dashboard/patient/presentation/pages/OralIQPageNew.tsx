'use client';

/**
 * Dashboard Oral IQ Page
 * 
 * This is the DASHBOARD flow wrapper - pre-fills data from sessionStorage or draft.
 * Implements smart re-assessment logic and handles the full booking flow.
 */

import { useEffect, useState, useMemo } from 'react';
import { Box, Title, Text, Loader } from '@mantine/core';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { notifications } from '@mantine/notifications';
import {
  GET_MY_APPOINTMENT_DRAFT,
  SAVE_APPOINTMENT_DRAFT,
  CREATE_APPOINTMENT,
  RESCHEDULE_APPOINTMENT,
} from '@/modules/appointments/infrastructure/graphql/appointments.graphql';
import { OralIQCore, type OralIQCompleteData, type OralIQInitialData } from '@/modules/oral-iq/presentation/components/OralIQCore';
import { oralIQSession } from '@/modules/oral-iq/infrastructure/oral-iq-session';
import { ProviderSearchStep } from '../components/ProviderSearchStep';
import { AppointmentBookingStep, type AppointmentBookingData } from '../components/AppointmentBookingStep';
import { AppointmentReviewStep } from '../components/AppointmentReviewStep';
import { AppointmentConfirmedStep } from '../components/AppointmentConfirmedStep';
import { AppointmentRescheduledStep } from '../components/AppointmentRescheduledStep';
import type { SelectedProvider } from '@/modules/oral-iq/presentation/OralIQPage';

type WizardPhase = 'oral-iq' | 'provider-search' | 'booking' | 'review' | 'confirmed' | 'rescheduled';

export function DashboardOralIQPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isDraftMode = searchParams?.get('draft') === 'true';
  const isRescheduleMode = searchParams?.get('reschedule') === 'true';
  
  const [phase, setPhase] = useState<WizardPhase>(() => {
    // If reschedule mode, start directly at booking step
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('reschedule') === 'true') {
      return 'booking';
    }
    return 'oral-iq';
  });
  const [isLoadingDraft, setIsLoadingDraft] = useState(isDraftMode);
  const [tokenReady, setTokenReady] = useState(false);

  // Wait for token before firing queries
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setTokenReady(true);
      return;
    }
    const interval = setInterval(() => {
      if (localStorage.getItem('accessToken')) {
        setTokenReady(true);
        clearInterval(interval);
      }
    }, 100);
    const timeout = setTimeout(() => { clearInterval(interval); setTokenReady(true); }, 3000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  // Initial data for OralIQCore
  const [initialData, setInitialData] = useState<OralIQInitialData | undefined>();
  const [originalData, setOriginalData] = useState<OralIQInitialData | undefined>();
  
  // Current oral IQ data
  const [currentOralIQData, setCurrentOralIQData] = useState<OralIQCompleteData | null>(null);
  
  // Provider search data
  const [initialProvider, setInitialProvider] = useState<SelectedProvider | null>(null);
  const [initialQuery, setInitialQuery] = useState<string | null>(null);
  const [initialResults, setInitialResults] = useState<SelectedProvider[] | null>(null);

  // Booking data
  const [bookingProvider, setBookingProvider] = useState<SelectedProvider | null>(null);
  const [bookingData, setBookingData] = useState<AppointmentBookingData | null>(null);

  // Reschedule state
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null);
  const [rescheduleInitialDate, setRescheduleInitialDate] = useState<Date | undefined>();
  const [rescheduleInitialTime, setRescheduleInitialTime] = useState<string | undefined>();
  const [rescheduleInitialType, setRescheduleInitialType] = useState<any>(undefined);
  const [rescheduleOralIQData, setRescheduleOralIQData] = useState<any>(null);

  // Fetch draft if in draft mode
  const { data: draftQueryData, loading: draftQueryLoading, error: draftQueryError } = useQuery<{ myAppointmentDraft: any }>(
    GET_MY_APPOINTMENT_DRAFT,
    {
      skip: !isDraftMode || !tokenReady,
      fetchPolicy: 'network-only',
    }
  );

  // Process draft data when query completes
  useEffect(() => {
    if (!isDraftMode || !tokenReady) return;
    if (draftQueryLoading) return;

    if (draftQueryError) {
      setIsLoadingDraft(false);
      notifications.show({
        title: 'Error',
        message: 'Failed to load draft. Starting fresh.',
        color: 'red',
      });
      return;
    }

    // Query finished (data may be null if no draft exists)
    if (draftQueryData !== undefined) {
      if (draftQueryData?.myAppointmentDraft) {
        loadDraftData(draftQueryData.myAppointmentDraft);
      } else {
        // No draft found — start fresh at oral-iq
        setPhase('oral-iq');
      }
      setIsLoadingDraft(false);
    }
  }, [isDraftMode, tokenReady, draftQueryLoading, draftQueryData, draftQueryError]);

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

  // Reschedule appointment mutation
  const [rescheduleAppointmentMutation, { loading: isRescheduling }] = useMutation(RESCHEDULE_APPOINTMENT, {
    onCompleted: () => {
      notifications.show({
        title: 'Appointment Rescheduled!',
        message: 'Your appointment has been successfully rescheduled',
        color: 'green',
      });
      setPhase('rescheduled');
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to reschedule appointment',
        color: 'red',
      });
    },
  });

  // Load draft data into state
  function loadDraftData(draft: any) {
    const oralIQData = draft.oralIQData;
    
    const data: OralIQInitialData = {
      selection: oralIQData.selection || null,
      formData: oralIQData.formData || null,
      result: oralIQData.result || null,
      dentalMapSelected: oralIQData.dentalMapSelected || [],
      dentalMapGroups: oralIQData.dentalMapGroups || {},
      selectionLabels: oralIQData.selectionLabels || [],
    };
    
    setInitialData(data);
    setOriginalData(data);

    // Also populate currentOralIQData so review/booking phases can render
    if (oralIQData.result && oralIQData.selection) {
      setCurrentOralIQData({
        selection: oralIQData.selection,
        formData: oralIQData.formData || {},
        result: oralIQData.result,
        dentalMapSelected: oralIQData.dentalMapSelected || [],
        dentalMapGroups: oralIQData.dentalMapGroups || {},
        selectionLabels: oralIQData.selectionLabels || [],
      });
    }
    
    if (draft.selectedProvider) {
      setInitialProvider(draft.selectedProvider);
      setBookingProvider(draft.selectedProvider);
    }
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

  // Load from sessionStorage if not in draft mode
  useEffect(() => {
    if (!isDraftMode && !isLoadingDraft) {
      const session = oralIQSession.read();

      if (session.selection || session.formData || session.result) {
        const data: OralIQInitialData = {
          selection: session.selection,
          formData: session.formData || {},
          result: session.result,
          dentalMapSelected: session.dentalMapSelected || [],
          dentalMapGroups: session.dentalMapGroups || {},
          selectionLabels: session.selectionLabels || [],
        };
        setInitialData(data);
        setOriginalData(data);

        // Also populate currentOralIQData so booking/review phases can render
        // when navigating back from booking step
        if (session.result && session.selection) {
          setCurrentOralIQData({
            selection: session.selection,
            formData: (session.formData || {}) as any,
            result: session.result,
            dentalMapSelected: session.dentalMapSelected || [],
            dentalMapGroups: session.dentalMapGroups || {},
            selectionLabels: session.selectionLabels || [],
          });
        }
      }

      if (session.bookingProvider) setInitialProvider(session.bookingProvider);
      if (session.providerSearchQuery) setInitialQuery(session.providerSearchQuery);
      if (session.providerSearchResults) setInitialResults(session.providerSearchResults);

      // Handle reschedule mode — load provider from sessionStorage and jump to booking
      if (isRescheduleMode) {
        const appointmentId = sessionStorage.getItem('rescheduleAppointmentId');
        const providerId = sessionStorage.getItem('rescheduleProviderId');
        const providerName = sessionStorage.getItem('rescheduleProviderName');
        const providerSpecialty = sessionStorage.getItem('rescheduleProviderSpecialty');
        const providerAddress = sessionStorage.getItem('rescheduleProviderAddress');
        const providerPhone = sessionStorage.getItem('rescheduleProviderPhone');
        const appointmentDate = sessionStorage.getItem('rescheduleAppointmentDate');
        const appointmentTime = sessionStorage.getItem('rescheduleAppointmentTime');
        const appointmentType = sessionStorage.getItem('rescheduleAppointmentType');
        const oralIQDataRaw = sessionStorage.getItem('rescheduleOralIQData');

        if (providerId && providerName && providerSpecialty) {
          setBookingProvider({
            id: providerId,
            name: providerName,
            specialty: providerSpecialty,
            address: providerAddress || undefined,
            phone: providerPhone || undefined,
          });
          if (appointmentId) setRescheduleAppointmentId(appointmentId);
          if (appointmentDate) setRescheduleInitialDate(new Date(appointmentDate));
          if (appointmentTime) setRescheduleInitialTime(appointmentTime);
          if (appointmentType) setRescheduleInitialType(appointmentType);
          if (oralIQDataRaw) {
            try { setRescheduleOralIQData(JSON.parse(oralIQDataRaw)); } catch { /* ignore */ }
          }
          setPhase('booking');
        }

        // Clean up reschedule session keys
        ['rescheduleAppointmentId', 'rescheduleProviderId', 'rescheduleProviderName',
          'rescheduleProviderSpecialty', 'rescheduleProviderAddress', 'rescheduleProviderPhone',
          'rescheduleAppointmentDate', 'rescheduleAppointmentTime', 'rescheduleAppointmentType',
          'rescheduleOralIQData']
          .forEach((k) => sessionStorage.removeItem(k));
      }
    }
  }, [isDraftMode, isLoadingDraft, isRescheduleMode]);

  // Determine if we should re-assess based on data changes
  const shouldReassess = useMemo(() => {
    if (!initialData || !originalData) return true;
    if (!initialData.result) return true; // No existing result, must assess
    
    // Compare step 0 and step 1 data
    const step0Changed = JSON.stringify(initialData.selection) !== JSON.stringify(originalData.selection);
    const step1Changed = JSON.stringify(initialData.formData) !== JSON.stringify(originalData.formData);
    
    return step0Changed || step1Changed;
  }, [initialData, originalData]);

  // Save current progress as draft
  async function saveDraft(currentPhase: WizardPhase) {
    if (!currentOralIQData) return;
    
    try {
      const oralIQData = {
        selection: currentOralIQData.selection,
        dentalMapSelected: currentOralIQData.dentalMapSelected,
        dentalMapGroups: currentOralIQData.dentalMapGroups,
        selectionLabels: currentOralIQData.selectionLabels,
        formData: currentOralIQData.formData,
        result: currentOralIQData.result,
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

  // Handle Oral IQ completion (step 4 done)
  const handleOralIQComplete = (data: OralIQCompleteData) => {
    setCurrentOralIQData(data);
    
    // Always go to provider search first (user can see pre-filled results if available)
    setPhase('provider-search');
  };

  // Handle step changes (for auto-save)
  const handleStepChange = (_step: number, _data: any) => {
    // Auto-save draft on step changes
    saveDraft('oral-iq');
  };

  // Provider search → booking
  function handleProviderSelected(provider: SelectedProvider) {
    setBookingProvider(provider);
    saveDraft('provider-search');
    setPhase('booking');
  }

  // Booking confirmed → go to review step
  function handleBookingConfirmed(data: AppointmentBookingData) {
    setBookingData(data);
    saveDraft('booking');
    setPhase('review');
  }

  // Final reschedule confirmation
  async function handleFinalReschedule() {
    if (!bookingData || !rescheduleAppointmentId) return;
    await rescheduleAppointmentMutation({
      variables: {
        input: {
          appointmentId: rescheduleAppointmentId,
          appointmentDate: bookingData.date.toISOString(),
          appointmentTime: bookingData.time,
          type: bookingData.appointmentType.toUpperCase().replace(/[\s-]/g, '_'),
        },
      },
    });
  }

  // Final confirmation → create appointment in database
  async function handleFinalConfirm() {
    if (!bookingData || !bookingProvider) return;

    const oralData = currentOralIQData || {
      selection: initialData?.selection,
      formData: initialData?.formData,
      result: initialData?.result,
      dentalMapSelected: initialData?.dentalMapSelected || [],
      dentalMapGroups: initialData?.dentalMapGroups || {},
      selectionLabels: initialData?.selectionLabels || [],
    };

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
            selection: oralData.selection,
            dentalMapSelected: oralData.dentalMapSelected,
            dentalMapGroups: oralData.dentalMapGroups,
            selectionLabels: oralData.selectionLabels,
            formData: oralData.formData,
            result: oralData.result,
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

  // Cancel — navigate to oral-iq start
  async function handleCancel() {
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
        <OralIQCore
          initialData={initialData}
          shouldReassess={shouldReassess}
          onComplete={handleOralIQComplete}
          onStepChange={handleStepChange}
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
            onBack={() => isRescheduleMode ? router.push('/patient/appointments') : setPhase('provider-search')}
            initialDate={rescheduleInitialDate}
            initialTime={rescheduleInitialTime}
            initialType={rescheduleInitialType}
            isReschedule={isRescheduleMode}
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
          {(() => {
            const oralData = currentOralIQData || rescheduleOralIQData || {
              selectionLabels: initialData?.selectionLabels || [],
              formData: initialData?.formData || {},
              result: initialData?.result,
            };
            const formData = oralData?.formData || {};
            const selectionLabels = oralData?.selectionLabels || [];
            const conditions = oralData?.result?.matchedConditions?.map((c: any) => c.name) ?? [];
            return (
              <AppointmentReviewStep
                booking={bookingData}
                oralIQSummary={{
                  selectedAreas: selectionLabels,
                  symptomType: formData?.symptomType ?? 'Not specified',
                  painLevel: formData?.painLevel,
                  duration: formData?.duration ?? 'Not specified',
                  conditions,
                }}
                onConfirm={isRescheduleMode ? handleFinalReschedule : handleFinalConfirm}
                onBack={() => setPhase('booking')}
                isLoading={isRescheduleMode ? isRescheduling : isCreatingAppointment}
                confirmLabel={isRescheduleMode ? 'Confirm Reschedule' : 'Confirm Appointment'}
              />
            );
          })()}
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

      {/* ── Phase: Rescheduled ── */}
      {!isLoadingDraft && phase === 'rescheduled' && bookingData && (
        <Box
          p={{ base: 'md', md: 28 }}
          bg="#fff"
          style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
        >
          <AppointmentRescheduledStep
            booking={bookingData}
            onViewAll={() => router.push('/patient/appointments')}
          />
        </Box>
      )}
    </Box>
  );
}
