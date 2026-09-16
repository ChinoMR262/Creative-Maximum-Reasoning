/**
 * Creative Maximum Reasoning (CMR) — Magnetic Dust Material Implementation
 * doc/CMR_Web_System_v2_Documentation/docs/06_MATERIAL_SYSTEM.md
 */

import { BaseMaterial } from './BaseMaterial.js';
import { MagneticDustGenerator } from '../generators/MagneticDustGenerator.js';

export class MagneticDustMaterial extends BaseMaterial {
  constructor() {
    super('magnetic-dust', 'Magnetic Dust (Polvo Polarizado)');
    this.elements = null;
  }

  buildGeometry() {
    if (!this.svg) return;
    this.elements = MagneticDustGenerator.createElements(this.svg);
  }

  renderState(state) {
    if (!this.elements) return;
    MagneticDustGenerator.applyState(this.elements, state, 0);
  }

  updateProximity(proximity, pointerX, pointerY) {
    if (this.state === 'selected' || !this.elements) return;
    MagneticDustGenerator.applyState(this.elements, this.state, proximity, pointerX, pointerY);
  }
}
