'use client'

import { usePathname } from 'next/navigation'
import { VisualEditing } from 'next-sanity/visual-editing'
import { SanityLive } from '@/lib/sanity.live'

export default function DraftModeTools() {
  const pathname = usePathname()

  // The Studio is embedded in this Next.js app. Mounting SanityLive inside
  // /studio makes Studio document mutations invalidate the Studio route itself,
  // which can interrupt typing and repeatedly reload the editor.
  if (pathname.startsWith('/studio')) return null

  return <><SanityLive /><VisualEditing /></>
}
