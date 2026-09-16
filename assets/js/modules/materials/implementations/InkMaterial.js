/**
 * Creative Maximum Reasoning (CMR) — Ink Material Implementation
 * doc/CMR_Web_System_v2_Documentation/docs/06_MATERIAL_SYSTEM.md
 */

import { BaseMaterial } from './BaseMaterial.js';
import { InkGenerator } from '../generators/InkGenerator.js';

export class InkMaterial extends BaseMaterial {
  constructor() {
    super('ink', 'Ink (Capilaridad Caligráfica)');
    this.elements = null;
  }

  buildGeometry() {
    if (!this.svg) return;
    this.elements = InkGenerator.createElements(this.svg);
  }

  renderState(state) {
    if (!this.elements) return;
    InkGenerator.applyState(this.elements, state, 0);
  }

  updateProximity(proximity, pointerX, pointerY) {
    if (this.state === 'selected' || !this.elements) return;
    InkGenerator.applyState(this.elements, this.state, proximity);
  }
}
