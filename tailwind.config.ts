import type { Config } from "tailwindcss";

/**
 * Chizunet Blog 设计令牌 (Design Tokens)
 * 色彩、圆角、动效与主站 chizunet.cc 共用同一套规范，完整说明见 DESIGN.md；
 * 修改共享令牌时请同步主站的 tailwind.config.js。
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 色彩：品牌色阶 cheese；暗色模式中性色直接使用 Tailwind 内置的 stone
      colors: {
        cheese: {
          50: '#FFFDF5',  // 页面背景（浅色）
          100: '#FFF8E1', // 图标底块、浅色装饰
          200: '#FFECB3', // 边框、悬停背景
          300: '#FFE082', // 选区、装饰圆
          400: '#FFD54F', // 暗色模式强调文字
          500: '#FFCA28', // 品牌主色：进度条、徽章、主按钮
          600: '#FFB300', // 强调文字 / 图标
          700: '#FFA000', // 标签文字、渐变终点
          800: '#FF8F00', // 图标按钮文字、正文链接
          900: '#FF6F00', // 次要文字（配合透明度）
          950: '#4E342E', // 正文主色（浅色模式，"面包皮"深棕）
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
        mono: [
          'var(--font-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      borderRadius: {
        card: '2rem',     // 文章卡片、中型面板
        panel: '2.5rem',  // 大面板：正文容器、搜索框、空状态
        avatar: '3rem',   // 头像框（主站）
      },
      // 动效：主题切换 / 颜色过渡统一使用 duration-theme + ease-theme（.theme-transition）
      transitionDuration: {
        theme: '700ms',
      },
      transitionTimingFunction: {
        theme: 'cubic-bezier(0.4, 0, 0.2, 1)',              // Material Design Standard
        'theme-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // 带回弹，仅用于缩放 / 位移
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.cheese.950'),
            maxWidth: 'none',
            lineHeight: '1.8',
            a: {
              color: theme('colors.cheese.800'),
              textDecoration: 'underline',
              textDecorationThickness: 'from-font',
              textUnderlineOffset: '2px',
              textDecorationColor: theme('colors.cheese.200'),
              transition: 'all 0.2s ease',
              '&:hover': {
                color: theme('colors.cheese.600'),
                backgroundColor: theme('colors.cheese.100'),
                textDecorationColor: theme('colors.cheese.500'),
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
              textDecoration: 'underline',
              textDecorationThickness: 'from-font',
              textUnderlineOffset: '2px',
              textDecorationColor: theme('colors.cheese.900'),
              '&:hover': {
                color: theme('colors.cheese.300'),
                backgroundColor: theme('colors.cheese.950'),
                textDecorationColor: theme('colors.cheese.400'),
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