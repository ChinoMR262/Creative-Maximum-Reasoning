/**
 * Creative Maximum Reasoning (CMR) — Rail Controls Component
 * Controles mecánicos inferiores (Tema, Estación, Calidad) con feedback visual
 */

export class RailControls {
  constructor(themeState, seasonalEngine, qualityManager) {
    this.themeState = themeState;
    this.seasonalEngine = seasonalEngine;
    this.qualityManager = qualityManager;
    this.element = null;
  }

  render() {
    const bottom = document.createElement('div');
    bottom.className = 'rail-bottom';

    bottom.innerHTML = `
      <div class="rail-tier-wrapper">
        <span class="rail-tier-label">Rendimiento</span>
        <span class="rail-tier-badge" id="railTierBadge" title="Nivel de Rendimiento">${this.qualityManager.getTier()}</span>
      </div>

      <div class="rail-controls-stack">
        <!-- Selector de Tema -->
        <button class="rail-control-btn" id="railThemeBtn" title="Cambiar Tema (Alt+T)" aria-label="Cambiar Tema">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
          <span class="rail-control-label">Tema: <strong id="railThemeTag">SYS</strong></span>
        </button>

        <!-- Selector de Estación -->
        <button class="rail-control-btn" id="railSeasonBtn" title="Capa Estacional (Alt+S)" aria-label="Capa Estacional">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <span class="rail-control-label">Estación: <strong id="railSeasonTag">AUT</strong></span>
        </button>
      </div>
    `;

    const themeBtn = bottom.querySelector('#railThemeBtn');
    themeBtn?.addEventListener('click', () => {
      this.themeState.cycle();
      this.updateLabels();
    });

    const seasonBtn = bottom.querySelector('#railSeasonBtn');
    seasonBtn?.addEventListener('click', () => {
      this.seasonalEngine.cycle();
      this.updateLabels();
    });

    this.element = bottom;
    this.updateLabels();
    return bottom;
  }

  updateLabels() {
    if (!this.element) return;

    // Tema
    const mode = this.themeState.mode;
    const resolved = this.themeState.getResolvedTheme();
    const themeTag = this.element.querySelector('#railThemeTag');
    const themeTooltip = this.element.querySelector('#railThemeTooltip');

    if (themeTag) {
      themeTag.textContent = mode === 'system' ? 'SYS' : mode === 'light' ? 'LGT' : 'DRK';
    }
    if (themeTooltip) {
      themeTooltip.textContent = `${mode.toUpperCase()} (${resolved})`;
    }

    // Estación
    const sMode = this.seasonalEngine.mode;
    const sResolved = this.seasonalEngine.resolvedSeason;
    const seasonTag = this.element.querySelector('#railSeasonTag');
    const seasonTooltip = this.element.querySelector('#railSeasonTooltip');

    if (seasonTag) {
      seasonTag.textContent = sMode === 'auto' ? 'AUT' : sMode.substring(0, 3).toUpperCase();
    }
    if (seasonTooltip) {
      seasonTooltip.textContent = `${sMode.toUpperCase()} (${sResolved})`;
    }

    // Calidad
    const tierBadge = this.element.querySelector('#railTierBadge');
    if (tierBadge) {
      tierBadge.textContent = this.qualityManager.getTier();
    }
  }
}
