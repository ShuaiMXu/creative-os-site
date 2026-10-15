// Crawl https://skillry.dev into public/skillry-full/ as a static mirror.
// - Pages: from sitemap + hrefs found in HTML -> saved as <path>/index.html
// - Assets: any root-relative path with a file extension found in html/css/js text
// - Rewrites: href page links -> /skillry-full<path>/ ; mirrored asset paths -> /skillry-full<path>
//   (asset paths are only rewritten when the file actually mirrored, so misses fall back to the live site)
// - External media (media.skillry.dev etc.) stays absolute.
// Resume-safe: state in .skillry-crawl-state.json
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, join, normalize, sep } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', 'public', 'skillry-full');
const ORIGIN = 'https://skillry.dev';
const PREFIX = '/skillry-full';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';
const CONCURRENCY = 5;
const STATE_FILE = join(fileURLToPath(import.meta.url), '..', '.skillry-crawl-state.json');
const TEXT_EXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.xml', '.txt', '.webmanifest']);
const ASSET_EXT = new Set(['.js', '.mjs', '.css', '.svg', '.png', '.webp', '.jpg', '.jpeg', '.gif', '.ico', '.json', '.webmanifest', '.woff', '.woff2', '.ttf', '.otf', '.mp4', '.webm', '.txt', '.xml', '.pdf']);
const SKIP_PREFIXES = ['/api', '/@', '/node_modules', '/__vite', '/mailto'];

const state = { done: {}, failed: {} };
if (existsSync(STATE_FILE)) Object.assign(state, JSON.parse(await readFile(STATE_FILE, 'utf8')));
let stateDirty = 0;

const queue = [];
const enqueued = new Set();
const mirrored = new Set(Object.keys(state.done));

function enqueue(path, type) {
  if (!path || path === '/') return;
  if (SKIP_PREFIXES.some(p => path.startsWith(p))) return;
  const key = type + ' ' + path;
  if (enqueued.has(key)) return;
  enqueued.add(key);
  queue.push({ path, type });
}

function splitPath(u) {
  // strip query + fragment
  const clean = u.split(/[?#]/)[0];
  return clean;
}

function extOf(p) {
  const m = p.match(/(\.[a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : '';
}

function collectFromText(text, { htmlScan }) {
  // root-relative path-ish strings
  for (const m of text.matchAll(/\/[A-Za-z0-9][A-Za-z0-9\-._~!$&'()*+,;=:@%/]*/g)) {
    const p = splitPath(m[0]);
    if (!p || p === '/') continue;
    if (p.startsWith('//')) continue;
    const e = extOf(p);
    if (e && ASSET_EXT.has(e)) enqueue(p, 'asset');
    else if (!e && htmlScan) enqueue(p, 'page'); // route link inside HTML text (embedded JSON counts)
  }
  // absolute with own domain
  for (const m of text.matchAll(/https:\/\/skillry\.dev(\/[A-Za-z0-9][^"'\s\\<>)]*)/g)) {
    const p = splitPath(m[1]);
    if (!p || p === '/') continue;
    const e = extOf(p);
    if (e && ASSET_EXT.has(e)) enqueue(p, 'asset');
    else if (!e && htmlScan) enqueue(p, 'page');
  }
}

async function fetchWithRetry(path) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(ORIGIN + path, { headers: { 'user-agent': UA, accept: '*/*' }, redirect: 'follow' });
      if (r.ok) return Buffer.from(await r.arrayBuffer());
      if (r.status === 404 || r.status === 410) return null;
      console.log('  http', r.status, path);
    } catch (e) { /* retry */ }
    await new Promise(r => setTimeout(r, 800 * (i + 1)));
  }
  return null;
}

function targetFile(item) {
  if (item.type === 'page') return join(ROOT, item.path, 'index.html');
  return join(ROOT, item.path);
}

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function rewriteText(buf, item, pathsMirrored) {
  const ext = extOf(item.path);
  if (!TEXT_EXT.has(ext) && item.type === 'asset') return buf; // binary stays
  let text = buf.toString('utf8');
  const isHtml = item.type === 'page' || ext === '.html';

  // 1) asset substrings anywhere in text -> prefix (only if mirrored)
  const assets = [...pathsMirrored].filter(p => extOf(p) && ASSET_EXT.has(extOf(p))).sort((a, b) => b.length - a.length);
  if (assets.length) {
    const rx = new RegExp('(?:' + assets.map(esc).join('|') + ')', 'g');
    text = text.replace(rx, s => PREFIX + s);
  }

  // 2) href page links in HTML only
  if (isHtml) {
    text = text.replace(/(href|action)=("([^"]*)"|'([^']*)')/g, (full, attr, q, dq, sq) => {
      const val = dq !== undefined ? dq : sq;
      let out = val;
      if (val === '/') out = PREFIX + '/';
      else if (val.startsWith('//') || /^[a-z]+:/.test(val) || val.startsWith('#')) out = val;
      else {
        const p = splitPath(val.startsWith(ORIGIN) ? val.slice(ORIGIN.length) : val);
        if (val.startsWith('/') || val.startsWith(ORIGIN)) {
          const e = extOf(p);
          if (e && ASSET_EXT.has(e)) out = pathsMirrored.has(p) ? PREFIX + p : val;
          else if (!e && p !== '' && (mirrored.has(p) || state.done['page ' + p])) out = PREFIX + p + '/';
          else if (!e && p !== '') out = val; // not mirrored, leave live link
          else out = val;
        }
      }
      return attr + '=' + q[0] + out + q[0];
    });
  }
  return Buffer.from(text, 'utf8');
}

let fetched = 0, bytes = 0;

async function worker(id) {
  while (queue.length) {
    const item = queue.shift();
    if (!item) break;
    if (state.done[item.type + ' ' + item.path]) continue;
    const buf = await fetchWithRetry(item.path);
    fetched++;
    if (fetched % 25 === 0) console.log(`[w${id}] ${fetched} fetched, queue=${queue.length}, failed=${Object.keys(state.failed).length}`);
    if (!buf) { state.failed[item.type + ' ' + item.path] = 'fetch'; stateDirty++; continue; }
    const file = normalize(targetFile(item));
    if (!file.startsWith(normalize(ROOT) + sep)) { console.log('  SKIP outside root:', item.path); continue; }
    // discover more before rewriting (discovery must see original text)
    const ext = extOf(item.path);
    if (item.type === 'page' || TEXT_EXT.has(ext)) collectFromText(buf.toString('utf8'), { htmlScan: item.type === 'page' });
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, rewriteText(buf, item, mirrored));
    state.done[item.type + ' ' + item.path] = buf.length;
    mirrored.add(item.path);
    bytes += buf.length;
    stateDirty++;
    if (stateDirty >= 25) { stateDirty = 0; await writeFile(STATE_FILE, JSON.stringify(state)); }
    await new Promise(r => setTimeout(r, 60));
  }
}

// seed: sitemap
const smr = await fetch(ORIGIN + '/sitemap.xml', { headers: { 'user-agent': UA } });
const sm = await smr.text();
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].slice(ORIGIN.length) || '/');
for (const l of locs) enqueue(splitPath(l) === '' ? '/' : splitPath(l), 'page');
enqueue('/', 'page');
console.log('seed pages:', queue.length);

const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i));
await Promise.all(workers);
await writeFile(STATE_FILE, JSON.stringify(state));
console.log('DONE. fetched:', fetched, 'bytes:', (bytes / 1048576).toFixed(1) + 'MB', 'failed:', Object.keys(state.failed).length);
console.log('failed list:', Object.keys(state.failed).slice(0, 30).join('\n  '));
