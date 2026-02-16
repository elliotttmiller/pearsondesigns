import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/pearsondesigns/',
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'services': resolve(__dirname, 'services.html'),
        'about': resolve(__dirname, 'about.html'),
        'showroom': resolve(__dirname, 'showroom.html'),
        'contact': resolve(__dirname, 'contact.html'),
      }
    }
  }
});
