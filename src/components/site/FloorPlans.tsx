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

// Gap-filling pagination range: near either edge the visible window widens
// to fill the slot an ellipsis would have taken, so the control always
// renders the same number of slots (once there are enough items to
// truncate at all) — no reflow as the visitor swipes toward either end.
function paginationRange(current: number, total: number, siblingCount = 1): Array<number | 'ellipsis'> {
  const totalSlots = siblingCount * 2 + 5
  if (total <= totalSlots) return Array.from({ length: total }, (_, index) => index)
  const leftSibling = Math.max(current - siblingCount, 0)
  const rightSibling = Math.min(current + siblingCount, total - 1)
  const showLeftEllipsis = leftSibling > 1
  const showRightEllipsis = rightSibling < total - 2
  const lastIndex = total - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + siblingCount * 2
    return [...Array.from({ length: leftItemCount }, (_, index) => index), 'ellipsis', lastIndex]
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + siblingCount * 2
    return [0, 'ellipsis', ...Array.from({ length: rightItemCount }, (_, index) => total - rightItemCount + index)]
  }
  const middleRange = Array.from({ length: rightSibling - leftSibling + 1 }, (_, index) => leftSibling + index)
  return [0, 'ellipsis', ...middleRange, 'ellipsis', lastIndex]
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

// Every configuration — main level or mezzanine — is its own independently
// rentable listing and its own slide. "Suite 1" and "Suite 1 Mezzanine" are
// never merged into one entry with a level switch.
type Slide = { key: string; floorLabel: string; configuration: FloorPlanConfiguration }

export default function FloorPlans({ content }: { content: FloorPlanSection }) {
  const slides = useMemo<Slide[]>(() => (content.floors || []).flatMap((floor) =>
    (floor.configurations || []).map((configuration) => ({ key: configuration._key || configuration.title, floorLabel: floor.label, configuration }))
  ), [content.floors])

  const [slideIndex, setSlideIndex] = useState(0)
  // Expanded by default: the drawer collapse is a JS convenience for tight
  // mobile screens, not a gate on content — collapsing by default would hide
  // suite details from anyone before hydration finishes, or without JS at all.
  const [infoCollapsed, setInfoCollapsed] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const sectionIsActive = useRef(false)
  const activeThumbRef = useRef<HTMLLIElement | null>(null)
  const id = useId()
  const selectedIndex = Math.min(slideIndex, Math.max(slides.length - 1, 0))
  const slide = slides[selectedIndex]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => { sectionIsActive.current = entry?.isIntersecting ?? false }, { threshold: 0.35 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const changeSlideWithKeyboard = (event: KeyboardEvent) => {
      if (!sectionIsActive.current || slides.length < 2 || event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      setSlideIndex((current) => event.key === 'ArrowRight' ? Math.min(current + 1, slides.length - 1) : Math.max(current - 1, 0))
    }
    window.addEventListener('keydown', changeSlideWithKeyboard)
    return () => window.removeEventListener('keydown', changeSlideWithKeyboard)
  }, [slides.length])

  useEffect(() => {
    // On narrow viewports the filmstrip scrolls horizontally rather than
    // wrapping or shrinking to illegibility — keep the active thumbnail in view.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    activeThumbRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })
  }, [selectedIndex])

  if (!slide) return null
  const { configuration } = slide
  const suiteTitle = configuration.name || configuration.title
  const description = configuration.body || content.body
  const ctaUrl = stegaClean(content.ctaUrl) || '#viewing'

  const selectSlide = (index: number) => setSlideIndex(index)
  const previousSlide = () => selectSlide(Math.max(selectedIndex - 1, 0))
  const nextSlide = () => selectSlide(Math.min(selectedIndex + 1, slides.length - 1))
  const finishSwipe = (clientX: number) => {
    if (touchStartX.current === null || slides.length < 2) return
    const distance = clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(distance) < 48) return
    if (distance < 0) nextSlide(); else previousSlide()
  }
  const pageItems = paginationRange(selectedIndex, slides.length)

  return (
    <section className="floor-plans" id="floor-plans" aria-label="Floor-plan configurator" ref={sectionRef}>
      <div className="floor-plan-axo-anchor" aria-hidden="true">
        <div className="floor-plan-axo-pin">
          <PlanImage key={configuration._key} image={configuration.explodedImage} sizes="9vw" emptyLabel="" />
        </div>
      </div>
      <div className="floor-plan-configurator">
        <div className="floor-plan-stage">
          <figure className="floor-plan-drawing" aria-label={`${slide.floorLabel}, ${suiteTitle} floor plan`} onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null }} onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}>
            <div className="floor-plan-canvas"><PlanImage key={configuration._key} image={configuration.planImage} sizes="(max-width: 760px) 100vw, 62vw" alt={`${suiteTitle} floor plan`} emptyLabel="Floor plan" /></div>
            {configuration.planImage?.asset?.url && <a className="floor-plan-open" href={configuration.planImage.asset.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${suiteTitle} floor plan at full size in a new tab`}>View full-size plan ↗</a>}
          </figure>

          {slides.length > 1 && (
            <nav className="floor-plan-filmstrip" aria-label="Choose suite">
              <button type="button" className="floor-plan-page-arrow" onClick={previousSlide} disabled={selectedIndex === 0} aria-label="Previous suite"><ChevronIcon direction="previous" /></button>
              <div className="floor-plan-filmstrip-track">
                <p className="floor-plan-filmstrip-caption" aria-live="polite">{String(selectedIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')} — {suiteTitle}</p>
                <ol className="floor-plan-filmstrip-list">
                  {pageItems.map((item, index) => item === 'ellipsis'
                    ? <li key={`ellipsis-${index}`} className="floor-plan-page-ellipsis" aria-hidden="true">…</li>
                    : <li key={slides[item].key} ref={item === selectedIndex ? activeThumbRef : undefined}>
                        <button type="button" className={item === selectedIndex ? 'is-active' : undefined} aria-current={item === selectedIndex ? 'true' : undefined} aria-label={`Show ${slides[item].configuration.name || slides[item].configuration.title}`} onClick={() => selectSlide(item)}>
                          <span className="floor-plan-filmstrip-thumb"><PlanImage image={slides[item].configuration.planImage} sizes="64px" emptyLabel="" /></span>
                        </button>
                      </li>)}
                </ol>
              </div>
              <button type="button" className="floor-plan-page-arrow" onClick={nextSlide} disabled={selectedIndex === slides.length - 1} aria-label="Next suite"><ChevronIcon direction="next" /></button>
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
