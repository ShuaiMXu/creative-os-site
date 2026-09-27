// Portal behaviour. The hero whirl is OUR OWN implementation of the spiral
// screen-rotor: the geometry, distribution and styling parameters were read
// out of the original site's shipped behaviour (8-turn spiral r=1875·(1−u),
// arc-length LUT, ≤120 tiles, 90s rotor spin, 3/4 tiles at 14% radius) and
// reimplemented from scratch — no their-code runs here. Tile images are the
// crawled catalog screens (public/assets/hero, placeholder by design; swap
// the files or the manifest to change the showcase). Also on board: the
// llama bob, the runway scroll choreography, agent tabs, copy-to-clipboard.

import heroScreens from './hero-screens.json' with { type: 'json' };

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Spiral rotor: our reimplementation of the whirl ---- */
function buildSpiral() {
  // 8 turns from r=1875 down to 0, arc-length parameterised like the original
  const TURNS = 8 * Math.PI * 2;
  const SAMPLES = 16384;
  const MAX_R = 1875;
  const points = [];
  for (let a = 0; a <= SAMPLES; a++) {
    const u = a / SAMPLES;
    const angle = u * TURNS;
    const r = MAX_R * (1 - u);
    points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
  }
  const cumulative = [0];
  for (let i = 1; i < points.length; i++) {
    cumulative.push(cumulative[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  const total = cumulative[SAMPLES];
  const STEPS = 4096;
  const lut = new Array(STEPS + 1);
  let cursor = 0;
  for (let c = 0; c <= STEPS; c++) {
    const d = (c / STEPS) * total;
    while (cursor < SAMPLES && cumulative[cursor + 1] < d) cursor++;
    const span = cumulative[cursor + 1] - cumulative[cursor];
    const t = span > 0 ? (d - cumulative[cursor]) / span : 0;
    const a = points[cursor];
    const b = points[Math.min(cursor + 1, SAMPLES)];
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    const ua = (cursor + t) / SAMPLES;
    const angle = ua * TURNS;
    const r = MAX_R * (1 - ua);
    // derivative of (r·cos, r·sin) along the spiral, normalised
    const dx = -MAX_R * Math.cos(angle) - r * Math.sin(angle) * TURNS;
    const dy = -MAX_R * Math.sin(angle) + r * Math.cos(angle) * TURNS;
    const len = Math.hypot(dx, dy);
    lut[c] = { x, y, tx: len > 0 ? dx / len : 1, ty: len > 0 ? dy / len : 0 };
  }
  return lut;
}

function startWhirl() {
  const canvas = document.querySelector('.whirl-field-canvas');
  const host = canvas?.parentElement;               // the masked wrapper keeps the ring clear for the mascot
  if (!host || reduced) {
    if (canvas) canvas.style.display = 'none';
    return;
  }
  canvas.style.display = 'none';                    // our rotor replaces their canvas outright

  const SCREENS = heroScreens;
  const TILE_WIDTHS = [175, 115, 85, 145];             // their tiles vary; keep them phone-thumbnail sized
  const TILE_COUNT = 120;
  const SPREAD = 2500;                              // their coordinate normalisation space

  const lut = buildSpiral();
  const rotor = document.createElement('div');
  rotor.className = 'pd-whirl-rotor';
  host.appendChild(rotor);

  for (let i = 0; i < TILE_COUNT; i++) {
    const u = (i / TILE_COUNT) % 1;
    let edge = 1;
    if (u < 0.08) edge = u / 0.08;
    else if (u > 0.92) edge = (1 - u) / 0.92;
    if (edge < 0.15) continue;

    const p = lut[Math.round(u * 4096)];
    const d = Math.hypot(p.x, p.y);
    const expand = 1875 * Math.pow(d / 1875, 1.0526315789473684);
    const h = d > 0 ? expand / d : 1;
    const scale = Math.pow(Math.min(expand / 1875, 1), 0.35);
    const angle = Math.atan2(p.ty, p.tx);
    const src = SCREENS[i % SCREENS.length];
    const width = TILE_WIDTHS[i % TILE_WIDTHS.length] / SPREAD * 100;

    const tile = document.createElement('div');
    tile.className = 'pd-whirl-tile';
    tile.style.left = `${(50 + p.x * h / SPREAD * 100).toFixed(3)}%`;
    tile.style.top = `${(50 + p.y * h / SPREAD * 100).toFixed(3)}%`;
    tile.style.width = `${width.toFixed(3)}%`;
    tile.style.transform = `translate(-50%, -50%) rotate(${angle.toFixed(4)}rad) scale(${scale.toFixed(4)})`;
    tile.style.opacity = edge.toFixed(3);
    const image = document.createElement('img');
    image.src = src;
    image.alt = '';
    image.decoding = 'async';
    image.loading = 'lazy';
    image.draggable = false;
    image.addEventListener('load', () => { image.style.opacity = '1'; }, { once: true });
    tile.appendChild(image);
    rotor.appendChild(tile);
  }
  requestAnimationFrame(() => { rotor.style.opacity = '1'; });
}
startWhirl();

/* ---- Mascot: their runtime attaches the bob class to the pilot artwork. ---- */
const pilot = document.querySelector('.HeroUfoMascot_pilotArtwork__D3UOD');
if (pilot && !reduced) pilot.classList.add('motion-safe:animate-[llama-bob_4.5s_ease-in-out_infinite]');

/* ---- Scroll choreography over the runway ---- */
const heroInner = document.querySelector('section.sticky > .relative.z-10');
const runway = document.querySelector('[class*="home-runway-height"]');
if (heroInner && !reduced) {
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const span = runway?.offsetHeight || innerHeight * 0.42;
      const progress = Math.min(Math.max(scrollY / span, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      heroInner.style.opacity = String(1 - eased);
      heroInner.style.transform = `translateY(${-eased * 7}vh)`;
      const rotor = document.querySelector('.pd-whirl-rotor');
      if (rotor) rotor.style.opacity = String(1 - eased);
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- Agent adapter tabs: the real argv from packages/harness-core/agents.js. ---- */
const AGENTS = {
  codex: {
    label: 'codex exec',
    argv: 'codex exec -C <worktree> -s workspace-write --json -o agent-last-message.md -',
    note: 'Prompt 走 stdin；仓库文件一律当作数据，不当作指令。',
    copy: 'codex exec -C <worktree> -s workspace-write --json -o agent-last-message.md -'
  },
  'claude-code': {
    label: 'claude -p',
    argv: 'claude -p --output-format stream-json --verbose --permission-mode acceptEdits \\\n  --bare --disallowed-tools "Bash(git push:*) Bash(git remote:*) Bash(git config:*) WebFetch"',
    note: '--bare 跳过 CLAUDE.md 自动加载：被审仓库无法通过记忆文件给 agent 下指令。',
    copy: 'claude -p --output-format stream-json --verbose --permission-mode acceptEdits --bare --disallowed-tools "Bash(git push:*) Bash(git remote:*) Bash(git config:*) WebFetch"'
  }
};

const argvPre = document.getElementById('agent-argv');
const noteP = document.getElementById('agent-note');
const labelSpan = document.getElementById('agent-label');
const copyButton = document.getElementById('agent-copy');

function selectAgent(id) {
  const agent = AGENTS[id];
  if (!agent || !argvPre) return;
  labelSpan.textContent = agent.label;
  argvPre.textContent = agent.argv;
  noteP.textContent = agent.note;
  copyButton.dataset.copy = agent.copy;
}

for (const tab of document.querySelectorAll('.pd-tab')) {
  tab.addEventListener('click', () => {
    for (const other of document.querySelectorAll('.pd-tab')) other.setAttribute('aria-selected', String(other === tab));
    selectAgent(tab.dataset.agent);
  });
}
selectAgent('codex');

/* ---- Copy to clipboard ---- */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toast-text').textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(1rem)';
  }, 1800);
}

for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      showToast('已复制到剪贴板');
    } catch {
      showToast('复制失败：浏览器拒绝了剪贴板访问');
    }
  });
}
