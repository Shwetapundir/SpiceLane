/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff4ed',
          100: '#ffe6d5',
          400: '#ff7c3b',
          500: '#f95f1b',
          600: '#e44b0a',
        }
      }
    },
  },
  plugins: [],
}