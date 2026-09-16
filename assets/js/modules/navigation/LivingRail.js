/**
 * Creative Maximum Reasoning (CMR) — Living Rail Orchestrator
 * Arquitectura hiper-modular de navegación viva de autor
 * doc/CMR_Web_System_v2_Documentation/docs/04_LIVING_NAVIGATION.md
 */

import { RailBrand } from './components/RailBrand.js';
import { RailNavList } from './components/RailNavList.js';
import { RailControls } from './components/RailControls.js';
import { RailScrollSpy } from './components/RailScrollSpy.js';
import { NavArtifact } from './mobile/NavArtifact.js';

export class LivingRail {
  constructor(themeState, seasonalEngine, qualityManager, eventBus = null) {
    this.themeState = themeState;
    this.seasonalEngine = seasonalEngine;
    this.qualityManager = qualityManager;
    this.eventBus = eventBus;

    this.railEl = null;
    this.navList = new RailNavList();
    this.controls = new RailControls(themeState, seasonalEngine, qualityManager);
    this.scrollSpy = null;
    this.mobileArtifact = new NavArtifact(themeState, qualityManager);
  }

  mount() {
    this.renderDesktopRail();
    this.renderMobile();
    this.listenEvents();
  }

  renderDesktopRail() {
    if (document.querySelector('.cmr-rail')) return;

    const rail = document.createElement('aside');
    rail.className = 'cmr-rail';
    rail.setAttribute('aria-label', 'Navegación Lateral CMR');

    // Ensamblar componentes modulares
    const topContainer = document.createElement('div');
    topContainer.className = 'rail-top';
    topContainer.appendChild(RailBrand.render());
    topContainer.appendChild(this.navList.render());

    rail.appendChild(topContainer);
    rail.appendChild(this.controls.render());

    document.body.prepend(rail);
    this.railEl = rail;

    // Inicializar observador de scroll desacoplado
    this.scrollSpy = new RailScrollSpy(rail);
    this.scrollSpy.mount();
  }

  renderMobile() {
    const mobileEl = this.mobileArtifact.render();
    if (mobileEl) {
      document.body.appendChild(mobileEl);
    }
  }

  listenEvents() {
    if (this.eventBus) {
      this.eventBus.on('quality:change', () => this.controls.updateLabels());
      this.eventBus.on('theme:change', () => this.controls.updateLabels());
      this.eventBus.on('season:change', () => this.controls.updateLabels());
    }
  }

  destroy() {
    this.scrollSpy?.destroy();
    this.navList?.destroy();
    this.mobileArtifact?.destroy();
    this.railEl?.remove();
  }
}
