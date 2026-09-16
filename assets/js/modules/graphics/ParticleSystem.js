/**
 * Creative Maximum Reasoning (CMR) — Particle System
 * Emisor sutil de partículas estacionales desacoplado del DOM
 * doc/CMR_Web_System_v2_Documentation/docs/12_SEASONAL_ENGINE.md
 */

export class ParticleSystem {
  constructor(qualityManager, seasonalEngine, eventBus = null) {
    this.qualityManager = qualityManager;
    this.seasonalEngine = seasonalEngine;
    this.eventBus = eventBus;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isPaused = false;

    this.onResize = this.onResize.bind(this);
    this.onSeasonChange = this.onSeasonChange.bind(this);

    if (this.eventBus) {
      this.eventBus.on('season:change', this.onSeasonChange);
      this.eventBus.on('quality:change', () => this.initParticles());
    }
  }

  onSeasonChange() {
    this.initParticles();
  }

  mount() {
    let canvas = document.getElementById('cmr-canvas-world');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'cmr-canvas-world';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;opacity:0.75;';
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

    const count = tier === 'ultra' ? 26 : tier === 'high' ? 16 : 8;
    this.particles = [];
    const season = this.seasonalEngine ? this.seasonalEngine.resolvedSeason : 'auto';

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(season));
    }
  }

  createParticle(season) {
    const isSummer = season === 'summer';
    return {
      x: Math.random() * this.width,
      y: isSummer ? this.height + Math.random() * 20 : Math.random() * this.height,
      size: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: isSummer ? -(Math.random() * 0.6 + 0.2) : (Math.random() * 0.5 + 0.2),
      opacity: Math.random() * 0.45 + 0.15,
      baseOpacity: Math.random() * 0.45 + 0.15,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.03,
      tilt: Math.random() * Math.PI,
      pulsePhase: Math.random() * Math.PI * 2
    };
  }

  update(dt, t) {
    if (!this.ctx || this.isPaused) return;

    // Respeto estricto a preferencia de reducción de movimiento y Tier Safe
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

    for (const p of this.particles) {
      p.pulsePhase += 0.025;

      switch (season) {
        case 'winter': {
          // Copos de nieve con deriva oscilatoria y caída gravitatoria sostenida
          p.y += p.speedY * 0.85;
          p.x += p.speedX + Math.sin(p.angle) * 0.45;
          p.angle += p.spin;

          if (p.y > this.height + 10) {
            p.y = -10;
            p.x = Math.random() * this.width;
          }
          if (p.x < -10) p.x = this.width + 10;
          if (p.x > this.width + 10) p.x = -10;

          this.renderSnowflake(p);
          break;
        }

        case 'autumn': {
          // Brasas y esquirlas de follaje con rotación tumbling
          p.y += p.speedY * 1.1;
          p.x += p.speedX + Math.cos(p.angle) * 0.65;
          p.angle += p.spin * 1.4;
          p.tilt += 0.02;

          if (p.y > this.height + 15) {
            p.y = -15;
            p.x = Math.random() * this.width;
          }
          if (p.x < -20) p.x = this.width + 20;
          if (p.x > this.width + 20) p.x = -20;

          this.renderEmber(p);
          break;
        }

        case 'spring': {
          // Esporas de polen y bio-luminiscencia orgánica con flotabilidad lenta
          p.y += Math.sin(p.angle) * 0.35 + p.speedY * 0.25;
          p.x += Math.cos(p.pulsePhase) * 0.4 + p.speedX;
          p.angle += p.spin * 0.8;
          p.opacity = p.baseOpacity * (0.65 + 0.35 * Math.sin(p.pulsePhase));

          if (p.y > this.height + 10) p.y = -10;
          if (p.y < -10) p.y = this.height + 10;
          if (p.x < -10) p.x = this.width + 10;
          if (p.x > this.width + 10) p.x = -10;

          this.renderSpore(p);
          break;
        }

        case 'summer': {
          // Destellos solares térmicos con convección ascendente
          p.y += p.speedY * 1.25;
          p.x += Math.sin(p.angle * 1.5) * 0.35;
          p.angle += p.spin * 1.2;

          // Desvanecimiento suave al subir
          const progress = Math.max(0, Math.min(1, p.y / this.height));
          p.opacity = p.baseOpacity * progress;

          if (p.y < -15) {
            p.y = this.height + 15;
            p.x = Math.random() * this.width;
            p.opacity = p.baseOpacity;
          }
          if (p.x < -10) p.x = this.width + 10;
          if (p.x > this.width + 10) p.x = -10;

          this.renderSolarSpark(p);
          break;
        }

        default: {
          // Modo neutro/ámbar clásico de CMR
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.angle) * 0.3;
          p.angle += p.spin;

          if (p.y > this.height) {
            p.y = -10;
            p.x = Math.random() * this.width;
          }
          if (p.x < -10) p.x = this.width + 10;
          if (p.x > this.width + 10) p.x = -10;

          this.ctx.fillStyle = `rgba(212, 163, 67, ${p.opacity})`;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  renderSnowflake(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.angle);
    this.ctx.fillStyle = `rgba(215, 235, 252, ${p.opacity})`;
    
    // Núcleo facetado sutil
    this.ctx.beginPath();
    this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    this.ctx.fill();

    // Micro-rayos en tier Ultra
    if (this.qualityManager.getTier() === 'ultra' && p.size > 1.6) {
      this.ctx.strokeStyle = `rgba(180, 215, 245, ${p.opacity * 0.7})`;
      this.ctx.lineWidth = 0.75;
      this.ctx.beginPath();
      this.ctx.moveTo(-p.size * 1.5, 0);
      this.ctx.lineTo(p.size * 1.5, 0);
      this.ctx.moveTo(0, -p.size * 1.5);
      this.ctx.lineTo(0, p.size * 1.5);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  renderEmber(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.angle);
    this.ctx.scale(1, Math.cos(p.tilt) * 0.6 + 0.4); // Efecto tumbling tridimensional
    this.ctx.fillStyle = `rgba(224, 118, 56, ${p.opacity})`;

    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.7, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  renderSpore(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    
    // Halo suave bio-luminiscente
    const grad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.2);
    grad.addColorStop(0, `rgba(145, 215, 140, ${p.opacity})`);
    grad.addColorStop(0.5, `rgba(110, 185, 125, ${p.opacity * 0.4})`);
    grad.addColorStop(1, 'rgba(110, 185, 125, 0)');

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, p.size * 2.2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  renderSolarSpark(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.fillStyle = `rgba(248, 192, 72, ${p.opacity})`;

    // Micro-chispa alargada verticalmente por convección
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, p.size * 0.7, p.size * 1.8, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.canvas?.remove();
    this.particles = [];
  }
}
