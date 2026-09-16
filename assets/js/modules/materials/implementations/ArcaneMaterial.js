/**
 * Creative Maximum Reasoning (CMR) — Arcane Material Implementation
 * doc/CMR_Web_System_v2_Documentation/docs/05_LIVING_FRAMES_AND_SELECTION.md & 06_MATERIAL_SYSTEM.md
 */

import { BaseMaterial } from './BaseMaterial.js';
import { ArcaneGenerator } from '../generators/ArcaneGenerator.js';

export class ArcaneMaterial extends BaseMaterial {
  constructor() {
    super('arcane', 'Arcane (Filamentos & Nodos Cognitivos)');
    this.elements = null;
  }

  buildGeometry() {
    if (!this.svg) return;
    this.elements = ArcaneGenerator.createElements(this.svg);
  }

  renderState(state) {
    if (!this.elements) return;
    ArcaneGenerator.applyState(this.elements, state, 0);
  }

  updateProximity(proximity, pointerX, pointerY) {
    if (this.state === 'selected' || !this.elements) return;
    ArcaneGenerator.applyState(this.elements, this.state, proximity);
  }
}
