/**
 * Creative Maximum Reasoning (CMR) — Mechanism Material Implementation
 * doc/CMR_Web_System_v2_Documentation/docs/05_LIVING_FRAMES_AND_SELECTION.md & 06_MATERIAL_SYSTEM.md
 */

import { BaseMaterial } from './BaseMaterial.js';
import { MechanismGenerator } from '../generators/MechanismGenerator.js';

export class MechanismMaterial extends BaseMaterial {
  constructor() {
    super('mechanism', 'Mechanism (Escuadras, Vernier & Lock)');
    this.elements = null;
  }

  buildGeometry() {
    if (!this.svg) return;
    this.elements = MechanismGenerator.createElements(this.svg);
  }

  renderState(state) {
    if (!this.elements) return;
    MechanismGenerator.applyState(this.elements, state, 0);
  }

  updateProximity(proximity, pointerX, pointerY) {
    if (this.state === 'selected' || !this.elements) return;
    MechanismGenerator.applyState(this.elements, this.state, proximity);
  }
}
