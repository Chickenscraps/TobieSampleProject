import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    borderRadius: {
      none: '0',
      DEFAULT: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '0',
    },
    extend: {
      colors: {
        tobie: {
          50: '#EAF2F9',
          100: '#D0E2F1',
          200: '#A1C5E3',
          300: '#72A8D5',
          400: '#4F91C9',
          500: '#316A9E',
          600: '#255077',
          700: '#18354F',
          800: '#0F2236',
          900: '#08111B',
        },
        accent: {
          DEFAULT: '#FFB31A',
          dark: '#E09800',
          50: '#FFF7E6',
          100: '#FFEDC4',
          200: '#FFD97A',
          700: '#8C5E00',
        },
        brand: {
          dark: '#18354F',
          surface: '#EAF2F9',
          muted: '#D0E2F1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 25px rgba(0,0,0,0.07), 0 4px 10px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
