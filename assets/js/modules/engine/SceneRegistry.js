/**
 * Creative Maximum Reasoning (CMR) — Scene Registry
 * Registro desacoplado de zonas tridimensionales y capas visuales independientes
 * doc/CMR_Web_System_v2_Documentation/docs/08_RENDERING_WEBGPU_THREE_TSL.md
 */

export class SceneRegistry {
  constructor() {
    this.scenes = new Map();
  }

  /**
   * Registra una zona/escena en el sistema
   * @param {string} id - Identificador de la zona ('ambient', 'hero', 'rail', 'previews')
   * @param {Object} scene - Instancia con contrato { update?, render?, resize?, dispose?, enabled? }
   */
  register(id, scene) {
    if (!id || !scene) return;
    if (typeof scene.enabled === 'undefined') {
      scene.enabled = true;
    }
    this.scenes.set(id, scene);
  }

  /**
   * Desregistra y libera una zona
   * @param {string} id 
   */
  unregister(id) {
    const scene = this.scenes.get(id);
    if (scene) {
      if (typeof scene.dispose === 'function') {
        scene.dispose();
      }
      this.scenes.delete(id);
    }
  }

  /**
   * Obtiene una zona registrada
   * @param {string} id 
   */
  get(id) {
    return this.scenes.get(id);
  }

  /**
   * Activa una zona
   * @param {string} id 
   */
  enable(id) {
    const scene = this.scenes.get(id);
    if (scene) scene.enabled = true;
  }

  /**
   * Desactiva una zona para no consumir ciclos de cálculo o GPU
   * @param {string} id 
   */
  disable(id) {
    const scene = this.scenes.get(id);
    if (scene) scene.enabled = false;
  }

  /**
   * Actualiza todas las zonas activas
   * @param {number} dt 
   * @param {number} t 
   */
  updateAll(dt, t) {
    for (const [id, scene] of this.scenes.entries()) {
      if (scene.enabled && typeof scene.update === 'function') {
        scene.update(dt, t);
      }
    }
  }

  /**
   * Renderiza todas las zonas activas
   * @param {any} adapter 
   * @param {any} ctx 
   */
  renderAll(adapter, ctx) {
    for (const [id, scene] of this.scenes.entries()) {
      if (scene.enabled && typeof scene.render === 'function') {
        scene.render(adapter, ctx);
      }
    }
  }

  /**
   * Ajusta resolución y proporciones de todas las zonas
   * @param {number} width 
   * @param {number} height 
   * @param {number} dpr 
   */
  resizeAll(width, height, dpr) {
    for (const [id, scene] of this.scenes.entries()) {
      if (typeof scene.resize === 'function') {
        scene.resize(width, height, dpr);
      }
    }
  }

  /**
   * Libera todas las zonas registradas
   */
  disposeAll() {
    for (const [id, scene] of this.scenes.entries()) {
      if (typeof scene.dispose === 'function') {
        scene.dispose();
      }
    }
    this.scenes.clear();
  }
}
