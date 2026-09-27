// Localize the hero whirl tiles: crawl the app-screen images the original
// whirl uses (they live in the page's RSC payload as cloud.appllama.io
// /orig/v1 captures) into public/assets/hero/, then emit the manifest the
// portal reads. Placeholder material by design.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(fileURLToPath(new URL('../tools/source/home.html', import.meta.url)), 'utf8');
const assetDir = fileURLToPath(new URL('../public/assets/hero/', import.meta.url));
mkdirSync(assetDir, { recursive: true });

const urls = [...new Set([...source.matchAll(/cloud\.appllama\.io\/orig\/v1\/[a-f0-9]+\.webp/g)].map(m => m[0]))];
console.log('screen urls in payload:', urls.length);

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
  Referer: 'https://appllama.io/',
  Accept: 'image/avif,image/webp,image/*,*/*'
};

const manifest = [];
let failed = 0;
urls.forEach((url, index) => {
  const file = `screen-${String(index + 1).padStart(3, '0')}.webp`;
  manifest.push(`/assets/hero/${file}`);
  if (existsSync(assetDir + file)) return;
  // run sequentially below instead
});
// sequential downloads with a small concurrency cap
const queue = urls.map((url, index) => ({ url, file: `screen-${String(index + 1).padStart(3, '0')}.webp` }));
let cursor = 0;
async function worker() {
  while (cursor < queue.length) {
    const item = queue[cursor++];
    if (existsSync(assetDir + item.file)) continue;
    try {
      const response = await fetch(`https://${item.url}`, { headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length < 500) throw new Error('tiny');
      writeFileSync(assetDir + item.file, buffer);
    } catch (error) {
      console.log('FAILED', item.url.slice(-50), error.message);
      failed++;
    }
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
console.log('failed:', failed, '/', queue.length);

writeFileSync(fileURLToPath(new URL('../apps/portal/hero-screens.json', import.meta.url)), JSON.stringify(manifest.filter(f => failed === 0 || existsSync(assetDir + f.split('/').pop())), null, 2) + '\n');
console.log('manifest entries:', JSON.parse(readFileSync(fileURLToPath(new URL('../apps/portal/hero-screens.json', import.meta.url)), 'utf8')).length);
