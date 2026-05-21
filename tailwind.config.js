export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf9f3',
          100: '#fbf2e6',
          200: '#f5dcc6',
          300: '#f0c6a3',
          400: '#e8a876',
          500: '#e08a4a',
          600: '#d96f2e',
          700: '#b85b25',
          800: '#8f4620',
          900: '#6d351a',
        },
        accent: {
          50: '#faf5f0',
          100: '#f5ece6',
          200: '#ead6ca',
          300: '#dfc1af',
          400: '#cfa079',
          500: '#bf7f43',
          600: '#b3632e',
          700: '#924f25',
          800: '#6f3c1d',
          900: '#562d16',
        },
        rose: {
          50: '#fff5f7',
          100: '#ffe0e6',
          200: '#ffc1ce',
          300: '#ff9fb7',
          400: '#ff7a9e',
          500: '#ff5588',
          600: '#e63a6f',
          700: '#c4275c',
          800: '#a01e4a',
          900: '#7d183c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        'gradient-size': '200% 200%',
      },
      backdropBlur: {
        'sm': '4px',
      },
    },
  },
  plugins: [],
}
