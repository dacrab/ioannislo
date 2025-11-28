import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});