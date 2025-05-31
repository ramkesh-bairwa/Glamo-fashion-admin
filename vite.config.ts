// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  server: {
    port: parseInt(process.env.PORT) || 5000,
  },
  preview: {
    port: parseInt(process.env.PORT) || 5000,
  },
});