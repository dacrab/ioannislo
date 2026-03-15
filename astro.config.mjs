import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    // @ts-ignore - @tailwindcss/vite Plugin type conflicts with Astro 6's bundled Vite type
    plugins: [tailwindcss()]
  }
});
