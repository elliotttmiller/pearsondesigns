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
        'how-it-works': resolve(__dirname, 'how-it-works.html'),
        'services': resolve(__dirname, 'services.html'),
        'portfolio': resolve(__dirname, 'portfolio.html'),
        'about': resolve(__dirname, 'about.html'),
        'faq': resolve(__dirname, 'faq.html'),
        'contact': resolve(__dirname, 'contact.html'),
      }
    }
  }
});
