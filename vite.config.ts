import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative paths let the site run from any folder on any host.
  base: './',
  plugins: [react()],
  test: { include: ['tests/**/*.test.ts'] },
});
