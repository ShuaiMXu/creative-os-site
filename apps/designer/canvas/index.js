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
    buildSidebar([]);
    updateInspector(null);
    updateStatusBar(nodes.length, hasEvaluation);
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
    updateInspector(node);
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

  // -- panel builders --
  function buildSidebar(nodes) {
    const tree = document.getElementById('pd-sidebar-tree');
    if (!tree) return;
    tree.replaceChildren();
    const byState = new Map();
    for (const node of nodes) {
      const list = byState.get(node.entry.stateId) || [];
      list.push(node);
      byState.set(node.entry.stateId, list);
    }
    for (const [stateId, stateNodes] of byState) {
      const group = document.createElement('div');
      group.className = 'pd-tree-group';
      const head = document.createElement('div');
      head.className = 'pd-tree-group-head open';
      head.innerHTML = `<span class="chevron"></span><span>${stateId}</span><span class="count">${stateNodes.length}</span>`;
      const items = document.createElement('div');
      items.className = 'pd-tree-items';
      for (const node of stateNodes) {
        const item = document.createElement('div');
        item.className = 'pd-tree-item';
        const checks = node.checks ? Object.values(node.checks) : [];
        const allOk = checks.length > 0 && checks.every(Boolean);
        const dotClass = node.phase === 'after' ? (allOk ? 'ok' : 'fail') : '';
        item.innerHTML = `<span class="dot ${dotClass}"></span>${node.entry.configurationId}<span style="margin-left:auto;font-size:9px;opacity:.5">${node.phase}</span>`;
        item.addEventListener('click', () => {
          const el = layer.querySelector(`[data-key="${node.key}"][data-phase="${node.phase}"]`);
          if (el) { stage.fitNode(el); selectNode(node, el); updateInspector(node); }
        });
        items.appendChild(item);
      }
      head.addEventListener('click', () => { items.hidden = !items.hidden; head.classList.toggle('open'); });
      group.append(head, items);
      tree.appendChild(group);
    }
  }

  function updateInspector(node) {
    const body = document.getElementById('pd-inspector-body');
    if (!body) return;
    body.replaceChildren();
    if (!node) { body.innerHTML = '<div class="pd-insp-empty">选择一个节点查看详情</div>'; return; }
    const rows = [
      ['State', node.entry.stateId], ['Config', node.entry.configurationId],
      ['Phase', node.phase], ['HTTP', node.entry.status || '—'], ['URL', node.entry.finalUrl || '—']
    ];
    for (const [label, value] of rows) {
      const sec = document.createElement('div');
      sec.className = 'pd-insp-section';
      const l = document.createElement('span');
      l.className = 'pd-insp-label'; l.textContent = label;
      const v = document.createElement('span');
      v.className = 'pd-insp-value mono'; v.textContent = value;
      sec.append(l, v);
      body.appendChild(sec);
    }
    if (node.checks) {
      const sec = document.createElement('div');
      sec.className = 'pd-insp-section';
      const l = document.createElement('span');
      l.className = 'pd-insp-label'; l.textContent = 'Checks';
      sec.appendChild(l);
      for (const [name, ok] of Object.entries(node.checks)) {
        const b = document.createElement('span');
        b.className = `pd-insp-badge ${ok ? 'ok' : 'fail'}`;
        b.textContent = `${ok ? '✓' : '✗'} ${name}`;
        sec.appendChild(b);
      }
      body.appendChild(sec);
    }
  }

  function updateStatusBar(count, hasEval) {
    const el = document.getElementById('pd-fs-count');
    const ev = document.getElementById('pd-fs-eval-status');
    if (el) el.textContent = `${count} states`;
    if (ev) ev.textContent = hasEval ? '✓ evaluated' : '○ not evaluated';
  }

  function updateZoomLabel() {
    const z = document.getElementById('pd-zoom-label');
    if (z) z.textContent = Math.round(stage.scale * 100) + '%';
  }

  // zoom controls
  document.getElementById('pd-zoom-in')?.addEventListener('click', () => {
    stage.scale = Math.min(4, stage.scale * 1.25); stage.refresh(); updateZoomLabel();
  });
  document.getElementById('pd-zoom-out')?.addEventListener('click', () => {
    stage.scale = Math.max(.25, stage.scale / 1.25); stage.refresh(); updateZoomLabel();
  });
  document.getElementById('pd-fs-fit')?.addEventListener('click', () => {
    stage.fit(layoutResultCache.w, layoutResultCache.h); updateZoomLabel();
  });
  stage.onChange(() => updateZoomLabel());

  // populate panels
  buildSidebar(nodes);
  updateInspector(null);
  updateStatusBar(nodes.length, hasEvaluation);
  updateZoomLabel();

  // cleanup (returned last — panels are populated before this)
  return () => {
    document.removeEventListener('keydown', keyHandler);
    saveLayout(runId, positions);
  };
}

export { renderCodeDiff };
