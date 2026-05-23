// #region File Overview
/**
 * eslint.config.mjs
 *
 * Configures ESLint — the code quality tool that catches bugs and bad practices
 * before the code runs. Uses the ESLint v9 flat config format.
 *
 * Three rule sets applied:
 *   - Next.js recommended + Core Web Vitals rules
 *   - TypeScript rules (no unused vars, no implicit any, prefer const)
 *   - Ignores (node_modules, .next, build output)
 */
// #endregion

// eslint.config.mjs — ESLint v9 flat config for Next.js 15
import pluginNext from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: 'nextjs/base',
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    name: 'typescript',
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    name: 'ignores',
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'out/**',
      'build/**',
      'coverage/**',
      'next-env.d.ts',
    ],
  },
];
