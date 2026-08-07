'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const navigation = [
  ['#building', 'Building'],
  ['#gallery', 'Gallery'],
  ['#spaces', 'Space'],
  ['#place', 'Address'],
] as const

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', close)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', close)
    }
  }, [menuOpen])

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Barnängshuset, home">
          <Image src="/assets/barnangshuset_logo-neg.svg" alt="" width={600} height={391} priority />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <a className="header-action" href="#viewing">Arrange a viewing</a>
        <button
          className="menu-button"
          type="button"
          aria-controls="site-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </header>
      <div id="site-menu" className={`menu-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Menu">
          {[...navigation, ['#viewing', 'Arrange a viewing'] as const].map(([href, label]) => (
            <a href={href} key={href} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
      </div>
    </>
  )
}
