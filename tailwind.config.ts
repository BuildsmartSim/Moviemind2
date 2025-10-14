import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        surfaceSoft: 'rgb(var(--color-surface-soft) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        textPrimary: 'rgb(var(--color-text-primary) / <alpha-value>)',
        textSecondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        focus: 'rgb(var(--color-focus) / <alpha-value>)'
      },
      boxShadow: {
        glow: '0 25px 60px -35px rgba(0, 0, 0, 0.9)',
        ambient: '0 18px 50px -30px rgba(0, 0, 0, 0.8)'
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"Inter"', '"Segoe UI"', 'sans-serif']
      }
    }
  }
};

export default config;
