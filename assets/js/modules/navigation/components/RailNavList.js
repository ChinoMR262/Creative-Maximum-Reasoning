/**
 * Creative Maximum Reasoning (CMR) — Rail Navigation List Component
 * Enlaces de navegación con tooltips de autor y panel de preview integrado
 */

import { PreviewPanel } from '../preview/PreviewPanel.js';

export class RailNavList {
  constructor() {
    this.previewPanel = new PreviewPanel();
  }

  render() {
    const nav = document.createElement('nav');
    nav.className = 'rail-nav';
    nav.setAttribute('aria-label', 'Secciones principales');

    const isSubpage = window.location.pathname.includes('/apps/');
    const prefix = isSubpage ? '../../index.html' : '';

    nav.innerHTML = `
      <!-- 01 // Inicio -->
      <div class="rail-item-wrapper">
        <a class="rail-item active" href="${prefix}#top" data-target="top" aria-current="page" aria-label="Inicio">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span class="rail-item-label">01 // Inicio</span>
        </a>
      </div>

      <!-- 02 // Aplicaciones con Preview Flotante -->
      <div class="rail-item-wrapper" data-has-preview="true" id="railAppsWrapper">
        <a class="rail-item" href="${prefix}#apps" data-target="apps" id="railAppsItem" aria-label="Aplicaciones">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <span class="rail-item-label">02 // Aplicaciones</span>
        </a>
      </div>

      <!-- 03 // Sobre mí -->
      <div class="rail-item-wrapper">
        <a class="rail-item" href="${prefix}#about" data-target="about" aria-label="Sobre mí">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span class="rail-item-label">03 // Sobre mí</span>
        </a>
      </div>

      <!-- 04 // Contacto -->
      <div class="rail-item-wrapper">
        <a class="rail-item" href="${prefix}#contact" data-target="contact" aria-label="Contacto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span class="rail-item-label">04 // Contacto</span>
        </a>
      </div>
    `;

    // Inyectar el panel de preview en el wrapper de Aplicaciones
    const appsWrapper = nav.querySelector('#railAppsWrapper');
    if (appsWrapper) {
      appsWrapper.appendChild(this.previewPanel.render());
    }

    return nav;
  }

  destroy() {
    this.previewPanel?.destroy();
  }
}
