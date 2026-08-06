'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

/**
 * A single restrained motion vocabulary for the editorial page.
 * The SSR baseline remains fully visible; GSAP only layers motion on after
 * hydration, and all movement is skipped for reduced-motion visitors.
 */
export default function PageAnimations() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const site = document.querySelector<HTMLElement>('.bh-site')
    if (!site) return

    const context = gsap.context(() => {
      const heroItems = site.querySelectorAll<HTMLElement>('[data-motion-hero]')
      if (heroItems.length) {
        gsap.fromTo(
          heroItems,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, delay: 0.14, ease: EASE_OUT },
        )
      }

      site.querySelectorAll<HTMLElement>('[data-motion-copy]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>(':scope > .kicker, :scope > h2, :scope > p:last-child')
        if (!items.length) return
        gsap.fromTo(
          items,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: EASE_OUT,
            scrollTrigger: { trigger: group, start: 'top 82%', once: true },
          },
        )
      })

      site.querySelectorAll<HTMLElement>('.motion-media').forEach((media) => {
        const image = media.querySelector<HTMLElement>('img')
        gsap.fromTo(
          media,
          { opacity: 0.35 },
          {
            opacity: 1,
            duration: 0.85,
            ease: EASE_OUT,
            scrollTrigger: { trigger: media, start: 'top 86%', once: true },
          },
        )
        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.012 },
            {
              scale: 1,
              duration: 0.85,
              ease: EASE_OUT,
              scrollTrigger: { trigger: media, start: 'top 86%', once: true },
            },
          )
        }
      })

      ;['.qualities', '.opportunity-facts dl', '.nearby-list'].forEach((selector) => {
        const group = site.querySelector<HTMLElement>(selector)
        if (!group) return
        const rows = group.querySelectorAll<HTMLElement>(':scope > div')
        if (!rows.length) return
        gsap.fromTo(
          rows,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            stagger: 0.05,
            ease: EASE_OUT,
            scrollTrigger: { trigger: group, start: 'top 84%', once: true },
          },
        )
      })
    }, site)

    return () => context.revert()
  }, [])

  return null
}
