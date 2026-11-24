import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(root, 'src') },
  },
  server: {
    port: 5173,
    // Все запросы /api/* уходят на наш Express-сервер
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
