/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9eeff',
          200: '#b5deff',
          300: '#84c8ff',
          400: '#57aeff',
          500: '#2f8fff',
          600: '#1e73e6',
          700: '#185dc0',
          800: '#174e9a',
          900: '#153f79',
        },
      },
    },
  },
  plugins: [],
}
