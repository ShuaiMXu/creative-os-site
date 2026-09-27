// Portal behaviour — everything here replicates what appllama.io's app JS
// does to the same markup: the whirl particle field behind the mascot, the
// llama bob (their runtime adds the same animate class), the scroll
// choreography over the runway, agent adapter tabs and copy-to-clipboard.

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let whirlOn = false;

/* ---- Whirl field: app screens orbit the mascot on a ring band, with cream
   particles drifting between them — the screens are runtime-fed canvas
   drawing on the original site too (no DOM, no CSS; the API data arrives
   with their app JS). Their radial mask keeps the centre clear for the UFO;
   this canvas layer sits behind it, which is what makes the screens read as
   "orbiting behind". Placeholder art: our own exported HappyClaw captures. ---- */
const canvas = document.querySelector('.whirl-field-canvas');
if (canvas && !reduced) {
  const ctx = canvas.getContext('2d');
  const box = canvas.parentElement?.parentElement;
  const DPR = Math.min(devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  const particles = [];
  const tiles = [];

  // The exported HappyClaw run: real before/after captures at both viewports.
  const SCREENS = [
    { src: '/runs/06dabc2c/before/desktop.png', w: 150, h: 94 },
    { src: '/runs/06dabc2c/after/desktop.png', w: 150, h: 94 },
    { src: '/runs/06dabc2c/before/mobile.png', w: 64, h: 138 },
    { src: '/runs/06dabc2c/after/mobile.png', w: 64, h: 138 }
  ];
  const images = SCREENS.map(screen => {
    const image = new Image();
    image.src = screen.src;
    return { image, ...screen };
  });

  for (let i = 0; i < 14; i++) {
    const screen = SCREENS[i % SCREENS.length];
    tiles.push({
      image: images[i % images.length],
      angle: (i / 14) * Math.PI * 2 + Math.random() * 0.3,
      radius: 0.34 + Math.random() * 0.26,
      speed: (0.00008 + Math.random() * 0.00022) * (i % 2 ? 1 : -1),
      scale: 0.8 + Math.random() * 0.5,
      tilt: (Math.random() - 0.5) * 0.22,
      alpha: 0.45 + Math.random() * 0.4
    });
  }

  function resize() {
    width = box?.clientWidth || innerWidth;
    height = box?.clientHeight || innerHeight;
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  addEventListener('resize', resize);

  for (let i = 0; i < 260; i++) {
    particles.push({
      radius: 0.30 + Math.random() * 0.62,          // outside their 50% clear centre
      angle: Math.random() * Math.PI * 2,
      speed: (0.00016 + Math.random() * 0.0006) * (Math.random() < 0.5 ? 1 : -1),
      size: 0.6 + Math.random() * 1.8,
      alpha: 0.08 + Math.random() * 0.3,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: 0.002 + Math.random() * 0.004
    });
  }

  function drawTile(tile, rMax) {
    if (!tile.image.image.complete || tile.image.image.naturalWidth === 0) return;
    const r = tile.radius * rMax;
    const x = width / 2 + Math.cos(tile.angle) * r;
    const y = height / 2 + Math.sin(tile.angle) * r * 0.72; // slight ellipse, matches the mask
    const w = tile.image.w * tile.scale;
    const h = tile.image.h * tile.scale;
    ctx.save();
    ctx.globalAlpha = tile.alpha;
    ctx.translate(x, y);
    ctx.rotate(tile.tilt + Math.sin(tile.angle) * 0.06);
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 10);
    ctx.closePath();
    ctx.fill();
    ctx.clip();
    ctx.drawImage(tile.image.image, -w / 2, -h / 2, w, h);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = tile.alpha * 0.5;
    ctx.strokeStyle = 'rgba(240, 220, 200, 0.55)';
    ctx.lineWidth = 1;
    ctx.translate(x, y);
    ctx.rotate(tile.tilt + Math.sin(tile.angle) * 0.06);
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 10);
    ctx.stroke();
    ctx.restore();
  }

  function frame() {
    if (!whirlOn) {
      whirlOn = true;
      canvas.style.opacity = '1'; // their 1.5s ease-out transition does the fade
    }
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const rMax = Math.max(width, height) / 2;
    for (const p of particles) {
      p.angle += p.speed * 16;
      p.drift += p.driftSpeed;
      const r = p.radius * rMax * (1 + Math.sin(p.drift) * 0.04);
      ctx.fillStyle = `rgba(240, 220, 200, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(p.angle) * r, cy + Math.sin(p.angle) * r, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const tile of tiles) {
      tile.angle += tile.speed * 16;
      drawTile(tile, rMax);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---- Mascot: their runtime attaches the bob class to the pilot artwork. ---- */
const pilot = document.querySelector('.HeroUfoMascot_pilotArtwork__D3UOD');
if (pilot && !reduced) pilot.classList.add('motion-safe:animate-[llama-bob_4.5s_ease-in-out_infinite]');

/* ---- Scroll choreography: the hero stays sticky for its own height plus a
   42svh runway; during the runway their JS fades the content out and lifts
   it, so the catalog slides over a quiet stage instead of a hard cut. ---- */
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
      if (canvas && whirlOn) canvas.style.opacity = String(1 - eased);
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

/* ---- Copy to clipboard with their button treatment as the toast. ---- */
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
