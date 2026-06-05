'use client'

import { useState, useEffect } from 'react'

const DISMISSED_KEY = 'barnang_avail_dismissed'

export default function AvailabilityBar({
  available,
  contactEmail,
}: {
  available: number
  contactEmail?: string
}) {
  const [visible, setVisible]   = useState(false)
  const [dismissed, setDismissed] = useState(true) // start hidden, check session

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY)) return
    setDismissed(false)

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) setVisible(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dismiss = () => {
    setDismissed(true)
    sessionStorage.setItem(DISMISSED_KEY, '1')
  }

  if (dismissed || available === 0) return null

  const href = contactEmail
    ? `mailto:${contactEmail}?subject=Viewing request — Barnängshuset`
    : '#viewing'

  return (
    <div
      className={`avail-bar${visible ? ' visible' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Space availability"
    >
      <p className="avail-bar__copy">
        <strong>{available} {available === 1 ? 'floor' : 'floors'} remaining</strong>
        <span className="sep">·</span>
        <span>from 300m²</span>
        <span className="sep">·</span>
        <span>4.9m ceilings</span>
      </p>
      <div className="avail-bar__actions">
        <a href={href} className="avail-bar__cta">
          Arrange a viewing&nbsp;→
        </a>
        <button
          className="avail-bar__dismiss"
          onClick={dismiss}
          aria-label="Dismiss availability notice"
        >
          ×
        </button>
      </div>
    </div>
  )
}
