import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  server: { port: 4173, strictPort: true, fs: { strict: true } },
  build: { rollupOptions: { input: {
    home: resolve('index.html'),
    portal: resolve('apps/portal/index.html'),
    web: resolve('apps/web/index.html'),
    designer: resolve('apps/designer/index.html'),
    appllama: resolve('apps/appllama/index.html'),
    'appllama-full': resolve('apps/appllama-full/index.html')
  } } }
});
