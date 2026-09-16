/**
 * Creative Maximum Reasoning (CMR) — Mobile Nav Artifact Component
 * Artefacto de navegación flotante y drawer adaptativo para dispositivos táctiles
 */

export class NavArtifact {
  constructor(themeState, qualityManager) {
    this.themeState = themeState;
    this.qualityManager = qualityManager;
    this.element = null;
  }

  render() {
    if (document.querySelector('.cmr-nav-artifact')) return null;

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
      if (mobileThemeLabel) {
        mobileThemeLabel.textContent = this.themeState.mode;
      }
    });

    this.element = container;
    return container;
  }

  destroy() {
    this.element?.remove();
  }
}
