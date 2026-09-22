'use client'

import Image from 'next/image'
import { stegaClean } from '@sanity/client/stega'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { FloorPlanConfiguration, FloorPlanSection, SanityImage } from '@/types/sanity'

function ArrowIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M6 3h7v7" /></svg>
}

function ChevronIcon({ direction }: { direction: 'previous' | 'next' }) {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d={direction === 'previous' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'} /></svg>
}

function CaretIcon({ direction }: { direction: 'up' | 'down' }) {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d={direction === 'up' ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'} /></svg>
}

// Classic truncated-pagination range: first, last, a window around the
// current page, and an ellipsis for whatever falls outside that window —
// keeps the control's width constant as more suites are added in Sanity.
function paginationRange(current: number, total: number, siblingCount = 1): Array<number | 'ellipsis'> {
  const totalSlots = siblingCount * 2 + 5
  if (total <= totalSlots) return Array.from({ length: total }, (_, index) => index)
  const left = Math.max(current - siblingCount, 1)
  const right = Math.min(current + siblingCount, total - 2)
  const range: Array<number | 'ellipsis'> = [0]
  if (left > 1) range.push('ellipsis')
  for (let index = left; index <= right; index += 1) range.push(index)
  if (right < total - 2) range.push('ellipsis')
  range.push(total - 1)
  return range
}

function PlanImage({ image, sizes, alt, emptyLabel = 'Floor-plan drawing' }: { image?: SanityImage; sizes: string; alt?: string; emptyLabel?: string }) {
  if (!image?.asset?.url) {
    return <div className="floor-plan-empty"><span className="font-display text-2xl leading-tight md:text-3xl">{emptyLabel}</span>{emptyLabel && <small className="text-xs font-semibold">To be added in Sanity</small>}</div>
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
  // Expanded by default: the drawer collapse is a JS convenience for tight
  // mobile screens, not a gate on content — collapsing by default would hide
  // suite details from anyone before hydration finishes, or without JS at all.
  const [infoCollapsed, setInfoCollapsed] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const sectionIsActive = useRef(false)
  const activeThumbRef = useRef<HTMLLIElement | null>(null)
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
      setSuiteIndex((current) => event.key === 'ArrowRight' ? Math.min(current + 1, groups.length - 1) : Math.max(current - 1, 0))
      setLevelIndex(0)
    }
    window.addEventListener('keydown', changeSuiteWithKeyboard)
    return () => window.removeEventListener('keydown', changeSuiteWithKeyboard)
  }, [groups.length])

  useEffect(() => {
    // On narrow viewports the filmstrip scrolls horizontally rather than
    // wrapping or shrinking to illegibility — keep the active thumbnail in view.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    activeThumbRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })
  }, [suiteIndex])

  if (!group) return null
  const configuration = group.levels[selectedLevelIndex]
  const hasLevels = group.levels.length > 1
  const suiteTitle = configuration.name || configuration.title
  const description = configuration.body || content.body
  const ctaUrl = stegaClean(content.ctaUrl) || '#viewing'

  const selectSuite = (index: number) => { setSuiteIndex(index); setLevelIndex(0) }
  const previousSuite = () => selectSuite(Math.max(selectedGroupIndex - 1, 0))
  const nextSuite = () => selectSuite(Math.min(selectedGroupIndex + 1, groups.length - 1))
  const finishSwipe = (clientX: number) => {
    if (touchStartX.current === null || groups.length < 2) return
    const distance = clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(distance) < 48) return
    if (distance < 0) nextSuite(); else previousSuite()
  }
  const pageItems = paginationRange(selectedGroupIndex, groups.length)

  return (
    <section className="floor-plans" id="floor-plans" aria-label="Floor-plan configurator" ref={sectionRef}>
      <div className="floor-plan-configurator">
        <div className="floor-plan-stage">
          <figure className="floor-plan-drawing" id={`${id}-plan`} role={hasLevels ? 'tabpanel' : undefined} aria-labelledby={hasLevels ? `${id}-level-tab-${selectedLevelIndex}` : undefined} onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null }} onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}>
            <div className="floor-plan-canvas"><PlanImage image={configuration.planImage} sizes="(max-width: 760px) 100vw, 62vw" alt={`${suiteTitle} floor plan`} emptyLabel="Floor plan" /></div>
            <div className="floor-plan-axo-pin" aria-hidden="true">
              <PlanImage image={configuration.explodedImage} sizes="9vw" emptyLabel="" />
            </div>
            {configuration.planImage?.asset?.url && <a className="floor-plan-open" href={configuration.planImage.asset.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${suiteTitle} floor plan at full size in a new tab`}>View full-size plan ↗</a>}
          </figure>

          {groups.length > 1 && (
            <nav className="floor-plan-filmstrip" aria-label="Choose suite">
              <button type="button" className="floor-plan-page-arrow" onClick={previousSuite} disabled={selectedGroupIndex === 0} aria-label="Previous suite"><ChevronIcon direction="previous" /></button>
              <ol className="floor-plan-filmstrip-list">
                {pageItems.map((item, index) => item === 'ellipsis'
                  ? <li key={`ellipsis-${index}`} className="floor-plan-page-ellipsis" aria-hidden="true">…</li>
                  : <li key={groups[item].key} ref={item === selectedGroupIndex ? activeThumbRef : undefined}>
                      <button type="button" className={item === selectedGroupIndex ? 'is-active' : undefined} aria-current={item === selectedGroupIndex ? 'true' : undefined} aria-label={`Show ${groups[item].levels[0].name || groups[item].levels[0].title}`} onClick={() => selectSuite(item)}>
                        <span className="floor-plan-filmstrip-thumb"><PlanImage image={groups[item].levels[0].planImage} sizes="64px" emptyLabel="" /></span>
                        <span className="floor-plan-filmstrip-label">{String(item + 1).padStart(2, '0')}</span>
                      </button>
                    </li>)}
              </ol>
              <button type="button" className="floor-plan-page-arrow" onClick={nextSuite} disabled={selectedGroupIndex === groups.length - 1} aria-label="Next suite"><ChevronIcon direction="next" /></button>
            </nav>
          )}
        </div>

        <aside className="floor-plan-info">
          <header className="floor-plan-suite-header">
            <h2 className="section-display">{suiteTitle}</h2>
            <button type="button" className="floor-plan-info-toggle" aria-expanded={!infoCollapsed} aria-controls={`${id}-info-body`} onClick={() => setInfoCollapsed((collapsed) => !collapsed)}>
              <span className="sr-only">{infoCollapsed ? 'Show suite details' : 'Hide suite details'}</span>
              <CaretIcon direction={infoCollapsed ? 'down' : 'up'} />
            </button>
          </header>

          <div className="floor-plan-info-body" id={`${id}-info-body`} data-collapsed={infoCollapsed}>
            <div className="floor-plan-info-body-inner">
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
              <div className="floor-plan-suite-information">
                <ConfigurationTables configuration={configuration} />
              </div>
              <a className="floor-plan-enquire" href={ctaUrl}><span>{content.ctaLabel || 'Discuss this suite'}</span><ArrowIcon /></a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
