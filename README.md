# Creative Maximum Reasoning (CMR)

Sitio web oficial y portal de distribución de aplicaciones, desarrollos de software y proyectos literarios de **Creative Maximum Reasoning**.

🌐 **Sitio Web Oficial:** [cmr-reasoning.com.ar](https://cmr-reasoning.com.ar)

---

## Acerca del Proyecto

Creative Maximum Reasoning es el sello de desarrollo y creación independiente liderado por **Jonathan Gabriel Nieto (S9U)** desde Neuquén, Argentina. Este repositorio contiene la plataforma web que sirve como punto central para nuestras aplicaciones y publicaciones.

### Desarrollos y Aplicaciones
- **CMR Writer Lite:** Sistema local de escritura y organización narrativa con
  capítulos, versiones, personajes, lugares, objetos, vínculos, cronología,
  continuidad y backups portables.

## Estado de CMR Writer Lite

- Versión vigente: `1.0.0 (17)`.
- Canal: v17 publicada en la prueba cerrada de Google Play.
- Producción: inactiva; la publicación cerrada no es un lanzamiento público.
- Las tarjetas genéricas y sus datos de demostración fueron retirados. La
  portada enlaza directamente a las fichas oficiales de Google Play.
- La privacidad pública contempla imágenes de personajes y objetos, detección
  local de géneros y comprobaciones locales de continuidad.

Actualizado: 28 de septiembre de 2026.

---

## Tecnologías y Arquitectura

- **Estructura y Estilos:** HTML5 semántico y CSS3 modular de alto rendimiento.
- **Interacciones:** Motor de animación nativo y diseño responsivo.
- **Infraestructura:** Desplegado en GitHub Pages con aceleración perimetral y seguridad mediante Cloudflare.

---

## Canales Oficiales

- **Sitio Web:** [cmr-reasoning.com.ar](https://cmr-reasoning.com.ar)
- **Contacto:** [contacto@cmr-reasoning.com.ar](mailto:contacto@cmr-reasoning.com.ar)
- **Google Play:** [Creative Maximum Reasoning](https://play.google.com/store/apps/dev?id=9143476523440074627)
- **Ubicación:** Neuquén, Argentina

---

© 2026 Creative Maximum Reasoning. Todos los derechos reservados.

---

## Seguridad HTTP

El sitio incluye una política CSP compatible con el alojamiento estático y un Worker de Cloudflare versionado en `cloudflare/security-headers-worker.js`. El Worker agrega CSP con protección anti-framing, HSTS, `nosniff`, Permissions Policy, Referrer Policy y COOP.

La configuración está en `wrangler.toml`. Su activación requiere autenticación de la cuenta propietaria de la zona y debe verificarse después del despliegue con:

```powershell
npx wrangler deploy
curl.exe -I https://cmr-reasoning.com.ar/
```
