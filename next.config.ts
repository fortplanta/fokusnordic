import type { NextConfig } from 'next'
import path from 'path'

// Absolute paths to the real installed React builds.
// NormalModuleReplacementPlugin rewrites to absolute paths, which bypasses
// Next.js's 'react$' alias that redirects to next/dist/compiled/react/ —
// that vendored copy omits useEffectEvent, breaking @sanity/vision imports.
const REACT_CJS_PROD = path.resolve('./node_modules/react/cjs/react.production.js')
const REACT_CJS_DEV  = path.resolve('./node_modules/react/cjs/react.development.js')

// Sanity packages are ESM ("type":"module") and use useEffectEvent.
// Match any file under node_modules/sanity or node_modules/@sanity.
const SANITY_CTX_RE = /[\\/]node_modules[\\/](@?sanity)[\\/]/

const nextConfig: NextConfig = {
  // Prevent server/SSR webpack bundle from bundling Sanity at all.
  // The react-server subset of React (used for SSR) also lacks useEffectEvent.
  serverExternalPackages: [
    'sanity',
    '@sanity/vision',
    '@sanity/ui',
    '@sanity/icons',
    // next-sanity intentionally omitted: the Studio is loaded with ssr:false
    // so it never enters the server bundle, making externalization unnecessary.
    // Including it here breaks next/dynamic's import() for ESM externals.
  ],

  webpack(config, { webpack, dev, isServer }) {
    // Only apply on the SERVER build. The server uses a vendored React subset
    // (react-server) that lacks useEffectEvent, so Sanity package imports of
    // 'react' must be redirected to the real installed CJS build.
    //
    // On the CLIENT build, webpack deduplicates React automatically. Applying
    // the redirect there would create two module IDs for React (index.js vs
    // cjs/react.development.js), causing "Invalid hook call / multiple React
    // copies" errors in the browser.
    if (isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^react$/, (resource: { context?: string; request: string }) => {
          if (SANITY_CTX_RE.test(resource.context ?? '')) {
            resource.request = dev ? REACT_CJS_DEV : REACT_CJS_PROD
          }
        })
      )
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
