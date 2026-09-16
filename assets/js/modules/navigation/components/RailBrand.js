/**
 * Creative Maximum Reasoning (CMR) — Rail Brand Component
 * Cabecera con isotipo de autor y anclaje al inicio
 */

export class RailBrand {
  static render() {
    const isSubpage = window.location.pathname.includes('/apps/');
    const basePath = isSubpage ? '../../' : './';
    const homeUrl = isSubpage ? `${basePath}index.html` : '#top';
    const logoSrc = `${basePath}assets/images/CMR%20Logo.png`;

    const brand = document.createElement('a');
    brand.className = 'rail-brand';
    brand.href = homeUrl;
    brand.setAttribute('title', 'Creative Maximum Reasoning — Inicio');
    brand.setAttribute('aria-label', 'CMR Inicio');

    brand.innerHTML = `
      <img src="${logoSrc}" alt="CMR" width="28" height="28" onerror="if(!this.dataset.retry){this.dataset.retry=1;this.src='../../assets/images/CMR%20Logo.png';}">
      <div class="rail-brand-meta">
        <span class="rail-brand-title">CMR</span>
        <span class="rail-brand-sub">Creative Maximum Reasoning</span>
      </div>
    `;

    return brand;
  }
}
