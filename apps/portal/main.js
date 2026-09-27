import { apps, systems, screens, screenPairs, elements, steps, repositories } from './content.js';
import { sectionHead, appCard, systemCard, screenPair, elementCard, stepCard } from './components.js';

const content = document.querySelector('#portal-content');
content.innerHTML = `
  <section class="content-section section-apps" id="apps">
    ${sectionHead('01 / APPS', 'What HappyHands does after the first build.', '三个入口对应同一个目标：让独立开发者得到持续、可验证、能沉淀的产品设计能力。', `<a class="text-link" href="${repositories.core}">View source on GitHub ↗</a>`)}
    <div class="apps-grid">${apps.map(appCard).join('')}</div>
  </section>
  <section class="content-section section-explore" id="explore">
    ${sectionHead('02 / EXPLORE', 'Start from a system, then make it yours.', '浏览 HappyHands 已沉淀的项目系统和预设模板。每套都包含 Token、组件、状态和适用场景。')}
    <div class="system-grid">${systems.map(systemCard).join('')}</div>
  </section>
  <section class="content-section section-screens" id="screens">
    ${sectionHead('03 / SCREENS', 'The same state, before and after.', '截图不是装饰素材。每一张都属于一个可复现的页面状态、视口和 run。', '<a class="text-link" href="/apps/designer/?case=happyclaw">Open the full review ↗</a>')}
    <div class="screen-pairs">${screenPairs.map(screenPair).join('')}</div>
  </section>
  <section class="content-section section-elements" id="elements">
    ${sectionHead('04 / UI ELEMENTS', 'Reusable templates, ready for product work.', '浏览可直接用于审阅、生成和整改的组件模板。每个模板都带状态、语义 Token 和使用边界。')}
    <div class="elements-grid">${elements.map(elementCard).join('')}</div>
  </section>
  <section class="get-started" id="get-started">
    <div class="get-started-copy"><p class="kicker">05 / GET STARTED</p><h2>Bring one real product.<br><span>Leave with a design loop.</span></h2><p>当前版本以本地 Harness 运行。它会验证仓库、启动预览、建立 run，并把截图、发现、修改和判定留在项目里。</p></div>
    <div class="steps-grid">${steps.map(stepCard).join('')}</div>
    <div class="command-card"><div><span>QUICKSTART</span><strong>Five-minute local proof</strong></div><code>pnpm harness onboard --config examples/happyclaw-site/project.json</code><button type="button" data-copy="pnpm harness onboard --config examples/happyclaw-site/project.json">复制命令</button></div>
    <div class="final-actions"><a class="button button-primary" href="${repositories.core}">Open GitHub ↗</a><a class="button button-secondary" href="${repositories.site}">Website source ↗</a></div>
  </section>`;

const track = document.querySelector('#whirl-track');
const count = 32;
for (let index = 0; index < count; index++) {
  const angle = (index / count) * Math.PI * 2;
  const radius = 31 + (index % 4) * 4;
  const tile = document.createElement('span');
  tile.className = 'whirl-tile';
  tile.style.setProperty('--x', `${50 + Math.cos(angle) * radius}%`);
  tile.style.setProperty('--y', `${50 + Math.sin(angle) * radius}%`);
  tile.style.setProperty('--r', `${angle + Math.PI / 2}rad`);
  tile.style.setProperty('--s', String(.68 + (index % 5) * .08));
  tile.dataset.variant = String(index % 4);
  tile.innerHTML = '<span class="placeholder-bar"></span><span class="placeholder-line"></span><span class="placeholder-line"></span>';
  track.appendChild(tile);
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
let heroFrame = 0;
let orbitAnimation;
function updateHeroScroll() {
  heroFrame = 0;
  if (!hero || !heroStage || reduceMotion.matches) {
    hero?.style.setProperty('--hero-progress', '0');
    if (orbitAnimation) orbitAnimation.playbackRate = 0;
    return;
  }
  const travel = Math.max(1, heroStage.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -heroStage.getBoundingClientRect().top / travel));
  const easedProgress = 1 - Math.pow(1 - progress, 3);
  hero.style.setProperty('--hero-progress', easedProgress.toFixed(3));
  orbitAnimation ||= track?.getAnimations()[0];
  if (orbitAnimation) orbitAnimation.playbackRate = 1 + easedProgress * 7;
}
function requestHeroScroll() {
  if (!heroFrame) heroFrame = requestAnimationFrame(updateHeroScroll);
}
window.addEventListener('scroll', requestHeroScroll, { passive: true });
window.addEventListener('resize', requestHeroScroll);
reduceMotion.addEventListener?.('change', requestHeroScroll);
updateHeroScroll();
