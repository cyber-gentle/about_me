import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'midnight': '#020818',
        'navy': '#0a1628',
        'gold': '#C9A84C',
        'gold-light': '#F0C96A',
        'text': '#E8EAF0',
        'muted': '#6B7A99',
        'border-gold': 'rgba(201, 168, 76, 0.2)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(to right, #C9A84C, #F0C96A)',
      },
      backdropFilter: {
        glass: 'blur(20px)',
      },
      fontFamily: {
        clash: ['Clash Display', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 168, 76, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
