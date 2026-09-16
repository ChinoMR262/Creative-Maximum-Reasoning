/**
 * Creative Maximum Reasoning (CMR) — S9U Codex Modal
 * Experiencia interactiva y cinemática del universo literario Seres del Noveno Universo (S9U)
 * Autor: Jonathan Gabriel Nieto // Neuquén, Patagonia Argentina
 */

import { S9U_CODEX_DATA } from '../navigation/preview/PreviewData.js';

export class CodexModal {
  constructor() {
    this.data = S9U_CODEX_DATA;
    this.modalEl = null;
    this.isOpen = false;
    this.previousFocus = null;

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  mount() {
    // Si ya existe en el DOM, no duplicar
    if (document.getElementById('s9uCodexModal')) {
      this.modalEl = document.getElementById('s9uCodexModal');
      return;
    }

    const modal = document.createElement('div');
    modal.id = 's9uCodexModal';
    modal.className = 'cmr-codex-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-labelledby', 's9uCodexTitle');

    modal.innerHTML = `
      <div class="codex-backdrop" data-action="close"></div>
      <div class="codex-container living-frame" data-material="stone" tabindex="-1">
        <div class="codex-header">
          <div class="codex-header-meta">
            <span class="codex-badge">${this.data.badge}</span>
            <span class="codex-region">${this.data.region}</span>
          </div>
          <button class="codex-close-btn" data-action="close" aria-label="Cerrar Códice S9U">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="codex-body">
          <div class="codex-title-block">
            <h2 id="s9uCodexTitle" class="codex-title">${this.data.title}</h2>
            <p class="codex-subtitle">${this.data.subtitle}</p>
          </div>

          <div class="codex-sections-grid">
            ${this.data.sections.map(section => `
              <article class="codex-entry">
                <h3 class="codex-entry-title">${section.title}</h3>
                <p class="codex-entry-text">${section.text}</p>
                ${section.cite ? `<blockquote class="codex-cite">${section.cite}</blockquote>` : ''}
              </article>
            `).join('')}
          </div>
        </div>

        <div class="codex-footer">
          <div class="codex-footer-author">
            <span>Autor & Creador:</span>
            <strong>${this.data.author}</strong>
          </div>
          <button class="btn btn-solid codex-action-btn" data-action="close">Entendido // Volver a la portada</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;

    // Delegación de eventos de cierre (backdrop, botones con data-action="close")
    this.modalEl.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="close"]')) {
        this.close();
      }
    });

    // Conectar botones o triggers en la página con data-codex-trigger="s9u"
    this.bindTriggers();
  }

  bindTriggers() {
    const triggers = document.querySelectorAll('[data-codex-trigger="s9u"]');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(trigger);
      });
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.open(trigger);
        }
      });
    });
  }

  open(triggerElement = null) {
    if (!this.modalEl || this.isOpen) return;

    this.isOpen = true;
    this.previousFocus = triggerElement || document.activeElement;

    this.modalEl.classList.add('is-open');
    this.modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', this.onKeyDown);

    // Foco en el contenedor del códice
    const container = this.modalEl.querySelector('.codex-container');
    if (container) {
      container.focus();
    }
  }

  close() {
    if (!this.modalEl || !this.isOpen) return;

    this.isOpen = false;
    this.modalEl.classList.remove('is-open');
    this.modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    window.removeEventListener('keydown', this.onKeyDown);

    // Restaurar foco al elemento que disparó el códice
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
  }

  onKeyDown(e) {
    if (e.key === 'Escape') {
      this.close();
      return;
    }

    // Focus trap dentro del modal
    if (e.key === 'Tab') {
      const focusables = this.modalEl.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }

  destroy() {
    this.close();
    this.modalEl?.remove();
    this.modalEl = null;
  }
}
