/**
 * Creative Maximum Reasoning (CMR) — Base Material Class
 * Clase base para la suite de materiales reactivos de autor
 * doc/CMR_Web_System_v2_Documentation/docs/06_MATERIAL_SYSTEM.md
 */

import { MaterialState } from '../contracts/MaterialState.js';

export class BaseMaterial {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.element = null;
    this.svg = null;
    this.state = MaterialState.DORMANT;
    this.qualityTier = 'high';
  }

  mount(element, svgContainer) {
    this.element = element;
    this.svg = svgContainer;
    this.buildGeometry();
    this.enterState(MaterialState.DORMANT);
  }

  buildGeometry() {
    // Override por subclases
  }

  enterState(state) {
    this.state = state;
    if (this.element) {
      this.element.dataset.state = state;
      if (state === MaterialState.SELECTED) {
        this.element.setAttribute('aria-selected', 'true');
        this.element.setAttribute('data-active', 'true');
      } else {
        this.element.setAttribute('aria-selected', 'false');
        this.element.removeAttribute('data-active');
      }
    }
    this.renderState(state);
  }

  renderState(state) {
    // Override por subclases
  }

  updateProximity(proximity, pointerX, pointerY) {
    if (this.state === MaterialState.SELECTED) return;
    // Override por subclases
  }

  setQuality(tier) {
    this.qualityTier = tier;
  }

  destroy() {
    if (this.svg) {
      this.svg.innerHTML = '';
    }
    this.element = null;
    this.svg = null;
  }
}
