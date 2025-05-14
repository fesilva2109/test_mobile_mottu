/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#05AF31',
          light: '#3ED17D',
          lighter: '#61CE70',
          accent: '#29D443',
          teal: '#4BCFAD',
          lime: '#A2FF00',
        },
        neutral: {
          white: '#FFFFFF',
          light: '#F4F4F4',
          gray: '#7A7A7A',
          dark: '#1D1D1D',
          black: '#040408',
        },
        status: {
          ready: '#05AF31',
          maintenance: '#F97316',
          quarantine: '#EF4444',
          waiting: '#F59E0B',
          priority: '#3B82F6',
        }
      },
    },
  },
  plugins: [],
};