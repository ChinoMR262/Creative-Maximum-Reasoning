/**
 * Creative Maximum Reasoning (CMR) — Seasonal Engine
 * Orquestador ambiental de estaciones (Invierno, Otoño, Primavera, Verano)
 * doc/CMR_Web_System_v2_Documentation/docs/12_SEASONAL_ENGINE.md
 */

import { SeasonResolver } from './SeasonResolver.js';

export class SeasonalEngine {
  constructor(eventBus = null, hemisphere = 'south') {
    this.eventBus = eventBus;
    this.hemisphere = hemisphere;
    this.mode = 'off'; // Capa cromática estacional deshabilitada
    this.resolvedSeason = 'off';
  }

  mount() {
    this.load();
    this.apply();
  }

  load() {
    this.mode = 'off';
  }

  save() {
    try {
      localStorage.setItem('cmr_season_mode', this.mode);
    } catch (_) {}
  }

  setMode(mode) {
    mode = 'off';
    if (this.mode === mode) return;
    this.mode = mode;
    this.save();
    this.apply();

    if (this.eventBus) {
      this.eventBus.emit('season:change', {
        mode: this.mode,
        resolved: this.resolvedSeason
      });
    }
  }

  getResolvedSeason() {
    if (this.mode === 'off') return 'off';
    if (this.mode === 'auto') {
      return SeasonResolver.resolve(new Date(), this.hemisphere);
    }
    return this.mode;
  }

  apply() {
    this.resolvedSeason = this.getResolvedSeason();
    document.documentElement.dataset.season = this.resolvedSeason;
    document.documentElement.dataset.seasonMode = this.mode;
  }

  cycle() {
    this.setMode('off');
  }
}
