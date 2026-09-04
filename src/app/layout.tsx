import type { Metadata } from 'next'
import './globals.css'
import '../styles/barnangshuset-site.css'
import '../styles/floor-plans.css'
import SiteMotion            from '@/components/motion/SiteMotion'
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
        {children}
        <SiteMotion />
      </body>
    </html>
  )
}
