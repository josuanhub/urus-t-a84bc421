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
          50: '#F0EFFF',
          100: '#E1DEFF',
          200: '#C3BCFF',
          300: '#A59AFF',
          400: '#8779FF',
          500: '#6C63FF',
          600: '#4D42FF',
          700: '#2E21FF',
          800: '#1409F5',
          900: '#1007CC'
        },
        accent: {
          DEFAULT: '#00D4AA',
          50: '#E6FFF9',
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
          50: '#3D3D6B',
          100: '#333360',
          200: '#2A2A52',
          300: '#222244',
          400: '#1E1E38',
          500: '#1A1A2E',
          600: '#141424',
          700: '#0E0E1A',
          800: '#080810',
          900: '#020206'
        },
        base: {
          DEFAULT: '#0A0A0F',
          light: '#12121A',
          dark: '#050508'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
        'gradient-surface': 'linear-gradient(180deg, #1A1A2E 0%, #0A0A0F 100%)'
      },
      boxShadow: {
        'primary': '0 0 20px rgba(108, 99, 255, 0.3)',
        'accent': '0 0 20px rgba(0, 212, 170, 0.3)',
        'glow': '0 0 40px rgba(108, 99, 255, 0.15)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
}