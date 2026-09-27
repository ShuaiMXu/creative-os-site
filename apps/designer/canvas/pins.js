// FindingPin: diagnosis findings pinned to the before-state nodes they cite (B2).
// Only capture:before:* references become canvas pins; everything else counts in the inspector.

export function buildPins(diagnosis) {
  if (!diagnosis?.findings) return [];
  const pins = [];
  for (const finding of diagnosis.findings) {
    const targets = finding.evidenceRefs.filter(ref => ref.startsWith('capture:before:'));
    for (const ref of targets) {
      const nodeKey = ref.replace('capture:before:', '');
      pins.push({
        findingId: finding.id,
        title: finding.title,
        priority: finding.priority,
        verificationStatus: finding.verificationStatus,
        nodeKey,
        evidenceRefs: finding.evidenceRefs
      });
    }
  }
  return pins;
}

export function renderPin(pin) {
  const el = document.createElement('div');
  el.className = 'pd-pin';
  el.dataset.findingId = pin.findingId;
  el.dataset.nodeKey = pin.nodeKey;
  el.dataset.status = pin.verificationStatus;
  const num = document.createElement('span');
  num.className = 'font-mono pd-pin-priority';
  num.textContent = pin.priority.toFixed(1);
  const title = document.createElement('span');
  title.className = 'pd-pin-title';
  title.textContent = truncate(pin.title, 18);
  el.append(num, title);
  el.title = `${pin.findingId}: ${pin.title}`;
  return el;
}

function truncate(s, n) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
