import * as zh from './content.zh.js';
import * as en from './content.en.js';
import { repositories, heroScreens } from './content.js';
import { startWhirl } from './whirl.js';

const LANG_KEY = 'pd-lang';
let lang = localStorage.getItem(LANG_KEY) || 'zh';
const t = () => lang === 'zh' ? zh : en;

// -- language switcher --
function renderLangSwitch() {
  const existing = document.getElementById('lang-switch');
  if (existing) return;
  const nav = document.querySelector('header nav') || document.querySelector('.nav nav');
  if (!nav) return;
  const switcher = document.createElement('div');
  switcher.id = 'lang-switch';
  switcher.style.cssText = 'display:flex;gap:2px;margin-left:12px';
  for (const code of ['zh', 'en']) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.lang = code;
    btn.textContent = code === 'zh' ? '中文' : 'EN';
    btn.style.cssText = `border:1px solid rgba(255,255,255,.15);background:${lang === code ? 'rgba(255,255,255,.12)' : 'none'};color:${lang === code ? 'inherit' : 'rgba(255,255,255,.4)'};padding:3px 10px;border-radius:6px;font:500 11px/1 inherit;cursor:pointer`;
    btn.addEventListener('click', () => setLang(code));
    switcher.appendChild(btn);
  }
  nav.appendChild(switcher);
}

function setLang(code) {
  lang = code;
  localStorage.setItem(LANG_KEY, code);
  renderContent();
}

// -- render all sections from the active language pack --
function renderContent() {
  const c = t();

  // hero
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = lang === 'zh' ? 'HappyHands — 持续在线的 AI 产品设计师' : 'HappyHands — AI Product Designer';
  const eyebrow = document.querySelector('.eyebrow');
  if (eyebrow) eyebrow.innerHTML = c.hero.eyebrow.map(s => `<span>${s}</span>`).join('');
  const h1 = document.querySelector('h1');
  if (h1) h1.innerHTML = lang === 'zh'
    ? `${c.hero.h1}<span>${c.hero.h1Accent}</span>${c.hero.h1Suffix}`
    : `${c.hero.h1}<span>${c.hero.h1Accent}</span>${c.hero.h1Suffix}`;
  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy) heroCopy.textContent = c.hero.copy;
  const primary = document.querySelector('.button-primary');
  if (primary) primary.textContent = c.hero.cta;
  const secondary = document.querySelector('.button-secondary');
  if (secondary) secondary.innerHTML = `${c.hero.ctaSecondary} <span aria-hidden="true">↗</span>`;
  const scrollNote = document.querySelector('.scroll-note');
  if (scrollNote) scrollNote.innerHTML = `${c.ui.scrollNote} <span>↓</span>`;

  // sections
  const content = document.querySelector('#portal-content');
  if (content) {
    content.innerHTML = `
    <section class="content-section section-apps" id="apps">
      <div class="section-head"><div><p class="kicker">${c.sections.apps.kicker}</p><h2>${c.sections.apps.title}</h2></div><div><p>${c.sections.apps.copy}</p><a class="text-link" href="${repositories.core}">${c.sections.apps.link}</a></div></div>
      <div class="apps-grid">${c.apps.map(appCard).join('')}</div>
    </section>
    <section class="content-section section-explore" id="explore">
      <div class="section-head"><div><p class="kicker">${c.sections.explore.kicker}</p><h2>${c.sections.explore.title}</h2></div><div><p>${c.sections.explore.copy}</p></div></div>
      <div class="system-grid">${c.systems.map(systemCard).join('')}</div>
    </section>
    <section class="content-section section-screens" id="screens">
      <div class="section-head"><div><p class="kicker">${c.sections.screens.kicker}</p><h2>${c.sections.screens.title}</h2></div><div><p>${c.sections.screens.copy}</p><a class="text-link" href="/apps/designer/?case=happyclaw">${c.sections.screens.link}</a></div></div>
      <div class="screen-pairs">${c.screenPairs.map(pairCard).join('')}</div>
    </section>
    <section class="content-section section-elements" id="elements">
      <div class="section-head"><div><p class="kicker">${c.sections.elements.kicker}</p><h2>${c.sections.elements.title}</h2></div><div><p>${c.sections.elements.copy}</p></div></div>
      <div class="elements-grid">${c.elements.map(elementCard).join('')}</div>
    </section>
    <section class="get-started" id="get-started">
      <div class="get-started-copy"><p class="kicker">${c.sections.getStarted.kicker}</p><h2>${c.sections.getStarted.title}<br><span>${c.sections.getStarted.titleLine2}</span></h2><p>${c.sections.getStarted.copy}</p></div>
      <div class="steps-grid">${c.steps.map(stepCard).join('')}</div>
      <div class="command-card"><div><span>${c.sections.getStarted.quickstartLabel}</span><strong>${c.sections.getStarted.quickstartTitle}</strong></div><code>pnpm harness onboard --config examples/happyclaw-site/project.json</code><button type="button" data-copy="pnpm harness onboard --config examples/happyclaw-site/project.json">${c.sections.getStarted.copyBtn}</button></div>
      <div class="final-actions"><a class="button button-primary" href="${repositories.core}">GitHub ↗</a><a class="button button-secondary" href="${repositories.site}">${lang === 'zh' ? '网站源码 ↗' : 'Website source ↗'}</a></div>
    </section>`;
  }

  // footer
  const footer = document.querySelector('footer');
  if (footer) {
    footer.innerHTML = `<span>${c.ui.footer.left}</span><span>${c.ui.footer.middle}</span><a href="${repositories.core}">${c.ui.footer.right}</a>`;
  }

  // re-observe sections for intersection animation
  observeSections();
}

// -- card builders (use the active language pack) --
function appCard(item) {
  const c = t();
  return `<article class="app-card"><div class="card-top"><span>${item.index}</span><span class="state">${item.state}</span></div><h3>${item.title}</h3><p>${item.description}</p><ul>${item.meta.map(v => `<li>${v}</li>`).join('')}</ul><a href="${item.href || repositories.core}">${item.action} <span aria-hidden="true">↗</span></a></article>`;
}

function systemCard(item) {
  return `<article class="system-card"><div class="system-preview">${item.values.map((v, i) => `<span style="--i:${i}">${v}</span>`).join('')}</div><p class="card-tag">${item.tag}</p><h3>${item.title}</h3><p>${item.description}</p><div class="chips">${item.traits.map(v => `<span>${v}</span>`).join('')}</div><a class="card-link" href="${item.href || repositories.core}">${item.link || 'View ↗'}</a></article>`;
}

function pairCard(item) {
  return `<article class="screen-pair"><div class="pair-head"><div><p class="card-tag">${item.task}</p><h3>${item.title}</h3></div><span>${item.result}</span></div><div class="pair-images"><figure><span>${item.beforeLabel}</span><img src="${item.before.src}" alt="${item.before.caption}" loading="lazy"></figure><div class="pair-arrow" aria-hidden="true">→</div><figure><span>${item.afterLabel}</span><img src="${item.after.src}" alt="${item.after.caption}" loading="lazy"></figure></div></article>`;
}

const previews = {
  button: `<div class="element-demo demo-buttons"><button>Run review</button><button>View evidence</button><button disabled>Publishing</button></div>`,
  input: `<div class="element-demo demo-input"><label>Repository URL</label><div>github.com/your/product <span>READY</span></div></div>`,
  status: `<div class="element-demo demo-status"><span>OBSERVED</span><span>CANDIDATE</span><span>APPROVED</span></div>`,
  tokens: `<div class="element-demo demo-tokens"><i></i><i></i><i></i><i></i><i></i></div>`,
  tabs: `<div class="element-demo demo-tabs"><span>Diagnose</span><span>Foundation</span><span>Visual QA</span></div>`,
  progress: `<div class="element-demo demo-progress"><span></span><span></span><span></span><span></span><span></span></div>`,
  empty: `<div class="element-demo demo-empty"><i>＋</i><strong>No reviews yet</strong><span>Connect a product to begin</span></div>`,
  dialog: `<div class="element-demo demo-dialog"><strong>Apply this direction?</strong><p>3 screens will be updated.</p><div><button>Cancel</button><button>Apply</button></div></div>`,
  card: `<div class="element-demo demo-card"><span>DESIGN FOUNDATION</span><strong>SaaS workspace</strong><p>12 tokens · 8 components</p><i>READY</i></div>`,
};

function elementCard(item) {
  return `<article class="element-card">${previews[item.kind]}<p class="card-tag">UI ELEMENT</p><h3>${item.title}</h3><p>${item.description}</p></article>`;
}

function stepCard(item) {
  return `<article class="step-card"><span>${item[0]}</span><h3>${item[1]}</h3><p>${item[2]}</p></article>`;
}

// -- scroll animations --
let observer;
function observeSections() {
  observer?.disconnect();
  observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }), { threshold: .12 });
  document.querySelectorAll('.content-section, .get-started').forEach(s => observer.observe(s));
}

// -- hero scroll (exact appllama motion model, smooth per-frame interpolation) --
// Their formula: scrollYProgress from useScroll, then:
//   opacity = map(p, [0,.35], [1,0]);  scale = map(p, [0,.35], [1,.88]);
//   bgOpacity = map(p, [.4,.85], [1,0]);
// We replicate with a rAF loop that lerps toward the scroll target each frame.
const heroStage = document.querySelector('.hero-scroll-stage');
const heroCenter = document.querySelector('.hero-center');
const heroWhirlHost = document.querySelector('.hero-whirl-host');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let _p = 0, _target = 0, _raf = null;

function _map(v, [a, b], [c, d]) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return c + t * (d - c);
}
function _progress() {
  if (!heroStage) return 0;
  const r = heroStage.getBoundingClientRect();
  const travel = r.height - innerHeight;
  return travel <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / travel));
}
function _tick() {
  _p += (_target - _p) * 0.08;
  if (Math.abs(_target - _p) < 0.001) _p = _target;
  if (heroCenter) {
    heroCenter.style.opacity = _map(_p, [0, .35], [1, 0]).toFixed(4);
    heroCenter.style.transform = `scale(${_map(_p, [0, .35], [1, .88]).toFixed(4)})`;
  }
  if (heroWhirlHost) heroWhirlHost.style.opacity = _map(_p, [.4, .85], [1, 0]).toFixed(4);
  if (Math.abs(_target - _p) >= 0.001) _raf = requestAnimationFrame(_tick);
  else _raf = null;
}
function _onScroll() {
  _target = _progress();
  if (reduceMotion.matches) {
    if (heroCenter) { heroCenter.style.opacity = '1'; heroCenter.style.transform = 'none'; }
    if (heroWhirlHost) heroWhirlHost.style.opacity = '0.5';
    return;
  }
  if (!_raf) _raf = requestAnimationFrame(_tick);
}
addEventListener('scroll', _onScroll, { passive: true });
_onScroll();

// -- appllama hero whirl (exact motion model, real screenshots) --
const whirlHost = document.querySelector('.hero-whirl-host') || (() => {
  // create the host if not in HTML
  const hero = document.querySelector('.hero');
  if (!hero) return null;
  const host = document.createElement('div');
  host.className = 'hero-whirl-host';
  hero.insertBefore(host, hero.firstChild);
  return host;
})();
if (whirlHost && heroScreens?.length) {
  startWhirl(whirlHost, heroScreens);
}

// -- copy to clipboard --
let toastTimer;
document.addEventListener('click', async e => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    const toast = document.querySelector('#toast');
    if (toast) { toast.querySelector('span').textContent = lang === 'zh' ? '已复制' : 'Copied'; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 1800); }
  } catch { /* clipboard denied */ }
});

// -- boot --
renderLangSwitch();
renderContent();
