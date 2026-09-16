/**
 * Creative Maximum Reasoning (CMR) — Capability Detector
 * Análisis no intrusivo del dispositivo y determinación del Quality Tier inicial
 * doc/CMR_Web_System_v2_Documentation/docs/16_PERFORMANCE_ADAPTIVE_QUALITY.md
 */

export class CapabilityDetector {
  /**
   * Ejecuta el diagnóstico de capacidades del cliente.
   */
  static detect() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let webgl2 = false;
    try {
      const canvas = document.createElement('canvas');
      webgl2 = Boolean(canvas.getContext('webgl2'));
    } catch (_) {
      webgl2 = false;
    }

    const webgpu = Boolean(navigator.gpu);

    // Determinación del Quality Tier
    let tier = 'high';
    if (reducedMotion || saveData || !webgl2) {
      tier = 'safe';
    } else if (memory <= 2 || cores <= 2) {
      tier = 'low';
    } else if (memory <= 4 || cores <= 4 || coarsePointer) {
      tier = 'medium';
    } else if (memory >= 8 && cores >= 8 && (webgpu || webgl2)) {
      tier = 'ultra';
    }

    const profile = {
      tier,
      reducedMotion,
      coarsePointer,
      saveData,
      cores,
      memory,
      dpr,
      webgl2,
      webgpu
    };

    // Publicar perfil en el DOM para CSS condicional
    document.documentElement.dataset.tier = profile.tier;
    if (profile.reducedMotion) {
      document.documentElement.dataset.reducedMotion = 'true';
    }

    return profile;
  }
}
