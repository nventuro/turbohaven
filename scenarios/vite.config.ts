import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  // The site publishes both apps, each in its own folder beside the page that picks between them.
  build: { outDir: '../dist/scenarios', emptyOutDir: true },
  plugins: [react()],
});
