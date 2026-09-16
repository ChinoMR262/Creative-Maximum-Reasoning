/**
 * Creative Maximum Reasoning (CMR) — Preview Tabs Controller
 * Conmutación accesible y desacoplada de pestañas dentro del preview cinemático
 */

export class PreviewTabs {
  constructor(panelElement) {
    this.panel = panelElement;
    this.tabButtons = [];
    this.panes = [];
  }

  mount() {
    if (!this.panel) return;

    this.tabButtons = Array.from(this.panel.querySelectorAll('.preview-tab-btn'));
    this.panes = Array.from(this.panel.querySelectorAll('.preview-pane'));

    this.tabButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetTab = btn.getAttribute('data-tab');
        this.activateTab(targetTab);
      });
    });
  }

  activateTab(tabId) {
    this.tabButtons.forEach((btn) => {
      const isTarget = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    this.panes.forEach((pane) => {
      const isTarget = pane.id === `pane-${tabId}`;
      pane.classList.toggle('active', isTarget);
    });
  }

  destroy() {
    this.tabButtons = [];
    this.panes = [];
  }
}
