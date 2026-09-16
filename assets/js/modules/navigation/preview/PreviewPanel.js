/**
 * Creative Maximum Reasoning (CMR) — Preview Panel Component
 * Ensamblador del panel flotante cinemático de aplicaciones
 */

import { CMR_WRITER_PREVIEW_DATA } from './PreviewData.js';
import { PreviewTabs } from './PreviewTabs.js';

export class PreviewPanel {
  constructor() {
    this.element = null;
    this.tabsController = null;
  }

  render() {
    const data = CMR_WRITER_PREVIEW_DATA;
    const panel = document.createElement('div');
    panel.className = 'cmr-preview-panel';
    panel.id = 'cmrPreviewPanel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Vista previa de aplicaciones');

    panel.innerHTML = `
      <div class="preview-header">
        <span class="preview-badge-live">${data.status}</span>
        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-gold);">${data.version}</span>
      </div>
      <h4 class="preview-title">${data.title}</h4>
      <p class="preview-sub">${data.subtitle}</p>

      <div class="preview-tabs" role="tablist">
        ${data.tabs.map((t, idx) => `
          <button class="preview-tab-btn ${idx === 0 ? 'active' : ''}" data-tab="${t.id}" role="tab" aria-selected="${idx === 0}">
            ${t.label}
          </button>
        `).join('')}
      </div>

      <div class="preview-display-stage">
        <!-- Tab 1: Editor -->
        <div class="preview-pane active" id="pane-editor">
          <p class="pane-editor-text">${data.tabs[0].excerpt}</p>
          <div class="pane-meta">
            <span>${data.tabs[0].chapter}</span>
            <span>${data.tabs[0].words}</span>
          </div>
        </div>

        <!-- Tab 2: Personajes -->
        <div class="preview-pane" id="pane-characters">
          <div style="display: flex; gap: 12px; align-items: center;">
            <div style="width: 38px; height: 38px; border: 1px solid var(--accent-gold); border-radius: 2px; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 700; color: var(--accent-gold);">${data.tabs[1].initials}</div>
            <div>
              <strong style="font-size: 13px; color: var(--text-main); display: block;">${data.tabs[1].name}</strong>
              <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">${data.tabs[1].role}</span>
            </div>
          </div>
          <div class="pane-meta">
            <span>${data.tabs[1].appearances}</span>
            <span>${data.tabs[1].archetype}</span>
          </div>
        </div>

        <!-- Tab 3: Cronología -->
        <div class="preview-pane" id="pane-timeline">
          <div style="font-family: var(--font-mono); font-size: 11.5px; color: var(--text-main); line-height: 1.5;">
            ${data.tabs[2].events.map(ev => `
              <div style="margin-bottom: 4px;"><span style="color: var(--accent-gold);">${ev.year}:</span> ${ev.desc}</div>
            `).join('')}
          </div>
          <div class="pane-meta">
            <span>${data.tabs[2].scope}</span>
            <span>${data.tabs[2].universe}</span>
          </div>
        </div>
      </div>

      <div class="preview-footer-action">
        <a class="preview-link-btn" href="${data.appUrl}">
          Explorar ficha técnica completa
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    `;

    this.element = panel;
    this.tabsController = new PreviewTabs(panel);
    this.tabsController.mount();

    // Soporte para cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        panel.classList.remove('open');
      }
    });

    return panel;
  }

  destroy() {
    this.tabsController?.destroy();
    this.element?.remove();
  }
}
