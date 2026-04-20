export interface TreatmentOption {
  id: string;
  title: string;
  description: string;
  image: string;
  category:
    | 'orthodontics'
    | 'cosmetic'
    | 'restorative'
    | 'endodontic'
    | 'periodontic'
    | 'preventive';
  specialty:
    | 'General Dentistry'
    | 'Periodontics'
    | 'Endodontics'
    | 'Orthodontics'
    | 'Cosmetic Dentistry';
  detailedDescription?: string;
  procedure?: string;
  duration?: string;
  recovery?: string;
  benefits?: string[];
  risks?: string[];
}

export interface TreatmentRecommendation {
  treatments: TreatmentOption[];
  matchedConditions: string[];
}
