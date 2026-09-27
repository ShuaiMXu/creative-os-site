import { apps, systems, screens, elements, steps, repositories } from './content.js';
import { sectionHead, appCard, systemCard, screenCard, elementCard, stepCard } from './components.js';

const content = document.querySelector('#portal-content');
content.innerHTML = `
  <section class="content-section section-apps" id="apps">
    ${sectionHead('01 / APPS', 'What HappyHands does after the first build.', '三个入口对应同一个目标：让独立开发者得到持续、可验证、能沉淀的产品设计能力。', `<a class="text-link" href="${repositories.core}">View source on GitHub ↗</a>`)}
    <div class="apps-grid">${apps.map(appCard).join('')}</div>
  </section>
  <section class="content-section section-explore" id="explore">
    ${sectionHead('02 / EXPLORE', 'Design systems become project memory.', '这里展示的不是灵感图库，而是每个项目被提取、确认和持续治理的视觉语言。')}
    <div class="system-grid">${systems.map(systemCard).join('')}</div>
  </section>
  <section class="content-section section-screens" id="screens">
    ${sectionHead('03 / SCREENS', 'The same state, before and after.', '截图不是装饰素材。每一张都属于一个可复现的页面状态、视口和 run。', '<a class="text-link" href="/apps/designer/?case=happyclaw">Open the full review ↗</a>')}
    <div class="screens-grid">${screens.map(screenCard).join('')}</div>
  </section>
  <section class="content-section section-elements" id="elements">
    ${sectionHead('04 / UI ELEMENTS', 'Components with evidence, states and rules.', '从已有产品提取组件，再补齐状态、语义 Token、使用规则和可追溯来源。')}
    <div class="elements-grid">${elements.map(elementCard).join('')}</div>
  </section>
  <section class="get-started" id="get-started">
    <div class="get-started-copy"><p class="kicker">05 / GET STARTED</p><h2>Bring one real product.<br><span>Leave with a design loop.</span></h2><p>当前版本以本地 Harness 运行。它会验证仓库、启动预览、建立 run，并把截图、发现、修改和判定留在项目里。</p></div>
    <div class="steps-grid">${steps.map(stepCard).join('')}</div>
    <div class="command-card"><div><span>QUICKSTART</span><strong>Five-minute local proof</strong></div><code>pnpm harness onboard --config examples/happyclaw-site/project.json</code><button type="button" data-copy="pnpm harness onboard --config examples/happyclaw-site/project.json">复制命令</button></div>
    <div class="final-actions"><a class="button button-primary" href="${repositories.core}">Open GitHub ↗</a><a class="button button-secondary" href="${repositories.site}">Website source ↗</a></div>
  </section>`;

const images = screens.map(item => item.src);
const track = document.querySelector('#whirl-track');
const count = 32;
for (let index = 0; index < count; index++) {
  const angle = (index / count) * Math.PI * 2;
  const radius = 39 + (index % 4) * 4.5;
  const tile = document.createElement('span');
  tile.className = 'whirl-tile';
  tile.style.setProperty('--x', `${50 + Math.cos(angle) * radius}%`);
  tile.style.setProperty('--y', `${50 + Math.sin(angle) * radius}%`);
  tile.style.setProperty('--r', `${angle + Math.PI / 2}rad`);
  tile.style.setProperty('--s', String(.68 + (index % 5) * .08));
  tile.innerHTML = `<img src="${images[index % images.length]}" alt="">`;
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
