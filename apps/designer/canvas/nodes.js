// Node rendering: StateCapture cards + DiffPair connectors (B2/B7).
// Builds DOM nodes with the appllama token classes; nothing here knows about the stage.

export function buildNodes(run, opts = {}) {
  const { manifest } = run;
  const nodes = [];

  // normalise captures to entries
  const beforeEntries = normalise(manifest.captures?.before);
  const afterEntries = normalise(manifest.captures?.after);
  const evaluation = run.evaluation;

  for (const entry of beforeEntries) {
    const key = `${entry.stateId}--${entry.configurationId}`;
    const after = afterEntries.find(e => `${e.stateId}--${e.configurationId}` === key);
    const checks = evaluation?.views?.[key]?.checks || null;

    nodes.push({
      key,
      phase: 'before',
      entry,
      after,
      checks,
      changed: isChanged(entry, after, checks, evaluation, key)
    });
  }

  // after-only entries (newly reachable states)
  for (const entry of afterEntries) {
    const key = `${entry.stateId}--${entry.configurationId}`;
    if (beforeEntries.some(e => `${e.stateId}--${e.configurationId}` === key)) continue;
    const checks = evaluation?.views?.[key]?.checks || null;
    nodes.push({ key, phase: 'after', entry, after: entry, checks, changed: true });
  }

  return nodes;
}

function normalise(capture) {
  if (!capture) return [];
  if (Array.isArray(capture?.states)) return capture.states;
  return Object.entries(capture?.viewports || {}).map(([configurationId, view]) => ({
    stateId: 'page',
    configurationId,
    legacy: true,
    ...view
  }));
}

// B4: computable definition of a changed state
function isChanged(before, after, checks, evaluation, key) {
  if (!after) return false; // no after = nothing to diff
  if (!checks) return true; // no evaluation data = don't guess, treat as changed
  if (Object.values(checks).some(ok => !ok)) return true;
  const view = evaluation?.views?.[key];
  if (view && JSON.stringify(view.beforeH1) !== JSON.stringify(view.afterH1)) return true;
  if (before?.reached === false && after.reached !== false) return true; // recovered
  return false;
}

export function renderNode(node, base) {
  const el = document.createElement('div');
  el.className = 'pd-node';
  el.dataset.key = node.key;
  el.dataset.phase = node.phase;
  el.dataset.changed = node.changed ? 'true' : 'false';

  const cap = document.createElement('div');
  cap.className = 'pd-node-caption font-mono';

  // phase tag: BEFORE / AFTER
  const phaseTag = document.createElement('span');
  phaseTag.className = `phase-tag ${node.phase}`;
  phaseTag.textContent = node.phase;

  const state = node.entry.stateId || 'page';
  const config = node.entry.configurationId || 'unknown';
  const http = node.entry.status ? ` · ${node.entry.status}` : '';
  const nameSpan = document.createElement('span');
  nameSpan.textContent = `${state} / ${config}${http}`;
  nameSpan.style.overflow = 'hidden';
  nameSpan.style.textOverflow = 'ellipsis';

  cap.append(phaseTag, nameSpan);

  if (node.entry.reached === false) {
    const err = document.createElement('div');
    err.className = 'pd-node-error';
    err.textContent = node.entry.error || 'State was not reached.';
    el.append(cap, err);
  } else {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = `${node.phase} screenshot of ${state} in ${config}`;
    img.src = `${base}/${node.entry.screenshot}`;
    el.append(cap, img);
  }

  // check badges
  if (node.checks) {
    const badges = document.createElement('div');
    badges.className = 'pd-node-checks';
    for (const [name, ok] of Object.entries(node.checks)) {
      const dot = document.createElement('span');
      dot.className = `pd-check-dot ${ok ? 'ok' : 'fail'}`;
      dot.title = ok ? name : `${name}: FAILED`;
      badges.appendChild(dot);
    }
    el.appendChild(badges);
  }

  // after jump tab
  if (node.after && node.phase === 'before') {
    const tab = document.createElement('div');
    tab.className = 'pd-jump-tab font-mono';
    tab.textContent = '→ after';
    tab.title = 'Jump to the after state';
    el.appendChild(tab);
  }

  return el;
}

// Connection line element between before and after nodes
export function renderConnection(x1, y, x2) {
  const el = document.createElement('div');
  el.className = 'pd-connection';
  el.style.left = `${x1}px`;
  el.style.top = `${y}px`;
  el.style.width = `${x2 - x1}px`;
  return el;
}
