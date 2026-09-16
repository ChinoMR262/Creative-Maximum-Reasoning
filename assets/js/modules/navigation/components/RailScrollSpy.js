/**
 * Creative Maximum Reasoning (CMR) — Rail Scroll Spy Component
 * Observador desacoplado de intersección para sincronizar la sección activa
 */

export class RailScrollSpy {
  constructor(railElement) {
    this.rail = railElement;
    this.observer = null;
  }

  mount() {
    const sections = ['top', 'apps', 'about', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            this.rail?.querySelectorAll('.rail-item').forEach((item) => {
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
      { threshold: 0.28 }
    );

    sections.forEach((sec) => this.observer.observe(sec));
  }

  destroy() {
    this.observer?.disconnect();
    this.observer = null;
  }
}
