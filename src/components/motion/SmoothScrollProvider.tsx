'use client'

/**
 * Lenis smooth scroll wired to the GSAP rAF ticker.
 * One loop, shared across all animations. Heavier inertia = lowered shoulders.
 *
 * Must wrap the page below the HTML/body — renders children transparently.
 */
import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Bail on reduced-motion — native scroll, no Lenis overhead
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration:  1.25,
      easing:    (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Drive Lenis from GSAP's ticker so both share one rAF loop
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    // Keep ScrollTrigger in sync with Lenis virtual scroll position
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => { lenis.raf(time * 1000) })
    }
  }, [])

  return <>{children}</>
}
