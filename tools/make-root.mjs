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
      '.whirl-field-canvas{display:none!important}',
      '[class*="HeroUfoMascot_stage"], [class*="HeroUfoMascot_surpriseMarks"]{display:none!important}',
      '[data-hero-ufo]{display:flex!important;align-items:center;justify-content:center}',
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
      '.pd-placeholder-grid .pd-box{aspect-ratio:4/3}',
      '.pd-hero-mark{position:relative;width:64px;height:64px;border-radius:999px;border:1px solid rgba(240,220,200,.55);display:flex;align-items:center;justify-content:center;margin-bottom:14px;box-shadow:0 0 0 1px rgba(240,220,200,.12),0 18px 50px -18px rgba(240,220,200,.35)}',
      '.pd-hero-mark span{font:600 17px/1 -apple-system,"Segoe UI","PingFang SC",sans-serif;letter-spacing:-.03em;color:rgb(240 220 200)}',
      '.pd-hero-mark i{position:absolute;inset:-7px;border-radius:999px;border:1px dashed rgba(240,220,200,.25);animation:pd-orbit 14s linear infinite}',
      '@keyframes pd-orbit{to{transform:rotate(360deg)}}',
      '@media (prefers-reduced-motion: reduce){.pd-hero-mark i{animation:none}}'
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

    /* mascot: their stage is hidden by CSS; the slot becomes a monogram mark —
       a finished-looking placeholder for our future mascot, wrapped in their
       fade-up container so the entrance animation still plays */
    var ufoSlot = document.querySelector('[data-hero-ufo]');
    if (ufoSlot && !ufoSlot.querySelector('.pd-hero-mark')) {
      var ph = document.createElement('div');
      ph.className = 'pd-hero-mark';
      ph.innerHTML = '<i></i><span>co</span>';
      ph.setAttribute('title', '吉祥物占位');
      ufoSlot.appendChild(ph);
    }

    /* our whirl canvas over the hero (their canvas is hidden) */
    var hero = document.querySelector('section.sticky');
    if (hero && !hero.querySelector('.pd-canvas')) {
      var cv = document.createElement('canvas');
      cv.className = 'pd-canvas';
      hero.insertBefore(cv, hero.firstChild);
      startWhirl(cv);
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

    /* ---------- our whirl: orbiting tiles from both exported runs ---------- */
  function startWhirl(canvas) {
    var ctx = canvas.getContext('2d');
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var SCREENS = [
      { src: '/runs/06dabc2c/before/desktop.png', w: 150, h: 94 },
      { src: '/runs/06dabc2c/after/desktop.png', w: 150, h: 94 },
      { src: '/runs/8f60c961/before/desktop.png', w: 150, h: 94 },
      { src: '/runs/06dabc2c/before/mobile.png', w: 64, h: 138 },
      { src: '/runs/06dabc2c/after/mobile.png', w: 64, h: 138 },
      { src: '/runs/8f60c961/before/mobile.png', w: 64, h: 138 }
    ];
    var images = SCREENS.map(function (s) { var im = new Image(); im.src = s.src; return { image: im, w: s.w, h: s.h }; });
    var tiles = [];
    for (var i = 0; i < 20; i++) {
      tiles.push({
        image: images[i % images.length],
        angle: (i / 20) * Math.PI * 2 + Math.random() * 0.25,
        radius: 0.32 + Math.random() * 0.3,
        speed: (0.00008 + Math.random() * 0.00022) * (i % 2 ? 1 : -1),
        scale: 0.7 + Math.random() * 0.6,
        tilt: (Math.random() - 0.5) * 0.22,
        alpha: 0.4 + Math.random() * 0.45
      });
    }
    var dots = [];
    for (var j = 0; j < 220; j++) {
      dots.push({ radius: 0.3 + Math.random() * 0.62, angle: Math.random() * Math.PI * 2, speed: (0.00016 + Math.random() * 0.0006) * (Math.random() < 0.5 ? 1 : -1), size: 0.6 + Math.random() * 1.8, alpha: 0.08 + Math.random() * 0.3 });
    }
    function resize() {
      canvas.width = canvas.parentElement.clientWidth * DPR;
      canvas.height = canvas.parentElement.clientHeight * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    var on = false;
    function frame() {
      if (!on) { on = true; canvas.style.opacity = '1'; }
      var w = canvas.width / DPR, h = canvas.height / DPR, rMax = Math.max(w, h) / 2;
      ctx.clearRect(0, 0, w, h);
      for (var d = 0; d < dots.length; d++) {
        var p = dots[d]; p.angle += p.speed * 16;
        ctx.fillStyle = 'rgba(240,220,200,' + p.alpha + ')';
        ctx.beginPath();
        ctx.arc(w / 2 + Math.cos(p.angle) * p.radius * rMax, h / 2 + Math.sin(p.angle) * p.radius * rMax, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      for (var t = 0; t < tiles.length; t++) {
        var tile = tiles[t]; tile.angle += tile.speed * 16;
        if (!tile.image.image.complete || tile.image.image.naturalWidth === 0) continue;
        var r = tile.radius * rMax;
        var x = w / 2 + Math.cos(tile.angle) * r;
        var y = h / 2 + Math.sin(tile.angle) * r * 0.72;
        var tw = tile.image.w * tile.scale, th = tile.image.h * tile.scale;
        ctx.save();
        ctx.globalAlpha = tile.alpha;
        ctx.translate(x, y);
        ctx.rotate(tile.tilt + Math.sin(tile.angle) * 0.06);
        ctx.beginPath();
        ctx.roundRect(-tw / 2, -th / 2, tw, th, 10);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(tile.image.image, -tw / 2, -th / 2, tw, th);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = tile.alpha * 0.5;
        ctx.strokeStyle = 'rgba(240,220,200,0.55)';
        ctx.lineWidth = 1;
        ctx.translate(x, y);
        ctx.rotate(tile.tilt + Math.sin(tile.angle) * 0.06);
        ctx.beginPath();
        ctx.roundRect(-tw / 2, -th / 2, tw, th, 10);
        ctx.stroke();
        ctx.restore();
      }
      requestAnimationFrame(frame);
    }
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(frame);
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
