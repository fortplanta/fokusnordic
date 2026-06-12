'use client'

import { useState, useEffect } from 'react'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

// NextStudio calls browser-only React hooks and must not run during SSR.
// useEffect + state defers rendering until after hydration: the server and the
// initial client render both return null (no mismatch), then the Studio mounts
// once the component is confirmed live in the browser.
export default function StudioClient() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return <NextStudio config={config} />
}
