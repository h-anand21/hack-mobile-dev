/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F5F2',
        dark: '#171717',
        accent: '#E7FF45',
        gray: '#ECECEC',
        text: '#171717',
        textSecondary: '#666666'
      },
      borderRadius: {
        card: '28px',
        input: '20px'
      }
    },
  },
  plugins: [],
}
