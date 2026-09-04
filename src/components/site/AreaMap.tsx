'use client'

import Image from 'next/image'
import { useEffect, useId, useState } from 'react'
import { stegaClean } from '@sanity/client/stega'
import type { CurrentHomePage } from '@/types/sanity'

type AreaMapContent = NonNullable<CurrentHomePage['areaMap']>
type Category = NonNullable<AreaMapContent['categories']>[number]
type Location = Category['locations'][number]
type Tone = 'wine' | 'coral' | 'ink'

function cleanTone(value?: string): Tone {
  const clean = stegaClean(value)
  return clean === 'coral' || clean === 'ink' ? clean : 'wine'
}

function ChevronIcon() {
  return (
    <svg className="map-chevron" viewBox="0 0 16 16" aria-hidden="true">
      <path d="m4 6 4 4 4-4" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m4 4 8 8M12 4l-8 8" />
    </svg>
  )
}

function Disclosure({ title, desktopOpen = true, mobileOpen = false, className = '', children }: {
  title: string
  desktopOpen?: boolean
  mobileOpen?: boolean
  className?: string
  children: React.ReactNode
}) {
  const contentId = useId()
  const [open, setOpen] = useState(desktopOpen)

  useEffect(() => {
    setOpen(window.matchMedia('(max-width: 760px)').matches ? mobileOpen : desktopOpen)
  }, [desktopOpen, mobileOpen])

  return (
    <section className={`map-disclosure ${className}${open ? ' is-open' : ''}`}>
      <button className="map-disclosure-trigger" type="button" aria-expanded={open} aria-controls={contentId} onClick={() => setOpen((current) => !current)}>
        <span>{title}</span><ChevronIcon />
      </button>
      <div className="map-disclosure-content" id={contentId} hidden={!open}>{children}</div>
    </section>
  )
}

function locationKey(location: Location, categoryIndex: number, locationIndex: number) {
  return location._key || `location-${categoryIndex}-${locationIndex}`
}

export default function AreaMap({ content, fallback }: { content: AreaMapContent; fallback: string }) {
  const [activeMarker, setActiveMarker] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(content.drawerOpenDesktop ?? true)
  const [nearbyOpen, setNearbyOpen] = useState(content.nearbyOpenDesktop ?? true)
  const drawerId = useId()
  const imageSource = content.mapImage?.asset?.url || fallback
  const categories = content.categories ?? []

  useEffect(() => {
    setDrawerOpen(window.matchMedia('(max-width: 760px)').matches
      ? content.drawerOpenMobile ?? false
      : content.drawerOpenDesktop ?? true)
  }, [content.drawerOpenDesktop, content.drawerOpenMobile])

  useEffect(() => {
    setNearbyOpen(window.matchMedia('(max-width: 760px)').matches
      ? content.nearbyOpenMobile ?? true
      : content.nearbyOpenDesktop ?? true)
  }, [content.nearbyOpenDesktop, content.nearbyOpenMobile])

  return (
    <section className="area-map" aria-label={content.heading || content.nearbyTitle || 'Local area map'}>
      <figure className="site-media area-map-image">
        <Image src={imageSource} alt={content.mapImage?.alt || ''} fill sizes="100vw" />
      </figure>

      <div className="area-map-markers" aria-label="Map locations">
        {content.buildingMarker?.icon?.asset?.url && (
          <span className="area-map-building-marker" role="img" aria-label={content.buildingMarker.alt || 'Barnängshuset'} style={{ left: `${content.buildingMarker.x}%`, top: `${content.buildingMarker.y}%`, width: `${content.buildingMarker.width}%` }}>
            <img src={content.buildingMarker.icon.asset.url} alt="" />
          </span>
        )}
        {categories.flatMap((category, categoryIndex) => (category.locations ?? []).map((location, locationIndex) => {
          const markerKey = locationKey(location, categoryIndex, locationIndex)
          return (
            <a className={`area-map-marker area-map-marker--${cleanTone(category.tone)}${activeMarker === markerKey ? ' is-active' : ''}`} href={location.url || `#area-location-${markerKey}`} style={{ left: `${location.x}%`, top: `${location.y}%` }} aria-label={`${location.name}${location.detail ? `, ${location.detail}` : ''}`} key={markerKey} onMouseEnter={() => setActiveMarker(markerKey)} onMouseLeave={() => setActiveMarker(null)} onFocus={() => setActiveMarker(markerKey)} onBlur={() => setActiveMarker(null)}>
              {locationIndex + 1}
            </a>
          )
        }))}
      </div>

      {!drawerOpen && (
        <button className="area-map-drawer-open" type="button" aria-controls={drawerId} onClick={() => setDrawerOpen(true)}>
          <span>{content.drawerTitle || 'Explore the area'}</span><ChevronIcon />
        </button>
      )}

      <aside className={`area-map-drawer${drawerOpen ? ' is-open' : ''}`} id={drawerId} aria-hidden={!drawerOpen}>
        <section className={`map-nearby${nearbyOpen ? ' is-open' : ''}`}>
          <header className="map-nearby-header">
            <button className="map-nearby-trigger" type="button" aria-expanded={nearbyOpen} aria-controls={`${drawerId}-nearby`} onClick={() => setNearbyOpen((current) => !current)}>
              <span><small>{content.kicker}</small>{content.nearbyTitle || content.heading || 'Close at hand'}</span><ChevronIcon />
            </button>
            <button className="map-drawer-close" type="button" onClick={() => setDrawerOpen(false)} aria-label="Close map guide"><CloseIcon /></button>
          </header>
          <div id={`${drawerId}-nearby`} hidden={!nearbyOpen}>
          <div className="map-category-list">
            {categories.map((category, categoryIndex) => (
              <Disclosure key={category._key || category.title} title={category.title} desktopOpen={category.openDesktop ?? true} mobileOpen={category.openMobile ?? categoryIndex === 0} className={`map-category map-category--${cleanTone(category.tone)}`}>
                <ol>
                  {(category.locations ?? []).map((location, locationIndex) => {
                    const markerKey = locationKey(location, categoryIndex, locationIndex)
                    return (
                      <li className={activeMarker === markerKey ? 'is-active' : undefined} id={`area-location-${markerKey}`} key={markerKey} onMouseEnter={() => setActiveMarker(markerKey)} onMouseLeave={() => setActiveMarker(null)}>
                        <a href={location.url || `#area-location-${markerKey}`} onFocus={() => setActiveMarker(markerKey)} onBlur={() => setActiveMarker(null)}>
                          <span>{String(locationIndex + 1).padStart(2, '0')}</span><span><strong>{location.name}</strong>{location.detail && <small>{location.detail}</small>}</span>
                        </a>
                      </li>
                    )
                  })}
                </ol>
              </Disclosure>
            ))}
          </div>
          </div>
        </section>

        {(content.travelTimes?.length ?? 0) > 0 && (
          <Disclosure title={content.travelTitle || 'Travel times'} desktopOpen={content.travelOpenDesktop ?? true} mobileOpen={content.travelOpenMobile ?? false} className="map-travel">
            <ol>
              {content.travelTimes?.map((item, index) => (
                <li key={item._key || item.name}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.name}</strong><small>{item.duration}</small></li>
              ))}
            </ol>
          </Disclosure>
        )}
      </aside>
    </section>
  )
}
