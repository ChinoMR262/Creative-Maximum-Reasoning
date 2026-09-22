/**
 * Creative Maximum Reasoning (CMR) — Rail Brand Component
 * Cabecera con isotipo de autor y anclaje al inicio
 */

export class RailBrand {
  static render() {
    const isSubpage = window.location.pathname.includes('/apps/');
    const basePath = isSubpage ? '../../' : './';
    const homeUrl = isSubpage ? `${basePath}index.html` : '#top';
    const logoSrc = new URL('../../../../images/CMR Logo.png', import.meta.url).href;

    const brand = document.createElement('a');
    brand.className = 'rail-brand';
    brand.href = homeUrl;
    brand.setAttribute('title', 'Creative Maximum Reasoning — Inicio');
    brand.setAttribute('aria-label', 'CMR Inicio');

    brand.innerHTML = `
      <img src="${logoSrc}" alt="Símbolo de Creative Maximum Reasoning" width="132" height="132" decoding="async">
      <div class="rail-brand-meta">
        <span class="rail-brand-eyebrow">Estudio independiente</span>
        <span class="rail-brand-title">Creative Maximum Reasoning</span>
        <span class="rail-brand-sub">Aplicaciones Android · Neuquén, Argentina</span>
      </div>
    `;

    return brand;
  }
}
