/**
 * Creative Maximum Reasoning (CMR) — Living Rail & Nav Artifact Controller
 * Navegación lateral viva de autor y panel de preview cinemático integrado
 * doc/CMR_Web_System_v2_Documentation/docs/04_LIVING_NAVIGATION.md & 14_PREVIEW_MEDIA_SYSTEM.md
 */

export class LivingRail {
  constructor(themeState, seasonalEngine, qualityManager, eventBus = null) {
    this.themeState = themeState;
    this.seasonalEngine = seasonalEngine;
    this.qualityManager = qualityManager;
    this.eventBus = eventBus;

    this.railEl = null;
    this.mobileArtifactEl = null;
    this.navObserver = null;
  }

  mount() {
    this.renderRail();
    this.renderMobileArtifact();
    this.setupScrollSpy();
    this.setupPreviewInteractions();
    this.listenEvents();
    this.updateControlLabels();
  }

  renderRail() {
    if (document.querySelector('.cmr-rail')) return;

    const rail = document.createElement('aside');
    rail.className = 'cmr-rail';
    rail.setAttribute('aria-label', 'Navegación Lateral CMR');

    rail.innerHTML = `
      <div class="rail-top">
        <a class="rail-brand" href="#top" title="Creative Maximum Reasoning — Inicio" aria-label="CMR Inicio">
          <img src="assets/images/CMR Logo.png" alt="CMR" width="26" height="26">
        </a>
        <nav class="rail-nav" aria-label="Secciones principales">
          <!-- Inicio -->
          <div class="rail-item-wrapper">
            <a class="rail-item active" href="#top" data-target="top" aria-current="page" aria-label="Inicio">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </a>
            <span class="rail-tooltip">01 // Inicio</span>
          </div>

          <!-- Aplicaciones con Preview Cinemático -->
          <div class="rail-item-wrapper" data-has-preview="true">
            <a class="rail-item" href="#apps" data-target="apps" id="railAppsItem" aria-label="Aplicaciones">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </a>
            <span class="rail-tooltip">02 // Aplicaciones</span>

            <!-- Panel de Preview Cinemático Flotante -->
            <div class="cmr-preview-panel" id="cmrPreviewPanel" role="region" aria-label="Vista previa de aplicaciones">
              <div class="preview-header">
                <span class="preview-badge-live">En Desarrollo // Prueba Cerrada</span>
                <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-gold);">v0.9.4</span>
              </div>
              <h4 class="preview-title">CMR Writer Lite</h4>
              <p class="preview-sub">Editor de narrativa por capítulos con sistema de personajes y notas cronológicas, creado por Jonathan Gabriel Nieto.</p>

              <div class="preview-tabs">
                <button class="preview-tab-btn active" data-tab="editor">01 // Editor</button>
                <button class="preview-tab-btn" data-tab="characters">02 // Personajes</button>
                <button class="preview-tab-btn" data-tab="timeline">03 // Cronología</button>
              </div>

              <div class="preview-display-stage">
                <!-- Tab 1: Editor -->
                <div class="preview-pane active" id="pane-editor">
                  <p class="pane-editor-text">«El silencio del Noveno Universo no era ausencia de sonido, sino el peso de una memoria que todavía nadie se había atrevido a escribir...»</p>
                  <div class="pane-meta">
                    <span>Capítulo VII // El Faro de Ceniza</span>
                    <span>2.450 palabras</span>
                  </div>
                </div>

                <!-- Tab 2: Personajes -->
                <div class="preview-pane" id="pane-characters">
                  <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="width: 38px; height: 38px; border: 1px solid var(--accent-gold); border-radius: 2px; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 700; color: var(--accent-gold);">AK</div>
                    <div>
                      <strong style="font-size: 13px; color: var(--text-main); display: block;">Arakiel de la Niebla</strong>
                      <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">Guardián del Umbral // Seres del Noveno Universo</span>
                    </div>
                  </div>
                  <div class="pane-meta">
                    <span>Apariciones: Cap. I, IV, VII</span>
                    <span>Arquetipo: Ermitaño</span>
                  </div>
                </div>

                <!-- Tab 3: Cronología -->
                <div class="preview-pane" id="pane-timeline">
                  <div style="font-family: var(--font-mono); font-size: 11.5px; color: var(--text-main); line-height: 1.5;">
                    <div><span style="color: var(--accent-gold);">Año 412:</span> La fractura del velo astral.</div>
                    <div style="margin-top: 4px;"><span style="color: var(--accent-gold);">Año 430:</span> Fundación de los Bastiones de Piedra.</div>
                  </div>
                  <div class="pane-meta">
                    <span>Línea temporal principal</span>
                    <span>S9U Canon</span>
                  </div>
                </div>
              </div>

              <div class="preview-footer-action">
                <a class="preview-link-btn" href="apps/cmr-writer-lite.html">
                  Explorar ficha técnica completa
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Sobre mí -->
          <div class="rail-item-wrapper">
            <a class="rail-item" href="#about" data-target="about" aria-label="Sobre mí">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </a>
            <span class="rail-tooltip">03 // Autor & S9U</span>
          </div>

          <!-- Contacto -->
          <div class="rail-item-wrapper">
            <a class="rail-item" href="#contact" data-target="contact" aria-label="Contacto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
            <span class="rail-tooltip">04 // Contacto</span>
          </div>
        </nav>
      </div>

      <div class="rail-bottom">
        <span class="rail-tier-badge" id="railTierBadge" title="Quality Tier">${this.qualityManager.getTier()}</span>

        <!-- Selector de Tema -->
        <div class="rail-item-wrapper">
          <button class="rail-control-btn" id="railThemeBtn" title="Cambiar Tema (Alt+T)" aria-label="Cambiar Tema">
            <svg id="railThemeIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
            <span class="rail-control-tag" id="railThemeTag">SYS</span>
          </button>
          <span class="rail-tooltip">Tema // <span id="railThemeTooltip">Sistema</span></span>
        </div>

        <!-- Selector de Estación -->
        <div class="rail-item-wrapper">
          <button class="rail-control-btn" id="railSeasonBtn" title="Capa Estacional (Alt+S)" aria-label="Capa Estacional">
            <svg id="railSeasonIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <span class="rail-control-tag" id="railSeasonTag">AUT</span>
          </button>
          <span class="rail-tooltip">Estación // <span id="railSeasonTooltip">Auto (Sur)</span></span>
        </div>
      </div>
    `;

    document.body.prepend(rail);
    this.railEl = rail;

    const themeBtn = rail.querySelector('#railThemeBtn');
    themeBtn?.addEventListener('click', () => {
      this.themeState.cycle();
      this.updateControlLabels();
    });

    const seasonBtn = rail.querySelector('#railSeasonBtn');
    seasonBtn?.addEventListener('click', () => {
      this.seasonalEngine.cycle();
      this.updateControlLabels();
    });
  }

  setupPreviewInteractions() {
    const previewPanel = this.railEl?.querySelector('#cmrPreviewPanel');
    if (!previewPanel) return;

    // Conmutación de Tabs dentro del Preview
    const tabBtns = previewPanel.querySelectorAll('.preview-tab-btn');
    const panes = {
      editor: previewPanel.querySelector('#pane-editor'),
      characters: previewPanel.querySelector('#pane-characters'),
      timeline: previewPanel.querySelector('#pane-timeline')
    };

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tab = btn.getAttribute('data-tab');

        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        Object.keys(panes).forEach((k) => {
          panes[k]?.classList.toggle('active', k === tab);
        });
      });
    });

    // Cerrar preview con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && previewPanel.classList.contains('open')) {
        previewPanel.classList.remove('open');
      }
    });
  }

  updateControlLabels() {
    // Actualizar etiquetas y tags de tema
    const mode = this.themeState.mode;
    const resolved = this.themeState.getResolvedTheme();
    const themeTag = document.getElementById('railThemeTag');
    const themeTooltip = document.getElementById('railThemeTooltip');

    if (themeTag) {
      themeTag.textContent = mode === 'system' ? 'SYS' : mode === 'light' ? 'LGT' : 'DRK';
    }
    if (themeTooltip) {
      themeTooltip.textContent = `${mode.toUpperCase()} (${resolved})`;
    }

    // Actualizar etiquetas y tags de estación
    const sMode = this.seasonalEngine.mode;
    const sResolved = this.seasonalEngine.resolvedSeason;
    const seasonTag = document.getElementById('railSeasonTag');
    const seasonTooltip = document.getElementById('railSeasonTooltip');

    if (seasonTag) {
      seasonTag.textContent = sMode === 'auto' ? 'AUT' : sMode.substring(0, 3).toUpperCase();
    }
    if (seasonTooltip) {
      seasonTooltip.textContent = `${sMode.toUpperCase()} (${sResolved})`;
    }
  }

  renderMobileArtifact() {
    if (document.querySelector('.cmr-nav-artifact')) return;

    const container = document.createElement('div');
    container.className = 'cmr-nav-artifact';

    container.innerHTML = `
      <button class="artifact-trigger" id="artifactTrigger" aria-label="Abrir Navegación CMR" aria-expanded="false" aria-controls="artifactDrawer">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div class="artifact-drawer" id="artifactDrawer" aria-hidden="true">
        <div class="artifact-drawer-header">
          <div class="brand">
            <img class="brand-logo" src="assets/images/CMR Logo.png" alt="CMR Logo" width="30" height="30">
            <span class="brand-cmr">CMR</span>
          </div>
          <button class="artifact-trigger" id="artifactCloseBtn" aria-label="Cerrar navegación">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <nav class="artifact-drawer-links" aria-label="Enlaces móviles">
          <a href="#top">Inicio <span>// 01</span></a>
          <a href="#apps">Aplicaciones <span>// 02</span></a>
          <a href="#about">Sobre mí & S9U <span>// 03</span></a>
          <a href="#contact">Contacto <span>// 04</span></a>
        </nav>
        <div class="artifact-drawer-footer">
          <button class="btn btn-outline" id="mobileThemeToggle">Tema: <span id="mobileThemeLabel">${this.themeState.mode}</span></button>
          <span class="rail-tier-badge">${this.qualityManager.getTier()}</span>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    this.mobileArtifactEl = container;

    const trigger = container.querySelector('#artifactTrigger');
    const closeBtn = container.querySelector('#artifactCloseBtn');
    const drawer = container.querySelector('#artifactDrawer');
    const mobileThemeToggle = container.querySelector('#mobileThemeToggle');
    const mobileThemeLabel = container.querySelector('#mobileThemeLabel');

    const toggleDrawer = (open) => {
      const isOpen = open !== undefined ? open : !drawer.classList.contains('open');
      drawer.classList.toggle('open', isOpen);
      drawer.setAttribute('aria-hidden', (!isOpen).toString());
      trigger.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    trigger?.addEventListener('click', () => toggleDrawer(true));
    closeBtn?.addEventListener('click', () => toggleDrawer(false));

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleDrawer(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        toggleDrawer(false);
      }
    });

    mobileThemeToggle?.addEventListener('click', () => {
      this.themeState.cycle();
      this.updateControlLabels();
      if (mobileThemeLabel) {
        mobileThemeLabel.textContent = this.themeState.mode;
      }
    });
  }

  setupScrollSpy() {
    const sections = ['top', 'apps', 'about', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    this.navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            this.railEl?.querySelectorAll('.rail-item').forEach((item) => {
              const matches = item.getAttribute('data-target') === id;
              item.classList.toggle('active', matches);
              if (matches) {
                item.setAttribute('aria-current', 'page');
              } else {
                item.removeAttribute('aria-current');
              }
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((sec) => this.navObserver.observe(sec));
  }

  listenEvents() {
    if (this.eventBus) {
      this.eventBus.on('quality:change', ({ tier }) => {
        const badge = document.getElementById('railTierBadge');
        if (badge) badge.textContent = tier;
      });
      this.eventBus.on('theme:change', () => this.updateControlLabels());
      this.eventBus.on('season:change', () => this.updateControlLabels());
    }
  }

  destroy() {
    this.navObserver?.disconnect();
    this.railEl?.remove();
    this.mobileArtifactEl?.remove();
  }
}
