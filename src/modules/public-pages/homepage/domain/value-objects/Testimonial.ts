/**
 * Testimonial Value Object
 *
 * This file defines a value object representing a customer testimonial or review.
 * It contains all the information needed to display testimonials throughout the application.
 *
 * As a Domain Value Object, this interface:
 * - Represents a reusable data structure for testimonials
 * - Is used in homepage, about page, and other sections that display reviews
 * - Ensures consistency in how testimonials are structured across the application
 * - Separates the data structure from implementation details
 *
 * This value object is used by:
 * - Homepage testimonials section
 * - About page testimonials
 * - Service detail pages
 * - Provider pages
 */
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  avatar?: string;
}
