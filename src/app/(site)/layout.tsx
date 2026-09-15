import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { SanityLive } from '@/lib/sanity.live'

/**
 * Sanity Live belongs to the public site only. Keeping it in this route group
 * lets published content invalidate cached pages without affecting /studio.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isEnabled } = await draftMode()

  return (
    <>
      {children}
      <SanityLive />
      {isEnabled && <VisualEditing />}
    </>
  )
}
