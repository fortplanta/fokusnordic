import type { NextConfig } from 'next'
import path from 'path'

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

  webpack(config, { isServer }) {
    // Next.js aliases "react" → next/dist/compiled/react (a canary build,
    // currently 19.2.0-canary) which does NOT export useEffectEvent.
    // sanity/structureTool imports useEffectEvent from "react" directly and
    // crashes in the browser.
    //
    // Client bundle only: override the alias so every package — including
    // Sanity — resolves to the single installed react@19.2.6 (stable), which
    // has useEffectEvent. One module ID, one React instance, no hook errors.
    //
    // Server bundle is left untouched: Next.js's RSC runtime, SSR internals,
    // and dev-tools all expect the vendored React on the server side.
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
      }
    }
    return config
  },

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
