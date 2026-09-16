/**
 * Creative Maximum Reasoning (CMR) — Dark Glass Material Implementation
 * Refracción óptica de autor con bisel reflectivo
 * doc/CMR_Web_System_v2_Documentation/docs/06_MATERIAL_SYSTEM.md
 */

import { BaseMaterial } from './BaseMaterial.js';

export class GlassMaterial extends BaseMaterial {
  constructor() {
    super('glass', 'Dark Glass (Vidrio Ahumado Biselado)');
  }

  buildGeometry() {
    if (!this.svg) return;
    this.svg.setAttribute('viewBox', '0 0 100 100');
    this.svg.setAttribute('preserveAspectRatio', 'none');

    // Bisel reflectivo perimetral
    const bevel = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bevel.setAttribute('x', '2');
    bevel.setAttribute('y', '2');
    bevel.setAttribute('width', '96');
    bevel.setAttribute('height', '96');
    bevel.setAttribute('rx', '2');
    bevel.setAttribute('class', 'living-stroke glass-bevel');
    bevel.setAttribute('fill', 'none');

    this.svg.appendChild(bevel);
    this.bevel = bevel;
  }

  renderState(state) {
    if (!this.bevel) return;
    if (state === 'selected' || state === 'hover') {
      this.bevel.style.opacity = '0.9';
    } else {
      this.bevel.style.opacity = '0.35';
    }
  }

  updateProximity(proximity, pointerX, pointerY) {
    if (this.state === 'selected' || !this.bevel) return;
    this.bevel.style.opacity = (0.35 + proximity * 0.5).toFixed(2);
  }
}
