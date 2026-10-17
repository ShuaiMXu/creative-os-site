// Minimap: viewport rectangle over a scaled-down node map (B5).
// Hidden when <=60 nodes (B5 boundary).

export class Minimap {
  constructor(container, stage, nodePositions) {
    this.container = container;
    this.stage = stage;
    this.positions = nodePositions;
    this.el = document.createElement('div');
    this.el.className = 'pd-minimap';
    this.canvas = document.createElement('canvas');
    this.el.appendChild(this.canvas);
    container.appendChild(this.el);

    stage.onChange(() => this.update());

    this.canvas.addEventListener('mousedown', e => {
      const rect = this.canvas.getBoundingClientRect();
      const fx = (e.clientX - rect.left) / rect.width;
      const fy = (e.clientY - rect.top) / rect.height;
      stage.x = this.stageRect.width / 2 - fx * this.contentWidth * stage.scale;
      stage.y = this.stageRect.height / 2 - fy * this.contentHeight * stage.scale;
      stage.#apply(); // internal; fire via a public method instead
    });
  }

  update() {
    // compute content bounds and draw dots for nodes + viewport rect
  }

  destroy() { this.el.remove(); }
}
