// tailwind.config.ts
import type { Config } from 'tailwindcss';
import designTokens from './src/shared/constants/design-tokens';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: designTokens.tailwind.colors,

      // Fix: Don't duplicate fontFamily - merge with custom properties
      fontFamily: {
        // Core font families
        sans: designTokens.tailwind.fontFamily.sans,
        serif: designTokens.tailwind.fontFamily.serif,
        mono: designTokens.tailwind.fontFamily.mono,

        // Custom font family utilities
        aptos: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        georgia: ['Georgia', 'ui-serif', 'serif'],
      },

      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.571' }],
        base: ['16px', { lineHeight: '1.6' }],
        lg: ['18px', { lineHeight: '1.667' }],
        xl: ['24px', { lineHeight: '1.333' }],
        '2xl': ['36px', { lineHeight: '1.222' }],
        '3xl': ['48px', { lineHeight: '1.167' }],
        '4xl': ['60px', { lineHeight: '1.133' }],
        '5xl': ['72px', { lineHeight: '1.111' }],
      },

      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },

      spacing: designTokens.tailwind.spacing,
      borderRadius: designTokens.tailwind.borderRadius,
      boxShadow: designTokens.tailwind.boxShadow,

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'tooth-highlight': 'toothHighlight 0.3s ease-in-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        toothHighlight: {
          '0%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgb(107 157 194 / 0.7)',
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px rgb(107 157 194 / 0)',
          },
          '100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgb(107 157 194 / 0)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

export default config;
