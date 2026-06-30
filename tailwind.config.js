/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          50:  '#F0EFFF',
          100: '#E2E1FF',
          200: '#C4C2FF',
          300: '#A7A4FF',
          400: '#8985FF',
          500: '#6C63FF',
          600: '#4A3FFF',
          700: '#2E24E0',
          800: '#1E17B0',
          900: '#110D80'
        },
        accent: {
          DEFAULT: '#00D4AA',
          50:  '#E0FFF9',
          100: '#B3FFF0',
          200: '#66FFE0',
          300: '#1AFFD1',
          400: '#00EFC0',
          500: '#00D4AA',
          600: '#00A888',
          700: '#007D65',
          800: '#005242',
          900: '#002920'
        },
        surface: {
          DEFAULT: '#1A1A2E',
          50:  '#3A3A5E',
          100: '#333352',
          200: '#2D2D47',
          300: '#26263D',
          400: '#202033',
          500: '#1A1A2E',
          600: '#141422',
          700: '#0E0E17',
          800: '#08080B',
          900: '#020203'
        },
        base: {
          DEFAULT: '#0A0A0F',
          50:  '#2A2A3F',
          100: '#222232',
          200: '#1A1A26',
          300: '#12121A',
          400: '#0C0C12',
          500: '#0A0A0F',
          600: '#07070B',
          700: '#050507',
          800: '#030304',
          900: '#010101'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
        'gradient-dark':    'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 100%)'
      },
      boxShadow: {
        'primary': '0 0 20px rgba(108, 99, 255, 0.35)',
        'accent':  '0 0 20px rgba(0, 212, 170, 0.35)'
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' },                        '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }
      }
    }
  },
  plugins: []
}