import type {
  SymptomAssessmentInput,
  OralIQAssessment,
} from '../entities/ai-treatment-recommendation.entity';

export interface OralIQRepository {
  assessOralHealth(input: SymptomAssessmentInput): Promise<OralIQAssessment>;
}
