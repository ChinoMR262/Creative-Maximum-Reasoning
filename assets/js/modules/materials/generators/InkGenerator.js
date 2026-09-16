/**
 * Creative Maximum Reasoning (CMR) — Ink Stroke Generator
 * Capilaridad de tinta literaria viva y manchas caligráficas de autor
 * doc/CMR_Web_System_v2_Documentation/docs/06_MATERIAL_SYSTEM.md
 */

export class InkGenerator {
  static createElements(svg) {
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Trazo de pluma perimetral
    const inkLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    inkLine.setAttribute('d', 'M 3,3 C 30,2 70,4 97,3 C 98,30 96,70 97,97 C 70,96 30,98 3,97 C 2,70 4,30 3,3 Z');
    inkLine.setAttribute('class', 'living-stroke ink-line');
    inkLine.setAttribute('fill', 'none');

    // Manchas de capilaridad en esquinas
    const inkSplashes = [
      { d: 'M 3,3 Q 12,5 8,14 Q 4,10 3,3 Z' },
      { d: 'M 97,3 Q 88,6 92,15 Q 96,10 97,3 Z' },
      { d: 'M 97,97 Q 87,95 91,86 Q 95,90 97,97 Z' },
      { d: 'M 3,97 Q 13,94 9,85 Q 5,90 3,97 Z' }
    ].map(pos => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pos.d);
      path.setAttribute('class', 'ink-splash');
      svg.appendChild(path);
      return path;
    });

    svg.appendChild(inkLine);

    return { inkLine, inkSplashes };
  }

  static applyState(elements, state, proximity = 0) {
    const { inkLine, inkSplashes } = elements;
    if (!inkLine) return;

    if (state === 'selected' || state === 'hover') {
      inkLine.style.opacity = '0.95';
      inkLine.style.strokeWidth = '1.8px';
      inkSplashes.forEach(s => {
        s.style.opacity = '0.9';
        s.style.transform = 'scale(1.15)';
      });
      return;
    }

    if (proximity > 0) {
      const op = (0.25 + proximity * 0.6).toFixed(2);
      inkLine.style.opacity = op;
      inkLine.style.strokeWidth = `${(1 + proximity * 0.6).toFixed(2)}px`;
      inkSplashes.forEach(s => {
        s.style.opacity = op;
        s.style.transform = `scale(${(1 + proximity * 0.12).toFixed(2)})`;
      });
    } else {
      inkLine.style.opacity = '0.25';
      inkLine.style.strokeWidth = '1px';
      inkSplashes.forEach(s => {
        s.style.opacity = '0.2';
        s.style.transform = 'scale(1)';
      });
    }
  }
}
