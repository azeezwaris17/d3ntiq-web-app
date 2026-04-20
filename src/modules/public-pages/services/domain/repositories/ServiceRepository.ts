/**
 * ServiceRepository Interface
 *
 * This file defines the repository contract for service data operations in the Domain layer.
 * It specifies what methods must exist to retrieve service content, without defining
 * how those methods are implemented.
 *
 * As a Domain Repository interface, this file:
 * - Defines the contract (interface) that all service data sources must follow
 * - Is independent of implementation details (API, database, mock data)
 * - Ensures type safety and consistency across different data sources
 * - Follows the Dependency Inversion Principle (depends on abstractions, not concretions)
 *
 * The interface includes methods for:
 * - Getting the complete services page content (hero + patient services + provider services)
 * - Getting a single service by slug (for detail pages)
 * - Getting services filtered by category (patient or provider)
 *
 * Implementations of this interface are provided in the Infrastructure layer.
 * The Application layer (use cases) depends on this interface, not the implementation,
 * making the system flexible and testable.
 */
import { Service, ServicesPageContent } from '../entities/Service';

export interface ServiceRepository {
  getServicesPageContent(): Promise<ServicesPageContent>;
  getServiceBySlug(slug: string): Promise<Service | null>;
  getServicesByCategory(category: 'patient' | 'provider'): Promise<Service[]>;
}
