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
        ],        mono: [
          'var(--font-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],      },
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
        'theme-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.cheese.950'),
            maxWidth: 'none',
            lineHeight: '1.8',
            a: {
              color: theme('colors.cheese.800'),
              textDecoration: 'none',
              borderBottom: `2px solid ${theme('colors.cheese.200')}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                color: theme('colors.cheese.600'),
                backgroundColor: theme('colors.cheese.100'),
                borderBottomColor: theme('colors.cheese.500'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.cheese.950'),
              fontWeight: '800',
              letterSpacing: '-0.02em',
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: theme('colors.cheese.900'),
              borderLeftColor: theme('colors.cheese.500'),
              backgroundColor: theme('colors.cheese.50'),
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
        invert: {
          css: {
            color: theme('colors.stone.300'),
            a: {
              color: theme('colors.cheese.400'),
              borderBottomColor: theme('colors.cheese.900'),
              '&:hover': {
                color: theme('colors.cheese.300'),
                backgroundColor: theme('colors.cheese.950'),
                borderBottomColor: theme('colors.cheese.400'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.stone.50'),
            },
            blockquote: {
              color: theme('colors.stone.200'),
              backgroundColor: theme('colors.stone.900'),
              borderLeftColor: theme('colors.cheese.600'),
            },
            strong: {
              color: theme('colors.stone.50'),
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
