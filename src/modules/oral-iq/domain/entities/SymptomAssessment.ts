import type { MouthModelSelection } from '@/modules/oral-iq/domain/oral-iq.types';

export interface SymptomFormData {
  symptomType: string;
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
