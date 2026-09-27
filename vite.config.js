import { defineConfig } from 'vite';
import { resolve, dirname, join } from 'node:path';
import { existsSync, statSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

// The public/skillry-full mirror uses directory-style URLs (/skillry-full/skills/x/).
// Vite's public middleware only serves exact file paths, so directory requests
// would fall through to the SPA fallback. Serve their index.html directly.
function mirrorIndex(urlPath) {
  const rel = decodeURIComponent(urlPath.replace(/^\/skillry-full\/?/, '').replace(/\/+$/, ''));
  const base = join(root, 'public', 'skillry-full', rel);
  const idx = join(base, 'index.html');
  try {
    if (statSync(base).isDirectory() && existsSync(idx)) return idx;
  } catch { /* not a directory */ }
  return null;
}

export default defineConfig({
  server: { port: 4173, strictPort: true, fs: { strict: true } },
  plugins: [{
    name: 'skillry-mirror-dir-index',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/skillry-full')) return next();
        const path = req.url.split('?')[0];
        if (/\.[a-z0-9]+$/i.test(path)) return next(); // exact file → public middleware
        const file = mirrorIndex(path);
        if (!file) return next();
        res.setHeader('content-type', 'text/html; charset=utf-8');
        res.end(readFileSync(file));
      });
    }
  }],
  build: { rollupOptions: { input: {
    home: resolve('index.html'),
    portal: resolve('apps/portal/index.html'),
    studio: resolve('apps/studio/index.html'),
    web: resolve('apps/web/index.html'),
    designer: resolve('apps/designer/index.html'),
    appllama: resolve('apps/appllama/index.html'),
    'appllama-full': resolve('apps/appllama-full/index.html')
  } } }
});
