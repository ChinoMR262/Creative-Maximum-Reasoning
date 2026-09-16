/**
 * Creative Maximum Reasoning (CMR) — Proximity Engine
 * Detección radial continua de cercanía a elementos interactivos
 * doc/CMR_Web_System_v2_Documentation/docs/07_INTERACTION_PROXIMITY_GESTURES.md
 */

export class ProximityEngine {
  constructor(pointerField, maxDistance = 320) {
    this.pointer = pointerField;
    this.maxDistance = maxDistance;
    this.elements = [];
  }

  mount() {
    this.refreshElements();
    window.addEventListener('resize', () => this.refreshElements(), { passive: true });
  }

  refreshElements() {
    this.elements = Array.from(document.querySelectorAll('.living-frame, .rail-brand, .rail-item, .btn'));
  }

  update(dt, t) {
    // Si la pantalla es táctil pura o reduced-motion, no calcular proximidad continua
    if (document.documentElement.dataset.reducedMotion === 'true') return;

    const px = this.pointer.x;
    const py = this.pointer.y;

    for (const el of this.elements) {
      const rect = el.getBoundingClientRect();
      // Omitir elementos completamente fuera de pantalla
      if (rect.bottom < 0 || rect.top > window.innerHeight) continue;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = px - centerX;
      const dy = py - centerY;
      const distance = Math.hypot(dx, dy);

      if (distance < this.maxDistance) {
        const proximity = Math.max(0, 1 - distance / this.maxDistance);
        const localX = Math.max(0, Math.min(100, ((px - rect.left) / rect.width) * 100));
        const localY = Math.max(0, Math.min(100, ((py - rect.top) / rect.height) * 100));

        el.style.setProperty('--proximity', proximity.toFixed(3));
        el.style.setProperty('--px', `${localX.toFixed(1)}%`);
        el.style.setProperty('--py', `${localY.toFixed(1)}%`);

        // Micro-inclinación 3D sutil sólo si el cursor está sobre el elemento
        if (px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom) {
          const rx = ((50 - localY) * 0.05).toFixed(2);
          const ry = ((localX - 50) * 0.05).toFixed(2);
          el.style.setProperty('--rx', `${rx}deg`);
          el.style.setProperty('--ry', `${ry}deg`);
        } else {
          el.style.setProperty('--rx', '0deg');
          el.style.setProperty('--ry', '0deg');
        }
      } else {
        if (el.style.getPropertyValue('--proximity') !== '0') {
          el.style.setProperty('--proximity', '0');
          el.style.setProperty('--rx', '0deg');
          el.style.setProperty('--ry', '0deg');
        }
      }
    }
  }

  destroy() {
    this.elements = [];
  }
}
