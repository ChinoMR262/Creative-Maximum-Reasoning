/**
 * Creative Maximum Reasoning (CMR) — Mobile Nav Artifact Component
 * Artefacto de navegación flotante y drawer adaptativo para dispositivos táctiles
 */

export class NavArtifact {
  constructor(themeState, qualityManager) {
    this.themeState = themeState;
    this.qualityManager = qualityManager;
    this.element = null;
    this.previousFocus = null;
    this.previousBodyOverflow = '';
    this.handleKeydown = null;
    this.backgroundElements = [];
  }

  render() {
    if (document.querySelector('.cmr-nav-artifact')) return null;

    const container = document.createElement('div');
    container.className = 'cmr-nav-artifact';
    const logoUrl = new URL('../../../../images/optimized/cmr-logo-nav.webp', import.meta.url).href;

    container.innerHTML = `
      <button class="artifact-trigger" id="artifactTrigger" aria-label="Abrir Navegación CMR" aria-expanded="false" aria-controls="artifactDrawer">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div class="artifact-drawer" id="artifactDrawer" role="dialog" aria-modal="true" aria-label="Navegación CMR" aria-hidden="true" inert>
        <div class="artifact-drawer-header">
          <div class="brand">
            <img class="brand-logo" src="${logoUrl}" alt="CMR Logo" width="30" height="30" decoding="async">
            <span class="brand-cmr">CMR</span>
          </div>
          <button class="artifact-trigger" id="artifactCloseBtn" aria-label="Cerrar navegación">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <nav class="artifact-drawer-links" aria-label="Enlaces móviles">
          <a href="#top">Inicio <span>01</span></a>
          <a href="#apps">Aplicaciones <span>02</span></a>
          <a href="#about">Sobre mí & S9U <span>03</span></a>
          <a href="#contact">Contacto <span>04</span></a>
        </nav>
        <div class="artifact-drawer-footer">
          <span class="artifact-platform-label">Aplicaciones Android</span>
          <span class="rail-tier-badge">${this.qualityManager.getTier()}</span>
        </div>
      </div>
    `;

    const trigger = container.querySelector('#artifactTrigger');
    const closeBtn = container.querySelector('#artifactCloseBtn');
    const drawer = container.querySelector('#artifactDrawer');
    this.backgroundElements = Array.from(document.body.children).filter((element) => element !== container);

    const getFocusableElements = () => Array.from(drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));

    const toggleDrawer = (open, restoreFocus = true) => {
      const isOpen = open !== undefined ? open : !drawer.classList.contains('open');

      if (isOpen) {
        this.previousFocus = document.activeElement;
        this.previousBodyOverflow = document.body.style.overflow;
        drawer.inert = false;
      }

      drawer.classList.toggle('open', isOpen);
      drawer.setAttribute('aria-hidden', (!isOpen).toString());
      trigger.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : this.previousBodyOverflow;
      this.backgroundElements.forEach((element) => {
        element.inert = isOpen;
      });

      if (isOpen) {
        requestAnimationFrame(() => getFocusableElements()[0]?.focus());
      } else {
        drawer.inert = true;
        if (restoreFocus && this.previousFocus instanceof HTMLElement) {
          this.previousFocus.focus();
        }
      }
    };

    trigger?.addEventListener('click', () => toggleDrawer(true));
    closeBtn?.addEventListener('click', () => toggleDrawer(false));

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleDrawer(false, false));
    });

    this.handleKeydown = (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        e.preventDefault();
        toggleDrawer(false);
      }

      if (e.key === 'Tab' && drawer.classList.contains('open')) {
        const focusable = getFocusableElements();
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', this.handleKeydown);

    this.element = container;
    return container;
  }

  destroy() {
    if (this.handleKeydown) {
      document.removeEventListener('keydown', this.handleKeydown);
      this.handleKeydown = null;
    }
    document.body.style.overflow = this.previousBodyOverflow;
    this.backgroundElements.forEach((element) => {
      element.inert = false;
    });
    this.backgroundElements = [];
    this.element?.remove();
  }
}
