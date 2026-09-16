/**
 * Creative Maximum Reasoning (CMR) — Pointer Field
 * Normalización de coordenadas de entrada, velocidad suavizada, tipo y reposo idle
 * doc/CMR_Web_System_v2_Documentation/docs/07_INTERACTION_PROXIMITY_GESTURES.md
 */

export class PointerField {
  constructor(eventBus = null, idleThresholdMs = 4000) {
    this.eventBus = eventBus;
    this.idleThresholdMs = idleThresholdMs;

    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.normX = 0.5;
    this.normY = 0.5;

    this.vx = 0;
    this.vy = 0;
    this.smoothSpeed = 0;
    this.angle = 0;
    this.directionX = 0;
    this.directionY = 0;

    this.lastX = this.x;
    this.lastY = this.y;
    this.lastTime = performance.now();
    this.lastActivity = performance.now();

    this.pointerType = 'mouse'; // 'mouse' | 'touch' | 'pen'
    this.isDirty = false;
    this.isIdle = false;

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
  }

  mount() {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });

    // Inyección de propiedades CSS iniciales
    document.documentElement.style.setProperty('--cmr-pointer-x', `${this.x}px`);
    document.documentElement.style.setProperty('--cmr-pointer-y', `${this.y}px`);
    document.documentElement.style.setProperty('--cmr-pointer-speed-norm', '0');
    document.documentElement.dataset.idle = 'false';
  }

  destroy() {
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerdown', this.onPointerDown);
  }

  onPointerDown(e) {
    this.pointerType = e.pointerType || 'mouse';
    this.resetIdle();
  }

  onPointerMove(e) {
    this.x = e.clientX;
    this.y = e.clientY;
    this.pointerType = e.pointerType || 'mouse';
    this.isDirty = true;
    this.resetIdle();
  }

  resetIdle() {
    this.lastActivity = performance.now();
    if (this.isIdle) {
      this.isIdle = false;
      document.documentElement.dataset.idle = 'false';
      if (this.eventBus) {
        this.eventBus.emit('idle:end');
      }
    }
  }

  /**
   * Actualización sincronizada con el frame para evitar reflows innecesarios.
   */
  update(dt, t) {
    const now = performance.now();

    // 1. Verificación de inactividad (Idle State)
    if (!this.isIdle && now - this.lastActivity > this.idleThresholdMs) {
      this.isIdle = true;
      this.smoothSpeed = 0;
      document.documentElement.dataset.idle = 'true';
      document.documentElement.style.setProperty('--cmr-pointer-speed-norm', '0');
      if (this.eventBus) {
        this.eventBus.emit('idle:start');
      }
    }

    if (!this.isDirty) {
      // Disipación exponencial gradual de la velocidad residual
      if (this.smoothSpeed > 0.001) {
        this.smoothSpeed *= 0.85;
        const norm = Math.min(1, this.smoothSpeed / 1.5).toFixed(3);
        document.documentElement.style.setProperty('--cmr-pointer-speed-norm', norm);
      }
      return;
    }

    this.isDirty = false;

    const timeDelta = Math.max(1, now - this.lastTime);
    const rawVx = (this.x - this.lastX) / timeDelta;
    const rawVy = (this.y - this.lastY) / timeDelta;
    const rawSpeed = Math.hypot(rawVx, rawVy);

    // Filtro pasa-bajos exponencial para velocidad suavizada
    this.smoothSpeed = this.smoothSpeed * 0.7 + rawSpeed * 0.3;
    this.vx = rawVx;
    this.vy = rawVy;

    if (rawSpeed > 0.01) {
      this.directionX = rawVx / rawSpeed;
      this.directionY = rawVy / rawSpeed;
      this.angle = Math.atan2(rawVy, rawVx);
    }

    this.lastX = this.x;
    this.lastY = this.y;
    this.lastTime = now;

    // Normalización dentro del viewport
    const winW = window.innerWidth || 1;
    const winH = window.innerHeight || 1;
    this.normX = Math.max(0, Math.min(1, this.x / winW));
    this.normY = Math.max(0, Math.min(1, this.y / winH));

    const speedNorm = Math.min(1, this.smoothSpeed / 1.5);

    // Actualizar propiedades CSS personalizadas
    document.documentElement.style.setProperty('--cmr-pointer-x', `${this.x}px`);
    document.documentElement.style.setProperty('--cmr-pointer-y', `${this.y}px`);
    document.documentElement.style.setProperty('--cmr-pointer-speed-norm', speedNorm.toFixed(3));

    if (this.eventBus) {
      this.eventBus.emit('input:pointer', {
        x: this.x,
        y: this.y,
        normX: this.normX,
        normY: this.normY,
        vx: this.vx,
        vy: this.vy,
        speed: this.smoothSpeed,
        speedNorm: speedNorm,
        angle: this.angle,
        pointerType: this.pointerType,
        isIdle: this.isIdle
      });
    }
  }
}
