/**
 * GetServiceBySlugUseCase
 *
 * This file implements the use case for retrieving a single service by its slug
 * in the Application layer. A use case encapsulates a single business operation
 * and orchestrates the flow of data between the Presentation and Infrastructure layers.
 *
 * How it works:
 * 1. Receives a slug parameter to identify which service to retrieve
 * 2. Delegates data retrieval to the ServiceRepository (following Dependency Inversion)
 * 3. Returns the Service entity or null if not found
 *
 * As an Application Use Case, this class:
 * - Contains business logic for the "get service by slug" operation
 * - Depends on the repository interface (from Domain), not the implementation
 * - Can be easily tested by injecting mock repositories
 * - Follows the Single Responsibility Principle (one use case = one operation)
 *
 * The use case is marked as @injectable for dependency injection support,
 * allowing flexible repository implementations to be injected at runtime.
 *
 * This use case is used by the ServiceDetailPage component to fetch individual service data.
 */
import { injectable, inject } from 'tsyringe';
import type { Service } from '../../domain/entities/Service';
import type { ServiceRepository } from '../../domain/repositories/ServiceRepository';

@injectable()
export class GetServiceBySlugUseCase {
  constructor(@inject('ServiceRepository') private serviceRepository: ServiceRepository) {}

  async execute(slug: string): Promise<Service | null> {
    return this.serviceRepository.getServiceBySlug(slug);
  }
}
