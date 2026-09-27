// Appllama hero whirl — exact motion model ported from their shipped code.
// Spiral: 8 turns, r=1875*(1-u), arc-length parameterised, ≤120 tiles,
// 90s rotor spin, 3/4 tiles at 14% radius, edge fade at 8%/92%.
// Parameters read from static/chunks/app/(home)/page-*.js on 2026-09-27.

function buildSpiral() {
  const TURNS = 8 * Math.PI * 2;
  const SAMPLES = 16384;
  const MAX_R = 1875;
  const STEPS = 4096;

  const pts = [];
  for (let a = 0; a <= SAMPLES; a++) {
    const u = a / SAMPLES;
    const angle = u * TURNS;
    const r = MAX_R * (1 - u);
    pts.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
  }
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  const total = cum[SAMPLES];
  const lut = new Array(STEPS + 1);
  let cursor = 0;
  for (let c = 0; c <= STEPS; c++) {
    const d = (c / STEPS) * total;
    while (cursor < SAMPLES && cum[cursor + 1] < d) cursor++;
    const span = cum[cursor + 1] - cum[cursor];
    const t = span > 0 ? (d - cum[cursor]) / span : 0;
    const a = pts[cursor];
    const b = pts[Math.min(cursor + 1, SAMPLES)];
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    const ua = (cursor + t) / SAMPLES;
    const angle = ua * TURNS;
    const r = MAX_R * (1 - ua);
    // tangent: derivative of (r·cos, r·sin) along u
    const dx = -MAX_R * Math.cos(angle) - r * Math.sin(angle) * TURNS;
    const dy = -MAX_R * Math.sin(angle) + r * Math.cos(angle) * TURNS;
    const len = Math.hypot(dx, dy);
    lut[c] = { x, y, tx: len > 0 ? dx / len : 1, ty: len > 0 ? dy / len : 0 };
  }
  return lut;
}

export function startWhirl(container, images) {
  if (!container || !images.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lut = buildSpiral();
  const SPREAD = 2500;
  const TILE_COUNT = Math.min(120, images.length * 2);
  const TILE_WIDTHS = [175, 115, 85, 145, 200, 130]; // cycle a spread

  const rotor = document.createElement('div');
  rotor.className = 'pd-whirl-rotor';
  container.appendChild(rotor);

  let placed = 0;
  for (let i = 0; i < TILE_COUNT; i++) {
    const u = (i / TILE_COUNT) % 1;
    let edge = 1;
    if (u < 0.08) edge = u / 0.08;
    else if (u > 0.92) edge = (1 - u) / 0.92;
    if (edge < 0.15) continue;

    const p = lut[Math.round(u * 4096)];
    if (!p) continue;
    const d = Math.hypot(p.x, p.y);
    const expand = 1875 * Math.pow(d / 1875, 1.0526315789473684);
    const h = d > 0 ? expand / d : 1;
    const scale = Math.pow(Math.min(expand / 1875, 1), 0.35);
    const angle = Math.atan2(p.ty, p.tx);
    const src = images[placed % images.length];
    const width = TILE_WIDTHS[placed % TILE_WIDTHS.length];

    const tile = document.createElement('div');
    tile.className = 'pd-whirl-tile';
    tile.style.left = `${(50 + (p.x * h) / SPREAD * 100).toFixed(3)}%`;
    tile.style.top = `${(50 + (p.y * h) / SPREAD * 100).toFixed(3)}%`;
    tile.style.width = `${(width / SPREAD * 100).toFixed(3)}%`;
    tile.style.transform = `translate(-50%, -50%) rotate(${angle.toFixed(4)}rad) scale(${scale.toFixed(4)})`;
    tile.style.opacity = edge.toFixed(3);

    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('load', () => { img.style.opacity = '1'; }, { once: true });
    tile.appendChild(img);
    rotor.appendChild(tile);
    placed++;
  }

  requestAnimationFrame(() => { rotor.style.opacity = '1'; });
  return () => { rotor.remove(); };
}
