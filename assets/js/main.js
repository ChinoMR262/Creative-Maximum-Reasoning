/**
 * Creative Maximum Reasoning (CMR) — Lógica de Interacción & Framer Motion
 * Vanguardista, Vanilla JS sin dependencias externas, seguro y modular.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sincronización automática de año de copyright
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Navegación móvil accesible
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Cerrar menú al hacer clic en cualquier enlace
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar menú al hacer clic fuera del drawer
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== navToggle) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
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
        { opacity: [0, 1], y: [24, 0] },
        { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
      );
    }

    if (heroBanner) {
      animate(
        heroBanner,
        { opacity: [0, 1], scale: [0.97, 1] },
        { duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }
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

    // C. Revelación progresiva en Scroll para Aplicaciones
    const appsSection = document.getElementById('apps');
    if (appsSection) {
      inView(appsSection, () => {
        animate(
          appsSection.querySelectorAll('.section-head, .app-card'),
          { opacity: [0, 1], y: [22, 0] },
          { delay: stagger(0.12), duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }
        );
      }, { margin: '0px 0px -80px 0px' });
    }

    // D. Revelación progresiva en Scroll para Sobre mí
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      inView(aboutSection, () => {
        animate(
          aboutSection.querySelectorAll('.author-presentation, .about-lede, .about-body, .roles'),
          { opacity: [0, 1], y: [18, 0] },
          { delay: stagger(0.14), duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }
        );
      }, { margin: '0px 0px -80px 0px' });
    }

    // E. Revelación de Funcionalidades en Subpágina
    const featuresList = document.querySelector('.features-list');
    if (featuresList) {
      inView(featuresList, () => {
        animate(
          featuresList.querySelectorAll('.feature-row'),
          { opacity: [0, 1], y: [16, 0] },
          { delay: stagger(0.08), duration: 0.55, ease: 'easeOut' }
        );
      }, { margin: '0px 0px -60px 0px' });
    }

    // F. Revelación del Pie de Página (Footer 3-Col)
    const footer = document.querySelector('footer');
    if (footer) {
      inView(footer, () => {
        animate(
          footer.querySelectorAll('.footer-col-left, .footer-col-center, .footer-col-right'),
          { opacity: [0, 1], y: [14, 0] },
          { delay: stagger(0.1), duration: 0.6, ease: 'easeOut' }
        );
      }, { margin: '0px 0px -40px 0px' });
    }
  }
});
