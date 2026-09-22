/**
 * Creative Maximum Reasoning (CMR) — Entrypoint Modular v2.0
 * Inicializa el CMREngine y preserva las animaciones de autor con Framer Motion
 * Directrices: doc/directrices-diseno-identidad-cmr.md & doc/CMR_Web_System_v2_Documentation
 */

import { CMREngine } from './modules/engine/CMREngine.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar el motor maestro CMR Web System v2
  const engine = new CMREngine();
  engine.mount();
  window.__CMR_ENGINE__ = engine; // Acceso para diagnóstico en consola

  // 2. Sincronización automática de año de copyright
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Animaciones con Framer Motion (Motion Engine)
  const Motion = window.Motion;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (Motion && !prefersReduced) {
    const { animate, inView, stagger } = Motion;

    // A. Entrada Cinemática en Hero Section
    const heroContent = document.querySelector('.hero-grid > div:first-child');
    const heroBanner = document.querySelector('.hero-banner-frame');

    if (heroContent) {
      animate(
        heroContent,
        { opacity: [0, 1], y: [14, 0] },
        { duration: 0.62, ease: [0.16, 1, 0.3, 1] }
      );
    }

    if (heroBanner) {
      animate(
        heroBanner,
        { opacity: [0, 1], x: [18, 0] },
        { duration: 0.68, delay: 0.08, ease: [0.16, 1, 0.3, 1] }
      );
    }

    // B. Entrada de Subpágina de App (CMR Writer Lite)
    const appHero = document.querySelector('.app-hero-subpage .wrap-narrow');
    if (appHero) {
      animate(
        appHero,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
      );
    }

    // C. Revelacion editorial: primero el contexto, luego las fichas de producto.
    const appsSection = document.getElementById('apps');
    if (appsSection) {
      inView(appsSection, () => {
        const sectionHead = appsSection.querySelector('.section-head');
        const appCards = appsSection.querySelectorAll('.app-card');

        if (sectionHead) {
          animate(
            sectionHead,
            { opacity: [0, 1], y: [10, 0] },
            { duration: 0.42, ease: [0.16, 1, 0.3, 1] }
          );
        }

        animate(
          appCards,
          { opacity: [0, 1], y: [16, 0] },
          { delay: stagger(0.08), duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        );
      }, { margin: '0px 0px -64px 0px' });
    }

    // D. Revelación progresiva en Scroll para Sobre mí
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      inView(aboutSection, () => {
        animate(
          aboutSection.querySelectorAll('.author-presentation, .about-lede, .about-body, .roles'),
          { opacity: [0, 1], y: [12, 0] },
          { delay: stagger(0.08), duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        );
      }, { margin: '0px 0px -80px 0px' });
    }

    // E. Revelación del Pie de Página (Footer 3-Col)
    const footer = document.querySelector('footer');
    if (footer) {
      inView(footer, () => {
        animate(
          footer.querySelectorAll('.footer-col-left, .footer-col-center, .footer-col-right'),
          { opacity: [0, 1] },
          { delay: stagger(0.06), duration: 0.42, ease: [0.16, 1, 0.3, 1] }
        );
      }, { margin: '0px 0px -40px 0px' });
    }
  }
});
