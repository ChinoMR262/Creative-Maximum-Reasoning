/**
 * Creative Maximum Reasoning (CMR) — Living Frame Controller
 * Controlador de marcos vivos y selección por material (10 materiales oficiales)
 * doc/CMR_Web_System_v2_Documentation/docs/05_LIVING_FRAMES_AND_SELECTION.md y 06_MATERIAL_SYSTEM.md
 */

export class LivingFrameController {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.frames = [];
    this.activeFrame = null;
  }

  mount() {
    this.frames = Array.from(document.querySelectorAll('.living-frame'));

    this.frames.forEach((frame, idx) => {
      if (!frame.dataset.id) {
        frame.dataset.id = `frame-${idx + 1}`;
      }

      // Asignar material por defecto si no viene especificado
      if (!frame.dataset.material) {
        const defaultMaterials = ['roots', 'stone', 'arcane', 'mechanism', 'frost'];
        frame.dataset.material = defaultMaterials[idx % defaultMaterials.length];
      }

      frame.dataset.state = 'dormant';
      if (!frame.hasAttribute('tabindex')) {
        frame.setAttribute('tabindex', '0');
      }

      // Interacción Pointer / Hover
      frame.addEventListener('pointerenter', () => {
        if (frame.dataset.state !== 'selected') {
          frame.dataset.state = 'hover';
        }
      });

      frame.addEventListener('pointerleave', () => {
        if (frame.dataset.state !== 'selected') {
          frame.dataset.state = 'dormant';
        }
      });

      frame.addEventListener('pointerdown', () => {
        if (frame.dataset.state !== 'selected') {
          frame.dataset.state = 'press';
        }
      });

      // Selección por Clic o Teclado
      frame.addEventListener('click', () => {
        this.selectFrame(frame);
      });

      frame.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectFrame(frame);
        }
      });
    });
  }

  selectFrame(selectedFrame) {
    this.frames.forEach((f) => {
      f.removeAttribute('data-active');
      f.setAttribute('aria-selected', 'false');
      f.dataset.state = 'dormant';
    });

    selectedFrame.setAttribute('data-active', 'true');
    selectedFrame.setAttribute('aria-selected', 'true');
    selectedFrame.dataset.state = 'selected';
    this.activeFrame = selectedFrame;

    if (this.eventBus) {
      this.eventBus.emit('frame:select', {
        id: selectedFrame.dataset.id,
        material: selectedFrame.dataset.material,
        element: selectedFrame
      });
    }
  }

  destroy() {
    this.frames = [];
    this.activeFrame = null;
  }
}
