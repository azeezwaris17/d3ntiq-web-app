import type { MouthModelSelection } from '@/modules/oral-iq/domain/oral-iq.types';

export interface SymptomFormData {
  /** One or more symptom types selected by the patient (e.g. ['tooth-pain', 'swelling']) */
  symptomTypes: string[];
  painLevel: number | null;
  duration: string;
  specificSensations: string;
  sensations: {
    sharpPain: boolean;
    dullAche: boolean;
    throbbing: boolean;
  };
}

export interface SymptomAssessment {
  selection: MouthModelSelection;
  formData: SymptomFormData;
  timestamp: Date;
}
