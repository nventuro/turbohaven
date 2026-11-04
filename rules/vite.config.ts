import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative paths let the site run from any folder on any host.
  base: './',
  // The site publishes both apps, each in its own folder beside the page that picks between them.
  build: { outDir: '../dist/rules', emptyOutDir: true },
  plugins: [react()],
  test: { include: ['tests/**/*.test.ts'] },
});
