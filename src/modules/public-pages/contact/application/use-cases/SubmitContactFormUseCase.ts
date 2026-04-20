/**
 * SubmitContactFormUseCase
 *
 * This file implements the use case for submitting contact form data in the Application layer.
 * A use case encapsulates a single business operation and orchestrates the flow of data
 * between the Presentation and Infrastructure layers.
 *
 * How it works:
 * 1. Receives contact form data from the presentation layer
 * 2. Validates the form data (required fields, email format, etc.)
 * 3. Delegates form submission to the ContactRepository (following Dependency Inversion)
 * 4. Throws errors if validation fails, allowing the presentation layer to handle them
 *
 * As an Application Use Case, this class:
 * - Contains business logic for form validation and submission
 * - Depends on the repository interface (from Domain), not the implementation
 * - Can be easily tested by injecting mock repositories
 * - Follows the Single Responsibility Principle (one use case = one operation)
 * - Implements validation rules (required fields, email format)
 *
 * The use case is marked as @injectable for dependency injection support,
 * allowing flexible repository implementations to be injected at runtime.
 *
 * Validation includes:
 * - Required fields check (fullName, email, message)
 * - Email format validation using regex
 */
import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import type { ContactFormData } from '../../domain/entities/ContactFormData';
import type { ContactRepository } from '../../domain/repositories/ContactRepository';

@injectable()
export class SubmitContactFormUseCase {
  constructor(@inject('ContactRepository') private contactRepository: ContactRepository) {}

  async execute(formData: ContactFormData): Promise<void> {
    // Validate form data
    if (!formData.fullName || !formData.email || !formData.message) {
      throw new Error('Required fields are missing');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('Invalid email address');
    }

    return this.contactRepository.submitContactForm(formData);
  }
}
