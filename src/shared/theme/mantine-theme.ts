/**
 * DENTIQ Mantine Theme
 *
 * Single theme layer: design-tokens are the source of truth; this file builds the
 * Mantine theme from them and exports one helper + static colors for convenience.
 */
import {
  createTheme,
  type MantineColorsTuple,
  type MantineThemeOverride,
  type MantineTheme,
} from '@mantine/core';
import designTokens from '@/shared/constants/design-tokens';
import { typography } from './typography';

// Convert design token arrays to MantineColorsTuple format
const convertToMantineColors = (colors: string[]): MantineColorsTuple => {
  const padded = [...colors];
  while (padded.length < 10) padded.push(padded[padded.length - 1] || '#000000');
  return padded.slice(0, 10) as unknown as MantineColorsTuple;
};

const getThemeColor = (
  theme: MantineTheme,
  name: keyof MantineTheme['colors'],
  shade: number,
  fallback: string
) => theme.colors[name]?.[shade] ?? fallback;

export const dentiqTheme: MantineThemeOverride = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: convertToMantineColors(designTokens.mantine.colors.primary),
    secondary: convertToMantineColors(designTokens.mantine.colors.secondary),
    success: convertToMantineColors(designTokens.mantine.colors.success),
    error: convertToMantineColors(designTokens.mantine.colors.error),
    warning: convertToMantineColors(designTokens.mantine.colors.warning),
    info: convertToMantineColors(designTokens.mantine.colors.info),
    neutral: convertToMantineColors(designTokens.mantine.colors.neutral),
  },

  // Typography
  fontFamily: designTokens.mantine.typography.fontFamily,
  fontFamilyMonospace: 'JetBrains Mono, Consolas, monospace',
  headings: { fontFamily: designTokens.mantine.typography.fontFamily },

  // Sizing tokens (aligned with your CSS variables / Figma rhythm)
  fontSizes: designTokens.mantine.typography.fontSizes,
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: {
    xs: '0.125rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  defaultRadius: 'md',

  shadows: {
    xs: 'var(--shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))',
    sm: 'var(--shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))',
    md: 'var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1))',
    lg: 'var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1))',
    xl: 'var(--shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1))',
  },

  // Semantic tokens (usable via theme.other.*)
  other: {
    bg: {
      page: 'var(--bg-page)',
      card: 'var(--bg-card)',
      cardHover: 'var(--bg-card-hover)',
      hover: 'var(--bg-hover)',
    },
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      disabled: 'var(--text-disabled)',
    },
    border: {
      color: 'var(--border-color)',
      divider: 'var(--divider-color)',
    },
    input: {
      bg: 'var(--input-bg)',
      border: 'var(--input-border)',
      focus: 'var(--input-focus)',
    },
    // Typography system integration
    typography: {
      scale: typography.scale,
      weights: typography.weights,
      lineHeights: typography.lineHeights,
      letterSpacing: typography.letterSpacing,
      colors: typography.colors,
    },
  },

  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        color: 'primary',
        variant: 'filled',
      },
    },
    TextInput: {
      defaultProps: { radius: 'md' },
      styles: () => ({
        input: {
          backgroundColor: 'var(--input-bg)',
          borderColor: 'var(--input-border)',
          color: 'var(--text-primary)',
          transition: 'all 0.2s ease',
          '&::placeholder': { color: 'var(--text-secondary)' },
          '&:focus': {
            borderColor: 'var(--input-focus)',
            boxShadow: '0 0 0 1px var(--input-focus)',
          },
        },
      }),
    },
    Card: {
      defaultProps: { radius: 'lg', shadow: 'sm' },
      styles: () => ({
        root: {
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s ease',
        },
      }),
    },
    ActionIcon: {
      defaultProps: { variant: 'default' },
      styles: () => ({
        root: {
          transition: 'all 0.2s ease',
          '&:hover': { backgroundColor: 'var(--bg-card-hover)' },
        },
      }),
    },
    Accordion: {
      styles: (_theme: MantineTheme) => ({
        item: {
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          transition: 'all 0.2s ease',
        },
        control: {
          color: 'var(--text-primary)',
          '&:hover': { backgroundColor: 'var(--bg-hover)' },
        },
        label: { color: 'var(--text-primary)' },
        content: { color: 'var(--text-secondary)' },
      }),
    },
  },
});

// --- Theme color helper (for use with useMantineTheme()) ---
export function themeColors(theme: MantineTheme) {
  return {
    primary: {
      1: getThemeColor(theme, 'primary', 1, '#DBE8FD'),
      2: getThemeColor(theme, 'primary', 2, '#B5F1FF'),
      3: getThemeColor(theme, 'primary', 3, '#93EAFE'),
      5: getThemeColor(theme, 'primary', 5, '#46869D'),
      6: getThemeColor(theme, 'primary', 6, '#3A758B'),
      7: getThemeColor(theme, 'primary', 7, '#295666'),
      9: getThemeColor(theme, 'primary', 9, '#0E2027'),
    },
    secondary: {
      1: getThemeColor(theme, 'secondary', 1, '#B5F1FF'),
      3: getThemeColor(theme, 'secondary', 3, '#6CDCF5'),
      4: getThemeColor(theme, 'secondary', 4, '#54D1ED'),
      5: getThemeColor(theme, 'secondary', 5, '#46869D'),
    },
    neutral: {
      0: getThemeColor(theme, 'neutral', 0, '#FFFFFF'),
      1: getThemeColor(theme, 'neutral', 1, '#F9F9FD'),
      2: getThemeColor(theme, 'neutral', 2, '#DFE8F6'),
      3: getThemeColor(theme, 'neutral', 3, '#D9D9DC'),
      4: getThemeColor(theme, 'neutral', 4, '#A9B4CD'),
      5: getThemeColor(theme, 'neutral', 5, '#9F9FA5'),
      6: getThemeColor(theme, 'neutral', 6, '#717176'),
      7: getThemeColor(theme, 'neutral', 7, '#3F3F41'),
      8: getThemeColor(theme, 'neutral', 8, '#1B1B1B'),
      9: getThemeColor(theme, 'neutral', 9, '#000000'),
    },
    success: {
      1: getThemeColor(theme, 'success', 1, '#A1F9B4'),
      4: getThemeColor(theme, 'success', 4, '#52BD94'),
    },
    error: {
      0: getThemeColor(theme, 'error', 0, '#FFE6D6'),
      1: getThemeColor(theme, 'error', 1, '#FFC7AD'),
      2: getThemeColor(theme, 'error', 2, '#FFA283'),
      4: getThemeColor(theme, 'error', 4, '#FF4332'),
      6: getThemeColor(theme, 'error', 6, '#B71926'),
      7: getThemeColor(theme, 'error', 7, '#930F25'),
    },
    warning: { 4: getThemeColor(theme, 'warning', 4, '#FFBD16') },
    info: { 4: getThemeColor(theme, 'info', 4, '#2952CC') },
  };
}
export type ThemeColors = ReturnType<typeof themeColors>;

// --- Static semantic colors (for use without theme, e.g. dashboard) ---
const other = dentiqTheme.other as NonNullable<typeof dentiqTheme.other>;
const pal = designTokens.mantine.colors;
export const colors = {
  primary: pal.primary[5] ?? 'var(--primary-400, #46869D)',
  border: other?.border?.color ?? 'var(--border-color)',
  borderLight: other?.border?.divider ?? 'var(--divider-color)',
  borderMedium: other?.border?.divider ?? 'var(--divider-color)',
  text: {
    primary: other?.text?.primary ?? 'var(--text-primary)',
    secondary: other?.text?.secondary ?? 'var(--text-secondary)',
    muted: other?.text?.secondary ?? 'var(--text-secondary)',
    dimmed: other?.text?.disabled ?? 'var(--text-disabled)',
  },
  background: {
    light: other?.bg?.page ?? 'var(--bg-page)',
    card: other?.bg?.card ?? 'var(--bg-card)',
    accent: other?.bg?.hover ?? 'var(--bg-hover)',
  },
  status: {
    success: pal.success[4] ?? 'var(--success-500, #52BD94)',
    warning: pal.warning[4] ?? 'var(--warning-500, #FFBD16)',
    error: pal.error[4] ?? 'var(--error-500, #FF4332)',
    info: pal.info[4] ?? 'var(--info-500, #2952CC)',
  },
  accent: {
    blue: pal.info[0] ?? '#D4E2FC',
    yellow: pal.warning[0] ?? '#FFF7D0',
    teal: pal.secondary[0] ?? '#DBE8FD',
    purple: pal.primary[0] ?? '#DBE8FD',
    green: pal.success[0] ?? '#CFFCD4',
  },
  gray: {
    50: pal.neutral[1] ?? '#F9F9FD',
    100: pal.neutral[2] ?? '#DFE8F6',
    200: pal.neutral[3] ?? '#D9D9DC',
    300: pal.neutral[4] ?? '#A9B4CD',
    400: pal.neutral[5] ?? '#9F9FA5',
    500: pal.neutral[6] ?? '#717176',
    600: pal.neutral[7] ?? '#3F3F41',
    700: pal.neutral[8] ?? '#1B1B1B',
    800: pal.neutral[8] ?? '#1B1B1B',
    900: pal.neutral[9] ?? '#000000',
  },
} as const;
