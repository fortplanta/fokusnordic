'use client'

import Image from 'next/image'
import { useId, useState } from 'react'
import type { FloorPlanConfiguration, FloorPlanSection, SanityImage } from '@/types/sanity'

function PlanImage({ image, sizes, emptyLabel = 'Floor-plan drawing' }: { image?: SanityImage; sizes: string; emptyLabel?: string }) {
  if (!image?.asset?.url) {
    return (
      <div className="floor-plan-empty">
        <span className="font-display text-2xl leading-tight md:text-3xl">{emptyLabel}</span>
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

function ConfigurationSummary({ configuration, active }: { configuration: FloorPlanConfiguration; active: boolean }) {
  return (
    <div className={`floor-plan-summary${active ? ' is-active' : ''}`} aria-hidden={!active}>
      <p className="floor-plan-count text-xs uppercase tracking-wider">Current planning study</p>
      <h4 className="mt-4 font-display text-2xl leading-tight tracking-tight">{configuration.title}</h4>
      {configuration.body && <p>{configuration.body}</p>}
      <ConfigurationFacts configuration={configuration} />
    </div>
  )
}

export default function FloorPlans({ content }: { content: FloorPlanSection }) {
  const floors = content.floors?.filter((floor) => floor.configurations?.length) || []
  const [floorIndex, setFloorIndex] = useState(0)
  const [configurationIndex, setConfigurationIndex] = useState(0)
  const id = useId()
  const maxConfigurationCount = Math.max(...floors.map((item) => item.configurations.length), 1)

  const floor = floors[Math.min(floorIndex, Math.max(floors.length - 1, 0))]
  const configuration = floor?.configurations[Math.min(configurationIndex, Math.max(floor?.configurations.length - 1, 0))]

  if (!floor || !configuration) return null

  const selectFloor = (index: number) => {
    setFloorIndex(index)
    setConfigurationIndex(0)
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
            <div className="floor-plan-exploded-preview" aria-label={`${floor.label}, ${configuration.title} exploded view`}>
              <PlanImage image={configuration.explodedImage} sizes="(max-width: 760px) 48vw, 24vw" emptyLabel="Exploded view" />
            </div>
          </div>

          <div className="floor-plan-preview" aria-label={`${floor.label}, ${configuration.title}`}>
            <PlanImage image={configuration.planImage} sizes="(max-width: 760px) 100vw, 58vw" />
          </div>

          <div className="floor-plan-summary-stack" aria-live="polite">
            {floors.flatMap((floorItem, currentFloorIndex) =>
              floorItem.configurations.map((item, currentConfigurationIndex) => (
                <ConfigurationSummary
                  configuration={item}
                  active={floorIndex === currentFloorIndex && configurationIndex === currentConfigurationIndex}
                  key={item._key || `${floorItem.label}-${item.title}`}
                />
              )),
            )}
          </div>

          <div className="floor-plan-actions">
            <div className="floor-plan-configuration-reserve" aria-hidden="true">
              {Array.from({ length: maxConfigurationCount }, (_, index) => <span key={index} />)}
            </div>
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
          </div>
        </div>
      </div>
    </section>
  )
}
