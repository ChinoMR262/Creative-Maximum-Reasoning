/**
 * Creative Maximum Reasoning (CMR) — EventBus Core
 * Bus de eventos desacoplado y reactivo de alto rendimiento
 * doc/CMR_Web_System_v2_Documentation/docs/03_ARCHITECTURE_CORE_ENGINE.md
 */

export class EventBus {
  constructor() {
    this.handlers = new Map();
  }

  /**
   * Suscribe un callback a un evento específico.
   * Retorna una función para desuscribirse limpiamente.
   */
  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event).add(handler);

    return () => this.off(event, handler);
  }

  /**
   * Elimina un callback registrado.
   */
  off(event, handler) {
    const set = this.handlers.get(event);
    if (set) {
      set.delete(handler);
      if (set.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  /**
   * Emite un evento a todos los suscriptores.
   */
  emit(event, payload) {
    const set = this.handlers.get(event);
    if (set) {
      for (const handler of set) {
        try {
          handler(payload);
        } catch (err) {
          console.error(`[CMR EventBus] Error en handler del evento "${event}":`, err);
        }
      }
    }
  }

  /**
   * Limpia todos los eventos registrados.
   */
  clear() {
    this.handlers.clear();
  }
}
