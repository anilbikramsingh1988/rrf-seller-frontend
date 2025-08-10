// postcss.config.js
export default {
  plugins: {
    // This is the correct way to reference the Tailwind CSS PostCSS plugin.
    // The package itself is now used directly.
    'tailwindcss': {},
    // Autoprefixer is used to automatically add vendor prefixes to CSS rules.
    'autoprefixer': {},
  },
}
