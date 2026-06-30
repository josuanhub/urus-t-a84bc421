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
          50:  '#f0efff',
          100: '#e4e2ff',
          200: '#ccc9ff',
          300: '#aaa4ff',
          400: '#8a80ff',
          500: '#6C63FF',
          600: '#5a4fe6',
          700: '#4a3fcc',
          800: '#3a31a8',
          900: '#2e2786'
        },
        accent: {
          DEFAULT: '#00D4AA',
          50:  '#e6fff9',
          100: '#b3ffee',
          200: '#66ffe0',
          300: '#1affd0',
          400: '#00eebb',
          500: '#00D4AA',
          600: '#00b38f',
          700: '#008f72',
          800: '#006b55',
          900: '#004d3d'
        },
        surface: {
          DEFAULT: '#1A1A2E',
          50:  '#f2f2f7',
          100: '#d9d9f0',
          200: '#b3b3e0',
          300: '#8080c8',
          400: '#4d4d9e',
          500: '#1A1A2E',
          600: '#151526',
          700: '#10101d',
          800: '#0d0d18',
          900: '#080812'
        },
        base: {
          DEFAULT: '#0A0A0F',
          50:  '#f0f0f2',
          100: '#d1d1db',
          200: '#a3a3b8',
          300: '#757594',
          400: '#474770',
          500: '#0A0A0F',
          600: '#08080c',
          700: '#060609',
          800: '#040406',
          900: '#020203'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
        'gradient-dark':    'linear-gradient(180deg, #0A0A0F 0%, #1A1A2E 100%)'
      },
      boxShadow: {
        'primary': '0 0 20px rgba(108, 99, 255, 0.35)',
        'accent':  '0 0 20px rgba(0, 212, 170, 0.35)'
      }
    }
  },
  plugins: []
}