'use client'

/**
 * Orchestrates all scroll-triggered animations for the home page.
 * Renders nothing — pure side-effect component.
 *
 * Animation budget:
 *   • Long, unhurried durations (0.9–1.5 s)
 *   • ease-soft / ease-mask cubic-beziers from tokens
 *   • Everything gated on !prefers-reduced-motion
 *
 * Approach: section components add data attributes / classes; this component
 * finds them and wires up the GSAP timelines after hydration.
 */
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Mirror the token easings in JS
const EASE_SOFT = 'cubic-bezier(0.22, 1, 0.36, 1)'
const EASE_MASK = 'cubic-bezier(0.16, 1, 0.30, 1)'

export default function PageAnimations() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {

      // ── Hero entrance timeline ───────────────────────────────────────────
      const heroRule   = document.querySelector<HTMLElement>('.hero__rule')
      const heroTag    = document.querySelector<HTMLElement>('.hero__tag')
      const heroAbout  = document.querySelector<HTMLElement>('.hero__about')
      const heroLink   = document.querySelector<HTMLElement>('.hero__link')
      const heroRows   = document.querySelectorAll<HTMLElement>('.hero__h1 .row')

      if (heroRule) {
        const tl = gsap.timeline({ delay: 0.2 })

        // Hairline rule draws left → right
        tl.fromTo(heroRule,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: EASE_SOFT, transformOrigin: 'left' }
        )

        // Tag fades + slides up
        if (heroTag) tl.fromTo(heroTag,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.9, ease: EASE_SOFT },
          '-=0.7'
        )

        // About paragraph
        if (heroAbout) tl.fromTo(heroAbout,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 1.0, ease: EASE_SOFT },
          '-=0.65'
        )

        // CTA link
        if (heroLink) tl.fromTo(heroLink,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: EASE_SOFT },
          '-=0.55'
        )

        // H1 rows — mask up from 110%
        heroRows.forEach((row, i) => {
          tl.fromTo(row,
            { y: '110%', clipPath: 'inset(0 0 100% 0)' },
            { y: '0%', clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: EASE_MASK },
            i === 0 ? '-=0.5' : '-=0.9'
          )
        })
      }

      // ── Section heading reveals ──────────────────────────────────────────
      // Targets every h2 outside the hero, excluding the bridge (handled below)
      document.querySelectorAll<HTMLElement>('section:not(.hero):not(.bridge) h2').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40, clipPath: 'inset(0 0 30% 0)' },
          {
            opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
            duration: 1.2, ease: EASE_MASK,
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      // ── Bridge — slow single reveal ──────────────────────────────────────
      // The pivot beat from emotion to data; one unhurried unfold, no stagger.
      const bridgeHeadline = document.querySelector<HTMLElement>('.bridge__headline')
      const bridgeSupport  = document.querySelector<HTMLElement>('.bridge__support')

      if (bridgeHeadline) {
        gsap.fromTo(bridgeHeadline,
          { opacity: 0, y: 28, clipPath: 'inset(0 0 22% 0)' },
          {
            opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
            duration: 1.6, ease: EASE_MASK,
            scrollTrigger: {
              trigger: bridgeHeadline,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (bridgeSupport) {
        gsap.fromTo(bridgeSupport,
          { opacity: 0, y: 16 },
          {
            opacity: 1, y: 0,
            duration: 1.2, ease: EASE_SOFT,
            delay: 0.22,
            scrollTrigger: {
              trigger: bridgeSupport,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // ── [data-fade] elements ─────────────────────────────────────────────
      document.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) => {
        const delay = parseFloat(el.dataset.delay ?? '0')
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            duration: 1.0, ease: EASE_SOFT, delay,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      // ── .reveal-img — clip-path wipe ─────────────────────────────────────
      document.querySelectorAll<HTMLElement>('.reveal-img').forEach((el) => {
        gsap.fromTo(el,
          { clipPath: 'inset(0 0 100% 0)' },
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.3, ease: EASE_MASK,
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      // ── Intro image parallax ─────────────────────────────────────────────
      // Image is height:130%, top:-15% — safe travel budget is ±10% of
      // image height (= ±13% of container), well within the 15% buffer.
      const introImg = document.querySelector<HTMLElement>('.intro__media img')
      if (introImg) {
        gsap.to(introImg, {
          y: '-10%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.intro__media',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      }

      // ── Journal card images parallax ─────────────────────────────────────
      document.querySelectorAll<HTMLElement>('.jcard__img img').forEach((img) => {
        gsap.fromTo(img,
          { y: '6%' },
          {
            y: '-6%',
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.jcard__img') as Element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        )
      })

      // ── Key figures — staggered count-in ────────────────────────────────
      const figItems = document.querySelectorAll<HTMLElement>('.figures__item')
      if (figItems.length) {
        gsap.fromTo(figItems,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 1.0, ease: EASE_SOFT,
            stagger: 0.1,
            scrollTrigger: {
              trigger: '.figures',
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // ── Testimonial image ────────────────────────────────────────────────
      const testiImg = document.querySelector<HTMLElement>('.testi__img')
      if (testiImg) {
        gsap.fromTo(testiImg,
          { clipPath: 'inset(0 0 100% 0)' },
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.4, ease: EASE_MASK,
            scrollTrigger: {
              trigger: testiImg,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // ── Floor cards stagger ──────────────────────────────────────────────
      const floorCards = document.querySelectorAll<HTMLElement>('.floor-card')
      if (floorCards.length) {
        gsap.fromTo(floorCards,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0,
            duration: 1.0, ease: EASE_SOFT,
            stagger: 0.15,
            scrollTrigger: {
              trigger: '.floors__list',
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // ── Neighbourhood spots stagger ──────────────────────────────────────
      const spots = document.querySelectorAll<HTMLElement>('.spot')
      if (spots.length) {
        gsap.fromTo(spots,
          { opacity: 0, x: -16 },
          {
            opacity: 1, x: 0,
            duration: 0.7, ease: EASE_SOFT,
            stagger: 0.06,
            scrollTrigger: {
              trigger: '.hood__list',
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // ── Journal cards stagger ────────────────────────────────────────────
      const jcards = document.querySelectorAll<HTMLElement>('.jcard')
      if (jcards.length) {
        gsap.fromTo(jcards,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0,
            duration: 1.0, ease: EASE_SOFT,
            stagger: 0.12,
            scrollTrigger: {
              trigger: '.journal__grid',
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // ── Rational case — ledger rows stagger ─────────────────────────
      const rcaseFacts = document.querySelectorAll<HTMLElement>('.rcase__fact')
      if (rcaseFacts.length) {
        gsap.fromTo(rcaseFacts,
          { opacity: 0, y: 18 },
          {
            opacity: 1, y: 0,
            duration: 0.9, ease: EASE_SOFT,
            stagger: 0.08,
            scrollTrigger: {
              trigger: '.rcase__facts',
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // ── Footer invite heading ────────────────────────────────────────────
      const footerInvite = document.querySelector<HTMLElement>('.footer__invite')
      if (footerInvite) {
        gsap.fromTo(footerInvite,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 1.3, ease: EASE_MASK,
            scrollTrigger: {
              trigger: footerInvite,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return null
}
