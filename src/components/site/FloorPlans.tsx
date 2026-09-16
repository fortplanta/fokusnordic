'use client'

import Image from 'next/image'
import { stegaClean } from '@sanity/client/stega'
import { useEffect, useId, useRef, useState } from 'react'
import type { FloorPlanConfiguration, FloorPlanSection, SanityImage } from '@/types/sanity'

function ArrowIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M6 3h7v7" /></svg>
}

function PlanImage({ image, sizes, alt, emptyLabel = 'Floor-plan drawing' }: { image?: SanityImage; sizes: string; alt?: string; emptyLabel?: string }) {
  if (!image?.asset?.url) {
    return <div className="floor-plan-empty"><span className="font-display text-2xl leading-tight md:text-3xl">{emptyLabel}</span><small className="text-xs font-semibold">To be added in Sanity</small></div>
  }
  return <Image src={image.asset.url} alt={alt || image.alt || ''} fill sizes={sizes} className="floor-plan-image" unoptimized={image.asset.url.toLowerCase().endsWith('.svg')} />
}

function ConfigurationFacts({ configuration }: { configuration: FloorPlanConfiguration }) {
  if (!configuration.facts?.length) return null
  return <dl className="floor-plan-facts">{configuration.facts.map((fact) => <div key={fact._key || fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
}

export default function FloorPlans({ content }: { content: FloorPlanSection }) {
  const suites = (content.floors || []).flatMap((floor) => (floor.configurations || []).map((configuration) => ({ floor, configuration })))
  const [suiteIndex, setSuiteIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const sectionIsActive = useRef(false)
  const id = useId()
  const selectedIndex = Math.min(suiteIndex, Math.max(suites.length - 1, 0))
  const selected = suites[selectedIndex]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => { sectionIsActive.current = entry?.isIntersecting ?? false }, { threshold: 0.35 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const changeSuiteWithKeyboard = (event: KeyboardEvent) => {
      if (!sectionIsActive.current || suites.length < 2 || event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      setSuiteIndex((current) => event.key === 'ArrowRight' ? (current + 1) % suites.length : (current - 1 + suites.length) % suites.length)
    }
    window.addEventListener('keydown', changeSuiteWithKeyboard)
    return () => window.removeEventListener('keydown', changeSuiteWithKeyboard)
  }, [suites.length])

  if (!selected) return null
  const { floor, configuration } = selected
  const selectSuite = (index: number) => { setSuiteIndex(index) }
  const previousSuite = () => selectSuite((selectedIndex - 1 + suites.length) % suites.length)
  const nextSuite = () => selectSuite((selectedIndex + 1) % suites.length)
  const finishSwipe = (clientX: number) => {
    if (touchStartX.current === null) return
    const distance = clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(distance) < 48) return
    if (distance < 0) nextSuite(); else previousSuite()
  }
  const ctaUrl = stegaClean(content.ctaUrl) || '#viewing'
  const suiteTitle = configuration.name || configuration.title
  const mainLevelLabel = configuration.mainLevelLabel || 'Main level'
  const mezzanineLevelLabel = configuration.mezzanineLevelLabel || 'Mezzanine'

  return (
    <section className="floor-plans" id="floor-plans" aria-label="Floor-plan selector" ref={sectionRef}>
      <div className="floor-plan-configurator">
        <div className="floor-plan-stage" onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null }} onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}>
          <header className="floor-plan-suite-header">
            <div className="floor-plan-suite-title"><h2>{floor.label}</h2><p>{suiteTitle}</p></div>
            <div className="floor-plan-desktop-summary">
              {configuration.body && <p>{configuration.body}</p>}
              <ConfigurationFacts configuration={configuration} />
            </div>
          </header>
          <div className="floor-plan-controls">
            <a className="floor-plan-desktop-cta" href={ctaUrl}><span>{content.ctaLabel || 'Discuss this suite'}</span><ArrowIcon /></a>
          </div>
          <div className="floor-plan-architectural-plate" id={`${id}-suite-panel`} role="group" aria-label={`${floor.label}, ${suiteTitle} floor plans`}>
            <figure className="floor-plan-level-view">
              <figcaption><span>{mainLevelLabel}</span><span>Floor plan</span></figcaption>
              <div className="floor-plan-canvas">
                <PlanImage image={configuration.planImage} sizes="(max-width: 760px) 100vw, 48vw" alt={`${suiteTitle} ${mainLevelLabel.toLowerCase()} floor plan`} emptyLabel={`${mainLevelLabel} floor plan`} />
              </div>
              {configuration.explodedImage?.asset?.url && <aside className="floor-plan-axo-context" aria-label={`${mainLevelLabel} spatial context`}><PlanImage image={configuration.explodedImage} sizes="(max-width: 760px) 72vw, 20vw" alt={`${suiteTitle} ${mainLevelLabel.toLowerCase()} axonometric context`} /></aside>}
            </figure>
            <figure className="floor-plan-level-view">
              <figcaption><span>{mezzanineLevelLabel}</span><span>Floor plan</span></figcaption>
              <div className="floor-plan-canvas">
                <PlanImage image={configuration.mezzaninePlanImage} sizes="(max-width: 760px) 100vw, 48vw" alt={`${suiteTitle} ${mezzanineLevelLabel.toLowerCase()} floor plan`} emptyLabel={`${mezzanineLevelLabel} floor plan`} />
              </div>
              {configuration.mezzanineExplodedImage?.asset?.url && <aside className="floor-plan-axo-context" aria-label={`${mezzanineLevelLabel} spatial context`}><PlanImage image={configuration.mezzanineExplodedImage} sizes="(max-width: 760px) 72vw, 20vw" alt={`${suiteTitle} ${mezzanineLevelLabel.toLowerCase()} axonometric context`} /></aside>}
            </figure>
          </div>
          <div className="floor-plan-mobile-details">
            {configuration.body && <p>{configuration.body}</p>}
            <ConfigurationFacts configuration={configuration} />
            <a className="floor-plan-enquire" href={ctaUrl}><span>{content.ctaLabel || 'Discuss this suite'}</span><ArrowIcon /></a>
          </div>
          <nav className="floor-plan-suite-navigation" aria-label="Select suite">
            <div className="floor-plan-suite-status" aria-live="polite">
              <span>{String(selectedIndex + 1).padStart(2, '0')} / {String(suites.length).padStart(2, '0')}</span>
              <div className="floor-plan-suite-dots" aria-label="Suites">
                {suites.map((item, index) => <button type="button" aria-current={selectedIndex === index ? 'true' : undefined} aria-controls={`${id}-suite-panel`} aria-label={item.configuration.name || item.configuration.title || `Suite ${index + 1}`} className={selectedIndex === index ? 'is-active' : ''} onClick={() => selectSuite(index)} key={`${item.floor._key || item.floor.label}-${item.configuration._key || item.configuration.title}`} />)}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </section>
  )
}
