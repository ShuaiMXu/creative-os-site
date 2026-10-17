// DOM rendering of the reference WebGL spiral motion, with the same phase and velocity model.
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
  lut.count = Math.ceil(total / 250);
  return lut;
}

export function startWhirl(container, images) {
  if (!container || !images.length) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const lut = buildSpiral();
  const count = lut.count;
  const widths = [120, 118, 85];
  const rotor = document.createElement('div');
  rotor.className = 'pd-whirl-rotor';
  rotor.style.animation = 'none';
  container.appendChild(rotor);
  const tiles = Array.from({length: count}, (_, i) => {
    const tile = document.createElement('div');
    tile.className = 'pd-whirl-tile';
    tile.style.width = `${widths[i % widths.length] / 2500 * 100}%`;
    const img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    img.addEventListener('load', () => { img.style.opacity = '1'; }, {once:true});
    img.src = images[i % images.length];
    tile.appendChild(img);
    rotor.appendChild(tile);
    return tile;
  });
  let phase = 0, velocity = 0, lastScroll = window.scrollY;
  const start = performance.now();
  let previous = start, frame, visible = true;
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  observer.observe(container);
  function draw() {
    tiles.forEach((tile, i) => {
      const u = (phase + i / count) % 1;
      const sample = u * 4096;
      const index = Math.min(Math.floor(sample), 4095);
      const a = lut[index], b = lut[index + 1], t = sample - index;
      const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
      const angle = Math.atan2(a.ty + (b.ty-a.ty)*t, a.tx + (b.tx-a.tx)*t);
      const d = Math.hypot(x,y);
      const radius = 1875 * (d / 1875) ** 1.0526315789473684;
      const h = d > 0 ? radius / d : 1;
      const scale = Math.min(radius / 1875,1) ** .35;
      tile.style.left = `${50 + x*h/2500*100}%`;
      tile.style.top = `${50 + y*h/2500*100}%`;
      tile.style.transform = `translate(-50%,-50%) rotate(${angle}rad) scale(${scale})`;
      tile.style.opacity = String(u < .08 ? u/.08 : u > .92 ? (1-u)/.08 : 1);
    });
  }
  function tick(now) {
    const dt = Math.min(now - previous,150)/1000;
    previous = now;
    if (dt > 0 && visible && !document.hidden && !motion.matches) {
      const speed = (window.scrollY-lastScroll)/dt;
      velocity += (speed-velocity)*Math.min(1,dt/.22);
      const elapsed = now-start;
      const boost = elapsed < 1900 ? 1+23*(elapsed<600?(elapsed/600)**2:1)*(1-elapsed/1900)**2 : 1;
      phase = (phase + .0032*(1+Math.abs(velocity)/1000*8)*boost*dt)%1;
      draw();
    } else { velocity = 0; }
    lastScroll = window.scrollY;
    frame = requestAnimationFrame(tick);
  }
  draw();
  rotor.style.opacity = '1';
  frame = requestAnimationFrame(tick);
  return () => { cancelAnimationFrame(frame); observer.disconnect(); rotor.remove(); };
}
