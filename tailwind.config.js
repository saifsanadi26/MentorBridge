/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        head: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: '#07090F',
        'bg-2': '#0B0E18',
        'bg-3': '#10131E',
        'bg-card': '#0E1120',
        border: 'rgba(255,255,255,0.07)',
        'border-2': 'rgba(255,255,255,0.13)',
        cyan: '#00D4FF',
        teal: '#00E5A8',
        violet: '#8B7FFF',
        gold: '#FFB800',
        rose: '#FF5E8A',
        text: '#E8EAF6',
        'text-2': '#7A7F99',
        'text-3': '#40455C',
      },
      borderRadius: {
        'r': '14px',
      },
    },
  },
  plugins: [],
}
