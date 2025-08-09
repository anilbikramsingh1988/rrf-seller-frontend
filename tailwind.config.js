// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,js}", // This will look in your src folder for any html or js files
    "./*.html", // This will also look for any HTML files in the root of your project
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};