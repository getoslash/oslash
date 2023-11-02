/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        shake: 'shake 1s cubic-bezier(.36,.07,.19,.97) both'
      },
      keyframes: {
        shake: {
          '10%, 90%': {
            transform: 'rotate(18deg)'
          },
          '20%, 80%': {
            transform: 'rotate(-18deg)'
          },
          '30%, 50%, 70%': {
            transform: 'rotate(18deg)'
          },
          '40%, 60%': {
            transform: 'rotate(-18deg)'
          }
        }
      },
    },
  },
  plugins: [],
}

