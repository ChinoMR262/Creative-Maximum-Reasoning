/**
 * Creative Maximum Reasoning (CMR) — Security Hardening
 * Verificación de directivas de seguridad en cliente y protección de obra
 * doc/CMR_Web_System_v2_Documentation/docs/18_SECURITY_HARDENING.md
 */

export class SecurityHardening {
  static apply() {
    // 1. Detección y defensa contra framing malicioso (Clickjacking defense)
    try {
      if (window.top !== window.self) {
        // Si está embebido indebidamente, romper el frame
        window.top.location = window.self.location;
      }
    } catch (_) {
      // Si el acceso entre orígenes falla, el navegador ya previene acceso
    }

    // 2. Evitar mutaciones globales de prototipos: congelar Object.prototype
    // rompe librerias y no constituye una frontera de seguridad.

    // 3. Marca de agua y metadato de protección de derechos de autor.
    // Las políticas nosniff, Permissions-Policy y anti-framing deben enviarse
    // como cabeceras HTTP desde el perímetro; una meta etiqueta no las sustituye.
    const aiProtectMeta = document.querySelector('meta[name="robots"]');
    if (!aiProtectMeta) {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'index, follow, max-image-preview:large, noai, noimageai';
      document.head.appendChild(meta);
    }
  }
}
