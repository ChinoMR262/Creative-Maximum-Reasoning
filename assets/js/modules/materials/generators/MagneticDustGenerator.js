/**
 * Creative Maximum Reasoning (CMR) — Magnetic Dust Generator
 * Micropartículas perimetrales que se polarizan y concentran según la posición del cursor
 * doc/CMR_Web_System_v2_Documentation/docs/06_MATERIAL_SYSTEM.md
 */

export class MagneticDustGenerator {
  static createElements(svg) {
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    const particles = [];
    const positions = [
      { x: 15, y: 3 }, { x: 35, y: 3 }, { x: 65, y: 3 }, { x: 85, y: 3 },
      { x: 97, y: 25 }, { x: 97, y: 50 }, { x: 97, y: 75 },
      { x: 85, y: 97 }, { x: 65, y: 97 }, { x: 35, y: 97 }, { x: 15, y: 97 },
      { x: 3, y: 75 }, { x: 3, y: 50 }, { x: 3, y: 25 }
    ];

    positions.forEach((pos, idx) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pos.x.toString());
      circle.setAttribute('cy', pos.y.toString());
      circle.setAttribute('r', (Math.random() * 1.2 + 0.8).toFixed(1));
      circle.setAttribute('class', 'living-stroke magnetic-dust-particle');
      circle.setAttribute('data-origin-x', pos.x.toString());
      circle.setAttribute('data-origin-y', pos.y.toString());
      svg.appendChild(circle);
      particles.push(circle);
    });

    return { particles };
  }

  static applyState(elements, state, proximity = 0, pointerX = 50, pointerY = 50) {
    const { particles } = elements;
    if (!particles) return;

    const isHover = state === 'hover' || state === 'selected';

    particles.forEach(p => {
      const ox = parseFloat(p.getAttribute('data-origin-x') || '0');
      const oy = parseFloat(p.getAttribute('data-origin-y') || '0');

      if (isHover || proximity > 0.3) {
        // Atracción magnética hacia el cursor
        const dx = (pointerX - ox) * 0.08 * (isHover ? 1.4 : proximity);
        const dy = (pointerY - oy) * 0.08 * (isHover ? 1.4 : proximity);
        p.setAttribute('cx', (ox + dx).toFixed(2));
        p.setAttribute('cy', (oy + dy).toFixed(2));
        p.style.opacity = (0.4 + proximity * 0.55).toFixed(2);
      } else {
        p.setAttribute('cx', ox.toString());
        p.setAttribute('cy', oy.toString());
        p.style.opacity = '0.25';
      }
    });
  }
}
