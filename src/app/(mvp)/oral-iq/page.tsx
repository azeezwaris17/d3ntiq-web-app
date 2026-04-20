'use client';

/**
 * Public Oral IQ Page
 * 
 * This is the PUBLIC flow wrapper - always starts fresh with no pre-filled data.
 * When user completes step 4, saves to sessionStorage and redirects to providers page.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OralIQCore, type OralIQCompleteData } from '@/modules/oral-iq/presentation/components/OralIQCore';
import { oralIQSession } from '@/modules/oral-iq/infrastructure/oral-iq-session';

export default function PublicOralIQPage() {
  const router = useRouter();

  // Set page title
  useEffect(() => {
    document.title = 'Oral IQ – Interactive Dental Assessment | DENTIQ';
  }, []);

  const handleComplete = (data: OralIQCompleteData) => {
    // Save to sessionStorage with 24-hour expiry
    oralIQSession.saveComplete({
      selection: data.selection,
      formData: data.formData,
      result: data.result,
      dentalMapSelected: data.dentalMapSelected,
      dentalMapGroups: data.dentalMapGroups,
      selectionLabels: data.selectionLabels,
    }, 24 * 60 * 60 * 1000); // 24 hours

    // Redirect to providers page with query params
    const params = new URLSearchParams({
      toothNumber: data.selection.fdiNumber?.toString() || data.selection.regionId,
      jaw: data.selection.jaw,
      symptoms: data.result.matchedConditions.map((c) => c.name).join(','),
    });
    
    router.push(`/providers?${params.toString()}`);
  };

  return (
    <OralIQCore
      initialData={undefined} // Always start fresh in public flow
      shouldReassess={true} // Always run assessment
      onComplete={handleComplete}
    />
  );
}
