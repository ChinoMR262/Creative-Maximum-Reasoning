/**
 * Creative Maximum Reasoning (CMR) — Mechanism Stroke Generator
 * Segmentos mecánicos, vernier ticks y retención con lock visual
 * doc/CMR_Web_System_v2_Documentation/docs/05_LIVING_FRAMES_AND_SELECTION.md & 06_MATERIAL_SYSTEM.md
 */

export class MechanismGenerator {
  static createElements(svg) {
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Escuadra mecánica superior izquierda
    const bracketTL = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bracketTL.setAttribute('d', 'M 0,15 L 0,0 L 15,0');
    bracketTL.setAttribute('class', 'living-stroke mech-bracket');
    bracketTL.setAttribute('fill', 'none');

    // Escuadra mecánica inferior derecha
    const bracketBR = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bracketBR.setAttribute('d', 'M 100,85 L 100,100 L 85,100');
    bracketBR.setAttribute('class', 'living-stroke mech-bracket');
    bracketBR.setAttribute('fill', 'none');

    // Indicador vernier desplazable (desplazamiento 2-12px)
    const vernierSlider = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vernierSlider.setAttribute('x1', '20');
    vernierSlider.setAttribute('y1', '0');
    vernierSlider.setAttribute('x2', '35');
    vernierSlider.setAttribute('y2', '0');
    vernierSlider.setAttribute('class', 'living-stroke mech-vernier');

    // Remaches de precisión en las esquinas
    const rivet1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rivet1.setAttribute('cx', '5');
    rivet1.setAttribute('cy', '5');
    rivet1.setAttribute('r', '1.2');
    rivet1.setAttribute('class', 'mech-rivet');

    const rivet2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rivet2.setAttribute('cx', '95');
    rivet2.setAttribute('cy', '95');
    rivet2.setAttribute('r', '1.2');
    rivet2.setAttribute('class', 'mech-rivet');

    svg.appendChild(bracketTL);
    svg.appendChild(bracketBR);
    svg.appendChild(vernierSlider);
    svg.appendChild(rivet1);
    svg.appendChild(rivet2);

    return { bracketTL, bracketBR, vernierSlider, rivet1, rivet2 };
  }

  static applyState(elements, state, proximity = 0) {
    const { bracketTL, bracketBR, vernierSlider, rivet1, rivet2 } = elements;
    if (!vernierSlider) return;

    if (state === 'selected') {
      bracketTL.classList.add('mech-locked');
      bracketBR.classList.add('mech-locked');
      vernierSlider.setAttribute('x1', '50');
      vernierSlider.setAttribute('x2', '65');
      vernierSlider.classList.add('mech-locked');
      rivet1.classList.add('rivet-engaged');
      rivet2.classList.add('rivet-engaged');
      return;
    }

    bracketTL.classList.remove('mech-locked');
    bracketBR.classList.remove('mech-locked');
    vernierSlider.classList.remove('mech-locked');
    rivet1.classList.remove('rivet-engaged');
    rivet2.classList.remove('rivet-engaged');

    if (state === 'hover') {
      vernierSlider.setAttribute('x1', '35');
      vernierSlider.setAttribute('x2', '50');
      return;
    }

    // Desplazamiento proporcional a la proximidad
    const xPos = 20 + (proximity * 15);
    vernierSlider.setAttribute('x1', xPos.toFixed(1));
    vernierSlider.setAttribute('x2', (xPos + 15).toFixed(1));
  }
}
