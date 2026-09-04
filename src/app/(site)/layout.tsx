import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { SanityLive } from '@/lib/sanity.live'

/**
 * Draft tooling belongs to the public site only. Keeping it in this route
 * group prevents the embedded /studio route from importing defineLive.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isEnabled } = await draftMode()

  return (
    <>
      {children}
      {isEnabled && (
        <>
          <SanityLive />
          <VisualEditing />
        </>
      )}
    </>
  )
}
