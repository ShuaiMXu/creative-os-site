// Second localization pass: unwrap Cloudflare image-transformation URLs
// (appllama.io/cdn-cgi/image/<params>/<target>). Targets already localized
// rewrite to the local file; targets still on their CDN get downloaded too.
// srcset variants are dropped — the local src renders at any size.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const pagePath = fileURLToPath(new URL('../apps/portal/index.html', import.meta.url));
const assetDir = fileURLToPath(new URL('../public/assets/browse/', import.meta.url));
mkdirSync(assetDir, { recursive: true });

let html = readFileSync(pagePath, 'utf8');
const wrappers = new Set();
for (const match of html.matchAll(/https:\/\/appllama\.io\/cdn-cgi\/image\/[^\s"']+/g)) wrappers.add(match[0]);
console.log('cdn-cgi urls:', wrappers.size);

// /cdn-cgi/image/<k=v,k=v>/rest  →  rest is the target (absolute URL or path)
const targets = new Map(); // wrapper -> { target, local }
for (const wrapper of wrappers) {
  const rest = wrapper.replace(/^https:\/\/appllama\.io\/cdn-cgi\/image\/[^/]+\//, '');
  const target = decodeURIComponent(rest);
  targets.set(wrapper, target);
}

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
  Referer: 'https://appllama.io/',
  Accept: 'image/avif,image/webp,image/*,*/*'
};

const resolve = new Map(); // wrapper -> local path
let failed = 0;
for (const [wrapper, target] of targets) {
  if (target.startsWith('/assets/browse/')) {
    resolve.set(wrapper, target);
    continue;
  }
  if (!/^https?:\/\/cloud\.appllama\.io\//.test(target) && !target.startsWith('/')) {
    continue; // anything else (foreign host) left alone
  }
  const url = target.startsWith('/') ? `https://appllama.io${target}` : target;
  const ext = (url.match(/\.(jpe?g|png|webp|avif|gif)$/i) || [null, 'jpg'])[1].toLowerCase();
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 12);
  const file = `${hash}.${ext}`;
  if (!existsSync(assetDir + file)) {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length < 100) throw new Error('tiny');
      writeFileSync(assetDir + file, buffer);
    } catch (error) {
      console.log('FAILED', url.slice(0, 90), error.message);
      failed++;
      continue;
    }
  }
  resolve.set(wrapper, `/assets/browse/${file}`);
}
console.log('resolved:', resolve.size, 'failed:', failed);

for (const [wrapper, local] of resolve) html = html.split(wrapper).join(local);

// Drop srcset attributes that still reference any external transform host;
// the plain src now points at the local file.
html = html.replace(/ srcSet="[^"]*(?:appllama\.io|cloud\.appllama)[^"]*"/g, '');
html = html.replace(/ srcset="[^"]*(?:appllama\.io|cloud\.appllama)[^"]*"/g, '');

writeFileSync(pagePath, html);
console.log('remaining appllama refs:', (html.match(/appllama\.io/g) || []).length);
