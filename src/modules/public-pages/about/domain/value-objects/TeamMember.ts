/**
 * TeamMember Value Object
 *
 * This file defines a value object representing a team member in the Domain layer.
 * It contains the essential information needed to display team members throughout the application.
 *
 * As a Domain Value Object, this interface:
 * - Represents a reusable data structure for team member information
 * - Is used in the about page team section
 * - Ensures type safety and consistency across the application
 * - Separates concerns by defining what team member data looks like, not where it comes from
 *
 * This value object is used by:
 * - About page team section
 * - Team member cards and displays
 */
export interface TeamMember {
  name: string;
  role: string;
  image: string;
}
