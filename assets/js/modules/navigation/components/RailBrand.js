/**
 * Creative Maximum Reasoning (CMR) — Rail Brand Component
 * Cabecera con isotipo de autor y anclaje al inicio
 */

export class RailBrand {
  static render() {
    const brand = document.createElement('a');
    brand.className = 'rail-brand';
    brand.href = '#top';
    brand.setAttribute('title', 'Creative Maximum Reasoning — Inicio');
    brand.setAttribute('aria-label', 'CMR Inicio');

    brand.innerHTML = `
      <img src="assets/images/CMR Logo.png" alt="CMR" width="28" height="28">
      <div class="rail-brand-meta">
        <span class="rail-brand-title">CMR</span>
        <span class="rail-brand-sub">Creative Maximum Reasoning</span>
      </div>
    `;

    return brand;
  }
}
