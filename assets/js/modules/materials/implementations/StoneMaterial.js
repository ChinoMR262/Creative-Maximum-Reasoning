/**
 * Creative Maximum Reasoning (CMR) — Stone Material Implementation
 * doc/CMR_Web_System_v2_Documentation/docs/05_LIVING_FRAMES_AND_SELECTION.md & 06_MATERIAL_SYSTEM.md
 */

import { BaseMaterial } from './BaseMaterial.js';
import { StoneGenerator } from '../generators/StoneGenerator.js';

export class StoneMaterial extends BaseMaterial {
  constructor() {
    super('stone', 'Stone (Borde Mineral & Kintsugi)');
    this.elements = null;
  }

  buildGeometry() {
    if (!this.svg) return;
    this.elements = StoneGenerator.createElements(this.svg);
  }

  renderState(state) {
    if (!this.elements) return;
    StoneGenerator.applyState(this.elements, state, 0);
  }

  updateProximity(proximity, pointerX, pointerY) {
    if (this.state === 'selected' || !this.elements) return;
    StoneGenerator.applyState(this.elements, this.state, proximity);
  }
}
