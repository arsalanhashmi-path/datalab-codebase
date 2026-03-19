import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0faf4',
          100: '#dcf4e6',
          200: '#bbe9cf',
          300: '#86d6a8',
          400: '#4cba7c',
          500: '#289c5e',
          600: '#1a7d4a',
          700: '#166440',
          800: '#134f34',
          900: '#10412b',
          950: '#072318',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        sans:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
