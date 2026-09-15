'use client'

import Image from 'next/image'
import { stegaClean } from '@sanity/client/stega'
import { useEffect, useId, useRef, useState } from 'react'
import type { FloorPlanConfiguration, FloorPlanSection, SanityImage } from '@/types/sanity'

function CloseIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg>
}

function ArrowIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M6 3h7v7" /></svg>
}

function SliderArrowIcon({ direction }: { direction: 'previous' | 'next' }) {
  return <svg className={direction === 'previous' ? 'is-previous' : ''} viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
}

function PlanImage({ image, sizes, alt, emptyLabel = 'Floor-plan drawing' }: { image?: SanityImage; sizes: string; alt?: string; emptyLabel?: string }) {
  if (!image?.asset?.url) {
    return <div className="floor-plan-empty"><span className="font-display text-2xl leading-tight md:text-3xl">{emptyLabel}</span><small className="text-xs font-semibold">To be added in Sanity</small></div>
  }
  return <Image src={image.asset.url} alt={alt || image.alt || ''} fill sizes={sizes} className="floor-plan-image" unoptimized={image.asset.url.toLowerCase().endsWith('.svg')} />
}

function LevelPlan({ label, title, planImage, axoImage }: { label: string; title: string; planImage?: SanityImage; axoImage?: SanityImage }) {
  const [showAxo, setShowAxo] = useState(false)
  const displayedImage = showAxo ? axoImage : planImage
  const previewImage = showAxo ? planImage : axoImage
  const displayedType = showAxo ? 'axonometric view' : 'floor plan'
  const previewType = showAxo ? 'floor plan' : 'AXO'

  useEffect(() => setShowAxo(false), [title, label])

  return (
    <figure className="floor-plan-level">
      <div className="floor-plan-level-image">
        <PlanImage image={displayedImage} sizes="(max-width: 760px) 100vw, 35vw" alt={`${title} ${label.toLowerCase()} ${displayedType}`} emptyLabel={`${label} ${displayedType}`} />
        {previewImage?.asset?.url && (
          <button className="floor-plan-view-toggle" type="button" aria-pressed={showAxo} aria-label={`View ${previewType} for ${title}, ${label}`} onClick={() => setShowAxo((current) => !current)}>
            <span className="floor-plan-view-thumbnail" aria-hidden="true"><PlanImage image={previewImage} sizes="(max-width: 760px) 28vw, 9vw" alt="" /></span>
            <span>View {previewType}</span>
          </button>
        )}
      </div>
      <figcaption><span>{label}</span><span>{showAxo ? 'Axonometric view' : 'Floor plan'}</span></figcaption>
    </figure>
  )
}

function ConfigurationFacts({ configuration }: { configuration: FloorPlanConfiguration }) {
  if (!configuration.facts?.length) return null
  return <dl className="floor-plan-facts">{configuration.facts.map((fact) => <div key={fact._key || fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
}

export default function FloorPlans({ content }: { content: FloorPlanSection }) {
  const suites = (content.floors || []).flatMap((floor) => (floor.configurations || []).map((configuration) => ({ floor, configuration })))
  const [suiteIndex, setSuiteIndex] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const id = useId()
  const selectedIndex = Math.min(suiteIndex, Math.max(suites.length - 1, 0))
  const selected = suites[selectedIndex]

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setDetailsOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  if (!selected) return null
  const { floor, configuration } = selected
  const selectSuite = (index: number) => { setSuiteIndex(index); setDetailsOpen(false) }
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

  return (
    <section className="floor-plans" id="floor-plans" aria-label="Floor-plan selector">
      <div className="floor-plan-configurator">
        <button className={`floor-plan-backdrop${detailsOpen ? ' is-open' : ''}`} type="button" aria-label="Dismiss suite details" tabIndex={detailsOpen ? 0 : -1} onClick={() => setDetailsOpen(false)} />
        <aside className={`floor-plan-details${detailsOpen ? ' is-open' : ''}`} id={`${id}-details`} aria-label={`${suiteTitle} details`}>
          <header className="floor-plan-details-header">
            <p>Suite details</p>
            <button className="floor-plan-details-close" type="button" aria-label="Close suite details" onClick={() => setDetailsOpen(false)}><CloseIcon /></button>
          </header>
          <div className="floor-plan-details-copy" aria-live="polite">
            {configuration.name && configuration.title !== configuration.name && <p className="floor-plan-option-name">{configuration.title}</p>}
            {configuration.body && <p className="floor-plan-description">{configuration.body}</p>}
            <ConfigurationFacts configuration={configuration} />
            <a className="floor-plan-enquire" href={ctaUrl}><span>{content.ctaLabel || 'Discuss this suite'}</span><ArrowIcon /></a>
          </div>
        </aside>
        <div className="floor-plan-stage" onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null }} onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}>
          <div className="floor-plan-suite-header"><p>{floor.label}</p><h3>{suiteTitle}</h3></div>
          <button className="floor-plan-details-open" type="button" aria-controls={`${id}-details`} aria-expanded={detailsOpen} onClick={() => setDetailsOpen(true)}><span>{content.detailsLabel || 'Suite details'}</span><ArrowIcon /></button>
          <div className="floor-plan-preview-pair" id={`${id}-suite-panel`} role="group" aria-label={`${floor.label}, ${suiteTitle}, main level and mezzanine`}>
            <LevelPlan key={`${selectedIndex}-main`} label={configuration.mainLevelLabel || 'Main level'} title={suiteTitle} planImage={configuration.planImage} axoImage={configuration.explodedImage} />
            <LevelPlan key={`${selectedIndex}-mezzanine`} label={configuration.mezzanineLevelLabel || 'Mezzanine'} title={suiteTitle} planImage={configuration.mezzaninePlanImage} axoImage={configuration.mezzanineExplodedImage} />
          </div>
          <nav className="floor-plan-suite-navigation" aria-label="Select suite">
            <button type="button" className="floor-plan-suite-arrow" onClick={previousSuite} aria-label="Previous suite"><SliderArrowIcon direction="previous" /></button>
            <div className="floor-plan-suite-status" aria-live="polite">
              <span>{String(selectedIndex + 1).padStart(2, '0')} / {String(suites.length).padStart(2, '0')}</span>
              <div className="floor-plan-suite-dots" aria-label="Suites">
                {suites.map((item, index) => <button type="button" aria-current={selectedIndex === index ? 'true' : undefined} aria-controls={`${id}-suite-panel`} aria-label={item.configuration.name || item.configuration.title || `Suite ${index + 1}`} className={selectedIndex === index ? 'is-active' : ''} onClick={() => selectSuite(index)} key={`${item.floor._key || item.floor.label}-${item.configuration._key || item.configuration.title}`} />)}
              </div>
            </div>
            <button type="button" className="floor-plan-suite-arrow" onClick={nextSuite} aria-label="Next suite"><SliderArrowIcon direction="next" /></button>
          </nav>
        </div>
      </div>
    </section>
  )
}
