/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This extends the default sans-serif font to use 'Inter',
        // which was linked in your index.html file.
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // You can define custom color palettes here.
        // For example:
        // 'rose-600': '#E11D48',
      },
    },
  },
  plugins: [],
}
