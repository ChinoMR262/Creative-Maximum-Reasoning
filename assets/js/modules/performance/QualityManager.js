/**
 * Creative Maximum Reasoning (CMR) — Quality Manager
 * Monitoreo adaptativo de rendimiento y degradación elegante de efectos
 * doc/CMR_Web_System_v2_Documentation/docs/16_PERFORMANCE_ADAPTIVE_QUALITY.md
 */

export class QualityManager {
  constructor(initialTier = 'high', eventBus = null) {
    this.currentTier = initialTier;
    this.eventBus = eventBus;
    this.tiers = ['safe', 'low', 'medium', 'high', 'ultra'];
    
    this.frameCount = 0;
    this.lastFpsCheck = performance.now();
    this.fpsHistory = [];
    this.consecutiveLowFps = 0;
    this.consecutiveHighFps = 0;
  }

  getTier() {
    return this.currentTier;
  }

  setTier(newTier) {
    if (!this.tiers.includes(newTier)) return;
    if (this.currentTier === newTier) return;

    this.currentTier = newTier;
    document.documentElement.dataset.tier = newTier;

    if (this.eventBus) {
      this.eventBus.emit('quality:change', { tier: newTier });
    }
  }

  /**
   * Actualización llamada en cada frame desde el Clock.
   */
  update(dt) {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastFpsCheck;

    if (elapsed >= 1000) {
      const currentFps = (this.frameCount * 1000) / elapsed;
      this.frameCount = 0;
      this.lastFpsCheck = now;
      this.lastFps = Math.round(currentFps);

      this.evaluatePerformance(currentFps);

      if (this.eventBus) {
        this.eventBus.emit('quality:metrics', {
          fps: this.lastFps,
          tier: this.currentTier,
          frameTimeMs: (1000 / (this.lastFps || 60)).toFixed(1)
        });
      }
    }
  }

  /**
   * Evalúa la estabilidad de FPS y aplica degradación adaptativa con histéresis.
   */
  evaluatePerformance(fps) {
    // Si el usuario activó reduced-motion, forzar Safe
    if (document.documentElement.dataset.reducedMotion === 'true') {
      if (this.currentTier !== 'safe') {
        this.setTier('safe');
      }
      return;
    }

    if (fps < 38) {
      this.consecutiveLowFps++;
      this.consecutiveHighFps = 0;

      // Degradar si hay 3 segundos consecutivos de lag
      if (this.consecutiveLowFps >= 3) {
        this.consecutiveLowFps = 0;
        this.downgrade();
      }
    } else if (fps >= 57) {
      this.consecutiveHighFps++;
      this.consecutiveLowFps = 0;

      // Subir sólo tras 15 segundos muy estables
      if (this.consecutiveHighFps >= 15) {
        this.consecutiveHighFps = 0;
        this.upgrade();
      }
    } else {
      this.consecutiveLowFps = 0;
      this.consecutiveHighFps = 0;
    }
  }

  downgrade() {
    const idx = this.tiers.indexOf(this.currentTier);
    if (idx > 0) {
      this.setTier(this.tiers[idx - 1]);
    }
  }

  upgrade() {
    const idx = this.tiers.indexOf(this.currentTier);
    if (idx < this.tiers.length - 1) {
      this.setTier(this.tiers[idx + 1]);
    }
  }
}
