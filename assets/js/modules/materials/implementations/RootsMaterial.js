/**
 * Creative Maximum Reasoning (CMR) — Roots Material Implementation
 * doc/CMR_Web_System_v2_Documentation/docs/05_LIVING_FRAMES_AND_SELECTION.md & 06_MATERIAL_SYSTEM.md
 */

import { BaseMaterial } from './BaseMaterial.js';
import { RootsGenerator } from '../generators/RootsGenerator.js';

export class RootsMaterial extends BaseMaterial {
  constructor() {
    super('roots', 'Roots (Crecimiento Orgánico)');
    this.elements = null;
  }

  buildGeometry() {
    if (!this.svg) return;
    this.elements = RootsGenerator.createElements(this.svg);
  }

  renderState(state) {
    if (!this.elements) return;
    RootsGenerator.applyState(this.elements, state, 0);
  }

  updateProximity(proximity, pointerX, pointerY) {
    if (this.state === 'selected' || !this.elements) return;
    RootsGenerator.applyState(this.elements, this.state, proximity);
  }
}
