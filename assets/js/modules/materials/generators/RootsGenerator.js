/**
 * Creative Maximum Reasoning (CMR) — Roots Vector Stroke Generator
 * Genera trazados procedurales orgánicos de raíces, bifurcaciones y pulsos
 * doc/CMR_Web_System_v2_Documentation/docs/05_LIVING_FRAMES_AND_SELECTION.md & 06_MATERIAL_SYSTEM.md
 */

export class RootsGenerator {
  static createElements(svg) {
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Trazado perimetral principal de enredadera viva
    const mainRoot = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mainRoot.setAttribute('d', 'M 2,2 L 98,2 C 99,2 99,4 99,8 L 99,92 C 99,96 97,98 92,98 L 8,98 C 3,98 1,96 1,90 L 1,10 C 1,4 3,2 8,2 Z');
    mainRoot.setAttribute('class', 'living-stroke root-main');
    mainRoot.setAttribute('fill', 'none');
    mainRoot.setAttribute('stroke-dasharray', '400');
    mainRoot.setAttribute('stroke-dashoffset', '340'); // 85% oculta en reposo

    // Bifurcación orgánica secundaria superior izquierda
    const branch1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    branch1.setAttribute('d', 'M 2,18 Q 6,10 16,8 Q 22,7 28,2');
    branch1.setAttribute('class', 'living-stroke root-branch');
    branch1.setAttribute('fill', 'none');
    branch1.setAttribute('stroke-dasharray', '50');
    branch1.setAttribute('stroke-dashoffset', '50');

    // Bifurcación orgánica secundaria inferior derecha
    const branch2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    branch2.setAttribute('d', 'M 98,82 Q 94,90 84,92 Q 78,93 72,98');
    branch2.setAttribute('class', 'living-stroke root-branch');
    branch2.setAttribute('fill', 'none');
    branch2.setAttribute('stroke-dasharray', '50');
    branch2.setAttribute('stroke-dashoffset', '50');

    // Nodos de savia / savia luminosa
    const bud1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bud1.setAttribute('cx', '16');
    bud1.setAttribute('cy', '8');
    bud1.setAttribute('r', '1.5');
    bud1.setAttribute('class', 'root-bud');

    const bud2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bud2.setAttribute('cx', '84');
    bud2.setAttribute('cy', '92');
    bud2.setAttribute('r', '1.5');
    bud2.setAttribute('class', 'root-bud');

    svg.appendChild(mainRoot);
    svg.appendChild(branch1);
    svg.appendChild(branch2);
    svg.appendChild(bud1);
    svg.appendChild(bud2);

    return { mainRoot, branch1, branch2, bud1, bud2 };
  }

  static applyState(elements, state, proximity = 0) {
    const { mainRoot, branch1, branch2, bud1, bud2 } = elements;
    if (!mainRoot) return;

    if (state === 'selected') {
      mainRoot.style.strokeDashoffset = '0';
      branch1.style.strokeDashoffset = '0';
      branch2.style.strokeDashoffset = '0';
      bud1.style.opacity = '1';
      bud2.style.opacity = '1';
      return;
    }

    if (state === 'hover') {
      mainRoot.style.strokeDashoffset = '40';
      branch1.style.strokeDashoffset = '10';
      branch2.style.strokeDashoffset = '10';
      bud1.style.opacity = '0.85';
      bud2.style.opacity = '0.85';
      return;
    }

    // Proximidad viva y gradual (reposo: 340 -> a proximidad: hasta 100)
    const offset = 340 - (proximity * 220);
    mainRoot.style.strokeDashoffset = offset.toFixed(1);
    const branchOffset = 50 - (proximity * 35);
    branch1.style.strokeDashoffset = branchOffset.toFixed(1);
    branch2.style.strokeDashoffset = branchOffset.toFixed(1);
    bud1.style.opacity = (proximity * 0.6).toFixed(2);
    bud2.style.opacity = (proximity * 0.6).toFixed(2);
  }
}
