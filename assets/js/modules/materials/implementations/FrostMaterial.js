/**
 * Creative Maximum Reasoning (CMR) — Frost Material Implementation
 * doc/CMR_Web_System_v2_Documentation/docs/05_LIVING_FRAMES_AND_SELECTION.md & 06_MATERIAL_SYSTEM.md
 */

import { BaseMaterial } from './BaseMaterial.js';
import { FrostGenerator } from '../generators/FrostGenerator.js';

export class FrostMaterial extends BaseMaterial {
  constructor() {
    super('frost', 'Frost (Cristalización Angular)');
    this.elements = null;
  }

  buildGeometry() {
    if (!this.svg) return;
    this.elements = FrostGenerator.createElements(this.svg);
  }

  renderState(state) {
    if (!this.elements) return;
    FrostGenerator.applyState(this.elements, state, 0);
  }

  updateProximity(proximity, pointerX, pointerY) {
    if (this.state === 'selected' || !this.elements) return;
    FrostGenerator.applyState(this.elements, this.state, proximity);
  }
}
