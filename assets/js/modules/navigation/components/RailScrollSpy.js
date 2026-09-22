/**
 * Creative Maximum Reasoning (CMR) - Rail Scroll Spy
 * Sincroniza la tarjeta expandida con la seccion dominante del viewport.
 */

export class RailScrollSpy {
  constructor(railElement) {
    this.rail = railElement;
    this.sections = [];
    this.frameRequest = null;
    this.handleViewportChange = this.scheduleUpdate.bind(this);
  }

  mount() {
    this.sections = ['top', 'apps', 'about', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!this.sections.length) return;

    window.addEventListener('scroll', this.handleViewportChange, { passive: true });
    window.addEventListener('resize', this.handleViewportChange, { passive: true });

    const hashTarget = decodeURIComponent(window.location.hash.slice(1));
    const hasHashTarget = this.sections.some((section) => section.id === hashTarget);
    if (hasHashTarget) {
      this.setActive(hashTarget);
    } else {
      this.updateActiveSection();
    }
  }

  scheduleUpdate() {
    if (this.frameRequest !== null) return;
    this.frameRequest = window.requestAnimationFrame(() => {
      this.frameRequest = null;
      this.updateActiveSection();
    });
  }

  updateActiveSection() {
    const activationLine = window.innerHeight * 0.38;
    let activeSection = this.sections[0];

    this.sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= activationLine) {
        activeSection = section;
      }
    });

    this.setActive(activeSection.id);
  }

  setActive(targetId) {
    this.rail?.querySelectorAll('.rail-item').forEach((item) => {
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
    window.removeEventListener('scroll', this.handleViewportChange);
    window.removeEventListener('resize', this.handleViewportChange);
    if (this.frameRequest !== null) {
      window.cancelAnimationFrame(this.frameRequest);
    }
    this.frameRequest = null;
    this.sections = [];
  }
}
