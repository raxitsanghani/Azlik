/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          gold: '#C9A227',
          charcoal: '#121212',
          navy: '#0A1128',
          ivory: '#FAFAF9',
          beige: '#F5F1E9',
          platinum: '#E5E4E2',
          marble: '#F5F5F7',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
