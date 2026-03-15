/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#dc2626', // Rose-gold/copper color from logo
          50: '#b91c1c',
          100: '#f8e7d9',
          200: '#fde2e4',
          300: '#fef3c7',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7c2d12',
        }
      }
    },
  },
  plugins: [],
}
