/**
 * ContactRepositoryImpl
 *
 * This file provides the concrete implementation of the ContactRepository interface
 * in the Infrastructure layer.
 *
 * IMPORTANT: Public pages are frontend-driven in this codebase.
 * We intentionally do NOT fetch contact page content from the backend.
 *
 * Note: Submitting the contact form may still call the backend.
 */

import { injectable } from 'tsyringe';
import { ContactRepository } from '../../domain/repositories/ContactRepository';
import { ContactFormData, ContactPageContent } from '../../domain/entities/ContactFormData';
import { apolloClient } from '@/core/config/graphql.config';
import { SUBMIT_CONTACT_FORM_MUTATION } from '@/core/graphql';
import { logger, trackError } from '@/core/logging';
import { contactData } from '../data/contactData';

@injectable()
export class ContactRepositoryImpl implements ContactRepository {
  async getContactPageContent(): Promise<ContactPageContent> {
    return contactData;
  }

  async submitContactForm(formData: ContactFormData): Promise<void> {
    try {
      logger.info('Submitting contact form', {
        module: 'contact_repository',
      });

      const { data } = await apolloClient.mutate<{
        submitContactForm?: { success: boolean; message?: string; contactId?: string };
      }>({
        mutation: SUBMIT_CONTACT_FORM_MUTATION,
        variables: {
          input: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          },
        },
      });

      if (!data?.submitContactForm?.success) {
        const message = data?.submitContactForm?.message || 'Failed to submit contact form';
        logger.error('Contact form submission failed', {
          module: 'contact_repository',
          error: message,
        });
        throw new Error(message);
      }

      logger.info('Contact form submitted successfully', {
        module: 'contact_repository',
        metadata: { contactId: data.submitContactForm.contactId },
      });
    } catch (error) {
      trackError(error as Error, {
        module: 'contact_repository',
        action: 'submit_contact_form',
      });
      throw error;
    }
  }
}
