'use client'

import { useEffect } from 'react'

const copyTargets = '[data-motion-copy], .volume-statements, .volume-groups, .opportunity-facts, .nearby-list'

function getMotionItems(element: HTMLElement) {
  if (element.classList.contains('opportunity-facts')) {
    return element.querySelectorAll<HTMLElement>('dl > div, :scope > .text-link')
  }

  return Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
}

function waitForImage(image: HTMLImageElement | null) {
  if (!image || (image.complete && image.naturalWidth > 0)) return Promise.resolve()

  return new Promise<void>((resolve) => {
    const finish = () => resolve()
    image.addEventListener('load', finish, { once: true })
    image.addEventListener('error', finish, { once: true })
  })
}

function waitForWindowLoad() {
  if (document.readyState === 'complete') return Promise.resolve()

  return new Promise<void>((resolve) => {
    window.addEventListener('load', () => resolve(), { once: true })
  })
}

export default function SiteMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const site = document.querySelector<HTMLElement>('.bh-site')
    if (!site) return

    let cancelled = false
    site.classList.add('motion-enabled')

    site.querySelectorAll<HTMLElement>('[data-motion-hero]').forEach((element, index) => {
      element.style.setProperty('--motion-order', String(index))
    })

    const fontReady = document.fonts?.ready ?? Promise.resolve()
    const heroImage = site.querySelector<HTMLImageElement>('.hero-media img')
    const readiness = Promise.allSettled([waitForWindowLoad(), fontReady, waitForImage(heroImage)])
    const safetyTimeout = new Promise<void>((resolve) => window.setTimeout(resolve, 2500))

    Promise.race([readiness, safetyTimeout]).then(() => {
      if (cancelled) return
      requestAnimationFrame(() => requestAnimationFrame(() => site.classList.add('hero-ready')))
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('motion-visible')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 })

    site.querySelectorAll<HTMLElement>(copyTargets).forEach((element) => {
      element.classList.add('motion-pending')
      getMotionItems(element).forEach((child, index) => {
        child.style.setProperty('--motion-order', String(index))
      })
      observer.observe(element)
    })

    return () => {
      cancelled = true
      observer.disconnect()
      site.classList.remove('motion-enabled', 'hero-ready')
    }
  }, [])

  return null
}
