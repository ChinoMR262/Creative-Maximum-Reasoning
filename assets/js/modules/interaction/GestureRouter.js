/**
 * Creative Maximum Reasoning (CMR) — Gesture Router
 * Ruteo desacoplado de gestos (Tap, Press/Hold, Swipe horizontal, Teclado)
 * doc/CMR_Web_System_v2_Documentation/docs/07_INTERACTION_PROXIMITY_GESTURES.md
 */

export class GestureRouter {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.holdTimer = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.isHolding = false;

    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerCancel = this.onPointerCancel.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  mount() {
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    window.addEventListener('pointerup', this.onPointerUp, { passive: true });
    window.addEventListener('pointercancel', this.onPointerCancel, { passive: true });

    window.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchend', this.onTouchEnd, { passive: true });

    window.addEventListener('keydown', this.onKeyDown);
  }

  destroy() {
    window.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerCancel);

    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchend', this.onTouchEnd);

    window.removeEventListener('keydown', this.onKeyDown);
    this.clearHold();
  }

  onPointerDown(e) {
    this.clearHold();
    const target = e.target.closest('.living-frame, .btn, .rail-item, [role="button"]');
    if (!target) return;

    // Iniciar temporizador de press/hold (220ms)
    this.holdTimer = setTimeout(() => {
      this.isHolding = true;
      target.setAttribute('data-state-hold', 'true');

      if (this.eventBus) {
        this.eventBus.emit('gesture:hold', {
          target,
          x: e.clientX,
          y: e.clientY
        });
      }
    }, 220);
  }

  onPointerUp(e) {
    this.clearHold();
  }

  onPointerCancel(e) {
    this.clearHold();
  }

  clearHold() {
    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
    if (this.isHolding) {
      document.querySelectorAll('[data-state-hold="true"]').forEach(el => {
        el.removeAttribute('data-state-hold');
      });
      this.isHolding = false;
      if (this.eventBus) {
        this.eventBus.emit('gesture:hold:end');
      }
    }
  }

  onTouchStart(e) {
    if (e.touches.length === 1) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.touchStartTime = performance.now();
    }
  }

  onTouchEnd(e) {
    if (e.changedTouches.length === 0) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - this.touchStartX;
    const deltaY = endY - this.touchStartY;
    const elapsed = performance.now() - this.touchStartTime;

    // Descarte si duró demasiado o fue muy corto
    if (elapsed > 600 || elapsed < 50) return;

    // Swipe horizontal claro (mínimo 45px de recorrido y el eje X supera al Y por factor 1.4)
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      const direction = deltaX > 0 ? 'right' : 'left';
      const velocity = Math.abs(deltaX) / elapsed;

      if (this.eventBus) {
        this.eventBus.emit('gesture:swipe', {
          direction,
          velocity,
          deltaX,
          deltaY
        });
      }
    }
  }

  onKeyDown(e) {
    // Si el usuario presiona Escape, avisar para cerrar overlays o preview activos
    if (e.key === 'Escape') {
      if (this.eventBus) {
        this.eventBus.emit('gesture:escape');
      }
    }
  }
}
