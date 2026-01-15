
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        foreground: '#e0e0e0',
        'cyber-black': '#050505',
        'cyber-gray': '#1c1c1c',
        'cyber-dark-gray': '#111111',
        'cyber-yellow': '#fcee0a',
        'cyber-cyan': '#00f0ff',
        'cyber-blue': '#0066ff',
        'cyber-muted': 'oklch(0.707 0.022 261.325)',
      },
      fontFamily: {
        display: ['var(--font-rajdhani)', 'sans-serif'],
        mono: ['var(--font-share-tech-mono)', 'monospace'],
        sans: ['var(--font-rajdhani)', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(20, 20, 20, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 20, 20, 0.8) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(to right, rgba(252, 238, 10, 0.05), transparent)',
      },
      boxShadow: {
        'cyber-glow': '0 0 100px -20px rgba(0, 102, 255, 0.4)',
        'text-glow': '0 0 10px rgba(0, 240, 255, 0.5)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
