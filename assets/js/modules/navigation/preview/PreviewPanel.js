/**
 * Creative Maximum Reasoning (CMR) — Preview Panel Component
 * Ensamblador del panel flotante cinemático de aplicaciones
 */

import { CMR_WRITER_PREVIEW_DATA, CMR_PING_PREVIEW_DATA } from './PreviewData.js';
import { PreviewTabs } from './PreviewTabs.js';

export class PreviewPanel {
  constructor() {
    this.element = null;
    this.tabsController = null;
    this.currentApp = 'writer';
  }

  getData(appKey = 'writer') {
    return appKey === 'ping' ? CMR_PING_PREVIEW_DATA : CMR_WRITER_PREVIEW_DATA;
  }

  render(appKey = 'writer') {
    this.currentApp = appKey;
    const data = this.getData(appKey);

    const panel = document.createElement('div');
    panel.className = 'cmr-preview-panel';
    panel.id = 'cmrPreviewPanel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', `Vista previa de ${data.title}`);

    panel.innerHTML = this.getInnerTemplate(data);

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

  updateApp(appKey) {
    if (!this.element || this.currentApp === appKey) return;
    this.currentApp = appKey;
    const data = this.getData(appKey);
    this.element.innerHTML = this.getInnerTemplate(data);
    this.tabsController?.destroy();
    this.tabsController = new PreviewTabs(this.element);
    this.tabsController.mount();
  }

  getInnerTemplate(data) {
    const isPing = this.currentApp === 'ping';

    return `
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
        ${!isPing ? `
          <!-- Writer Lite: Tab 1: Editor -->
          <div class="preview-pane active" id="pane-editor">
            <p class="pane-editor-text">${data.tabs[0].excerpt}</p>
            <div class="pane-meta">
              <span>${data.tabs[0].chapter}</span>
              <span>${data.tabs[0].words}</span>
            </div>
          </div>

          <!-- Writer Lite: Tab 2: Personajes -->
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

          <!-- Writer Lite: Tab 3: Cronología -->
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
        ` : `
          <!-- Ping Booster: Tab 1: Diagnóstico -->
          <div class="preview-pane active" id="pane-diagnostic">
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">${data.tabs[0].excerpt}</p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-family: var(--font-mono);">
              ${data.tabs[0].metrics.map(m => `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 8px; border-radius: 2px; text-align: center;">
                  <span style="display: block; font-size: 9.5px; color: var(--text-dim); text-transform: uppercase;">${m.label}</span>
                  <strong style="font-size: 14px; color: var(--accent-gold);">${m.value}</strong>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Ping Booster: Tab 2: DNS -->
          <div class="preview-pane" id="pane-dns">
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 10px;">${data.tabs[1].excerpt}</p>
            <div style="font-family: var(--font-mono); font-size: 11px;">
              ${data.tabs[1].servers.map(s => `
                <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid var(--border);">
                  <span style="color: var(--text-main);">${s.name} (${s.ip})</span>
                  <strong style="color: #4ade80;">${s.time}</strong>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Ping Booster: Tab 3: Perfiles -->
          <div class="preview-pane" id="pane-profiles">
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 10px;">${data.tabs[2].excerpt}</p>
            <ul style="list-style: none; padding: 0; margin: 0; font-family: var(--font-mono); font-size: 11px;">
              ${data.tabs[2].profilesList.map(p => `
                <li style="padding: 4px 0; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                  <span style="color: var(--accent-gold);">→</span> ${p}
                </li>
              `).join('')}
            </ul>
          </div>
        `}
      </div>

      <div class="preview-footer-action">
        <a class="preview-link-btn" href="${data.appUrl}">
          Explorar ficha técnica completa
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    `;
  }

  destroy() {
    this.tabsController?.destroy();
    this.element?.remove();
  }
}

