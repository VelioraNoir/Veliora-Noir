// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Luxury color palette
        luxury: {
          charcoal: {
            50: '#f8f8f8',
            100: '#e8e8e8',
            200: '#d1d1d1',
            300: '#b0b0b0',
            400: '#888888',
            500: '#6d6d6d',
            600: '#5d5d5d',
            700: '#4f4f4f',
            800: '#454545',
            900: '#3d3d3d',
            950: '#1a1a1a',
          },
          ivory: {
            50: '#fefefe',
            100: '#fdfdfd',
            200: '#fbfbfb',
            300: '#f8f8f8',
            400: '#f3f3f3',
            500: '#ede9e3',
            600: '#d4c8b8',
            700: '#b8a690',
            800: '#9c8668',
            900: '#826b4a',
          },
          gold: {
            50: '#fefbf3',
            100: '#fdf6e3',
            200: '#faecc2',
            300: '#f6dc97',
            400: '#f0c55a',
            500: '#eab332',
            600: '#d99a28',
            700: '#b57c24',
            800: '#926325',
            900: '#785221',
          },
          rose: {
            50: '#fdf7f7',
            100: '#fceced',
            200: '#fad7d9',
            300: '#f6b5b9',
            400: '#f08791',
            500: '#e85d6b',
            600: '#d33d4e',
            700: '#b12a3a',
            800: '#942635',
            900: '#7e2433',
          },
        },
        // Glass morphism colors
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
        }
      },
      fontFamily: {
        // Elegant serif for headlines
        'serif': ['Playfair Display', 'serif'],
        // Clean sans for body text
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'shimmer': {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'luxury-lg': '0 35px 60px -12px rgba(0, 0, 0, 0.35)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'inner-luxury': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
}