/**
 * Creative Maximum Reasoning (CMR) — Resource Manager
 * Gestión quirúrgica del ciclo de vida de recursos de GPU y memoria
 * doc/CMR_Web_System_v2_Documentation/docs/08_RENDERING_WEBGPU_THREE_TSL.md
 */

export class ResourceManager {
  constructor() {
    this.trackedResources = new Map();
  }

  /**
   * Registra un recurso con su función destructora específica
   * @param {any} resource - Referencia al objeto, buffer o textura
   * @param {Function} cleanup - Callback para liberar el recurso en la GPU
   */
  track(resource, cleanup) {
    if (!resource) return;
    this.trackedResources.set(resource, cleanup);
  }

  /**
   * Libera un recurso específico
   * @param {any} resource 
   */
  release(resource) {
    if (!resource || !this.trackedResources.has(resource)) return;
    const cleanup = this.trackedResources.get(resource);
    try {
      if (typeof cleanup === 'function') {
        cleanup();
      } else if (resource.destroy && typeof resource.destroy === 'function') {
        resource.destroy();
      } else if (resource.dispose && typeof resource.dispose === 'function') {
        resource.dispose();
      }
    } catch (err) {
      console.warn('[CMR ResourceManager] Error al liberar recurso individual:', err);
    }
    this.trackedResources.delete(resource);
  }

  /**
   * Libera todos los recursos rastreados en la GPU
   */
  disposeAll() {
    for (const [resource, cleanup] of this.trackedResources.entries()) {
      try {
        if (typeof cleanup === 'function') {
          cleanup();
        } else if (resource.destroy && typeof resource.destroy === 'function') {
          resource.destroy();
        } else if (resource.dispose && typeof resource.dispose === 'function') {
          resource.dispose();
        }
      } catch (err) {
        console.warn('[CMR ResourceManager] Error durante disposeAll:', err);
      }
    }
    this.trackedResources.clear();
  }
}
