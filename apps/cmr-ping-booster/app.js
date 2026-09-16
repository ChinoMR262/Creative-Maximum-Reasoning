document.addEventListener('DOMContentLoaded', () => {
  loadRemoteVersion();
  initLanguagePreference();
  initScrollProgress();
  initCardTilt();
});

async function loadRemoteVersion() {
  const isEnglish = window.location.pathname.includes('/en/');
  const androidReleasePath = isEnglish ? '../android-release.json' : './android-release.json';
  const versionManifestPath = isEnglish ? '../version.json' : './version.json';

  try {
    const [androidResponse, versionResponse] = await Promise.all([
      fetch(androidReleasePath, { cache: 'no-store' }),
      fetch(versionManifestPath, { cache: 'no-store' })
    ]);
    if (!androidResponse.ok || !versionResponse.ok) return;
    const data = await androidResponse.json();
    const versionManifest = await versionResponse.json();

    if (data.versionName && data.versionCode) {
      const androidBadge = document.getElementById('android-version-badge');
      if (androidBadge) {
        androidBadge.textContent = isEnglish
          ? `v${data.versionName} (${data.versionCode}) · Android 7.0 or higher`
          : `v${data.versionName} (${data.versionCode}) · Android 7.0 o superior`;
      }
    }

    if (versionManifest.pc) {
      const pcBadge = document.getElementById('pc-version-badge');
      if (pcBadge) {
        pcBadge.textContent = isEnglish
          ? `v${versionManifest.pc.version} EXE · Standalone Portable Binary`
          : `v${versionManifest.pc.version} EXE · Binario Autónomo Portable`;
      }
    }
  } catch (err) {
    // Modo de fallo silencioso para entornos sin conexión o previsualización local
  }
}

function initLanguagePreference() {
  const langOptions = document.querySelectorAll('.lang-option');
  langOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const targetLang = opt.textContent.trim().toUpperCase();
      try {
        localStorage.setItem('cmr_preferred_lang', targetLang);
      } catch (e) {
      }
    });
  });
}

/**
 * Barra de progreso de lectura / scroll nativa
 * Basada en APIs estándar del navegador con requestAnimationFrame
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;
  let ticking = false;

  const updateProgress = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}

/**
 * Microinteracción de inclinación sutil (tilt) en tarjetas clave
 * Activada exclusivamente con puntero de mouse (pointer: fine) y respetando prefers-reduced-motion
 */
function initCardTilt() {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!hasFinePointer || prefersReducedMotion) return;

  const targetCards = document.querySelectorAll('.audit-cell, .btn-download, .arch-compare-box');

  targetCards.forEach(card => {
    card.style.transition = 'transform 0.15s ease-out, border-color 0.25s ease, box-shadow 0.25s ease';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Inclinación máxima sutil de 2.5 grados para no deformar texto
      const rotateX = ((y - centerY) / centerY) * -2.5;
      const rotateY = ((x - centerX) / centerX) * 2.5;

      card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
