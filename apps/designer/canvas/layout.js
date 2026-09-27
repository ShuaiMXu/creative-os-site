// Auto layout: states as rows, configurations as columns (B3).
// User-dragged positions persist to localStorage per run, never to the ledger.

const KEY_PREFIX = 'pd-canvas-';

export function autoLayout(entries, { hasAfter = false } = {}) {
  // entries: [{stateId, configurationId, ...}] — the flat list of before nodes
  const states = [];
  const configs = [];
  for (const e of entries) {
    if (!states.includes(e.stateId)) states.push(e.stateId);
    if (!configs.includes(e.configurationId)) configs.push(e.configurationId);
  }
  const COLUMN_GAP = 48;
  const PAIR_GAP = 28;
  const ROW_GAP = 72; // generous breathing room between state rows
  const GUTTER = 140;

  // column widths: desktop 240, mobile 144 — same-height rows via uniform max
  const baseWidths = configs.map(c => {
    const sample = entries.find(e => e.configurationId === c);
    const aspect = sample ? sample.width / sample.height : 1;
    return aspect < 0.75 ? 144 : 240;
  });
  // total column width accounts for the after node
  const colWidths = baseWidths.map(w => hasAfter ? w * 2 + PAIR_GAP : w);

  const positions = new Map(); // key: stateId--configId -> {x, y, w, pairX}
  const colOffsets = [];
  let acc = GUTTER;
  for (let i = 0; i < configs.length; i++) {
    colOffsets.push(acc);
    acc += colWidths[i] + COLUMN_GAP;
  }

  states.forEach((stateId, row) => {
    configs.forEach((configId, col) => {
      const entry = entries.find(e => e.stateId === stateId && e.configurationId === configId);
      if (!entry) return;
      const key = `${stateId}--${configId}`;
      const w = baseWidths[col];
      const h = w / (entry.width / entry.height);
      const x = colOffsets[col];
      const y = row * ROW_GAP;
      positions.set(key, {
        x, y, w,
        h: Math.min(h, w * 2.2),
        // after node position (right of before + pair gap)
        afterX: hasAfter ? x + w + PAIR_GAP : null,
        afterW: hasAfter ? w : null
      });
    });
  });

  const totalWidth = acc;
  const totalHeight = states.length * ROW_GAP;
  return { positions, totalWidth, totalHeight, states, configs, colOffsets, colWidths };
}

export function loadLayout(runId) {
  try {
    return JSON.parse(localStorage.getItem(KEY_PREFIX + runId) || 'null');
  } catch { return null; }
}

export function saveLayout(runId, positions) {
  localStorage.setItem(KEY_PREFIX + runId, JSON.stringify(positions));
}

export function clearLayout(runId) {
  localStorage.removeItem(KEY_PREFIX + runId);
}
