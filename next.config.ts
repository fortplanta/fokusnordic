import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
