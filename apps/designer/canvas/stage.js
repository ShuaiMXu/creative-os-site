// Canvas stage: pan, zoom, fit — the viewport over the infinite plane.
// Manages a CSS transform on the stage element; nothing else knows about it.

export class Stage {
  constructor(element) {
    this.el = element;
    this.scale = 1;
    this.x = 0;
    this.y = 0;
    this.min = 0.25;
    this.max = 4;
    this.listeners = new Set();
    this.#bind();
  }

  #bind() {
    const el = this.el;
    let panning = false;
    let startX = 0, startY = 0;
    let originX = 0, originY = 0;

    el.addEventListener('mousedown', e => {
      if (e.target === el || e.target.classList.contains('pd-canvas-bg')) {
        panning = true;
        startX = e.clientX; startY = e.clientY;
        originX = this.x; originY = this.y;
        el.style.cursor = 'grabbing';
        e.preventDefault();
      }
    });
    el.addEventListener('mousemove', e => {
      if (!panning) return;
      this.x = originX + (e.clientX - startX);
      this.y = originY + (e.clientY - startY);
      this.#apply();
    });
    const end = () => { panning = false; el.style.cursor = ''; };
    el.addEventListener('mouseup', end);
    el.addEventListener('mouseleave', end);

    el.addEventListener('wheel', e => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      this.zoomAt(px, py, factor);
    }, { passive: false });
  }

  zoomAt(px, py, factor) {
    const next = Math.min(this.max, Math.max(this.min, this.scale * factor));
    const ratio = next / this.scale;
    // keep the point under the cursor fixed
    this.x = px - (px - this.x) * ratio;
    this.y = py - (py - this.y) * ratio;
    this.scale = next;
    this.#apply();
  }

  fit(contentWidth, contentHeight) {
    const rect = this.el.getBoundingClientRect();
    const pad = 48;
    this.scale = Math.min(this.max, Math.max(this.min,
      Math.min((rect.width - pad) / contentWidth, (rect.height - pad) / contentHeight)));
    this.x = (rect.width - contentWidth * this.scale) / 2;
    this.y = (rect.height - contentHeight * this.scale) / 2;
    this.#apply();
  }

  fitNode(node) {
    const r = node.getBoundingClientRect();
    const rect = this.el.getBoundingClientRect();
    const cx = (r.left + r.right) / 2 - rect.left;
    const cy = (r.top + r.bottom) / 2 - rect.top;
    this.x = this.x + rect.width / 2 - cx;
    this.y = this.y + rect.height / 2 - cy;
    this.#apply();
  }

  #apply() {
    this.el.style.setProperty('--pd-scale', this.scale);
    this.el.style.setProperty('--pd-x', `${this.x}px`);
    this.el.style.setProperty('--pd-y', `${this.y}px`);
    for (const fn of this.listeners) fn(this);
  }

  onChange(fn) { this.listeners.add(fn); }
  get transform() { return `translate(${this.x}px, ${this.y}px) scale(${this.scale})`; }
}
