/**
 * Creative Maximum Reasoning (CMR) — Central Engine
 * Ensamblador y orquestador maestro de la arquitectura CMR Web System v2
 * doc/CMR_Web_System_v2_Documentation/docs/03_ARCHITECTURE_CORE_ENGINE.md
 */

import { EventBus } from '../core/EventBus.js';
import { Clock } from '../core/Clock.js';
import { CapabilityDetector } from '../core/CapabilityDetector.js';
import { FeatureFlags } from '../core/FeatureFlags.js';
import { QualityManager } from '../performance/QualityManager.js';
import { PointerField } from '../interaction/PointerField.js';
import { ProximityEngine } from '../interaction/ProximityEngine.js';
import { ThemeState } from '../theme/ThemeState.js';
import { SeasonalEngine } from '../theme/SeasonalEngine.js';
import { LivingFrameController } from '../materials/LivingFrameController.js';
import { LivingRail } from '../navigation/LivingRail.js';
import { ParticleSystem } from '../graphics/ParticleSystem.js';
import { SecurityHardening } from '../security/SecurityHardening.js';
import { CodexModal } from '../interaction/CodexModal.js';

export class CMREngine {
  constructor() {
    this.eventBus = new EventBus();
    this.clock = new Clock();
    this.flags = new FeatureFlags();
    
    // 1. Diagnóstico de capacidades y determinación de Tier
    this.capabilities = CapabilityDetector.detect();
    
    // 2. Gestor de calidad adaptativa
    this.quality = new QualityManager(this.capabilities.tier, this.eventBus);

    // 3. Subsistemas de interacción
    this.pointer = new PointerField(this.eventBus);
    this.proximity = new ProximityEngine(this.pointer);
    this.codexModal = new CodexModal();


    // 4. Subsistemas de tema y estaciones
    this.theme = new ThemeState(this.eventBus);
    this.seasonal = new SeasonalEngine(this.eventBus, 'south');

    // 5. Subsistema de materiales y navegación
    this.frames = new LivingFrameController(this.eventBus);
    this.rail = new LivingRail(this.theme, this.seasonal, this.quality, this.eventBus);

    // 6. Subsistema gráfico de partículas
    this.particles = new ParticleSystem(this.quality, this.seasonal, this.eventBus);

    this.isMounted = false;
  }

  mount() {
    if (this.isMounted) return;
    this.isMounted = true;

    // A. Aplicar endurecimiento de seguridad
    SecurityHardening.apply();

    // B. Montar subsistemas
    this.theme.mount();
    this.seasonal.mount();
    this.pointer.mount();
    this.proximity.mount();
    this.frames.mount();
    this.rail.mount();
    this.particles.mount();
    this.codexModal.mount();

    // C. Conectar reloj central de animación
    this.clock.subscribe((dt, t) => {
      this.pointer.update(dt, t);
      this.proximity.update(dt, t);
      this.particles.update(dt, t);
      this.quality.update(dt);
    });

    this.clock.start();

    // D. Registrar atajos de teclado globales accesibles
    this.setupGlobalShortcuts();

    // E. Conectar disparadores de vistas previas de aplicaciones
    this.setupAppPreviewTriggers();

    // Log sobrio de confirmación de arranque en consola
    console.info(
      `%c[CMR Engine v2.0] Operativo | Tier: ${this.quality.getTier()} | Tema: ${this.theme.getResolvedTheme()} | Estación: ${this.seasonal.resolvedSeason}`,
      'background: #0c0c0e; color: #d4a343; padding: 4px 8px; border: 1px solid #d4a343; font-family: monospace;'
    );
  }

  setupAppPreviewTriggers() {
    // Disparadores de vista previa interactiva desde las tarjetas
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-preview-trigger]');
      if (trigger) {
        e.preventDefault();
        const appKey = trigger.dataset.previewTrigger;
        const preview = this.rail?.getPreviewPanel();
        if (preview) {
          preview.open(appKey);
          const railApps = document.getElementById('railAppsItem');
          railApps?.focus();
        }
      }
    });
  }

  setupGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Atajo Alt+T para ciclar tema
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        this.theme.cycle();
      }
      // Atajo Alt+S para ciclar estación
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        this.seasonal.cycle();
      }
    });
  }

  destroy() {
    this.clock.stop();
    this.pointer.destroy();
    this.proximity.destroy();
    this.frames.destroy();
    this.rail.destroy();
    this.particles.destroy();
    this.codexModal.destroy();
    this.theme.destroy();
    this.eventBus.clear();
    this.isMounted = false;
  }
}
