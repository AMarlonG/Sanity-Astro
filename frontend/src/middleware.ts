import type { MiddlewareHandler } from 'astro';

/**
 * Security Middleware
 *
 * Applies Content Security Policy and security headers globally.
 * CSP is relaxed in development for Visual Editing compatibility.
 */

const isDevelopment = import.meta.env.DEV;

// Content Security Policy configuration
function getCSPDirectives(): string {
  if (isDevelopment) {
    // Relaxed CSP for development - allows Visual Editing
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.sanity.io", // unsafe-eval needed for Visual Editing
      "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for Astro scoped styles
      "img-src 'self' cdn.sanity.io data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' *.sanity.io wss://*.sanity.io", // WebSocket for Visual Editing
      "frame-src 'self' http://localhost:3333", // Allow embedding Studio in dev
      "frame-ancestors 'self' http://localhost:3333",
      "worker-src 'self' blob:",
    ].join('; ');
  }

  // Strict CSP for production
  return [
    "default-src 'self'",
    "script-src 'self'", // No unsafe-inline or unsafe-eval in production
    "style-src 'self' 'unsafe-inline'", // unsafe-inline still needed for Astro scoped styles
    "img-src 'self' cdn.sanity.io data:",
    "font-src 'self' data:",
    "connect-src 'self' *.sanity.io",
    "frame-src 'none'", // No iframes in production
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "worker-src 'self' blob:",
  ].join('; ');
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();

  // Clone response to modify headers
  const modifiedResponse = new Response(response.body, response);

  // Add CSP header
  const csp = getCSPDirectives();
  modifiedResponse.headers.set('Content-Security-Policy', csp);

  // Add additional security headers (complementing API route headers)
  if (!modifiedResponse.headers.has('X-Content-Type-Options')) {
    modifiedResponse.headers.set('X-Content-Type-Options', 'nosniff');
  }
  if (!modifiedResponse.headers.has('X-Frame-Options')) {
    modifiedResponse.headers.set('X-Frame-Options', isDevelopment ? 'SAMEORIGIN' : 'DENY');
  }
  if (!modifiedResponse.headers.has('X-XSS-Protection')) {
    modifiedResponse.headers.set('X-XSS-Protection', '1; mode=block');
  }
  if (!modifiedResponse.headers.has('Referrer-Policy')) {
    modifiedResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  if (!modifiedResponse.headers.has('Permissions-Policy')) {
    modifiedResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  }

  return modifiedResponse;
};
