import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Prevent server/SSR webpack bundle from bundling Sanity at all.
  // Sanity packages are ESM-only and use browser APIs; externalising them lets
  // Node load them natively while the Studio (client-only via useEffect guard)
  // is never rendered server-side.
  serverExternalPackages: [
    'sanity',
    '@sanity/vision',
    '@sanity/ui',
    '@sanity/icons',
  ],

  images: {
    // Serve AVIF first (best compression), WebP as fallback — both auto-handled by next/image
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Sanity CDN — all project image assets
      {
        protocol: 'https',
        hostname:  'cdn.sanity.io',
        pathname:  '/images/**',
      },
    ],
    // Hint the browser to preload hero-sized images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2400],
  },
}

export default nextConfig
