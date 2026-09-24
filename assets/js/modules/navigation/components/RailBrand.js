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
      <span class="rail-brand-plate">
        <picture class="rail-brand-picture">
        <source srcset="${logoAvif}" type="image/avif">
        <source srcset="${logoWebp}" type="image/webp">
        <img src="${logoPng}" alt="Creative Maximum Reasoning — Estudio independiente" width="1122" height="1402" decoding="async" fetchpriority="high">
        </picture>
        <span class="rail-brand-play-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M3.609 1.814L13.793 12 3.61 22.186a2.38 2.38 0 0 1-.61-.958V2.772c.162-.38.375-.708.61-.958zm11.242 11.243l2.253 2.253-11.7 6.649 9.447-8.902zm0-2.114L5.405 2.04l11.7 6.65-2.254 2.253zm1.472 1.057l3.864 2.196c1.09.619 1.09 1.626 0 2.245l-3.864 2.196-2.52-2.52 2.52-2.117z"/>
          </svg>
        </span>
      </span>
    `;

    return brand;
  }
}
