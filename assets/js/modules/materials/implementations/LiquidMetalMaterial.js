/**
 * Creative Maximum Reasoning (CMR) — Liquid Metal Material Implementation
 * doc/CMR_Web_System_v2_Documentation/docs/06_MATERIAL_SYSTEM.md
 */

import { BaseMaterial } from './BaseMaterial.js';
import { LiquidMetalGenerator } from '../generators/LiquidMetalGenerator.js';

export class LiquidMetalMaterial extends BaseMaterial {
  constructor() {
    super('liquid-metal', 'Liquid Metal (Mercurio Especular)');
    this.elements = null;
  }

  buildGeometry() {
    if (!this.svg) return;
    this.elements = LiquidMetalGenerator.createElements(this.svg);
  }

  renderState(state) {
    if (!this.elements) return;
    LiquidMetalGenerator.applyState(this.elements, state, 0);
  }

  updateProximity(proximity, pointerX, pointerY) {
    if (this.state === 'selected' || !this.elements) return;
    LiquidMetalGenerator.applyState(this.elements, this.state, proximity);
  }
}
