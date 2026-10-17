// Post-process the skillry mirror (fast token-scan version):
// 1) undo partial in-flight rewrites (remove literal '/skillry-full')
// 2) rewrite mirrored asset paths (relative + absolute-with-domain, JSON-escape tolerant)
// 3) rewrite href page links to directory-style mirror URLs
// Root page is fetched if missing.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, 'public', 'skillry-full');
const STATE = join(here, '.skillry-crawl-state.json');
const PREFIX = '/skillry-full';
const ORIGIN = 'https://skillry.dev';
const TEXT_EXT = ['.html', '.css', '.js', '.mjs', '.json', '.svg', '.xml', '.txt', '.webmanifest'];
const ASSET_EXT = new Set(['.js', '.mjs', '.css', '.svg', '.png', '.webp', '.jpg', '.jpeg', '.gif', '.ico', '.json', '.webmanifest', '.woff', '.woff2', '.ttf', '.otf', '.mp4', '.webm', '.txt', '.xml', '.pdf']);

const state = JSON.parse(await readFile(STATE, 'utf8'));
const assets = new Set(Object.keys(state.done).filter(k => k.startsWith('asset ')).map(k => k.slice(6))
  .filter(p => ASSET_EXT.has(extname(p).toLowerCase())));
const pages = new Set(Object.keys(state.done).filter(k => k.startsWith('page ')).map(k => k.slice(5)));
console.log('mirrored assets:', assets.size, 'pages:', pages.size);

if (!pages.has('/') && !existsSync(join(ROOT, 'index.html'))) {
  console.log('fetching root page...');
  const r = await fetch(ORIGIN + '/', { headers: { 'user-agent': 'Mozilla/5.0 Chrome/129' } });
  if (r.ok) {
    const buf = Buffer.from(await r.arrayBuffer());
    await writeFile(join(ROOT, 'index.html'), buf);
    state.done['page /'] = buf.length;
    await writeFile(STATE, JSON.stringify(state));
    console.log('root page saved,', (buf.length / 1024).toFixed(0) + 'KB');
    pages.add('/');
  } else console.log('root fetch failed:', r.status);
} else pages.add('/');

// generic path token: matches "/skills/x/media/y.webp" and JSON-escaped "\/skills\/x"
const norm = s => s.replace(/\\/g, '');
const rxAbs = /https:(?:\\?\/){2}skillry\.dev((?:\\?\/)[A-Za-z0-9][A-Za-z0-9\-._~!$&'()*+,;=:@%\\/]*)/g;
const rxRel = /(?:\\?\/)[A-Za-z0-9][A-Za-z0-9\-._~!$&'()*+,;=:@%\\/]*/g;

function rewriteAssets(text) {
  text = text.replace(rxAbs, (m, tok) => assets.has(norm(tok)) ? PREFIX + tok : m);
  return text.replace(rxRel, (m, offset, full) => {
    if (!assets.has(norm(m))) return m;
    if (full.startsWith('skillry-full', offset - 12) || full.slice(Math.max(0, offset - 13), offset).includes('skillry-full')) return m;
    return PREFIX + m;
  });
}

function rewriteHrefs(text) {
  return text.replace(/(href|action)=("([^"]*)"|'([^']*)')/g, (full, attr, q, dq, sq) => {
    const val = dq !== undefined ? dq : sq;
    if (val === '/') return `${attr}=${q[0]}${PREFIX}/${q[0]}`;
    if (!val.startsWith('/') || val.startsWith('//') || val.startsWith(PREFIX)) return full;
    const p = val.split(/[?#]/)[0].replace(/\/+$/, '');
    if (!p) return full;
    const e = extname(p).toLowerCase();
    if (e && ASSET_EXT.has(e)) return full; // handled by asset pass
    if (pages.has(p)) return `${attr}=${q[0]}${PREFIX}${p}/${q[0]}`;
    return full;
  });
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let n = 0, touched = 0;
for await (const file of walk(ROOT)) {
  if (!TEXT_EXT.includes(extname(file).toLowerCase())) continue;
  n++;
  const before = await readFile(file, 'utf8');
  let after = before.split(PREFIX).join(''); // undo partial pass-1 rewrites
  after = rewriteAssets(after);
  if (extname(file) === '.html') after = rewriteHrefs(after);
  if (after !== before) { await writeFile(file, after); touched++; }
  if (n % 500 === 0) console.log(n, 'files scanned...');
}
console.log(`done: ${n} text files, ${touched} rewritten`);
