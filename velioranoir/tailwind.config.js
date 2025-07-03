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
        // Metallic accessories color palette
        metallic: {
          charcoal: {
            50: '#f8f9fa',
            100: '#e9ecef',
            200: '#dee2e6',
            300: '#ced4da',
            400: '#adb5bd',
            500: '#6c757d',
            600: '#495057',
            700: '#343a40',
            800: '#212529',
            900: '#1a1d20',
            950: '#0d0f11',
          },
          platinum: {
            50: '#fefefe',
            100: '#fdfdfd',
            200: '#fafafa',
            300: '#f5f5f5',
            400: '#efefef',
            500: '#e5e4e2',
            600: '#d3d2d0',
            700: '#bfbdba',
            800: '#a8a6a3',
            900: '#8f8d8a',
          },
          silver: {
            50: '#f9f9f9',
            100: '#f2f2f2',
            200: '#e6e6e6',
            300: '#d4d4d4',
            400: '#c0c0c0',
            500: '#a8a8a8',
            600: '#909090',
            700: '#787878',
            800: '#606060',
            900: '#4a4a4a',
          },
          gold: {
            50: '#fefbf3',
            100: '#fdf6e3',
            200: '#fbedcc',
            300: '#f7de9f',
            400: '#f2c866',
            500: '#d4af37',
            600: '#bf9a2a',
            700: '#a08224',
            800: '#826722',
            900: '#6b5520',
          },
          copper: {
            50: '#fef7f3',
            100: '#feeee6',
            200: '#fcdacc',
            300: '#f8bfa8',
            400: '#f2957e',
            500: '#b87333',
            600: '#a65f29',
            700: '#8b4d23',
            800: '#70401f',
            900: '#5c351b',
          },
          bronze: {
            50: '#faf8f5',
            100: '#f4f0ea',
            200: '#e7ddd1',
            300: '#d7c7b5',
            400: '#c3aa93',
            500: '#cd7f32',
            600: '#b56f2a',
            700: '#985c24',
            800: '#7a4a20',
            900: '#643d1c',
          }
        },
        // Glass morphism colors
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
          border: 'rgba(192, 192, 192, 0.2)',
        }
      },
      fontFamily: {
        // Elegant serif for headlines - accessories deserve sophistication
        'serif': ['Playfair Display', 'serif'],
        'playfair': ['Playfair Display', 'serif'],
        // Clean sans for body text
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'subheading': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'metallic-shine': 'metallic-shine 2s ease-in-out infinite',
        'pulse-metallic': 'pulse-metallic 2s ease-in-out infinite',
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
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'metallic-shine': {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' }
        },
        'pulse-metallic': {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(192, 192, 192, 0.4)' 
          },
          '50%': { 
            boxShadow: '0 0 20px 10px rgba(192, 192, 192, 0.1)' 
          }
        }
      },
      backdropBlur: {
        'xs': '2px',
        'metallic': '16px',
      },
      boxShadow: {
        'metallic': '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(192, 192, 192, 0.1)',
        'metallic-lg': '0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(192, 192, 192, 0.15)',
        'metallic-inner': 'inset 0 2px 4px 0 rgba(192, 192, 192, 0.1)',
        'glass-metallic': '0 8px 32px 0 rgba(192, 192, 192, 0.2)',
        'gold-glow': '0 0 30px rgba(212, 175, 55, 0.3)',
        'silver-glow': '0 0 30px rgba(192, 192, 192, 0.3)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      backgroundImage: {
        'metallic-gradient': 'linear-gradient(135deg, #e5e4e2 0%, #c0c0c0 50%, #d4af37 100%)',
        'silver-gradient': 'linear-gradient(135deg, #f9f9f9 0%, #c0c0c0 50%, #a8a8a8 100%)',
        'gold-gradient': 'linear-gradient(135deg, #fdf6e3 0%, #d4af37 50%, #bf9a2a 100%)',
        'metallic-mesh': `
          radial-gradient(at 40% 20%, rgba(212, 175, 55, 0.15) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(192, 192, 192, 0.2) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(229, 228, 226, 0.25) 0px, transparent 50%),
          radial-gradient(at 80% 50%, rgba(255, 255, 255, 0.1) 0px, transparent 50%)
        `,
      }
    },
  },
  plugins: [],
}