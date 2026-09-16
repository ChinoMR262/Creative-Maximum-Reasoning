/**
 * Creative Maximum Reasoning (CMR) — Living Rail & Nav Artifact Controller
 * Navegación lateral viva de autor y artefacto móvil accesible
 * doc/CMR_Web_System_v2_Documentation/docs/04_LIVING_NAVIGATION.md
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
    this.listenEvents();
  }

  renderRail() {
    // Si ya existe en el DOM, no duplicar
    if (document.querySelector('.cmr-rail')) return;

    const rail = document.createElement('aside');
    rail.className = 'cmr-rail';
    rail.setAttribute('aria-label', 'Navegación Lateral CMR');

    rail.innerHTML = `
      <div class="rail-top">
        <a class="rail-brand" href="#top" title="Creative Maximum Reasoning — Inicio" aria-label="CMR Inicio">
          <img src="assets/images/CMR Logo.png" alt="CMR" width="28" height="28">
        </a>
        <nav class="rail-nav" aria-label="Secciones principales">
          <a class="rail-item active" href="#top" data-target="top" title="Inicio" aria-current="page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span class="rail-label">Inicio</span>
          </a>
          <a class="rail-item" href="#apps" data-target="apps" title="Aplicaciones">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            <span class="rail-label">Apps</span>
          </a>
          <a class="rail-item" href="#about" data-target="about" title="Sobre mí">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span class="rail-label">Autor</span>
          </a>
          <a class="rail-item" href="#contact" data-target="contact" title="Contacto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span class="rail-label">Contacto</span>
          </a>
        </nav>
      </div>

      <div class="rail-bottom">
        <span class="rail-tier-badge" id="railTierBadge" title="Nivel de Rendimiento">${this.qualityManager.getTier()}</span>
        <button class="rail-control-btn" id="railThemeBtn" title="Cambiar Tema (Sistema/Oscuro/Claro)" aria-label="Cambiar Tema">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
        </button>
        <button class="rail-control-btn" id="railSeasonBtn" title="Capa Estacional (Auto/Invierno/Otoño/Primavera/Verano/Off)" aria-label="Capa Estacional">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>
      </div>
    `;

    document.body.prepend(rail);
    this.railEl = rail;

    const themeBtn = rail.querySelector('#railThemeBtn');
    themeBtn?.addEventListener('click', () => {
      this.themeState.cycle();
    });

    const seasonBtn = rail.querySelector('#railSeasonBtn');
    seasonBtn?.addEventListener('click', () => {
      this.seasonalEngine.cycle();
    });
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
          <a href="#about">Sobre mí <span>// 03</span></a>
          <a href="#contact">Contacto <span>// 04</span></a>
        </nav>
        <div class="artifact-drawer-footer">
          <button class="btn btn-outline" id="mobileThemeToggle">Tema: <span id="mobileThemeLabel">Auto</span></button>
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
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
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
    }
  }

  destroy() {
    this.navObserver?.disconnect();
    this.railEl?.remove();
    this.mobileArtifactEl?.remove();
  }
}
