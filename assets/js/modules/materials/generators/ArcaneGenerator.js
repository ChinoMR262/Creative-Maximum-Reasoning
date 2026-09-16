/**
 * Creative Maximum Reasoning (CMR) — Arcane Stroke Generator
 * Filamentos de resonancia cognitiva y nodos de convergencia rúnicos
 * doc/CMR_Web_System_v2_Documentation/docs/05_LIVING_FRAMES_AND_SELECTION.md & 06_MATERIAL_SYSTEM.md
 */

export class ArcaneGenerator {
  static createElements(svg) {
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Filamento luminoso alfa (sentido horario)
    const filamentA = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    filamentA.setAttribute('d', 'M 4,4 L 96,4 L 96,96 L 4,96 Z');
    filamentA.setAttribute('class', 'living-stroke arcane-filament arcane-alpha');
    filamentA.setAttribute('fill', 'none');
    filamentA.setAttribute('stroke-dasharray', '80 120');

    // Filamento luminoso beta (sentido antihorario / desfase)
    const filamentB = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    filamentB.setAttribute('d', 'M 96,4 L 4,4 L 4,96 L 96,96 Z');
    filamentB.setAttribute('class', 'living-stroke arcane-filament arcane-beta');
    filamentB.setAttribute('fill', 'none');
    filamentB.setAttribute('stroke-dasharray', '60 140');

    // Nodos de convergencia en las cuatro esquinas
    const nodes = [
      { cx: '4', cy: '4' },
      { cx: '96', cy: '4' },
      { cx: '96', cy: '96' },
      { cx: '4', cy: '96' }
    ].map(pos => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pos.cx);
      circle.setAttribute('cy', pos.cy);
      circle.setAttribute('r', '2.5');
      circle.setAttribute('class', 'arcane-node');
      svg.appendChild(circle);
      return circle;
    });

    svg.appendChild(filamentA);
    svg.appendChild(filamentB);

    return { filamentA, filamentB, nodes };
  }

  static applyState(elements, state, proximity = 0) {
    const { filamentA, filamentB, nodes } = elements;
    if (!filamentA) return;

    if (state === 'selected') {
      filamentA.classList.add('arcane-stabilized');
      filamentB.classList.add('arcane-stabilized');
      nodes.forEach(n => n.classList.add('node-active'));
      return;
    }

    filamentA.classList.remove('arcane-stabilized');
    filamentB.classList.remove('arcane-stabilized');
    nodes.forEach(n => n.classList.remove('node-active'));

    const intensity = state === 'hover' ? 1 : Math.max(0.2, proximity);
    filamentA.style.opacity = intensity.toString();
    filamentB.style.opacity = (intensity * 0.8).toString();
    nodes.forEach(n => {
      n.style.opacity = (intensity * 0.9).toString();
    });
  }
}
