import { apps, systems, screens, screenPairs, elements, steps, repositories } from './content.js';
import { sectionHead, appCard, systemCard, screenPair, elementCard, stepCard } from './components.js';

const content = document.querySelector('#portal-content');
content.innerHTML = `
  <section class="content-section section-apps" id="apps">
    ${sectionHead('01 / APPS', '产品跑起来之后，我们做什么。', '三件事：审阅现有产品、理清设计系统、改完代码只查受影响的部分。', `<a class="text-link" href="${repositories.core}">View source on GitHub ↗</a>`)}
    <div class="apps-grid">${apps.map(appCard).join('')}</div>
  </section>
  <section class="content-section section-explore" id="explore">
    ${sectionHead('02 / EXPLORE', '先有系统，再做页面。', '这里是我们自己的设计系统和已走完闭环的项目档案。')}
    <div class="system-grid">${systems.map(systemCard).join('')}</div>
  </section>
  <section class="content-section section-screens" id="screens">
    ${sectionHead('03 / SCREENS', '同一状态，改前改后。', '每一张截图都对应一个真实页面的真实状态。不是素材库。', '<a class="text-link" href="/apps/designer/?case=happyclaw">看完整审阅 ↗</a>')}
    <div class="screen-pairs">${screenPairs.map(screenPair).join('')}</div>
  </section>
  <section class="content-section section-elements" id="elements">
    ${sectionHead('04 / UI ELEMENTS', '拿来就能用的组件。', '每个组件都写清楚了什么时候用、什么时候别用。')}
    <div class="elements-grid">${elements.map(elementCard).join('')}</div>
  </section>
  <section class="get-started" id="get-started">
    <div class="get-started-copy"><p class="kicker">05 / GET STARTED</p><h2>带一个真实产品来。<br><span>走完一次设计闭环。</span></h2><p>本地运行，不需要注册。跑一条命令，五分钟内看到第一次审阅。</p></div>
    <div class="steps-grid">${steps.map(stepCard).join('')}</div>
    <div class="command-card"><div><span>QUICKSTART</span><strong>五分钟本地验证</strong></div><code>pnpm harness onboard --config examples/happyclaw-site/project.json</code><button type="button" data-copy="pnpm harness onboard --config examples/happyclaw-site/project.json">复制命令</button></div>
    <div class="final-actions"><a class="button button-primary" href="${repositories.core}">Open GitHub ↗</a><a class="button button-secondary" href="${repositories.site}">Website source ↗</a></div>
  </section>`;

const track = document.querySelector('#whirl-track');
const count = 64;
function createSpiralPath() {
  const turns = 8 * Math.PI * 2;
  const raw = [];
  const distance = [0];
  for (let index = 0; index <= 16384; index++) {
    const progress = index / 16384;
    const angle = progress * turns;
    const radius = 1875 * (1 - progress);
    raw.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
    if (index) distance.push(distance[index - 1] + Math.hypot(raw[index].x - raw[index - 1].x, raw[index].y - raw[index - 1].y));
  }
  const points = [];
  let cursor = 0;
  for (let index = 0; index <= 4096; index++) {
    const target = index / 4096 * distance[distance.length - 1];
    while (cursor < raw.length - 2 && distance[cursor + 1] < target) cursor++;
    const span = distance[cursor + 1] - distance[cursor] || 1;
    const mix = (target - distance[cursor]) / span;
    const x = raw[cursor].x + (raw[cursor + 1].x - raw[cursor].x) * mix;
    const y = raw[cursor].y + (raw[cursor + 1].y - raw[cursor].y) * mix;
    const next = raw[Math.min(cursor + 2, raw.length - 1)];
    points.push({ x, y, angle: Math.atan2(next.y - y, next.x - x) });
  }
  return points;
}
const spiral = createSpiralPath();
function sampleSpiral(progress) {
  const position = ((progress % 1) + 1) % 1 * (spiral.length - 1);
  const index = Math.min(Math.floor(position), spiral.length - 2);
  const mix = position - index;
  const current = spiral[index];
  const next = spiral[index + 1];
  return { x: current.x + (next.x - current.x) * mix, y: current.y + (next.y - current.y) * mix, angle: current.angle + (next.angle - current.angle) * mix };
}
const orbitTiles = [];
for (let index = 0; index < count; index++) {
  const tile = document.createElement('span');
  tile.className = 'whirl-tile';
  tile.dataset.variant = String(index % 5);
  tile.innerHTML = '<span class="placeholder-top"><i></i><i></i></span><span class="placeholder-panel"></span><span class="placeholder-line"></span><span class="placeholder-line"></span>';
  track.appendChild(tile);
  orbitTiles.push(tile);
}

let toastTimer;
document.addEventListener('click', async event => {
  const button = event.target.closest('[data-copy]');
  if (!button) return;
  const toast = document.querySelector('#toast');
  try { await navigator.clipboard.writeText(button.dataset.copy); toast.textContent = '命令已复制'; }
  catch { toast.textContent = '复制失败，请手动复制'; }
  toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }), { threshold: .12 });
document.querySelectorAll('.content-section, .get-started').forEach(section => observer.observe(section));

const hero = document.querySelector('.hero');
const heroStage = document.querySelector('.hero-scroll-stage');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let orbitPhase = 0;
let previousTime = performance.now();
let previousScroll = window.scrollY;
let smoothedVelocity = 0;
const startedAt = previousTime;
function renderHeroFrame(time) {
  const delta = Math.min(time - previousTime, 150) / 1000;
  previousTime = time;
  const velocity = delta ? (window.scrollY - previousScroll) / delta : 0;
  previousScroll = window.scrollY;
  smoothedVelocity += (velocity - smoothedVelocity) * Math.min(1, delta / .22);
  const progress = heroStage ? Math.min(1, Math.max(0, -heroStage.getBoundingClientRect().top / Math.max(1, heroStage.offsetHeight))) : 0;
  hero?.style.setProperty('--hero-progress', progress.toFixed(3));
  hero?.style.setProperty('--field-progress', Math.min(1, Math.max(0, (progress - .4) / .45)).toFixed(3));
  if (!reduceMotion.matches) {
    const intro = time - startedAt;
    const launchBoost = intro < 1900 ? 1 + 23 * (intro < 600 ? (intro / 600) ** 2 : 1) * (1 - intro / 1900) ** 2 : 1;
    orbitPhase += .0032 * (1 + Math.abs(smoothedVelocity) / 1000 * 8) * launchBoost * delta;
  }
  orbitTiles.forEach((tile, index) => {
    const pathProgress = (orbitPhase + index / count) % 1;
    const point = sampleSpiral(pathProgress);
    const distance = Math.hypot(point.x, point.y);
    const remappedRadius = 1875 * (distance / 1875) ** 1.0526315789473684;
    const radiusRatio = distance ? remappedRadius / distance : 1;
    const scale = Math.min(remappedRadius / 1875, 1) ** .35;
    let opacity = 1;
    if (pathProgress < .08) opacity = pathProgress / .08;
    else if (pathProgress > .92) opacity = (1 - pathProgress) / .08;
    tile.style.left = `${50 + point.x * radiusRatio / 2500 * 100}%`;
    tile.style.top = `${50 + point.y * radiusRatio / 2500 * 100}%`;
    tile.style.transform = `translate(-50%,-50%) rotate(${point.angle}rad) scale(${scale})`;
    tile.style.opacity = opacity.toFixed(3);
  });
  requestAnimationFrame(renderHeroFrame);
}
requestAnimationFrame(renderHeroFrame);
