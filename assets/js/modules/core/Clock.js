/**
 * Creative Maximum Reasoning (CMR) — Unified Clock
 * Fuente única de tiempo continuo para evitar múltiples loops desincronizados
 * doc/CMR_Web_System_v2_Documentation/docs/03_ARCHITECTURE_CORE_ENGINE.md
 */

export class Clock {
  constructor() {
    this.subscribers = new Set();
    this.isRunning = false;
    this.rafId = null;
    this.lastTime = performance.now();
    this.elapsedTime = 0;
    this.isPaused = false;

    this.handleVisibility = this.handleVisibility.bind(this);
    this.tick = this.tick.bind(this);
  }

  /**
   * Inicia el bucle de tiempo y registra observadores de visibilidad.
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    document.addEventListener('visibilitychange', this.handleVisibility);
    this.rafId = requestAnimationFrame(this.tick);
  }

  /**
   * Detiene el bucle de tiempo.
   */
  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    document.removeEventListener('visibilitychange', this.handleVisibility);
  }

  /**
   * Pausa o reanuda el clock según visibilidad de pestaña.
   */
  handleVisibility() {
    if (document.hidden) {
      this.isPaused = true;
    } else {
      this.isPaused = false;
      this.lastTime = performance.now();
    }
  }

  /**
   * Suscribe una función que recibe (dt, elapsedTime).
   */
  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  /**
   * Ciclo de actualización central.
   */
  tick(currentTime) {
    if (!this.isRunning) return;

    if (!this.isPaused) {
      const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Clamp para evitar saltos bruscos
      this.lastTime = currentTime;
      this.elapsedTime += dt;

      for (const fn of this.subscribers) {
        try {
          fn(dt, this.elapsedTime);
        } catch (err) {
          console.error('[CMR Clock] Error en suscriptor de frame:', err);
        }
      }
    }

    this.rafId = requestAnimationFrame(this.tick);
  }
}
