'use client'

import { useEffect } from 'react'

const targets = '[data-motion-copy], .motion-media, .qualities, .opportunity-facts, .nearby-list'

export default function SiteMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const site = document.querySelector<HTMLElement>('.bh-site')
    if (!site) return

    site.classList.add('motion-enabled')
    site.querySelectorAll<HTMLElement>('[data-motion-hero]').forEach((element, index) => {
      element.style.setProperty('--motion-order', String(index))
      element.classList.add('motion-visible')
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('motion-visible')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 })

    site.querySelectorAll<HTMLElement>(targets).forEach((element) => {
      element.classList.add('motion-pending')
      observer.observe(element)
    })

    return () => {
      observer.disconnect()
      site.classList.remove('motion-enabled')
    }
  }, [])

  return null
}
