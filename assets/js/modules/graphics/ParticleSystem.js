/**
 * Creative Maximum Reasoning (CMR) — Particle System
 * Emisor sutil de partículas estacionales desacoplado del DOM
 * doc/CMR_Web_System_v2_Documentation/docs/12_SEASONAL_ENGINE.md
 */

export class ParticleSystem {
  constructor(qualityManager, seasonalEngine) {
    this.qualityManager = qualityManager;
    this.seasonalEngine = seasonalEngine;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isPaused = false;

    this.onResize = this.onResize.bind(this);
  }

  mount() {
    let canvas = document.getElementById('cmr-canvas-world');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'cmr-canvas-world';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;opacity:0.65;';
      document.body.prepend(canvas);
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.onResize();

    window.addEventListener('resize', this.onResize, { passive: true });
    this.initParticles();
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  initParticles() {
    const tier = this.qualityManager.getTier();
    if (tier === 'safe') {
      this.particles = [];
      return;
    }

    const count = tier === 'ultra' ? 24 : tier === 'high' ? 14 : 6;
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02
      });
    }
  }

  update(dt, t) {
    if (!this.ctx || this.isPaused) return;

    // Si reduced-motion o tier safe, limpiar y salir
    if (document.documentElement.dataset.reducedMotion === 'true' || this.qualityManager.getTier() === 'safe') {
      this.ctx.clearRect(0, 0, this.width, this.height);
      return;
    }

    const season = this.seasonalEngine.resolvedSeason;
    if (season === 'off') {
      this.ctx.clearRect(0, 0, this.width, this.height);
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Paletas por estación
    let color = 'rgba(212, 163, 67, '; // Default ámbar
    if (season === 'winter') {
      color = 'rgba(180, 210, 235, ';
    } else if (season === 'autumn') {
      color = 'rgba(196, 108, 55, ';
    } else if (season === 'spring') {
      color = 'rgba(125, 175, 110, ';
    }

    for (const p of this.particles) {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.angle) * 0.3;
      p.angle += p.spin;

      // Reciclaje fuera del viewport
      if (p.y > this.height) {
        p.y = -10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      this.ctx.fillStyle = `${color}${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.canvas?.remove();
    this.particles = [];
  }
}
