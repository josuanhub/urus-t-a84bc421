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
          100: '#E1DEFF',
          200: '#C3BCFF',
          300: '#A59BFF',
          400: '#8779FF',
          500: '#6C63FF',
          600: '#4B40E0',
          700: '#3730B8',
          800: '#262090',
          900: '#161268'
        },
        accent: {
          DEFAULT: '#00D4AA',
          50:  '#E6FFF9',
          100: '#CCFFF3',
          200: '#99FFE7',
          300: '#66FFDB',
          400: '#33FFCF',
          500: '#00D4AA',
          600: '#00AA88',
          700: '#008066',
          800: '#005544',
          900: '#002B22'
        },
        surface: {
          DEFAULT: '#1A1A2E',
          50:  '#2E2E50',
          100: '#272745',
          200: '#22223C',
          300: '#1E1E35',
          400: '#1A1A2E',
          500: '#141425',
          600: '#0F0F1C',
          700: '#0A0A13',
          800: '#05050A',
          900: '#000005'
        },
        base: {
          DEFAULT: '#0A0A0F',
          50:  '#1E1E2E',
          100: '#181825',
          200: '#14141E',
          300: '#101018',
          400: '#0A0A0F',
          500: '#070709',
          600: '#040405',
          700: '#020202',
          800: '#010101',
          900: '#000000'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
        'gradient-dark':    'linear-gradient(180deg, #1A1A2E 0%, #0A0A0F 100%)'
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(108, 99, 255, 0.4)',
        'glow-accent':  '0 0 20px rgba(0, 212, 170, 0.4)'
      }
    }
  },
  plugins: []
}