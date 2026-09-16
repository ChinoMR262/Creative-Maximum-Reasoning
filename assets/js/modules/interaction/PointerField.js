/**
 * Creative Maximum Reasoning (CMR) — Pointer Field
 * Normalización de coordenadas de entrada y velocidad para interacción fluida
 * doc/CMR_Web_System_v2_Documentation/docs/07_INTERACTION_PROXIMITY_GESTURES.md
 */

export class PointerField {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.vx = 0;
    this.vy = 0;
    this.lastX = this.x;
    this.lastY = this.y;
    this.lastTime = performance.now();
    this.isDirty = false;

    this.onPointerMove = this.onPointerMove.bind(this);
  }

  mount() {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    // Inyección de posición inicial
    document.documentElement.style.setProperty('--cmr-pointer-x', `${this.x}px`);
    document.documentElement.style.setProperty('--cmr-pointer-y', `${this.y}px`);
  }

  destroy() {
    window.removeEventListener('pointermove', this.onPointerMove);
  }

  onPointerMove(e) {
    this.x = e.clientX;
    this.y = e.clientY;
    this.isDirty = true;
  }

  /**
   * Actualización sincronizada con el frame para evitar recalcular estilos en cada evento.
   */
  update(dt, t) {
    if (!this.isDirty) return;
    this.isDirty = false;

    const now = performance.now();
    const timeDelta = Math.max(1, now - this.lastTime);
    this.vx = (this.x - this.lastX) / timeDelta;
    this.vy = (this.y - this.lastY) / timeDelta;
    this.lastX = this.x;
    this.lastY = this.y;
    this.lastTime = now;

    // Actualizar propiedades CSS personalizadas
    document.documentElement.style.setProperty('--cmr-pointer-x', `${this.x}px`);
    document.documentElement.style.setProperty('--cmr-pointer-y', `${this.y}px`);

    if (this.eventBus) {
      this.eventBus.emit('input:pointer', {
        x: this.x,
        y: this.y,
        vx: this.vx,
        vy: this.vy
      });
    }
  }
}
