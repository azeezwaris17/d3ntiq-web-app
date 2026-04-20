/**
 * ContactRepository Interface
 *
 * This file defines the repository contract for contact page data operations in the Domain layer.
 * It specifies what methods must exist to retrieve contact content and submit contact forms,
 * without defining how those methods are implemented.
 *
 * As a Domain Repository interface, this file:
 * - Defines the contract (interface) that all contact data sources must follow
 * - Is independent of implementation details (API, database, mock data)
 * - Ensures type safety and consistency across different data sources
 * - Follows the Dependency Inversion Principle (depends on abstractions, not concretions)
 *
 * The interface includes methods for:
 * - Getting the complete contact page content (hero + contact info + form configuration)
 * - Submitting contact form data (for processing contact inquiries)
 *
 * Implementations of this interface are provided in the Infrastructure layer.
 * The Application layer (use cases) depends on this interface, not the implementation,
 * making the system flexible and testable.
 */
import { ContactFormData, ContactPageContent } from '../entities/ContactFormData';

export interface ContactRepository {
  getContactPageContent(): Promise<ContactPageContent>;
  submitContactForm(formData: ContactFormData): Promise<void>;
}
