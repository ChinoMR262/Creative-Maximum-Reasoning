/**
 * Creative Maximum Reasoning (CMR) — Rail Brand Component
 * Cabecera con isotipo de autor y anclaje al inicio
 */

export class RailBrand {
  static render() {
    const isSubpage = window.location.pathname.includes('/apps/');
    const basePath = isSubpage ? '../../' : './';
    const homeUrl = isSubpage ? `${basePath}index.html` : '#top';
    const logoAvif = new URL('../../../../images/optimized/cmr-mini-banner-264.avif', import.meta.url).href;
    const logoWebp = new URL('../../../../images/optimized/cmr-mini-banner-264.webp', import.meta.url).href;
    const logoPng = new URL('../../../../images/Mini-Baneer-cmr.png', import.meta.url).href;

    const brand = document.createElement('a');
    brand.className = 'rail-brand';
    brand.href = homeUrl;
    brand.setAttribute('title', 'Creative Maximum Reasoning — Inicio');
    brand.setAttribute('aria-label', 'CMR Inicio');

    brand.innerHTML = `
      <picture class="rail-brand-picture">
        <source srcset="${logoAvif}" type="image/avif">
        <source srcset="${logoWebp}" type="image/webp">
        <img src="${logoPng}" alt="Creative Maximum Reasoning — Estudio independiente" width="1122" height="1402" decoding="async" fetchpriority="high">
      </picture>
    `;

    return brand;
  }
}
