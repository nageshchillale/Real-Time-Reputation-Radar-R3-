/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9b30ff', 
          500: '#9b30ff',
          dark: '#4a0080',
          light: '#d28eff',
        },
        accent: {
          neon: '#00f0ff', 
          violet: '#bf55ec',
        },
        dark: {
          900: '#0a0a0f',
          800: '#14141f',
          700: '#1e1e2d',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% -20%, #4a0080 0%, #0a0a0f 70%)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
