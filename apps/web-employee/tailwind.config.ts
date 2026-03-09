import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // obie.team brand palette
        tobie: {
          50: '#e8f0f8',
          100: '#c5d9ed',
          200: '#9ebfdf',
          300: '#6ea1ce',
          400: '#4d8ab8',
          500: '#316A9E', // Blue Shade 1 — primary cards & interactive
          600: '#255077', // Blue Shade 2 — secondary/nested containers
          700: '#18354F', // Blue Shade 3 — deep backgrounds, high-contrast
          800: '#112840',
          900: '#0F1115', // Grey-900 — headlines on light backgrounds
        },
        accent: {
          DEFAULT: '#FFB31A', // Accent Yellow — CTAs, urgency, key metrics
          dark: '#E69D00',
          light: '#FFD06B',
        },
        brand: {
          surface: '#F3F4F6',
          'surface-alt': '#E5E7EB',
          muted: '#D1D5DB',
          dark: '#0F1115',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 25px rgba(0,0,0,0.07), 0 4px 10px rgba(0,0,0,0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.25s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
