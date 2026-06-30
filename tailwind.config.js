/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          50:  '#F0EFFE',
          100: '#E2E0FD',
          200: '#C5C1FB',
          300: '#A8A3F9',
          400: '#8B84F7',
          500: '#6C63FF',
          600: '#4D43E0',
          700: '#3830B8',
          800: '#252090',
          900: '#141268'
        },
        accent: {
          DEFAULT: '#00D4AA',
          50:  '#E6FDF8',
          100: '#CCFBF1',
          200: '#99F6E3',
          300: '#66F1D5',
          400: '#33ECC7',
          500: '#00D4AA',
          600: '#00AB88',
          700: '#008266',
          800: '#005944',
          900: '#003022'
        },
        surface: {
          DEFAULT: '#1A1A2E',
          50:  '#E8E8F0',
          100: '#D1D1E1',
          200: '#A3A3C3',
          300: '#7575A5',
          400: '#474787',
          500: '#1A1A2E',
          600: '#151525',
          700: '#10101C',
          800: '#0B0B13',
          900: '#06060A'
        },
        base: {
          DEFAULT: '#0A0A0F',
          50:  '#E6E6E8',
          100: '#CDCDD1',
          200: '#9B9BA3',
          300: '#696975',
          400: '#373747',
          500: '#0A0A0F',
          600: '#08080C',
          700: '#060609',
          800: '#040406',
          900: '#020203'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
        'gradient-dark':    'linear-gradient(180deg, #1A1A2E 0%, #0A0A0F 100%)'
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(108, 99, 255, 0.35)',
        'glow-accent':  '0 0 20px rgba(0, 212, 170, 0.35)'
      }
    }
  },
  plugins: []
}