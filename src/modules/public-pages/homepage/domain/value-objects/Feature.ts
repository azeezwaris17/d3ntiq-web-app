/**
 * Feature Value Object
 *
 * This file defines a reusable value object representing a feature/service item
 * used throughout the application. Value objects are immutable data structures
 * that represent concepts from the business domain.
 *
 * As a Domain Value Object, this interface:
 * - Represents a self-contained, reusable data structure
 * - Is used within entities (like HomepageContent) to compose complex structures
 * - Ensures consistency across different parts of the application
 * - Follows the DRY (Don't Repeat Yourself) principle
 *
 * Features are used in multiple contexts:
 * - Homepage patient features section
 * - Homepage provider features section
 * - Services page listings
 * - Service detail pages
 */
export interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  icon?: string;
  slug?: string;
}
