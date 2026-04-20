/**
 * ServiceRepositoryImpl
 *
 * This file provides the concrete implementation of the ServiceRepository interface
 * in the Infrastructure layer.
 *
 * IMPORTANT: Public pages are frontend-driven in this codebase.
 * We intentionally do NOT fetch services content from the backend.
 */

import { injectable } from 'tsyringe';
import { ServiceRepository } from '../../domain/repositories/ServiceRepository';
import { Service, ServicesPageContent } from '../../domain/entities/Service';
import { servicesData } from '../data/servicesData';

@injectable()
export class ServiceRepositoryImpl implements ServiceRepository {
  async getServicesPageContent(): Promise<ServicesPageContent> {
    return servicesData;
  }

  async getServiceBySlug(slug: string): Promise<Service | null> {
    return this.getServiceFromData(slug);
  }

  async getServicesByCategory(category: 'patient' | 'provider'): Promise<Service[]> {
    if (category === 'patient') {
      return servicesData.patientServices.services;
    }
    return servicesData.providerServices.services;
  }

  private getServiceFromData(slug: string): Service | null {
    const resolvedSlug = this.resolveServiceSlugAlias(slug);
    const allServices: Service[] = [
      ...servicesData.patientServices.services,
      ...servicesData.providerServices.services,
    ];
    return allServices.find((service) => service.slug === resolvedSlug) || null;
  }

  /**
   * Some UI sections (or older links) use slightly different slugs.
   * This keeps URLs stable by mapping aliases to the canonical slugs used in fallback data.
   */
  private resolveServiceSlugAlias(slug: string): string {
    const normalized = slug.trim().toLowerCase();

    const aliases: Record<string, string> = {
      appointments: 'appointment-scheduling',
      appointment: 'appointment-scheduling',
      'dentist-notes': 'doctor-notes',
      'doctors-notes': 'doctor-notes',
      'access-to-dentist-notes': 'doctor-notes',
      'user-roles-permissions': 'user-role-permission',
      'roles-permissions': 'user-role-permission',
    };

    return aliases[normalized] ?? normalized;
  }
}
