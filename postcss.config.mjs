// #region File Overview
/**
 * postcss.config.mjs
 *
 * PostCSS runs on every CSS file during the build and applies two plugins:
 *   - tailwindcss  → generates all Tailwind utility classes from tailwind.config.ts
 *   - autoprefixer → adds vendor prefixes (-webkit-, -moz-, etc.) for cross-browser support
 *
 * Without this file, Tailwind CSS classes will not work in the browser.
 *
 * @type {import('postcss-load-config').Config}
 */
// #endregion
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
