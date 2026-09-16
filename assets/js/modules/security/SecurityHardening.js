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

    // 2. Congelar objetos sensibles en tiempo de ejecución
    if (Object.freeze) {
      Object.freeze(Object.prototype);
    }

    // 3. Verificación de políticas de seguridad
    const nosniff = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
    if (!nosniff) {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'X-Content-Type-Options';
      meta.content = 'nosniff';
      document.head.appendChild(meta);
    }

    // 4. Marca de agua y metadato de protección de derechos de autor (Anti AI scraping)
    const aiProtectMeta = document.querySelector('meta[name="robots"]');
    if (!aiProtectMeta) {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'index, follow, max-image-preview:large, noai, noimageai';
      document.head.appendChild(meta);
    }
  }
}
