// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Make sure this is '/' unless you're deploying under a subfolder
  plugins: [react()],
});
