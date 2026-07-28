import type { Config } from 'tailwindcss';

// Nocturne design tokens, baked in as the Tailwind theme.
// Source of truth: _ds/nocturne .../styles.css
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#161826',
        surface: '#232532',
        text: '#e9e9ed',
        divider: 'rgba(233,233,237,0.16)',
        accent: {
          DEFAULT: '#9184d9',
          100: '#f5f4ff', 200: '#e7e5fe', 300: '#d2cefd', 400: '#b5abfc',
          500: '#968ae0', 600: '#796cbf', 700: '#5d5294', 800: '#423a6a', 900: '#2b2741',
        },
        neutral: {
          100: '#f3f5fe', 200: '#e4e7f5', 300: '#cfd3e5', 400: '#b2b6ca',
          500: '#9397ab', 600: '#75798c', 700: '#595d6c', 800: '#3f424d', 900: '#292b31',
        },
        section: {
          DEFAULT: '#262a60', glow: '#353b80', ghost: '#4c5397',
        },
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      fontWeight: {
        heading: '500',
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        md: '8px',
        lg: '14px',
      },
      boxShadow: {
        sm: '0 0 0 1px #3f424d',
        md: '0 0 0 1px #595d6c, 0 6px 18px rgba(0,0,0,0.55)',
        lg: '0 0 0 1px #9397ab, 0 16px 40px rgba(0,0,0,0.65)',
      },
    },
  },
  plugins: [],
} satisfies Config;
