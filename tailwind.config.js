/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        accent: 'var(--color-accent)',
        secondary: 'var(--color-secondary)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
      },
      keyframes: {
        scrollDown: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(200%)' }
        }
      },
      animation: {
        'scrollDown': 'scrollDown 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}; 