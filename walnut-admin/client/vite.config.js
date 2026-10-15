import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The admin is served at /admin on the website's domain, so:
//  - `base` makes built asset URLs resolve under /admin/
//  - the dev proxy maps /admin/api back to the API's own /api mount
export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/admin/api': {
        target: 'http://localhost:4000',
        rewrite: (p) => p.slice('/admin'.length),
      },
      '/media': 'http://localhost:4000',
    },
  },
  build: {
    sourcemap: false,
  },
});
