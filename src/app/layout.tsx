import type { Metadata } from 'next'
import './globals.css'
import JsFlag               from '@/components/motion/JsFlag'
import SmoothScrollProvider  from '@/components/motion/SmoothScrollProvider'
import PageAnimations        from '@/components/motion/PageAnimations'
import SkipLink              from '@/components/layout/SkipLink'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://barnangshuset.se'

// Default / fallback metadata — overridden per-page via generateMetadata
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s — Barnängshuset',
    default:  'Barnängshuset — Office Space in Södermalm',
  },
  description:
    'A restored 1917 cotton mill at Nackagatan 4, Södermalm. Two floors of calm, focused workspace for founders, studios, and small teams.',
  openGraph: {
    siteName: 'Barnängshuset',
    locale:   'en_SE',
    type:     'website',
  },
  // Prevent indexing of localhost / staging — real domain set in NEXT_PUBLIC_SITE_URL
  robots: process.env.NODE_ENV === 'production'
    ? { index: true, follow: true }
    : { index: false, follow: false },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external origins used in the critical path */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://api.maptiler.com" />
        <link rel="dns-prefetch" href="https://tiles.maptiler.com" />
      </head>
      <body>
        {/* Skip-to-content for keyboard users */}
        <SkipLink />
        {/* Adds .js to <html> on hydration — activates animation CSS */}
        <JsFlag />
        {/* Lenis smooth scroll + GSAP ticker */}
        <SmoothScrollProvider>
          {children}
          <PageAnimations />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
