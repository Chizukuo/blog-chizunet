import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cheese: {
          50: '#FFFDF5',
          100: '#FFF8E1',
          200: '#FFECB3',
          300: '#FFE082',
          400: '#FFD54F',
          500: '#FFCA28', // Main Cheese Yellow
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
          950: '#4E342E', // Dark crust
        },
      },
      fontFamily: {
        sans: [
          'Outfit',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          '"Noto Sans SC"',
          '"Noto Sans JP"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Hiragino Kaku Gothic ProN"',
          '"Meiryo"',
          'sans-serif',
        ],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      },
      transitionTimingFunction: {
        'theme': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'theme-spring': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.cheese.950'),
            a: {
              color: theme('colors.cheese.800'),
              '&:hover': {
                color: theme('colors.cheese.600'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.cheese.950'),
              fontWeight: '700',
            },
            code: {
              color: theme('colors.pink.500'),
              backgroundColor: theme('colors.cheese.100'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.cheese.50'),
            a: {
              color: theme('colors.cheese.400'),
              '&:hover': {
                color: theme('colors.cheese.300'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.cheese.50'),
            },
            code: {
              color: theme('colors.pink.400'),
              backgroundColor: theme('colors.stone.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
