/**
 * Creative Maximum Reasoning (CMR) — Rail Navigation List Component
 * Enlaces de navegación con tooltips de autor y panel de preview integrado
 */

import { PreviewPanel } from '../preview/PreviewPanel.js';

export class RailNavList {
  constructor() {
    this.previewPanel = new PreviewPanel();
    this.element = null;
    this.handleClick = null;
  }

  render() {
    const nav = document.createElement('nav');
    nav.className = 'rail-nav';
    nav.setAttribute('aria-label', 'Secciones principales');

    const isSubpage = window.location.pathname.includes('/apps/');
    const prefix = isSubpage ? '../../index.html' : '';

    nav.innerHTML = `
      <div class="rail-item-wrapper" data-expanded="true">
        <a class="rail-item active" href="${prefix}#top" data-target="top" aria-current="location" aria-expanded="true">
          <span class="rail-item-content">
            <span class="rail-item-heading"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/></svg><strong>Inicio</strong></span>
            <span class="rail-item-detail" aria-hidden="false">La portada y la idea central de CMR.</span>
            <span class="rail-item-action">Ir al inicio <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg></span>
          </span>
          <svg class="rail-item-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg>
        </a>
      </div>

      <div class="rail-item-wrapper" data-expanded="false" data-has-preview="true" id="railAppsWrapper">
        <a class="rail-item" href="${prefix}#apps" data-target="apps" id="railAppsItem" aria-expanded="false">
          <span class="rail-item-content">
            <span class="rail-item-heading"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8M12 17v4"/></svg><strong>Aplicaciones</strong></span>
            <span class="rail-item-detail" aria-hidden="true">Software de escritura y red desarrollado por CMR.</span>
            <span class="rail-item-action">Ver aplicaciones <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg></span>
          </span>
          <svg class="rail-item-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg>
        </a>
      </div>

      <div class="rail-item-wrapper" data-expanded="false">
        <a class="rail-item" href="${prefix}#about" data-target="about" aria-expanded="false">
          <span class="rail-item-content">
            <span class="rail-item-heading"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21c.8-4 3.1-6 7-6s6.2 2 7 6"/></svg><strong>Sobre mí</strong></span>
            <span class="rail-item-detail" aria-hidden="true">Autoría, criterio y forma de trabajo.</span>
            <span class="rail-item-action">Conocer al autor <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg></span>
          </span>
          <svg class="rail-item-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg>
        </a>
      </div>

      <div class="rail-item-wrapper" data-expanded="false">
        <a class="rail-item" href="${prefix}#contact" data-target="contact" aria-expanded="false">
          <span class="rail-item-content">
            <span class="rail-item-heading"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m4 7 8 6 8-6"/></svg><strong>Contacto</strong></span>
            <span class="rail-item-detail" aria-hidden="true">Canales oficiales y consultas directas.</span>
            <span class="rail-item-action">Abrir contacto <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg></span>
          </span>
          <svg class="rail-item-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg>
        </a>
      </div>
    `;

    // Inyectar el panel de preview en el wrapper de Aplicaciones
    const appsWrapper = nav.querySelector('#railAppsWrapper');
    if (appsWrapper) {
      appsWrapper.appendChild(this.previewPanel.render());
    }

    this.handleClick = (event) => {
      const link = event.target.closest('.rail-item');
      if (!link) return;

      const targetId = link.dataset.target;
      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      this.setExpanded(targetId);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      if (window.location.hash !== `#${targetId}`) {
        window.history.pushState(null, '', `#${targetId}`);
      }
    };

    nav.addEventListener('click', this.handleClick);
    this.element = nav;
    return nav;
  }

  setExpanded(targetId) {
    this.element?.querySelectorAll('.rail-item').forEach((item) => {
      const matches = item.dataset.target === targetId;
      item.classList.toggle('active', matches);
      item.setAttribute('aria-expanded', matches.toString());
      item.closest('.rail-item-wrapper')?.setAttribute('data-expanded', matches.toString());
      item.querySelector('.rail-item-detail')?.setAttribute('aria-hidden', (!matches).toString());
      if (matches) {
        item.setAttribute('aria-current', 'location');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  }

  destroy() {
    if (this.element && this.handleClick) {
      this.element.removeEventListener('click', this.handleClick);
    }
    this.handleClick = null;
    this.element = null;
    this.previewPanel?.destroy();
  }
}
