'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { CurrentHomePage } from '@/types/sanity'

type AreaMapContent = NonNullable<CurrentHomePage['areaMap']>

export default function AreaMap({
  content,
  propertyName = 'Barnängshuset',
}: {
  content: AreaMapContent
  propertyName?: string
}) {
  const allPois = content.pois ?? []
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const indexById = new Map(allPois.map((poi, index) => [poi._id, index]))
  const pinnedPois = allPois.filter(
    (poi): poi is typeof poi & { mapX: number; mapY: number } => poi.mapX != null && poi.mapY != null,
  )
  const building = content.buildingX != null && content.buildingY != null
    ? { x: content.buildingX, y: content.buildingY }
    : null
  const routePois = building ? pinnedPois.filter((poi) => poi.showRoute) : []
  const imageUrl = content.mapImage?.asset?.url

  return (
    <section className="area-map" aria-label={content.heading || 'Local area map'}>
      <div className="area-map-head">
        {content.kicker && <p className="kicker">{content.kicker}</p>}
        {content.heading && <h2>{content.heading}</h2>}
        {content.supportingLine && <p className="area-map-support">{content.supportingLine}</p>}
      </div>

      <div className="area-map-stage">
        <ol className="area-map-list" aria-label="Nearby places">
          {allPois.map((poi, index) => (
            <li
              key={poi._id}
              className={hoveredId === poi._id ? 'is-active' : undefined}
              onMouseEnter={() => setHoveredId(poi._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <span className="area-map-list-num">{String(index + 1).padStart(2, '0')}</span>
              <span className="area-map-list-body">
                <strong>{poi.name}</strong>
                {poi.description && <small>{poi.description}</small>}
              </span>
              <span className="area-map-list-time">{poi.walkingMinutes} min</span>
            </li>
          ))}
        </ol>

        <div className="area-map-map">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={content.mapImage?.alt || ''}
                fill
                sizes="(max-width: 900px) 100vw, 66vw"
                className="area-map-image"
              />

              {building && routePois.length > 0 && (
                <svg className="area-map-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  {routePois.map((poi) => (
                    <line key={poi._id} x1={building.x} y1={building.y} x2={poi.mapX} y2={poi.mapY} />
                  ))}
                </svg>
              )}

              {building && (
                <div className="area-map-pin area-map-pin--building" style={{ left: `${building.x}%`, top: `${building.y}%` }}>
                  <span className="area-map-pin-label">{propertyName}</span>
                </div>
              )}

              {pinnedPois.map((poi) => (
                <button
                  key={poi._id}
                  type="button"
                  className={`area-map-pin${hoveredId === poi._id ? ' is-active' : ''}`}
                  style={{ left: `${poi.mapX}%`, top: `${poi.mapY}%` }}
                  aria-label={`${poi.name} — ${poi.walkingMinutes} min`}
                  onMouseEnter={() => setHoveredId(poi._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(poi._id)}
                  onBlur={() => setHoveredId(null)}
                >
                  {(indexById.get(poi._id) ?? 0) + 1}
                </button>
              ))}

              {building && routePois.map((poi) => (
                <span
                  key={poi._id}
                  className="area-map-route-label"
                  style={{ left: `${(building.x + poi.mapX) / 2}%`, top: `${(building.y + poi.mapY) / 2}%` }}
                >
                  {poi.walkingMinutes} min
                </span>
              ))}
            </>
          ) : (
            <div className="map-placeholder">
              <p style={{ fontSize: 'var(--step-1)', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Map</p>
              <p>Upload a map image under Area map → Map image in Sanity to enable this section.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
