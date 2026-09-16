/**
 * Creative Maximum Reasoning (CMR) — Fabric Material Implementation
 * doc/CMR_Web_System_v2_Documentation/docs/06_MATERIAL_SYSTEM.md
 */

import { BaseMaterial } from './BaseMaterial.js';
import { FabricGenerator } from '../generators/FabricGenerator.js';

export class FabricMaterial extends BaseMaterial {
  constructor() {
    super('fabric', 'Fabric (Urdimbre y Trama Textil)');
    this.elements = null;
  }

  buildGeometry() {
    if (!this.svg) return;
    this.elements = FabricGenerator.createElements(this.svg);
  }

  renderState(state) {
    if (!this.elements) return;
    FabricGenerator.applyState(this.elements, state, 0);
  }

  updateProximity(proximity, pointerX, pointerY) {
    if (this.state === 'selected' || !this.elements) return;
    FabricGenerator.applyState(this.elements, this.state, proximity);
  }
}
