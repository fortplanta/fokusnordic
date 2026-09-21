'use client'

import Image from 'next/image'
import { stegaClean } from '@sanity/client/stega'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
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

function ConfigurationTables({ configuration }: { configuration: FloorPlanConfiguration }) {
  if (!configuration.detailTables?.length) return <ConfigurationFacts configuration={configuration} />
  return <div className="floor-plan-tables">{configuration.detailTables.map((table) => <table key={table._key || table.title}>
    <caption>{table.title}</caption>
    {(table.labelHeading || table.valueHeading) && <thead><tr><th>{table.labelHeading}</th><th>{table.valueHeading}</th></tr></thead>}
    <tbody>{table.rows?.map((row) => <tr key={row._key || row.label}><td>{row.accent && <span className="floor-plan-table-key" aria-hidden="true" />}{row.label}</td><td>{row.value}</td></tr>)}</tbody>
    {table.footer && <tfoot><tr><td colSpan={2}>{table.footer}</td></tr></tfoot>}
  </table>)}</div>
}

// Main level and mezzanine are separate, independently rentable configurations
// that happen to share a floor — grouped here only so the UI can offer a level
// tab, never merged into a single listing's data.
type SuiteGroup = { key: string; floorLabel: string; levels: FloorPlanConfiguration[] }

export default function FloorPlans({ content }: { content: FloorPlanSection }) {
  const groups = useMemo<SuiteGroup[]>(() => {
    const result: SuiteGroup[] = []
    for (const floor of content.floors || []) {
      for (const configuration of floor.configurations || []) {
        const isMezzanine = (configuration.levelLabel || '').toLowerCase() === 'mezzanine'
        const previous = result[result.length - 1]
        if (isMezzanine && previous?.floorLabel === floor.label) {
          previous.levels.push(configuration)
        } else {
          result.push({ key: configuration._key || configuration.title, floorLabel: floor.label, levels: [configuration] })
        }
      }
    }
    return result
  }, [content.floors])

  const [suiteIndex, setSuiteIndex] = useState(0)
  const [levelIndex, setLevelIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const sectionIsActive = useRef(false)
  const id = useId()
  const selectedGroupIndex = Math.min(suiteIndex, Math.max(groups.length - 1, 0))
  const group = groups[selectedGroupIndex]
  const selectedLevelIndex = Math.min(levelIndex, Math.max((group?.levels.length || 1) - 1, 0))

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => { sectionIsActive.current = entry?.isIntersecting ?? false }, { threshold: 0.35 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const changeSuiteWithKeyboard = (event: KeyboardEvent) => {
      if (!sectionIsActive.current || groups.length < 2 || event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"], [role="tablist"]')) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      setSuiteIndex((current) => event.key === 'ArrowRight' ? (current + 1) % groups.length : (current - 1 + groups.length) % groups.length)
      setLevelIndex(0)
    }
    window.addEventListener('keydown', changeSuiteWithKeyboard)
    return () => window.removeEventListener('keydown', changeSuiteWithKeyboard)
  }, [groups.length])

  if (!group) return null
  const configuration = group.levels[selectedLevelIndex]
  const hasLevels = group.levels.length > 1
  const suiteTitle = configuration.name || configuration.title
  const description = configuration.body || content.body
  const ctaUrl = stegaClean(content.ctaUrl) || '#viewing'

  const selectSuite = (index: number) => { setSuiteIndex(index); setLevelIndex(0) }
  const finishSwipe = (clientX: number) => {
    if (touchStartX.current === null || groups.length < 2) return
    const distance = clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(distance) < 48) return
    selectSuite(distance < 0 ? (selectedGroupIndex + 1) % groups.length : (selectedGroupIndex - 1 + groups.length) % groups.length)
  }

  return (
    <section className="floor-plans" id="floor-plans" aria-label="Floor-plan configurator" ref={sectionRef}>
      <div className="floor-plan-configurator">
        <header className="floor-plan-suite-header">
          <h2 className="section-display">{suiteTitle}</h2>
          {hasLevels && (
            <>
              <p className="floor-plan-level-label">Available areas:</p>
              <div className="floor-plan-level-tabs" role="tablist" aria-label="Choose level" onKeyDown={(event) => {
                if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
                event.preventDefault()
                const lastIndex = group.levels.length - 1
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? lastIndex : selectedLevelIndex === 0 ? lastIndex : 0
                setLevelIndex(next)
                document.getElementById(`${id}-level-tab-${next}`)?.focus()
              }}>
                {group.levels.map((entry, index) => (
                  <button key={entry._key || index} id={`${id}-level-tab-${index}`} type="button" role="tab" aria-selected={index === selectedLevelIndex} aria-controls={`${id}-plan`} onClick={() => setLevelIndex(index)}>
                    {entry.levelLabel || (index === 0 ? 'Main level' : 'Mezzanine')}
                  </button>
                ))}
              </div>
            </>
          )}
          {description && <p className="floor-plan-description">{description}</p>}
          <a className="floor-plan-enquire" href={ctaUrl}><span>{content.ctaLabel || 'Discuss this suite'}</span><ArrowIcon /></a>
        </header>

        <div className="floor-plan-suite-information">
          <ConfigurationTables configuration={configuration} />
        </div>

        <nav className="floor-plan-suite-picker" aria-label="Choose suite">
          {groups.map((option, index) => {
            const label = option.levels[0].name || option.levels[0].title
            return <button key={option.key} type="button" className={index === selectedGroupIndex ? 'is-active' : undefined} aria-current={index === selectedGroupIndex ? 'true' : undefined} aria-label={`Show ${label}`} onClick={() => selectSuite(index)}>{String(index + 1).padStart(2, '0')}</button>
          })}
        </nav>

        <figure className="floor-plan-axo-view">
          <div className="floor-plan-axo-canvas"><PlanImage image={configuration.explodedImage} sizes="(max-width: 760px) 32vw, 15vw" alt={`${suiteTitle} axonometric context`} emptyLabel="AXO" /></div>
        </figure>

        <figure className="floor-plan-drawing" id={`${id}-plan`} role={hasLevels ? 'tabpanel' : undefined} aria-labelledby={hasLevels ? `${id}-level-tab-${selectedLevelIndex}` : undefined} onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null }} onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}>
          <div className="floor-plan-canvas"><PlanImage image={configuration.planImage} sizes="(max-width: 760px) 100vw, 62vw" alt={`${suiteTitle} floor plan`} emptyLabel="Floor plan" /></div>
          {configuration.planImage?.asset?.url && <a className="floor-plan-open" href={configuration.planImage.asset.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${suiteTitle} floor plan at full size in a new tab`}>View full-size plan ↗</a>}
        </figure>
      </div>
    </section>
  )
}
