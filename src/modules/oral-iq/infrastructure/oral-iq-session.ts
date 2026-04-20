/**
 * oral-iq-session.ts
 *
 * Single source of truth for persisting Oral IQ flow data across
 * the public → login → dashboard journey via sessionStorage.
 * 
 * Enhanced with expiry support to prevent stale data.
 */

import type { OralIQAssessment, SymptomFormData } from '../domain/entities/ai-treatment-recommendation.entity';
import type { MouthModelSelection } from '../domain/oral-iq.types';
import type { SelectedProvider } from '../presentation/OralIQPage';

export interface OralIQSession {
  /** The tooth/gum area selected in step 0 */
  selection: MouthModelSelection | null;
  /** Raw selected IDs for the dental map SVG (to re-highlight on restore) */
  dentalMapSelected: string[] | null;
  /** Group selections for the dental map SVG */
  dentalMapGroups: Record<string, string[]> | null;
  /** The symptom form data from step 1 */
  formData: Partial<SymptomFormData> | null;
  /** The full assessment result from the backend */
  result: OralIQAssessment | null;
  /** The provider the patient clicked "Book Appointment" on */
  bookingProvider: SelectedProvider | null;
  /** The raw search query used on the providers page */
  providerSearchQuery: string | null;
  /** All providers returned from the last search */
  providerSearchResults: SelectedProvider[] | null;
  /** Human-readable labels for the dental map selection */
  selectionLabels: string[] | null;
  /** Timestamp when data was saved */
  savedAt?: number;
  /** Timestamp when data expires */
  expiresAt?: number;
}

const KEYS = {
  selection: 'oralIQSelection',
  dentalMapSelected: 'oralIQDentalMapSelected',
  dentalMapGroups: 'oralIQDentalMapGroups',
  formData: 'oralIQFormData',
  result: 'oralIQResult',
  bookingProvider: 'bookingProvider',
  providerSearchQuery: 'providerSearchQuery',
  providerSearchResults: 'providerSearchResults',
  selectionLabels: 'oralIQSelectionLabels',
  metadata: 'oralIQMetadata',
} as const;

// Default expiry: 24 hours
const DEFAULT_EXPIRY_MS = 24 * 60 * 60 * 1000;

function safeGet<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    if (value === null || value === undefined) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // sessionStorage unavailable (SSR / private mode)
  }
}

export const oralIQSession = {
  read(): OralIQSession {
    // Check expiry first
    const metadata = safeGet<{ savedAt: number; expiresAt: number }>(KEYS.metadata);
    if (metadata?.expiresAt && Date.now() > metadata.expiresAt) {
      this.clear();
      return {
        selection: null,
        dentalMapSelected: null,
        dentalMapGroups: null,
        formData: null,
        result: null,
        bookingProvider: null,
        providerSearchQuery: null,
        providerSearchResults: null,
        selectionLabels: null,
      };
    }

    return {
      selection: safeGet<MouthModelSelection>(KEYS.selection),
      dentalMapSelected: safeGet<string[]>(KEYS.dentalMapSelected),
      dentalMapGroups: safeGet<Record<string, string[]>>(KEYS.dentalMapGroups),
      formData: safeGet<Partial<SymptomFormData>>(KEYS.formData),
      result: safeGet<OralIQAssessment>(KEYS.result),
      bookingProvider: safeGet<SelectedProvider>(KEYS.bookingProvider),
      providerSearchQuery: safeGet<string>(KEYS.providerSearchQuery),
      providerSearchResults: safeGet<SelectedProvider[]>(KEYS.providerSearchResults),
      selectionLabels: safeGet<string[]>(KEYS.selectionLabels),
      savedAt: metadata?.savedAt,
      expiresAt: metadata?.expiresAt,
    };
  },

  saveSelection(selection: MouthModelSelection, labels: string[], selectedIds: string[], groups: Record<string, string[]>): void {
    safeSet(KEYS.selection, selection);
    safeSet(KEYS.selectionLabels, labels);
    safeSet(KEYS.dentalMapSelected, selectedIds);
    safeSet(KEYS.dentalMapGroups, groups);
    this.updateMetadata();
  },

  saveFormData(formData: Partial<SymptomFormData>): void {
    safeSet(KEYS.formData, formData);
    this.updateMetadata();
  },

  saveResult(result: OralIQAssessment): void {
    safeSet(KEYS.result, result);
    this.updateMetadata();
  },

  saveBookingProvider(provider: SelectedProvider): void {
    safeSet(KEYS.bookingProvider, provider);
    this.updateMetadata();
  },

  saveProviderSearch(query: string, results: SelectedProvider[]): void {
    safeSet(KEYS.providerSearchQuery, query);
    safeSet(KEYS.providerSearchResults, results);
    this.updateMetadata();
  },

  /**
   * Save complete session data with optional custom expiry
   */
  saveComplete(data: Partial<OralIQSession>, expiryMs?: number): void {
    if (data.selection) safeSet(KEYS.selection, data.selection);
    if (data.dentalMapSelected) safeSet(KEYS.dentalMapSelected, data.dentalMapSelected);
    if (data.dentalMapGroups) safeSet(KEYS.dentalMapGroups, data.dentalMapGroups);
    if (data.formData) safeSet(KEYS.formData, data.formData);
    if (data.result) safeSet(KEYS.result, data.result);
    if (data.bookingProvider) safeSet(KEYS.bookingProvider, data.bookingProvider);
    if (data.providerSearchQuery) safeSet(KEYS.providerSearchQuery, data.providerSearchQuery);
    if (data.providerSearchResults) safeSet(KEYS.providerSearchResults, data.providerSearchResults);
    if (data.selectionLabels) safeSet(KEYS.selectionLabels, data.selectionLabels);
    this.updateMetadata(expiryMs);
  },

  /**
   * Update metadata with current timestamp and expiry
   */
  updateMetadata(expiryMs: number = DEFAULT_EXPIRY_MS): void {
    const now = Date.now();
    safeSet(KEYS.metadata, {
      savedAt: now,
      expiresAt: now + expiryMs,
    });
  },

  /**
   * Check if session has data
   */
  hasData(): boolean {
    const session = this.read();
    return !!(session.selection || session.formData || session.result);
  },

  /**
   * Check if session is expired
   */
  isExpired(): boolean {
    const metadata = safeGet<{ expiresAt: number }>(KEYS.metadata);
    return metadata?.expiresAt ? Date.now() > metadata.expiresAt : false;
  },

  clear(): void {
    Object.values(KEYS).forEach((k) => {
      try { sessionStorage.removeItem(k); } catch { /* noop */ }
    });
  },
};
