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

function SliderArrowIcon({ direction }: { direction: 'previous' | 'next' }) {
  return <svg className={direction === 'previous' ? 'is-previous' : ''} viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
}

function PlanImage({ image, sizes, alt, emptyLabel = 'Floor-plan drawing' }: { image?: SanityImage; sizes: string; alt?: string; emptyLabel?: string }) {
  if (!image?.asset?.url) {
    return (
      <div className="floor-plan-empty">
        <span className="font-display text-2xl leading-tight md:text-3xl">{emptyLabel}</span>
        <small className="text-xs font-semibold">To be added in Sanity</small>
      </div>
    )
  }
  return <Image src={image.asset.url} alt={alt || image.alt || ''} fill sizes={sizes} className="floor-plan-image" unoptimized={image.asset.url.toLowerCase().endsWith('.svg')} />
}

function LevelPlan({ label, image, sizes, alt }: { label: string; image?: SanityImage; sizes: string; alt: string }) {
  return (
    <figure className="floor-plan-level">
      <div className="floor-plan-level-image">
        <PlanImage image={image} sizes={sizes} alt={alt} emptyLabel={`${label} floor plan`} />
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  )
}

function AxoSlider({ configuration, id }: { configuration: FloorPlanConfiguration; id: string }) {
  const levels = [
    {
      label: configuration.mainLevelLabel || 'Main level',
      image: configuration.explodedImage,
    },
    {
      label: configuration.mezzanineLevelLabel || 'Mezzanine',
      image: configuration.mezzanineExplodedImage,
    },
  ]
  const [levelIndex, setLevelIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const level = levels[levelIndex]

  const finishSwipe = (clientX: number) => {
    if (touchStartX.current === null) return
    const distance = clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(distance) < 48) return
    setLevelIndex(distance < 0 ? 1 : 0)
  }

  return (
    <div className="floor-plan-axo">
      <div className="floor-plan-axo-tabs" role="tablist" aria-label={`${configuration.title} axonometric level`}>
        {levels.map((item, index) => (
          <button key={item.label} type="button" role="tab" id={`${id}-axo-tab-${index}`} aria-selected={levelIndex === index} aria-controls={`${id}-axo-panel`} className={levelIndex === index ? 'is-active' : ''} onClick={() => setLevelIndex(index)}>
            {item.label}
          </button>
        ))}
      </div>
      <div
        className="floor-plan-axo-viewport"
        id={`${id}-axo-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-axo-tab-${levelIndex}`}
        onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null }}
        onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}
      >
        <div className="floor-plan-axo-image">
          <PlanImage image={level.image} sizes="(max-width: 760px) 74vw, 20vw" alt={`${configuration.title} ${level.label.toLowerCase()} axonometric diagram`} emptyLabel="Axonometric view" />
        </div>
        <button className="floor-plan-axo-arrow is-previous" type="button" aria-label="Show previous level" disabled={levelIndex === 0} onClick={() => setLevelIndex(0)}><SliderArrowIcon direction="previous" /></button>
        <button className="floor-plan-axo-arrow is-next" type="button" aria-label="Show next level" disabled={levelIndex === levels.length - 1} onClick={() => setLevelIndex(1)}><SliderArrowIcon direction="next" /></button>
        <div className="floor-plan-axo-status" aria-live="polite">
          <span>{level.label} · {levelIndex + 1} of {levels.length}</span>
          <span className="floor-plan-axo-dots" aria-hidden="true">
            {levels.map((item, index) => <i className={levelIndex === index ? 'is-active' : ''} key={item.label} />)}
          </span>
        </div>
      </div>
    </div>
  )
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

  if (!floor || !configuration) return null

  const selectFloor = (index: number) => {
    setFloorIndex(index)
    setConfigurationIndex(0)
    setFloorMenuOpen(false)
  }

  const ctaUrl = stegaClean(content.ctaUrl) || '#viewing'

  return (
    <section className="floor-plans" id="floor-plans" aria-label="Floor-plan configurator">
      <div className="floor-plan-configurator">
        <button className={`floor-plan-backdrop${detailsOpen ? ' is-open' : ''}`} type="button" aria-label="Dismiss floor-plan details" tabIndex={detailsOpen ? 0 : -1} onClick={() => setDetailsOpen(false)} />

        <aside className={`floor-plan-details${detailsOpen ? ' is-open' : ''}`} id={`${id}-details`} aria-label="Selected floor-plan details">
          <button className="floor-plan-details-close" type="button" aria-label="Close floor-plan details" onClick={() => setDetailsOpen(false)}><CloseIcon /></button>
          <div className="floor-plan-exploded-preview" aria-label={`${floor.label}, ${configuration.title} axonometric views`}>
            <AxoSlider configuration={configuration} id={`${id}-${floorIndex}-${configurationIndex}`} key={`${floor._key || floor.label}-${configuration._key || configuration.title}`} />
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
                  <button type="button" role="tab" id={`${id}-configuration-${index}`} aria-selected={configurationIndex === index} aria-controls={`${id}-plan`} aria-label={item.title || `Configuration ${String(index + 1).padStart(2, '0')}`} className={configurationIndex === index ? 'is-active' : ''} onClick={() => setConfigurationIndex(index)} key={item._key || item.title}>
                    {String(index + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
            <p aria-live="polite">{configuration.name || configuration.title}</p>
          </div>

          <div className="floor-plan-preview-pair" id={`${id}-plan`} role="tabpanel" aria-labelledby={`${id}-configuration-${configurationIndex}`} aria-label={`${floor.label}, ${configuration.title}, main level and mezzanine`}>
            <LevelPlan label={configuration.mainLevelLabel || 'Main level'} image={configuration.planImage} sizes="(max-width: 760px) 100vw, 39vw" alt={`${configuration.title} main-level floor plan`} />
            <LevelPlan label={configuration.mezzanineLevelLabel || 'Mezzanine'} image={configuration.mezzaninePlanImage} sizes="(max-width: 760px) 100vw, 39vw" alt={`${configuration.title} mezzanine floor plan`} />
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
