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

export default {
  async fetch(request) {
    const response = await fetch(request);
    return applySecurityHeaders(response);
  }
};
