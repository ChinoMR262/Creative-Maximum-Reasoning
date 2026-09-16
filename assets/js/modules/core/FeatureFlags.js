/**
 * Creative Maximum Reasoning (CMR) — Feature Flags
 * Control granular de subsistemas en tiempo de ejecución
 * doc/CMR_Web_System_v2_Documentation/docs/03_ARCHITECTURE_CORE_ENGINE.md
 */

export class FeatureFlags {
  constructor(initialFlags = {}) {
    this.flags = {
      livingRail: true,
      proximity: true,
      livingFrames: true,
      graphics: true,
      seasonalLayer: true,
      previews: true,
      motionTransitions: true,
      audioFeedback: false,
      ...initialFlags
    };

    this.loadOverrides();
  }

  loadOverrides() {
    try {
      const stored = localStorage.getItem('cmr_flags');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.flags = { ...this.flags, ...parsed };
      }
    } catch (_) {
      // Ignorar fallo de almacenamiento si cookies o localStorage están bloqueados
    }
  }

  isEnabled(flagName) {
    return Boolean(this.flags[flagName]);
  }

  set(flagName, value) {
    this.flags[flagName] = Boolean(value);
    try {
      localStorage.setItem('cmr_flags', JSON.stringify(this.flags));
    } catch (_) {}
  }
}
