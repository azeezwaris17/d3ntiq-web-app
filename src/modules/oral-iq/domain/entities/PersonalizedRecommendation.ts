export interface SpecialtyRecommendation {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface PersonalizedRecommendation {
  specialties: SpecialtyRecommendation[];
  recommendations: string[];
  concerns?: string;
  severityLevel?: string;
  disclaimer?: string;
}
