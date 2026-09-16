/**
 * Creative Maximum Reasoning (CMR) — Living Frame Controller Orchestrator
 * Orquestador de marcos vivos reactivos con inyección de capas procedimentales de material
 * doc/CMR_Web_System_v2_Documentation/docs/05_LIVING_FRAMES_AND_SELECTION.md y 06_MATERIAL_SYSTEM.md
 */

import { MaterialFactory } from './registry/MaterialFactory.js';
import { MaterialState } from './contracts/MaterialState.js';

export class LivingFrameController {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.frames = [];
    this.materialInstances = new Map();
    this.activeFrame = null;
    this._onPointerMove = this._handlePointerMove.bind(this);
  }

  mount() {
    this.frames = Array.from(document.querySelectorAll('.living-frame'));

    this.frames.forEach((frame, idx) => {
      if (!frame.dataset.id) {
        frame.dataset.id = `frame-${idx + 1}`;
      }

      // Asignar material por defecto si no viene especificado
      if (!frame.dataset.material) {
        const defaultMaterials = ['roots', 'stone', 'arcane', 'mechanism', 'frost'];
        frame.dataset.material = defaultMaterials[idx % defaultMaterials.length];
      }

      if (!frame.hasAttribute('tabindex')) {
        frame.setAttribute('tabindex', '0');
      }
      frame.setAttribute('role', 'button');
      frame.setAttribute('aria-selected', 'false');

      // Capa SVG procedimental para trazos vivos de autor
      let svg = frame.querySelector('.living-frame-svg');
      if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'living-frame-svg');
        svg.setAttribute('aria-hidden', 'true');
        frame.prepend(svg);
      }

      // Instanciar material hiper-modular
      const material = MaterialFactory.create(frame.dataset.material);
      material.mount(frame, svg);
      this.materialInstances.set(frame, material);

      // Eventos Pointer
      frame.addEventListener('pointerenter', () => {
        if (frame !== this.activeFrame) {
          material.enterState(MaterialState.HOVER);
        }
      });

      frame.addEventListener('pointerleave', () => {
        if (frame !== this.activeFrame) {
          material.enterState(MaterialState.DORMANT);
        }
      });

      frame.addEventListener('pointerdown', () => {
        if (frame !== this.activeFrame) {
          material.enterState(MaterialState.PRESS);
        }
      });

      // Selección por Clic o Teclado
      frame.addEventListener('click', () => {
        this.selectFrame(frame);
      });

      frame.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectFrame(frame);
        }
      });
    });

    window.addEventListener('pointermove', this._onPointerMove, { passive: true });
  }

  _handlePointerMove(e) {
    // Actualizar cálculo fino de proximidad hacia cada marco vivo
    this.frames.forEach((frame) => {
      if (frame === this.activeFrame) return;

      const rect = frame.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.hypot(distX, distY);
      const radius = Math.max(rect.width, rect.height) * 1.3;

      const proximity = Math.max(0, Math.min(1, 1 - distance / radius));
      const material = this.materialInstances.get(frame);
      if (material) {
        material.updateProximity(proximity, e.clientX, e.clientY);
      }
    });
  }

  selectFrame(selectedFrame) {
    if (this.activeFrame && this.activeFrame !== selectedFrame) {
      const prevMaterial = this.materialInstances.get(this.activeFrame);
      if (prevMaterial) {
        prevMaterial.enterState(MaterialState.DORMANT);
      }
    }

    const material = this.materialInstances.get(selectedFrame);
    if (material) {
      material.enterState(MaterialState.SELECTED);
    }
    this.activeFrame = selectedFrame;

    if (this.eventBus) {
      this.eventBus.emit('frame:select', {
        id: selectedFrame.dataset.id,
        material: selectedFrame.dataset.material,
        element: selectedFrame
      });
    }
  }

  destroy() {
    window.removeEventListener('pointermove', this._onPointerMove);
    this.materialInstances.forEach((mat) => mat.destroy());
    this.materialInstances.clear();
    this.frames = [];
    this.activeFrame = null;
  }
}
