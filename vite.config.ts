import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative URLs work at both a domain root and /repository/ on GitHub Pages.
  base: './',
});
