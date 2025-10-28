/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}", // Changed from ts,tsx to js,jsx
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'orange-50': '#FFF7ED',
        'orange-700': '#C2410C',
        'brown-900': '#422006',
      },
      fontFamily: {
        sans: ['Switzer', 'sans-serif'],
        serif: ['IBM Plex Serif', 'serif'],
      },
    },
  },
  plugins: [],
};