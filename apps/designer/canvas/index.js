// Canvas view: the third workbench view (B1 scope).
// Entry: renderCanvas(container, run) — builds the full canvas from an exported run.

import { Stage } from './stage.js';
import { buildNodes, renderNode } from './nodes.js';
import { buildPins, renderPin } from './pins.js';
import { autoLayout, loadLayout, saveLayout, clearLayout } from './layout.js';
import { renderCodeDiff } from './codediff.js';

export async function renderCanvas(container, run) {
  container.replaceChildren();

  // fetch evaluation.json separately (the workbench doesn't pre-load it)
  let evaluation = null;
  if (run.manifest.evaluation) {
    try {
      const response = await fetch(`${run.base}/evaluation.json`, { cache: 'no-store' });
      if (response.ok) evaluation = await response.json();
    } catch { /* absent = no diff mode */ }
  }
  const enrichedRun = { ...run, evaluation };

  // -- data --
  const nodes = buildNodes(enrichedRun);
  const pins = buildPins(run.diagnosis);
  const hasEvaluation = Boolean(evaluation);
  const hasAfter = Boolean(run.manifest.captures?.after);
  const runId = run.manifest.id;

  if (nodes.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'pd-canvas-empty';
    empty.innerHTML = '<h3>此 run 没有可摊开的状态</h3><p>采集基线后，画布会展示全部状态截图。</p>';
    container.appendChild(empty);
    return;
  }

  // -- DOM --
  const toolbar = document.createElement('div');
  toolbar.className = 'pd-canvas-toolbar';

  const diffBtn = document.createElement('button');
  diffBtn.type = 'button';
  diffBtn.className = 'pd-canvas-btn';
  diffBtn.textContent = 'Diff 模式 (D)';
  diffBtn.disabled = !hasEvaluation;
  diffBtn.title = hasEvaluation ? '只显示变化的状态' : '需先 evaluate';
  diffBtn.addEventListener('click', () => toggleDiff());
  toolbar.appendChild(diffBtn);

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'pd-canvas-btn';
  resetBtn.textContent = '重置布局';
  resetBtn.addEventListener('click', () => {
    clearLayout(runId);
    buildCanvas(false);
  });
  toolbar.appendChild(resetBtn);

  const nodeCount = document.createElement('span');
  nodeCount.className = 'font-mono pd-canvas-count';
  nodeCount.textContent = `${nodes.length} 状态`;
  toolbar.appendChild(nodeCount);

  const stageEl = document.createElement('div');
  stageEl.className = 'pd-canvas-stage';
  const layer = document.createElement('div');
  layer.className = 'pd-canvas-layer';
  stageEl.appendChild(layer);

  container.append(toolbar, stageEl);

  // -- state --
  let diffMode = false;
  let selectedNode = null;
  const stage = new Stage(stageEl);

  buildCanvas(true);

  function buildCanvas(fit) {
    layer.replaceChildren();

    // auto layout
    const layoutResult = autoLayout(nodes.map(n => n.entry));
    const saved = loadLayout(runId);
    const positions = saved || layoutResult.positions;

    // state row labels
    for (const [i, state] of layoutResult.states.entries()) {
      const label = document.createElement('div');
      label.className = 'font-mono pd-row-label';
      label.textContent = state;
      label.style.top = `${i * 48}px`;
      layer.appendChild(label);
    }

    // nodes
    const nodeEls = new Map();
    for (const node of nodes) {
      const pos = positions.get(node.key);
      if (!pos) continue;
      const el = renderNode(node, run.base);
      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
      el.style.width = `${pos.w}px`;

      if (diffMode && !node.changed && node.phase === 'before') el.classList.add('pd-dim');

      el.addEventListener('click', e => { e.stopPropagation(); selectNode(node, el); });
      const jumpTab = el.querySelector('.pd-jump-tab');
      if (jumpTab) jumpTab.addEventListener('click', e => {
        e.stopPropagation();
        const afterEl = nodeEls.get(node.key + ':after');
        if (afterEl) { stage.fitNode(afterEl); ring(afterEl); }
      });

      layer.appendChild(el);
      nodeEls.set(node.key + ':' + node.phase, el);

      // after node for pairing
      if (node.after && node.phase === 'before') {
        const afterPos = { x: pos.x + pos.w + 8, y: pos.y, w: pos.w };
        const afterEl = renderNode({ ...node, phase: 'after', entry: node.after }, run.base);
        afterEl.style.left = `${afterPos.x}px`;
        afterEl.style.top = `${afterPos.y}px`;
        afterEl.style.width = `${afterPos.w}px`;
        if (diffMode && !node.changed) afterEl.classList.add('pd-dim');
        afterEl.addEventListener('click', e => { e.stopPropagation(); selectNode(node, afterEl); });
        layer.appendChild(afterEl);
        nodeEls.set(node.key + ':after', afterEl);
      }
    }

    // pins
    for (const pin of pins) {
      const nodeEl = nodeEls.get(pin.nodeKey + ':before');
      if (!nodeEl) continue;
      const pinEl = renderPin(pin);
      pinEl.addEventListener('click', e => {
        e.stopPropagation();
        highlightEvidence(pin.evidenceRefs, nodeEls);
      });
      nodeEl.appendChild(pinEl);
    }

    if (fit) stage.fit(layoutResult.totalWidth + 200, layoutResult.totalHeight + 100);
  }

  function toggleDiff() {
    diffMode = !diffMode;
    diffBtn.classList.toggle('active', diffMode);
    buildCanvas(false);
  }

  function selectNode(node, el) {
    if (selectedNode) selectedNode.el.classList.remove('pd-selected');
    selectedNode = { node, el };
    el.classList.add('pd-selected');
  }

  function highlightEvidence(refs, nodeEls) {
    // dim all, then re-light the referenced ones
    for (const el of nodeEls.values()) el.classList.add('pd-dim');
    for (const ref of refs) {
      if (!ref.startsWith('capture:')) continue;
      const key = ref.replace(/capture:(before|after):/, '') + ':$1';
      // try both phases
      for (const phase of ['before', 'after']) {
        const el = nodeEls.get(ref.replace(`capture:${phase}:`, '') + `:${phase}`);
        if (el) el.classList.remove('pd-dim');
      }
    }
    // click empty to clear
    stageEl.addEventListener('click', function clear(e) {
      if (e.target === stageEl || e.target.classList.contains('pd-canvas-bg')) {
        for (const el of nodeEls.values()) el.classList.remove('pd-dim');
        stageEl.removeEventListener('click', clear);
      }
    });
  }

  function ring(el) {
    el.classList.add('pd-ring');
    setTimeout(() => el.classList.remove('pd-ring'), 800);
  }

  // keyboard
  const keyHandler = e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.key === 'f' || e.key === 'F') {
      if (selectedNode) stage.fitNode(selectedNode.el);
      else stage.fit(layoutResultCache.w, layoutResultCache.h);
    }
    if (e.key === 'D' || (e.key === 'd' && !e.ctrlKey && !e.metaKey)) toggleDiff();
  };
  document.addEventListener('keydown', keyHandler);

  let layoutResultCache = { w: 0, h: 0 };
  const layout = autoLayout(nodes.map(n => n.entry));
  layoutResultCache = { w: layout.totalWidth + 200, h: layout.totalHeight + 100 };

  // stage background click = deselect
  stageEl.addEventListener('click', e => {
    if (e.target === stageEl) {
      if (selectedNode) { selectedNode.el.classList.remove('pd-selected'); selectedNode = null; }
      for (const el of layer.querySelectorAll('.pd-dim')) el.classList.remove('pd-dim');
    }
  });

  // cleanup
  return () => {
    document.removeEventListener('keydown', keyHandler);
    saveLayout(runId, positions);
  };
}

export { renderCodeDiff };
