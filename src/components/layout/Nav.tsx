'use client'

import { useEffect, useRef } from 'react'

export default function Nav({ propertyName }: { propertyName?: string }) {
  const navRef  = useRef<HTMLElement>(null)
  const lastY   = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true

      requestAnimationFrame(() => {
        const y = window.scrollY
        // Only hide after scrolling past 80px — never hide at the very top
        if (y > 80) {
          nav.classList.toggle('hidden', y > lastY.current)
        } else {
          nav.classList.remove('hidden')
        }
        lastY.current = y
        ticking.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav ref={navRef} className="nav" aria-label="Main navigation">
      <div className="container">
        <a href="/" className="nav__brand" aria-label="Barnängshuset home">
          {propertyName ?? 'Barnängshuset'}
        </a>
        <div className="nav__center" role="list">
          <a href="#spaces"        role="listitem">Spaces</a>
          <a href="#building"      role="listitem">Building</a>
          <a href="#neighbourhood" role="listitem">Neighbourhood</a>
        </div>
        <div className="nav__right" role="list">
          <a href="#journal" role="listitem">Journal</a>
          <a href="#viewing" role="listitem">Contact</a>
        </div>
      </div>
    </nav>
  )
}
