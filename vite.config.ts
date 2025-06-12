import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* ws://localhost:* wss://localhost:*; style-src 'self' 'unsafe-inline' http://localhost:* https://fonts.googleapis.com; img-src 'self' data: blob: http://localhost:* https:; font-src 'self' data: https://fonts.gstatic.com https:; connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:* https:; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-src 'self'; worker-src 'self' blob:",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  }
});
