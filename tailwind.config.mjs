/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Space Mono', 'monospace'],
        'display': ['Anton', 'sans-serif'],
      },
      colors: {
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        'accent': 'var(--accent)',
        'muted': 'var(--muted)',
        'border': 'var(--border)',
        'subtle-bg': 'var(--subtle-bg)',
      },
      animation: {
        'glitch': 'glitch 1s infinite',
        'text-glitch': 'textGlitch 3s infinite linear alternate-reverse',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        textGlitch: {
          '0%': { transform: 'skew(0deg)' },
          '20%': { transform: 'skew(-2deg)' },
          '40%': { transform: 'skew(2deg)' },
          '60%': { transform: 'skew(-1deg)' },
          '80%': { transform: 'skew(1deg)' },
          '100%': { transform: 'skew(0deg)' },
        },
        marquee: {
          '0%': { transform: 'translate3d(calc(-25% + 20vw), 0, 0)' },
          '100%': { transform: 'translate3d(calc(-50% + 20vw), 0, 0)' },
        },
      },
      clipPath: {
        'slant': 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        'diagonal': 'polygon(0 0, 100% 0, 100% 100%, 15% 100%)',
        'brutalist': 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)',
      },
    },
  },
  plugins: [],
}