/**
 * Oral IQ Repository Implementation
 * Delegates to the unified assessOralHealth GraphQL hook.
 */

import { injectable } from 'tsyringe';
import type { OralIQRepository } from '../../domain/repositories/OralIQRepository';
import type {
  SymptomAssessmentInput,
  OralIQAssessment,
} from '../../domain/entities/ai-treatment-recommendation.entity';
import { apolloClient } from '@/core/config/graphql.config';
import { ASSESS_ORAL_HEALTH } from '../services/graphql-queries';
import { logger } from '@/core/logging';

@injectable()
export class OralIQRepositoryImpl implements OralIQRepository {
  async assessOralHealth(input: SymptomAssessmentInput): Promise<OralIQAssessment> {
    try {
      logger.info('assessOralHealth: sending unified assessment', {
        module: 'oral_iq_repository',
      });

      const { data } = await apolloClient.mutate<{ assessOralHealth: OralIQAssessment }>({
        mutation: ASSESS_ORAL_HEALTH,
        variables: { input },
      });

      if (!data?.assessOralHealth) {
        throw new Error('No data returned from assessOralHealth');
      }

      return data.assessOralHealth;
    } catch (error) {
      logger.error('Error in assessOralHealth', {
        module: 'oral_iq_repository',
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    }
  }
}
