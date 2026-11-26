const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "script-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "upgrade-insecure-requests"
].join('; ');

export function applySecurityHeaders(response) {
  const secured = new Response(response.body, response);
  secured.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
  secured.headers.set('Strict-Transport-Security', 'max-age=31536000');
  secured.headers.set('X-Content-Type-Options', 'nosniff');
  secured.headers.set('X-Frame-Options', 'DENY');
  secured.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  secured.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  secured.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  return secured;
}

function redirectTo(path, baseUrl, status = 301) {
  return applySecurityHeaders(Response.redirect(new URL(path, baseUrl).href, status));
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const legacyPcDownload = '/apps/cmr-ping-booster/cmr_ping_booster_pc.exe';
    const legacyPcDownloadAlt = '/apps/cmr-ping-booster/cmr_ping_booster_pc';
    const lowerPath = url.pathname.toLowerCase();

    // 1. Redirecciones 301 permanentes para rutas antiguas y binarios obsoletos (evitar 404)
    if (lowerPath === legacyPcDownload || lowerPath === legacyPcDownloadAlt) {
      return redirectTo('/apps/cmr-ping-booster/', url, 301);
    }

    if (lowerPath === '/apps/cmr-writer-lite.html') {
      return redirectTo('/apps/cmr-writer-lite/', url, 301);
    }

    if (lowerPath === '/apps/cmr-ping-booster.html') {
      return redirectTo('/apps/cmr-ping-booster/', url, 301);
    }

    // 2. Manejo de trampa 404 de Cloudflare Email Protection
    if (lowerPath.startsWith('/cdn-cgi/l/email-protection')) {
      return redirectTo('/#contact', url, 301);
    }

    const cacheableMethod = request.method === 'GET' || request.method === 'HEAD';
    const managedPath = !url.pathname.startsWith('/cdn-cgi/');
    const authenticated = request.headers.has('Authorization');
    const isStaticAsset = /\.(?:avif|css|gif|ico|jpe?g|js|json|png|svg|webp|woff2?)$/i.test(url.pathname);
    const edgeTtl = isStaticAsset ? 86400 : 600;

    const response = await fetch(request, cacheableMethod && managedPath && !authenticated ? {
      cf: {
        cacheEverything: true,
        cacheTtlByStatus: {
          '200-299': edgeTtl,
          '404': 60,
          '500-599': 0
        }
      }
    } : undefined);
    return applySecurityHeaders(response);
  }
};
