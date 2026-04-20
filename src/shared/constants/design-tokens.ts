// src/shared/config/design-tokens.ts
// Central design token source
// This file intentionally mirrors the current Tailwind and Mantine color palettes
// and basic sizing tokens so they can be consumed from a single source.

export const designTokens = {
  tailwind: {
    colors: {
      primary: {
        'dark-0': '#0E2027',
        'dark-100': '#2540A8',
        'dark-200': '#295666',
        'dark-300': '#3A758B',
        400: '#46869D',
        DEFAULT: '#46869D',
      },
      secondary: {
        'light-0': '#DBE8FD',
        'light-100': '#B5F1FF',
        'light-200': '#93EAFE',
        'light-300': '#6CDCF5',
        400: '#54D1ED',
        DEFAULT: '#54D1ED',
      },
      success: {
        'dark-900': '#0F595A',
        'dark-800': '#1A6D66',
        'dark-700': '#298876',
        'dark-600': '#3BA285',
        500: '#52BD94',
        'light-400': '#7BD7AB',
        'light-300': '#9BEBBC',
        'light-200': '#A1F9B4',
        'light-100': '#CFFCD4',
        DEFAULT: '#52BD94',
      },
      error: {
        'dark-900': '#7A0925',
        'dark-800': '#930F25',
        'dark-700': '#B71926',
        'dark-600': '#DB2424',
        500: '#FF4332',
        'light-400': '#FF7E65',
        'light-300': '#FFA283',
        'light-200': '#FFC7AD',
        'light-100': '#FFE6D6',
        DEFAULT: '#FF4332',
      },
      warning: {
        'dark-900': '#7A4B04',
        'dark-800': '#935F07',
        'dark-700': '#B77C0B',
        'dark-600': '#DB9B10',
        500: '#FFBD16',
        'light-400': '#FFD250',
        'light-300': '#FFDF73',
        'light-200': '#FFECA1',
        'light-100': '#FFF7D0',
        DEFAULT: '#FFBD16',
      },
      info: {
        'dark-900': '#071561',
        'dark-800': '#0D1F76',
        'dark-700': '#142D92',
        'dark-600': '#1D3EAF',
        500: '#2952CC',
        'light-400': '#597FE0',
        'light-300': '#7C9FEF',
        'light-200': '#AAC4F9',
        'light-100': '#D4E2FC',
        DEFAULT: '#2952CC',
      },
      neutral: {
        'black-900': '#000000',
        'dark-800': '#1b1b1b',
        'dark-700': '#3F3F41',
        'dark-600': '#717176',
        500: '#9F9FA5',
        'light-400': '#A9B4CD',
        'light-300': '#D9D9DC',
        'light-200': '#DFE8F6',
        'light-100': '#F9F9FD',
        'white-0': '#FFFFFF',
        DEFAULT: '#9F9FA5',
      },
      dental: {
        tooth: '#FFFFFF',
        gum: '#FFB6C1',
        cavity: '#8B4513',
        filling: '#C0C0C0',
        crown: '#FFD700',
        implant: '#708090',
      },
    },

    fontFamily: {
      // Font stack: Inter primary with robust system fallbacks
      sans: [
        'Inter', // Primary design font
        'ui-sans-serif', // System UI fallback
        'system-ui', // System UI
        '-apple-system', // Apple systems
        'BlinkMacSystemFont', // Chrome/Mac
        '"Segoe UI"', // Windows
        'Roboto', // Android/Google
        '"Helvetica Neue"', // Legacy
        'Arial', // Universal
        '"Noto Sans"', // International
        'sans-serif', // Final fallback
      ],
      serif: [
        'Georgia', // Primary serif
        'Cambria', // Windows serif
        '"Times New Roman"', // Universal serif
        'Times', // Legacy
        'serif', // Final fallback
      ],
      mono: [
        'JetBrains Mono', // Primary monospace
        'Consolas', // Windows
        'Monaco', // Mac
        '"Andale Mono"', // Legacy
        '"Ubuntu Mono"', // Linux
        'monospace', // Final fallback
      ],
      // Explicit font families for specific use cases
      aptos: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      georgia: ['Georgia', 'ui-serif', 'serif'],
    },

    spacing: {
      '0.5': '0.125rem',
      '1': '0.25rem',
      '1.5': '0.375rem',
      '2': '0.5rem',
      '2.5': '0.625rem',
      '3': '0.75rem',
      '3.5': '0.875rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
    },

    borderRadius: {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },

    boxShadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      dental: '0 4px 20px rgb(107 157 194 / 0.15)',
    },
  },

  mantine: {
    colors: {
      primary: [
        '#DBE8FD',
        '#B5F1FF',
        '#93EAFE',
        '#6CDCF5',
        '#54D1ED',
        '#46869D',
        '#3A758B',
        '#295666',
        '#2540A8',
        '#0E2027',
      ],
      secondary: [
        '#DBE8FD',
        '#B5F1FF',
        '#93EAFE',
        '#6CDCF5',
        '#54D1ED',
        '#46869D',
        '#3A758B',
        '#295666',
        '#2540A8',
        '#0E2027',
      ],
      success: [
        '#CFFCD4',
        '#A1F9B4',
        '#9BEBBC',
        '#7BD7AB',
        '#52BD94',
        '#3BA285',
        '#298876',
        '#1A6D66',
        '#0F595A',
        '#0F595A',
      ],
      error: [
        '#FFE6D6',
        '#FFC7AD',
        '#FFA283',
        '#FF7E65',
        '#FF4332',
        '#DB2424',
        '#B71926',
        '#930F25',
        '#7A0925',
        '#7A0925',
      ],
      warning: [
        '#FFF7D0',
        '#FFECA1',
        '#FFDF73',
        '#FFD250',
        '#FFBD16',
        '#DB9B10',
        '#B77C0B',
        '#935F07',
        '#7A4B04',
        '#7A4B04',
      ],
      info: [
        '#D4E2FC',
        '#AAC4F9',
        '#7C9FEF',
        '#597FE0',
        '#2952CC',
        '#1D3EAF',
        '#142D92',
        '#0D1F76',
        '#071561',
        '#071561',
      ],
      neutral: [
        '#FFFFFF',
        '#F9F9FD',
        '#DFE8F6',
        '#D9D9DC',
        '#A9B4CD',
        '#9F9FA5',
        '#717176',
        '#3F3F41',
        '#1B1B1B',
        '#000000',
      ],
    },

    typography: {
      // Mantine font stack: Inter → system fallbacks
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      secondaryFontFamily: 'Georgia, ui-serif, serif',
      fontSizes: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '24px',
      },
    },
  },
};

export type DesignTokens = typeof designTokens;
export default designTokens;
