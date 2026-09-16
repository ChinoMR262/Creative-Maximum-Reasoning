/**
 * Creative Maximum Reasoning (CMR) — Frost Stroke Generator
 * Cristalización angular perimetral y crecimiento de dendritas de escarcha
 * doc/CMR_Web_System_v2_Documentation/docs/05_LIVING_FRAMES_AND_SELECTION.md & 06_MATERIAL_SYSTEM.md
 */

export class FrostGenerator {
  static createElements(svg) {
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Dendrita cristalina esquina superior derecha
    const crystalTR = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    crystalTR.setAttribute('d', 'M 75,2 L 98,2 L 98,25 M 98,2 L 86,14 M 94,6 L 90,2 M 98,10 L 94,14');
    crystalTR.setAttribute('class', 'living-stroke frost-crystal');
    crystalTR.setAttribute('fill', 'none');
    crystalTR.setAttribute('stroke-dasharray', '80');
    crystalTR.setAttribute('stroke-dashoffset', '60');

    // Dendrita cristalina esquina inferior izquierda
    const crystalBL = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    crystalBL.setAttribute('d', 'M 25,98 L 2,98 L 2,75 M 2,98 L 14,86 M 6,94 L 10,98 M 2,90 L 6,86');
    crystalBL.setAttribute('class', 'living-stroke frost-crystal');
    crystalBL.setAttribute('fill', 'none');
    crystalBL.setAttribute('stroke-dasharray', '80');
    crystalBL.setAttribute('stroke-dashoffset', '60');

    svg.appendChild(crystalTR);
    svg.appendChild(crystalBL);

    return { crystalTR, crystalBL };
  }

  static applyState(elements, state, proximity = 0) {
    const { crystalTR, crystalBL } = elements;
    if (!crystalTR) return;

    if (state === 'selected') {
      crystalTR.style.strokeDashoffset = '0';
      crystalBL.style.strokeDashoffset = '0';
      crystalTR.classList.add('frost-solidified');
      crystalBL.classList.add('frost-solidified');
      return;
    }

    crystalTR.classList.remove('frost-solidified');
    crystalBL.classList.remove('frost-solidified');

    if (state === 'hover') {
      crystalTR.style.strokeDashoffset = '15';
      crystalBL.style.strokeDashoffset = '15';
      return;
    }

    const offset = 60 - (proximity * 35);
    crystalTR.style.strokeDashoffset = offset.toFixed(1);
    crystalBL.style.strokeDashoffset = offset.toFixed(1);
  }
}
