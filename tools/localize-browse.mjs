// Localize the browse catalog imagery: download every cloud.appllama.io
// image the portal references into public/assets/browse/ and rewrite the
// page to serve them locally, so the catalog renders with zero network.
// Placeholder material by design — swap the files to swap the showcase.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const pagePath = fileURLToPath(new URL('../apps/portal/index.html', import.meta.url));
const assetDir = fileURLToPath(new URL('../public/assets/browse/', import.meta.url));
mkdirSync(assetDir, { recursive: true });

let html = readFileSync(pagePath, 'utf8');
const urls = new Set();
for (const match of html.matchAll(/https:\/\/cloud\.appllama\.io\/[^\s"'?]+/g)) urls.add(match[0]);
console.log('unique CDN urls:', urls.size);

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
  Referer: 'https://appllama.io/',
  Accept: 'image/avif,image/webp,image/*,*/*'
};

const mapping = new Map();
let failed = 0;
for (const url of urls) {
  const ext = (url.match(/\.(jpe?g|png|webp|avif|gif)$/i) || [null, 'jpg'])[1].toLowerCase();
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 12);
  const file = `${hash}.${ext}`;
  const target = assetDir + file;
  if (!existsSync(target)) {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length < 100) throw new Error(`suspiciously small (${buffer.length}B)`);
      writeFileSync(target, buffer);
    } catch (error) {
      console.log('FAILED', url, error.message);
      failed++;
      continue;
    }
  }
  mapping.set(url, `/assets/browse/${file}`);
}
console.log('downloaded:', mapping.size, 'failed:', failed);

for (const [url, local] of mapping) {
  // replace the URL everywhere it appears (src, srcSet entries, preload hrefs)
  html = html.split(url).join(local);
}
// srcset entries that carried transformation params (?tr=...) on the same base
// now collide; drop srcset on the catalog imgs entirely — src already points
// at the local file and the browser scales it.
html = html.replace(/ srcSet="[^"]*cloud\.appllama\.io[^"]*"/g, '');
html = html.replace(/ srcset="[^"]*cloud\.appllama\.io[^"]*"/g, '');

writeFileSync(pagePath, html);
const remaining = (html.match(/cloud\.appllama\.io/g) || []).length;
console.log('remaining CDN refs in page:', remaining);
