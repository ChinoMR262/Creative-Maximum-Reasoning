/**
 * Creative Maximum Reasoning (CMR) — Stone Stroke Generator
 * Borde mineral con microfisuras procedurales kintsugi (iluminación selectiva de grietas)
 * doc/CMR_Web_System_v2_Documentation/docs/05_LIVING_FRAMES_AND_SELECTION.md & 06_MATERIAL_SYSTEM.md
 */

export class StoneGenerator {
  static createElements(svg) {
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Perímetro mineral facetado/biselado
    const border = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    border.setAttribute('d', 'M 3,0 L 97,0 L 100,3 L 100,97 L 97,100 L 3,100 L 0,97 L 0,3 Z');
    border.setAttribute('class', 'living-stroke stone-border');
    border.setAttribute('fill', 'none');

    // Microfisura procedural 1 (estilo kintsugi mineral)
    const fissure1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fissure1.setAttribute('d', 'M 0,35 L 8,37 L 14,33 L 20,38 L 26,36');
    fissure1.setAttribute('class', 'living-stroke stone-fissure');
    fissure1.setAttribute('fill', 'none');

    // Microfisura procedural 2 (ángulo opuesto)
    const fissure2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fissure2.setAttribute('d', 'M 100,68 L 92,66 L 85,71 L 80,67 L 72,70');
    fissure2.setAttribute('class', 'living-stroke stone-fissure');
    fissure2.setAttribute('fill', 'none');

    svg.appendChild(border);
    svg.appendChild(fissure1);
    svg.appendChild(fissure2);

    return { border, fissure1, fissure2 };
  }

  static applyState(elements, state, proximity = 0) {
    const { border, fissure1, fissure2 } = elements;
    if (!border) return;

    if (state === 'selected') {
      border.classList.add('stone-active');
      fissure1.classList.add('fissure-glowing');
      fissure2.classList.add('fissure-glowing');
      fissure1.style.opacity = '1';
      fissure2.style.opacity = '1';
      return;
    }

    border.classList.remove('stone-active');
    fissure1.classList.remove('fissure-glowing');
    fissure2.classList.remove('fissure-glowing');

    if (state === 'hover') {
      fissure1.style.opacity = '0.75';
      fissure2.style.opacity = '0.75';
      return;
    }

    const op = (0.15 + (proximity * 0.4)).toFixed(2);
    fissure1.style.opacity = op;
    fissure2.style.opacity = op;
  }
}
