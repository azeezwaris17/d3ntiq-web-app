import type { MouthModelSelection } from '@/modules/oral-iq/domain/oral-iq.types';

// ============================================================================
// Input Types
// ============================================================================

export interface SymptomSensations {
  sharpPain: boolean;
  dullAche: boolean;
  throbbing: boolean;
}

export interface SymptomFormData {
  symptomType: string;
  painLevel?: number | null;
  duration?: string;
  specificSensations?: string;
  sensations: SymptomSensations;
}

export interface SymptomAssessmentInput {
  selection: MouthModelSelection;
  formData: SymptomFormData;
  timestamp: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface TreatmentOption {
  id: string;
  title: string;
  description: string;
  estimatedCost?: string;
  conditionName?: string;
  causeTreated?: string;
  image: string | null;
  category: string;
  specialty: string;
  detailedDescription?: string;
  procedure?: string;
  duration?: string;
  recovery?: string;
  benefits?: string[];
  risks?: string[];
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  detailedExplanation?: string;
  possibleCauses?: string[];
  recommendedActions?: string[];
  whenToSeekCare?: string;
}

export interface AIMetadata {
  concerns: string;
  severityLevel: string;
  personalizedGuidance: string;
  professionalCareRecommendation: string;
  disclaimer: string;
}

export interface AITreatmentRecommendation {
  treatments: TreatmentOption[];
  matchedConditions: Condition[];
  aiMetadata: AIMetadata;
}

export interface SpecialtyRecommendation {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface OralIQAssessment {
  matchedConditions: Condition[];
  treatments: TreatmentOption[];
  specialties: SpecialtyRecommendation[];
  recommendations: string[];
  aiMetadata?: AIMetadata;
}

// ============================================================================
// Enums (matching backend)
// ============================================================================

export enum RegionType {
  TOOTH = 'TOOTH',
  GUM = 'GUM',
}

export enum JawPosition {
  UPPER = 'UPPER',
  LOWER = 'LOWER',
}

export enum ToothType {
  INCISOR = 'INCISOR',
  CANINE = 'CANINE',
  PREMOLAR = 'PREMOLAR',
  MOLAR = 'MOLAR',
}

export enum TreatmentCategory {
  ORTHODONTICS = 'ORTHODONTICS',
  COSMETIC = 'COSMETIC',
  RESTORATIVE = 'RESTORATIVE',
  ENDODONTIC = 'ENDODONTIC',
  PERIODONTIC = 'PERIODONTIC',
  PREVENTIVE = 'PREVENTIVE',
}

export enum ConditionSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
}

export enum SeverityLevel {
  INFORMATIONAL = 'informational',
  MONITOR = 'monitor',
  CONSULT_SOON = 'consult_soon',
  SEEK_IMMEDIATE_CARE = 'seek_immediate_care',
}
