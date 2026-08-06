import type { Metadata } from 'next'
import { VisualEditing } from 'next-sanity/visual-editing'
import './globals.css'
import { SanityLive }        from '@/lib/sanity.live'
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
    'Up to 9,762 m² of office space across three principal floors at Nackagatan 4, Södermalm.',
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
        {/* Live content event stream — revalidates published content and
            streams drafts to the Presentation preview in real time */}
        <SanityLive />
        {/* VisualEditing connects the page to the Studio Presentation tool.
            The component detects the Presentation iframe via postMessage and
            is a no-op for regular visitors — safe to render unconditionally.
            Gating on draftMode() creates a chicken-and-egg: the component
            can't mount to establish the connection needed to enable drafts. */}
        <VisualEditing />
      </body>
    </html>
  )
}
