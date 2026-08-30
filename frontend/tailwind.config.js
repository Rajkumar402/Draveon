/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: 'rgb(var(--primary-purple))',
          blue: 'rgb(var(--secondary-blue))',
          accent: 'rgb(var(--accent-light))',
          bg: 'rgb(var(--bg-start))',
          surface: 'rgb(var(--surface))',
          border: 'rgb(var(--border))',
          text: 'rgb(var(--text-primary))',
          body: 'rgb(var(--text-secondary))',
        },
        draveonPurple: {
          light: '#9D4EDD',
          DEFAULT: '#7B2CBF',
          dark: '#5A189A'
        },
        draveonBlue: {
          light: '#48CAE4',
          DEFAULT: '#00B4D8',
          dark: '#0077B6'
        },
        draveonDark: '#0B0F19'
      },
      backgroundImage: {
        'logo-gradient': 'linear-gradient(135deg, #7B2CBF 0%, #00B4D8 100%)',
      }
    },
  },
  plugins: [],
}
