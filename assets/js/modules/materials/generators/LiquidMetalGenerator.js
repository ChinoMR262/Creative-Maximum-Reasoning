/**
 * Creative Maximum Reasoning (CMR) — Liquid Metal Stroke Generator
 * Trazos de mercurio y oro líquido con tensión superficial especular
 * doc/CMR_Web_System_v2_Documentation/docs/06_MATERIAL_SYSTEM.md
 */

export class LiquidMetalGenerator {
  static createElements(svg) {
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Filamento de metal líquido perimetral
    const flowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    flowPath.setAttribute('d', 'M 4,4 Q 50,2 96,4 Q 98,50 96,96 Q 50,98 4,96 Q 2,50 4,4 Z');
    flowPath.setAttribute('class', 'living-stroke liquid-metal-flow');
    flowPath.setAttribute('fill', 'none');

    // Gotas de tensión superficial en bordes
    const droplets = [
      { cx: '50', cy: '3', r: '2.2' },
      { cx: '97', cy: '50', r: '2.2' },
      { cx: '50', cy: '97', r: '2.2' },
      { cx: '3', cy: '50', r: '2.2' }
    ].map(d => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', d.cx);
      circle.setAttribute('cy', d.cy);
      circle.setAttribute('r', d.r);
      circle.setAttribute('class', 'liquid-metal-droplet');
      svg.appendChild(circle);
      return circle;
    });

    svg.appendChild(flowPath);

    return { flowPath, droplets };
  }

  static applyState(elements, state, proximity = 0) {
    const { flowPath, droplets } = elements;
    if (!flowPath) return;

    if (state === 'selected' || state === 'hover') {
      flowPath.style.opacity = '1';
      flowPath.style.strokeWidth = '2px';
      droplets.forEach(d => {
        d.style.opacity = '1';
        d.style.transform = 'scale(1.2)';
      });
      return;
    }

    if (proximity > 0) {
      const op = (0.3 + proximity * 0.6).toFixed(2);
      flowPath.style.opacity = op;
      flowPath.style.strokeWidth = `${(1 + proximity * 0.8).toFixed(2)}px`;
      droplets.forEach(d => {
        d.style.opacity = op;
        d.style.transform = `scale(${(1 + proximity * 0.18).toFixed(2)})`;
      });
    } else {
      flowPath.style.opacity = '0.3';
      flowPath.style.strokeWidth = '1px';
      droplets.forEach(d => {
        d.style.opacity = '0.25';
        d.style.transform = 'scale(1)';
      });
    }
  }
}
