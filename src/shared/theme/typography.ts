/**
 * Typography System
 *
 * Centralized typography configuration with fluid responsive scaling using clamp()
 * All sizes automatically scale between mobile and desktop viewports
 *
 * Usage:
 * import { typography } from '@/shared/theme/typography';
 * <Text fz={typography.scale.body.desktop} fw={typography.weights.regular} />
 */

// ============================================================================
// RESPONSIVE TYPE SCALE
// ============================================================================

/**
 * Fluid type scale using clamp() for automatic responsive sizing
 * Format: clamp(min, preferred, max) - scales smoothly between viewports
 */
export const typeScale = {
  // ──────────────────────────────────────────────────────────────────────────
  // DISPLAY & HERO SIZES
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Display sizes - Extra large marketing headers
   * Use for: Landing page hero titles, major section headers
   * Example: Homepage main headline, campaign headers
   */
  display: {
    default: 'clamp(3.5rem, 2.5rem + 4vw, 5.5rem)', // 56-88px - Primary display size
    lg: 'clamp(3.5rem, 2.5rem + 4vw, 5.5rem)', // 56-88px - Same as default
    md: 'clamp(3rem, 2rem + 3vw, 4rem)', // 48-64px - Medium display
    sm: 'clamp(2.25rem, 1.8rem + 2vw, 3rem)', // 36-48px - Small display
  },

  /**
   * Hero size - Premium hero section titles
   * Use for: Hero sections, feature highlights, major CTAs
   * Example: "Find Your Perfect Dental Provider"
   */
  hero: 'clamp(3rem, 2.2rem + 3vw, 4.5rem)', // 48-72px

  // ──────────────────────────────────────────────────────────────────────────
  // HEADING SIZES (H1-H6)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Heading scale - Standard page headings
   * Use semantic HTML (h1-h6) with appropriate visual size
   */
  heading: {
    h1: 'clamp(2.5rem, 2rem + 2vw, 3.5rem)', // 40-56px - Page title, main heading
    h2: 'clamp(2rem, 1.6rem + 1.5vw, 2.75rem)', // 32-44px - Major section heading
    h3: 'clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem)', // 24-30px - Subsection heading
    h4: 'clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)', // 20-24px - Card title, minor heading
    h5: 'clamp(1.125rem, 1rem + 0.5vw, 1.25rem)', // 18-20px - Small heading, list title
    h6: 'clamp(1rem, 0.95rem + 0.4vw, 1.125rem)', // 16-18px - Smallest heading, label
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CONTENT SIZES
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Section title - Large section headers
   * Use for: Major content sections, feature blocks
   * Example: "Our Services", "Why Choose Us"
   */
  section: 'clamp(1.75rem, 1.5rem + 1vw, 2.25rem)', // 28-36px

  /**
   * Card title - Card and component headers
   * Use for: Card titles, modal headers, sidebar headings
   * Example: Service card titles, blog post titles
   */
  card: 'clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)', // 20-24px

  /**
   * Body text - Main content text
   * Use for: Paragraphs, descriptions, article content
   * Minimum 16px for optimal readability (WCAG)
   */
  body: {
    desktop: 'clamp(1rem, 0.95rem + 0.4vw, 1.125rem)', // 16-18px - Desktop body text

    tablet: 'clamp(0.95rem, 0.9rem + 0.3vw, 1.05rem)', // 15-17px - Tablet body text

    mobile: 'clamp(0.9375rem, 0.9rem + 0.3vw, 1rem)', // 15-16px - Mobile body text

    // Backward compatibility aliases
    xl: 'clamp(1rem, 0.95rem + 0.4vw, 1.125rem)', // 16-18px - Extra large body
    lg: 'clamp(1rem, 0.95rem + 0.4vw, 1.125rem)', // 16-18px - Large body (same as desktop)
    md: 'clamp(0.95rem, 0.9rem + 0.3vw, 1.05rem)', // 15-17px - Medium body (same as tablet)
    sm: 'clamp(0.875rem, 0.85rem + 0.2vw, 0.95rem)', // 14-15px - Small body (same as caption)
    xs: 'clamp(0.75rem, 0.72rem + 0.2vw, 0.8125rem)', // 12-13px - Extra small body
  },

  /**
   * Caption - Secondary descriptive text
   * Use for: Image captions, metadata, timestamps, helper text
   * Example: "Posted 2 hours ago", "Photo by John Doe"
   */
  caption: 'clamp(0.875rem, 0.85rem + 0.2vw, 0.95rem)', // 14-15px

  /**
   * Button text - Call-to-action buttons
   * Use for: Primary buttons, CTAs, action links
   * Example: "Get Started", "Learn More", "Sign Up"
   */
  button: 'clamp(1rem, 0.95rem + 0.4vw, 1.125rem)', // 15-17px

  /**
   * Label - Form labels and small UI text
   * Use for: Form field labels, input labels, badges
   * Example: "Email Address", "Required", "New"
   */
  label: 'clamp(0.875rem, 0.83rem + 0.3vw, 0.95rem)', // 14-15px
} as const;

// ============================================================================
// FONT WEIGHTS
// ============================================================================

/**
 * Font weight scale for visual hierarchy
 * Use semantic names for clarity and consistency
 */
export const fontWeights = {
  light: 300, // Rarely used - Special emphasis, large display text
  regular: 400, // Body text, paragraphs, descriptions, default text
  medium: 500, // Emphasized text, labels, navigation links, form labels
  semibold: 600, // Subheadings, important text, buttons, card titles
  bold: 700, // Headings, titles, strong emphasis, section headers
  extrabold: 800, // Display text, hero titles, major headlines
} as const;

// ============================================================================
// LINE HEIGHTS
// ============================================================================

/**
 * Line height scale for optimal readability
 * Larger text needs tighter line height, body text needs more space
 *
 * Guidelines:
 * - Display/Hero: 1.05-1.1 (tight, dramatic)
 * - Headings: 1.15-1.3 (snug, clear hierarchy)
 * - Body text: 1.5-1.65 (relaxed, easy reading)
 * - UI elements: 1.4 (compact, efficient)
 */
export const lineHeights = {
  tight: 1.05, // Display text (56px+) - Dramatic, impactful headlines
  tighter: 1.1, // Hero titles (48-72px) - Premium feel, controlled spacing
  snug: 1.15, // Large headings (40-56px) - Clear hierarchy, readable
  heading: 1.2, // H2 headings (32-44px) - Standard heading spacing
  subheading: 1.3, // H3 headings (24-30px) - Comfortable subsection spacing
  card: 1.35, // Card titles (20-24px) - Compact card headers
  label: 1.4, // Labels, buttons, eyebrow (14-16px) - UI elements
  normal: 1.5, // Captions (14-15px) - Standard UI text
  relaxed: 1.6, // Body text (16-18px) - Optimal reading comfort
  loose: 1.65, // Mobile body text - Extra breathing room on small screens
} as const;

// ============================================================================
// LETTER SPACING (TRACKING)
// ============================================================================

/**
 * Letter spacing for different text sizes
 * Larger text benefits from tighter spacing, smaller text needs more
 *
 * Guidelines:
 * - Display/Large headings: Negative spacing for premium feel
 * - Body text: Normal (0) for optimal readability
 * - Buttons/UI: Slight positive for clarity
 * - Uppercase text: More spacing for legibility
 */
export const letterSpacing = {
  tighter: '-0.02em', // Display text (56px+) - Tight, premium feel
  tight: '-0.01em', // Large headings (40px+) - Refined, elegant
  normal: '0', // Body text (16-18px) - Default, optimal readability
  wide: '0.02em', // Buttons, CTAs - Clear, actionable
  wider: '0.05em', // Small text, badges - Improved legibility
  widest: '0.08em', // Uppercase text, eyebrow - Maximum clarity
} as const;

// ============================================================================
// TEXT COLORS
// ============================================================================

/**
 * Text color system with WCAG AA compliance
 * All colors meet 4.5:1 contrast ratio for normal text
 *
 * Usage:
 * - Primary: Main headings, important content
 * - Secondary: Body text, standard content
 * - Tertiary: Supporting text, metadata
 * - Muted: Disabled states, placeholders (use with caution)
 */
export const textColors = {
  // Light theme (on white/light backgrounds)
  light: {
    primary: '#1A202C', // 15.5:1 contrast - Headings, titles, important text
    secondary: '#4A5568', // 8.6:1 contrast - Body text, paragraphs, descriptions
    tertiary: '#718096', // 5.7:1 contrast - Captions, metadata, helper text
    muted: '#A0AEC0', // 3.5:1 contrast - Disabled, placeholder (large text only)
  },

  // Dark theme (on dark backgrounds)
  dark: {
    primary: '#FFFFFF', // Pure white - Headings, titles
    secondary: 'rgba(255, 255, 255, 0.9)', // 90% opacity - Body text, content
    tertiary: 'rgba(255, 255, 255, 0.7)', // 70% opacity - Captions, metadata
    muted: 'rgba(255, 255, 255, 0.5)', // 50% opacity - Disabled (large text only)
  },
} as const;

// ============================================================================
// MAX LINE LENGTH
// ============================================================================

/**
 * Maximum line length for optimal readability
 * Body text should be 45-75 characters per line (65 is ideal)
 *
 * Use with: max-width or maw prop
 * Example: <Text maw={maxLineLength}>Long paragraph...</Text>
 */
export const maxLineLength = '65ch';

// ============================================================================
// COMBINED EXPORT
// ============================================================================

/**
 * Main typography object - Import this for all typography needs
 *
 * Usage Examples:
 *
 * // Font size
 * <Title fz={typography.scale.heading.h1}>Heading</Title>
 *
 * // Font weight
 * <Text fw={typography.weights.semibold}>Bold text</Text>
 *
 * // Line height
 * <Text lh={typography.lineHeights.relaxed}>Paragraph</Text>
 *
 * // Letter spacing
 * <Text lts={typography.letterSpacing.wide}>Button</Text>
 *
 * // Text color
 * <Text c={typography.colors.light.primary}>Dark text</Text>
 *
 * // Max line length
 * <Text maw={typography.maxLineLength}>Long content...</Text>
 */
export const typography = {
  scale: typeScale,
  weights: fontWeights,
  lineHeights,
  letterSpacing,
  colors: textColors,
} as const;

export default typography;
