// Auto layout: states as rows, configurations as columns (B3).
// User-dragged positions persist to localStorage per run, never to the ledger.

const KEY_PREFIX = 'pd-canvas-';

export function autoLayout(entries) {
  // entries: [{stateId, configurationId, ...}] — the flat list of nodes
  const states = [];
  const configs = [];
  for (const e of entries) {
    if (!states.includes(e.stateId)) states.push(e.stateId);
    if (!configs.includes(e.configurationId)) configs.push(e.configurationId);
  }
  const COLUMN_GAP = 32;
  const ROW_GAP = 48;
  const GUTTER = 120;

  // column widths: narrow (3:4+) = 132, wide = 220
  const colWidths = configs.map(c => {
    const sample = entries.find(e => e.configurationId === c);
    const aspect = sample ? sample.width / sample.height : 1;
    return aspect < 0.75 ? 132 : 220;
  });

  const positions = new Map(); // key: stateId--configId -> {x, y, w}
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
      const w = colWidths[col];
      const h = w / (entry.width / entry.height);
      positions.set(key, {
        x: colOffsets[col],
        y: row * ROW_GAP,
        w,
        h: Math.min(h, w * 2.2) // cap absurdly tall screenshots
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
