'use client'

import Image from 'next/image'
import { stegaClean } from '@sanity/client/stega'
import { useEffect, useId, useRef, useState } from 'react'
import type { FloorPlanConfiguration, FloorPlanSection, SanityImage } from '@/types/sanity'

function ChevronIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
}

function CloseIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg>
}

function ArrowIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M6 3h7v7" /></svg>
}

function PlanImage({ image, sizes, emptyLabel = 'Floor-plan drawing' }: { image?: SanityImage; sizes: string; emptyLabel?: string }) {
  if (!image?.asset?.url) {
    return (
      <div className="floor-plan-empty">
        <span className="font-display text-2xl leading-tight md:text-3xl">{emptyLabel}</span>
        <small className="text-xs font-semibold">To be added in Sanity</small>
      </div>
    )
  }
  return <Image src={image.asset.url} alt={image.alt || ''} fill sizes={sizes} className="floor-plan-image" />
}

function ConfigurationFacts({ configuration }: { configuration: FloorPlanConfiguration }) {
  if (!configuration.facts?.length) return null
  return (
    <dl className="floor-plan-facts">
      {configuration.facts.map((fact) => (
        <div key={fact._key || fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
      ))}
    </dl>
  )
}

export default function FloorPlans({ content }: { content: FloorPlanSection }) {
  const floors = content.floors?.filter((item) => item.configurations?.length) || []
  const [floorIndex, setFloorIndex] = useState(0)
  const [configurationIndex, setConfigurationIndex] = useState(0)
  const [floorMenuOpen, setFloorMenuOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasSelectedConfiguration, setHasSelectedConfiguration] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const id = useId()
  const floor = floors[Math.min(floorIndex, Math.max(floors.length - 1, 0))]
  const configuration = floor?.configurations[Math.min(configurationIndex, Math.max(floor?.configurations.length - 1, 0))]

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setFloorMenuOpen(false)
      setDetailsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.25 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView || hasSelectedConfiguration || !floor || floor.configurations.length < 2) return

    const interval = window.setInterval(() => {
      setConfigurationIndex((current) => (current + 1) % floor.configurations.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [floor, hasSelectedConfiguration, isInView])

  if (!floor || !configuration) return null

  const selectFloor = (index: number) => {
    setFloorIndex(index)
    setConfigurationIndex(0)
    setFloorMenuOpen(false)
  }

  const ctaUrl = stegaClean(content.ctaUrl) || '#viewing'

  return (
    <section className="floor-plans" id="floor-plans" aria-label="Floor-plan configurator" ref={sectionRef}>
      <div className="floor-plan-configurator">
        <button className={`floor-plan-backdrop${detailsOpen ? ' is-open' : ''}`} type="button" aria-label="Dismiss floor-plan details" tabIndex={detailsOpen ? 0 : -1} onClick={() => setDetailsOpen(false)} />

        <aside className={`floor-plan-details${detailsOpen ? ' is-open' : ''}`} id={`${id}-details`} aria-label="Selected floor-plan details">
          <button className="floor-plan-details-close" type="button" aria-label="Close floor-plan details" onClick={() => setDetailsOpen(false)}><CloseIcon /></button>
          <div className="floor-plan-exploded-preview" aria-label={`${floor.label}, ${configuration.title} exploded view`}>
            <PlanImage image={configuration.explodedImage} sizes="(max-width: 760px) 64vw, 20vw" emptyLabel="Exploded view" />
          </div>
          <div className="floor-plan-details-copy" aria-live="polite">
            <p className="floor-plan-eyebrow">{floor.label}</p>
            <h3>{configuration.title}</h3>
            {configuration.name && <p className="floor-plan-option-name">{configuration.name}</p>}
            {configuration.body && <p className="floor-plan-description">{configuration.body}</p>}
            <ConfigurationFacts configuration={configuration} />
            <a className="floor-plan-enquire" href={ctaUrl}><span>{content.ctaLabel || 'Discuss this floor'}</span><ArrowIcon /></a>
          </div>
        </aside>

        <div className="floor-plan-stage">
          <button className="floor-plan-details-open" type="button" aria-controls={`${id}-details`} aria-expanded={detailsOpen} onClick={() => setDetailsOpen(true)}><span>{content.detailsLabel || 'View details'}</span><ArrowIcon /></button>

          <div className="floor-plan-configurations">
            <div className="floor-plan-configurations-row">
              <div role="tablist" aria-label={`${floor.label} configurations`}>
                {floor.configurations.map((item, index) => (
                  <button type="button" role="tab" id={`${id}-configuration-${index}`} aria-selected={configurationIndex === index} aria-controls={`${id}-plan`} className={configurationIndex === index ? 'is-active' : ''} onClick={() => { setHasSelectedConfiguration(true); setConfigurationIndex(index) }} key={item._key || item.title}>
                    {String(index + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
            <p aria-live="polite">{configuration.name || configuration.title}</p>
          </div>

          <div className="floor-plan-preview" id={`${id}-plan`} role="tabpanel" aria-labelledby={`${id}-configuration-${configurationIndex}`} aria-label={`${floor.label}, ${configuration.title}`}>
            <PlanImage image={configuration.planImage} sizes="(max-width: 760px) 100vw, 78vw" />
          </div>

          <div className="floor-plan-floor-selector">
            <div className={`floor-plan-floor-menu${floorMenuOpen ? ' is-open' : ''}`} id={`${id}-floors`} role="menu" aria-hidden={!floorMenuOpen}>
              {floors.map((item, index) => (
                <button type="button" role="menuitemradio" aria-checked={floorIndex === index} onClick={() => selectFloor(index)} key={item._key || item.label}>
                  <span>{item.label}</span>{floorIndex === index && <span aria-hidden="true">✓</span>}
                </button>
              ))}
            </div>
            <button className={floorMenuOpen ? 'is-open' : ''} type="button" aria-expanded={floorMenuOpen} aria-controls={`${id}-floors`} onClick={() => setFloorMenuOpen((current) => !current)}><span>{floor.label}</span><ChevronIcon /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
