import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const SRC = fileURLToPath(new URL('./source/home.html', import.meta.url));
const DST = fileURLToPath(new URL('../apps/appllama-full/index.html', import.meta.url));
const injector = `
<script>
(function () {
  if (!document.getElementById('pd-cloak')) {
    var c = document.createElement('style');
    c.id = 'pd-cloak';
    c.textContent = 'html{background:#141414}body{opacity:0!important}html.pd-ready body{opacity:1!important;transition:opacity .35s ease}';
    document.currentScript.parentElement.appendChild(c);
  }
  function reveal() { document.documentElement.classList.add('pd-ready'); }
  setTimeout(reveal, 4500);
  function swap() {
    document.title = 'Creative OS — 完整展示';
    document.documentElement.lang = 'zh-CN';
    var h1 = document.querySelector('h1');
    if (h1 && h1.textContent.indexOf('Discover') === 0) h1.innerHTML = '跑得起来的产品，也该像被<span class="theme-accent-word text-accent">设计过</span>。';
    var sub = document.querySelector('h1 + p');
    if (sub && sub.textContent.indexOf('Every onboarding') === 0) sub.textContent = '采集证据、诊断、一次限定范围的修改、重新渲染、人的判定。';
    var s2 = document.querySelector('main section h2');
    if (s2 && s2.textContent.indexOf('The top of the') === 0) s2.innerHTML = '一个闭环，七步都留<span class="theme-accent-word text-accent">证据</span>。';
    document.querySelectorAll('button, a, h2, p').forEach(function (el) {
      var t = el.textContent.trim();
      if (t === 'Start free') el.textContent = '开始使用';
      else if (t === 'Keep exploring') el.textContent = '继续探索';
      else if (t === 'Browse apps') el.textContent = '浏览目录';
      else if (t === 'Get everything with Pro') el.textContent = '了解产品';
      else if (t.indexOf('Come do it') === 0) el.innerHTML = '现在，从一个<span class="theme-accent-word text-accent">真实的应用</span>开始。';
    });
    var fp = document.querySelector('.site-footer-fineprint');
    if (fp && fp.textContent.indexOf('Appllama') >= 0) fp.textContent = '© 2026 Creative OS · 完整展示版（对方内容仅作参考）';
  }
  function boot() { swap(); reveal(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setInterval(swap, 1500);
})();
</script>`;
let html = readFileSync(SRC, 'utf8');
html = html.replace('</head>', injector + '\n</head>');
writeFileSync(DST, html);
console.log('written:', html.length, 'bytes');
