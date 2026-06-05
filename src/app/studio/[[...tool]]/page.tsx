/**
 * Server component — exports metadata, renders the client studio wrapper.
 * Next.js App Router does not allow metadata exports from 'use client' files.
 */
import type { Metadata, Viewport } from 'next'
import StudioClient from './StudioClient'

export const metadata: Metadata = {
  title: 'Barnängshuset Studio',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

// Studio must not be statically cached
export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <StudioClient />
}
