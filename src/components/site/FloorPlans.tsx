'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import type { FloorPlanConfiguration, FloorPlanSection, SanityImage } from '@/types/sanity'

function PlanImage({ image, sizes }: { image?: SanityImage; sizes: string }) {
  if (!image?.asset?.url) {
    return (
      <div className="floor-plan-empty">
        <span className="font-display text-2xl leading-tight md:text-3xl">Floor-plan drawing</span>
        <small className="text-xs font-semibold uppercase tracking-wider">To be added in Sanity</small>
      </div>
    )
  }

  return (
    <Image
      src={image.asset.url}
      alt={image.alt || ''}
      fill
      sizes={sizes}
      className="floor-plan-image"
    />
  )
}

function ConfigurationFacts({ configuration }: { configuration: FloorPlanConfiguration }) {
  if (!configuration.facts?.length) return null

  return (
    <dl className="floor-plan-facts">
      {configuration.facts.map((fact) => (
        <div key={fact._key || fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function FloorPlans({ content }: { content: FloorPlanSection }) {
  const floors = content.floors?.filter((floor) => floor.configurations?.length) || []
  const [floorIndex, setFloorIndex] = useState(0)
  const [configurationIndex, setConfigurationIndex] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const id = useId()

  const floor = floors[Math.min(floorIndex, Math.max(floors.length - 1, 0))]
  const configuration = floor?.configurations[Math.min(configurationIndex, Math.max(floor?.configurations.length - 1, 0))]

  useEffect(() => {
    if (!drawerOpen) return
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'

    const drawer = drawerRef.current
    const focusable = drawer?.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])') || []
    focusable[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false)
        return
      }
      if (event.key !== 'Tab' || !focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      ;(previousFocus || triggerRef.current)?.focus()
    }
  }, [drawerOpen])

  if (!floor || !configuration) return null

  const selectFloor = (index: number) => {
    setFloorIndex(index)
    setConfigurationIndex(0)
  }

  const stepConfiguration = (direction: -1 | 1) => {
    const count = floor.configurations.length
    setConfigurationIndex((current) => (current + direction + count) % count)
  }

  return (
    <section className="floor-plans grid-section" id="floor-plans" aria-label="Floor plans">
      <div className="floor-plan-browser">
        <div className="floor-tabs" role="group" aria-label="Select floor">
          {floors.map((item, index) => (
            <button
              type="button"
              aria-pressed={floorIndex === index}
              className={floorIndex === index ? 'is-active' : ''}
              onClick={() => selectFloor(index)}
              key={item._key || item.label}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="floor-plan-panel" id={`${id}-panel`}>
          <div className="floor-plan-identity" aria-live="polite">
            <p className="text-xs uppercase tracking-wider">{String(floorIndex + 1).padStart(2, '0')} / {String(floors.length).padStart(2, '0')}</p>
            <h3 className="mt-6 max-w-full font-display text-5xl leading-none tracking-tight md:text-6xl">{floor.label}</h3>
          </div>

          <div className="floor-plan-preview" aria-label={`${floor.label}, ${configuration.title}`}>
            <PlanImage image={configuration.planImage} sizes="(max-width: 760px) 100vw, 58vw" />
          </div>

          <div className="floor-plan-summary">
            <p className="floor-plan-count text-xs uppercase tracking-wider">Current planning study</p>
            <h4 className="mt-4 font-display text-2xl leading-tight tracking-tight">{configuration.title}</h4>
            {configuration.body && <p>{configuration.body}</p>}
            <ConfigurationFacts configuration={configuration} />
          </div>

          <div className="floor-plan-actions">
            <div className="configuration-tabs" role="group" aria-label={`${floor.label} configurations`}>
              {floor.configurations.map((item, index) => (
                <button
                  type="button"
                  aria-pressed={configurationIndex === index}
                  className={configurationIndex === index ? 'is-active' : ''}
                  onClick={() => setConfigurationIndex(index)}
                  key={item._key || item.title}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.title}
                </button>
              ))}
            </div>
            <button ref={triggerRef} className="floor-plan-open" type="button" onClick={() => setDrawerOpen(true)}>
              Open detailed drawings <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </div>

      {drawerOpen && (
        <div className="floor-plan-layer" onMouseDown={(event) => event.target === event.currentTarget && setDrawerOpen(false)}>
          <aside
            className="floor-plan-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-drawer-title`}
          >
            <div className="floor-plan-drawer-header">
              <div>
                <p>{floor.label}</p>
                <h2 id={`${id}-drawer-title`}>{configuration.title}</h2>
              </div>
              <button type="button" className="floor-plan-close" onClick={() => setDrawerOpen(false)} aria-label="Close detailed plans">Close</button>
            </div>

            <div className="floor-plan-drawer-body">
              <figure className="floor-plan-drawing floor-plan-drawing-main">
                <PlanImage image={configuration.planImage} sizes="(max-width: 760px) 100vw, 72vw" />
                <figcaption>Bird’s-eye floor plan</figcaption>
              </figure>
              <figure className="floor-plan-drawing floor-plan-drawing-exploded">
                <PlanImage image={configuration.explodedImage} sizes="(max-width: 760px) 100vw, 30vw" />
                <figcaption>Exploded building view</figcaption>
              </figure>
            </div>

            {floor.configurations.length > 1 && (
              <div className="floor-plan-drawer-nav" aria-label="Browse configurations">
                <button type="button" onClick={() => stepConfiguration(-1)}>← Previous</button>
                <span>{configurationIndex + 1} / {floor.configurations.length}</span>
                <button type="button" onClick={() => stepConfiguration(1)}>Next →</button>
              </div>
            )}
          </aside>
        </div>
      )}
    </section>
  )
}
