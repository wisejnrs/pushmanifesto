/** @type {import('next').NextConfig} */

// Content Security Policy — covers the original site's integrations:
// Google Fonts + Material Icons, Google Analytics (gtag), Buy Me a Coffee, Vercel.
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com https://cdnjs.buymeacoffee.com;
  script-src-elem 'self' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com https://cdnjs.buymeacoffee.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https://cdn.buymeacoffee.com https://www.googletagmanager.com https://*.google-analytics.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://va.vercel-scripts.com https://www.googletagmanager.com https://*.google-analytics.com;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/healthz", destination: "/api/health", permanent: false },
      { source: "/health", destination: "/api/health", permanent: false },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

export default nextConfig;
