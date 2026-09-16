/**
 * Creative Maximum Reasoning (CMR) — Fabric Stroke Generator
 * Trama textil de urdimbre y trama elástica que reacciona a la proximidad
 * doc/CMR_Web_System_v2_Documentation/docs/06_MATERIAL_SYSTEM.md
 */

export class FabricGenerator {
  static createElements(svg) {
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Malla perimetral de hilo horizontal
    const weaveH = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    weaveH.setAttribute('d', 'M 2,2 L 98,2 M 2,98 L 98,98');
    weaveH.setAttribute('class', 'living-stroke fabric-thread fabric-h');
    weaveH.setAttribute('stroke-dasharray', '3 3');

    // Malla perimetral de hilo vertical
    const weaveV = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    weaveV.setAttribute('d', 'M 2,2 L 2,98 M 98,2 L 98,98');
    weaveV.setAttribute('class', 'living-stroke fabric-thread fabric-v');
    weaveV.setAttribute('stroke-dasharray', '3 3');

    // Nudos de tensión elástica en esquinas
    const tensionKnots = [
      { d: 'M 2,6 L 6,2' },
      { d: 'M 94,2 L 98,6' },
      { d: 'M 98,94 L 94,98' },
      { d: 'M 6,98 L 2,94' }
    ].map(pos => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pos.d);
      path.setAttribute('class', 'fabric-knot');
      svg.appendChild(path);
      return path;
    });

    svg.appendChild(weaveH);
    svg.appendChild(weaveV);

    return { weaveH, weaveV, tensionKnots };
  }

  static applyState(elements, state, proximity = 0) {
    const { weaveH, weaveV, tensionKnots } = elements;
    if (!weaveH) return;

    if (state === 'selected') {
      weaveH.style.opacity = '0.9';
      weaveV.style.opacity = '0.9';
      tensionKnots.forEach(k => k.style.opacity = '1');
      return;
    }

    if (state === 'hover') {
      weaveH.style.opacity = '0.85';
      weaveV.style.opacity = '0.85';
      tensionKnots.forEach(k => k.style.opacity = '0.9');
    } else if (proximity > 0) {
      const op = (0.2 + proximity * 0.55).toFixed(2);
      weaveH.style.opacity = op;
      weaveV.style.opacity = op;
      tensionKnots.forEach(k => k.style.opacity = op);
    } else {
      weaveH.style.opacity = '0.2';
      weaveV.style.opacity = '0.2';
      tensionKnots.forEach(k => k.style.opacity = '0.15');
    }
  }
}
