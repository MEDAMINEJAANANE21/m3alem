import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));
const PAGES = ['index', 'services', 'auth', 'contact', 'account', '404'];

// Pattern: Proxy — the browser only talks to the frontend origin; /api calls are forwarded
// to the backend, so there is no CORS to configure and no API URL hard-coded in the client.
const apiProxy = {
  '/api': {
    target: process.env.API_PROXY_TARGET ?? 'http://localhost:3000',
    changeOrigin: true,
  },
};

export default defineConfig({
  appType: 'mpa',
  server: { port: 5173, proxy: apiProxy },
  preview: { port: 4173, proxy: apiProxy },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(PAGES.map((page) => [page, resolve(root, `${page}.html`)])),
    },
  },
});
