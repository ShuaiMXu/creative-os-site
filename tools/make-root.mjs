// Site root = appllama's home.html verbatim (their app hydrates and runs),
// plus an injector that (1) swaps visible copy post-hydration and (2) removes
// every appllama-visible element, leaving clearly-marked placeholders and our
// own whirl canvas drawn from public/runs captures. All operations are
// idempotent and re-asserted, so React re-renders cannot restore what was
// removed.
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'C:/Users/A、/AppData/Local/Temp/appllama/site/home.html';
const DST = 'C:/Users/A、/Documents/Codex/2026-09-14/referenced-chatgpt-conversation-this-is-an/outputs/creative-os-site/index.html';

const injector = `
<script>
(function () {
  var PD_HERO_DEADLINE = Date.now() + 6000;
  /* ---------- pre-paint cloak: their English page must never flash.
     Head styles survive hydration re-renders (body nodes do not), so this is
     safe to install during parse. ---------- */
  if (!document.getElementById('pd-cloak')) {
    var cloak = document.createElement('style');
    cloak.id = 'pd-cloak';
    cloak.textContent = 'html{background:#141414}body{opacity:0!important}html.pd-ready body{opacity:1!important;transition:opacity .35s ease}';
    document.currentScript.parentElement.appendChild(cloak);
  }
  function reveal() { document.documentElement.classList.add('pd-ready'); }
  setTimeout(reveal, 4500); /* safety: never leave the page invisible */

  /* ---------- styles: hide their brand elements; placeholders look deliberate.
     Created only after hydration — injecting into <head> during parse is itself
     a hydration mismatch (React #418) that wipes our nodes on the re-render. ---------- */
  function ensureStyle() {
    if (document.getElementById('pd-swap-style')) return;
    var st = document.createElement('style');
    st.id = 'pd-swap-style';
    st.textContent = [
      'header img[alt="Appllama"]{display:none!important}',
      'img[src*="cloud.appllama.io"]{visibility:hidden!important}',
      /* their hero ships complete: mascot, whirl canvas and entrance effects stay.
       A stylesheet !important keeps their inline display:none on the mascot
       wrapper from winning — React rewrites it, but inline non-important loses. */
      '[data-hero-ufo]{display:block!important}',
      '.footer-ink-cap .wm-stage, footer .wm-stage{display:none!important}',
      'a[href^="https://x.com/appllama"], a[href^="https://www.linkedin.com/company/appllama"], a[href^="https://www.producthunt.com/products/appllama"]{display:none!important}',
      'a[href="/terms"], a[href="/privacy"], a[href="/refund"], a[href="/copyright"], a[href="/support"], a[href="/public-works"], a[href="https://studio.appllama.io/"]{display:none!important}',
      /* their middle nav (dead routes), search and Go Pro */
      'header nav a[href="/apps"], header nav a[href="/explore"], header nav a[href="/pricing"], header nav a[href="/screens"], header nav a[href="/flows"], header nav a[href="/elements"], header nav a[href="/mcp"]{display:none!important}',
      'header [aria-label*="Search" i], header a[href="/pricing"][class*="rounded-full"]{display:none!important}',
      /* our placeholders */
      '.pd-box{display:flex;align-items:center;justify-content:center;border:1.5px dashed rgba(240,220,200,.35);border-radius:18px;color:rgba(240,220,200,.55);font:500 12px/1.4 ui-monospace,monospace;letter-spacing:.18em;text-align:center;white-space:pre-line}',
      '.pd-brand{font:600 17px/1 -apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;letter-spacing:-.02em;color:#f7f7f7}',
      '.pd-brand i{display:block;margin-top:4px;font:500 9px/1 ui-monospace,monospace;letter-spacing:.3em;font-style:normal;color:rgb(240 220 200)}',
      '.pd-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity 1.5s ease-out}',
      '.pd-placeholder-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;max-width:1440px;margin:48px auto 0;padding:0 clamp(20px,3vw,40px)}',
      '.pd-placeholder-grid .pd-box{aspect-ratio:4/3}'
    ].join('\\n');
    document.head.appendChild(st);
  }

  /* ---------- element swaps (idempotent, marked with data-pd) ---------- */
  function mark(el, fn) { if (el && !el.dataset.pd) { el.dataset.pd = '1'; fn(el); } }

  function swap() {
    ensureStyle();
    document.title = 'Creative OS — Product Designer';
    document.documentElement.lang = 'zh-CN';

    /* their nav labels by text (dead routes), search and Go Pro buttons */
    document.querySelectorAll('header a, header button').forEach(function (el) {
      var t = (el.innerText || '').trim();
      var head = t.split('\\n')[0];
      if (['Apps', 'Explore', 'Pricing', 'Screens', 'Flows', 'UI Elements', 'Search', 'Go Pro'].indexOf(head) >= 0 || head.indexOf('MCP') === 0) el.style.display = 'none';
      if (t === 'Get started') { el.style.display = 'inline-flex'; el.textContent = '打开 Workbench'; if (el.tagName === 'A') el.setAttribute('href', '/apps/designer/?case=happyclaw'); }
    });

    /* copy */
    var h1 = document.querySelector('h1');
    if (h1 && h1.textContent.indexOf('Discover') === 0) h1.innerHTML = '跑得起来的产品，也该像被<span class="theme-accent-word text-accent">设计过</span>。';
    var sub = document.querySelector('h1 + p');
    if (sub && sub.textContent.indexOf('Every onboarding') === 0) sub.textContent = '采集证据、诊断、一次限定范围的修改、重新渲染、人的判定——agent 只负责改代码，闭环由本地 Harness 掌管。';
    var s2 = document.querySelector('main section h2');
    if (s2 && s2.textContent.indexOf('The top of the') === 0) s2.innerHTML = '一个闭环，七步都留<span class="theme-accent-word text-accent">证据</span>。';
    document.querySelectorAll('button, a, h2, p').forEach(function (el) {
      var t = el.textContent.trim();
      if (t === 'Start free') el.textContent = '开始使用';
      else if (t === 'Keep exploring') el.textContent = '继续探索';
      else if (t === 'Browse apps') el.textContent = '浏览目录';
      else if (t === 'Get everything with Pro') el.textContent = '了解产品';
      else if (t.indexOf('Come do it') === 0) el.innerHTML = '现在，从一个<span class="theme-accent-word text-accent">真实的应用</span>开始。';
      else if (t.indexOf('Every onboarding step') === 0) el.textContent = '把你的应用接进闭环——基线、证据、一次修改、一次判定，都留在你自己的机器上。';
      else if (t === 'Studio') { el.textContent = '产品页'; el.setAttribute('href', '/apps/web/'); }
      else if (t === 'Public works') { el.textContent = 'Workbench'; el.setAttribute('href', '/apps/designer/?case=happyclaw'); }
    });
    var fp = document.querySelector('.site-footer-fineprint');
    if (fp && fp.textContent.indexOf('Appllama') >= 0) fp.textContent = '© 2026 Creative OS · 素材为占位，后续替换';

    /* logo -> our wordmark inside their link */
    var logoLink = document.querySelector('header a[href="/"]');
    if (logoLink) mark(logoLink, function (el) {
      var brand = document.createElement('span');
      brand.className = 'pd-brand';
      brand.innerHTML = 'creative os<i>PORTAL</i>';
      el.appendChild(brand);
    });

    /* hero: their complete hero ships as-is — mascot, whirl canvas and
       entrance effects are theirs, untouched. One fight: their component
       writes inline display:none on the mascot wrapper until its entrance
       controller fires, and React re-writes it on every render; when that
       controller half-fails (offline, headless) the mascot never appears.
       After 6s, every swap pass forces the wrapper open so their own fadeUp
       can finish — a no-op wherever their controller already revealed it. */
    if (Date.now() > PD_HERO_DEADLINE) {
      var ufoEl = document.querySelector('[data-hero-ufo]');
      if (ufoEl && ufoEl.style.display === 'none') ufoEl.style.display = 'block';
    }

    /* catalog: keep the swapped H2 section, hide the rest of that sheet, add placeholder grid */
    var sheet = document.querySelector('main .relative.z-10');
    if (sheet) {
      var keep = sheet.querySelector('section');
      Array.prototype.forEach.call(sheet.children, function (child) {
        if (child !== keep && !child.classList.contains('pd-placeholder-grid') && child.tagName !== 'PDKEEP') child.style.display = 'none';
      });
      if (!sheet.querySelector('.pd-placeholder-grid')) {
        var grid = document.createElement('div');
        grid.className = 'pd-placeholder-grid';
        for (var i = 0; i < 6; i++) {
          var box = document.createElement('div');
          box.className = 'pd-box';
          box.textContent = '案例截图\\n占位 ' + (i + 1);
          grid.appendChild(box);
        }
        var pb = document.createElement('div');
        pb.className = 'pd-box';
        pb.style.cssText = 'aspect-ratio:4/3;margin:14px clamp(20px,3vw,40px) 0;max-width:calc(100% - 80px)';
        pb.textContent = '目录大区占位 · 换成我们自己的案例与截图';
        grid.appendChild(pb);
        sheet.appendChild(grid);
      }
    }

    /* trusted-by logo wall inside the ink-cap block */
    document.querySelectorAll('div').forEach(function (el) {
      if (el.children.length > 3 && el.textContent.indexOf('Trusted by design teams') === 0) el.style.display = 'none';
    });

    /* footer wordmark placeholder */
    var foot = document.querySelector('footer');
    if (foot && !foot.querySelector('.pd-wm')) {
      var wm = document.createElement('div');
      wm.className = 'pd-wm pd-box';
      wm.style.cssText = 'margin:24px auto 0;max-width:420px;height:72px';
      wm.textContent = '巨型字标\\n占位';
      foot.insertBefore(wm, foot.firstChild);
    }
  }

  

  /* First pass as soon as the DOM exists — before hydration re-renders —
     then reveal the page. The cloak above guarantees the English original
     never paints. The interval keeps re-asserting against re-renders. */
  var started = false;
  function begin() { if (started) return; started = true; swap(); reveal(); setInterval(swap, 1200); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', begin);
  else begin();
})();
</script>`;

let html = readFileSync(SRC, 'utf8');
html = html.replace('</head>', injector + '\n</head>');
writeFileSync(DST, html);
console.log('written, bytes:', html.length);
