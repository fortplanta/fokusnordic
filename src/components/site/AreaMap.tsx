'use client'

import { useState } from 'react'
import type { CurrentHomePage } from '@/types/sanity'
import NeighbourhoodMap from '@/components/sections/NeighbourhoodMap'

type AreaMapContent = NonNullable<CurrentHomePage['areaMap']>

export default function AreaMap({
  content,
  propertyName = 'Barnängshuset',
  buildingLat,
  buildingLng,
}: {
  content: AreaMapContent
  propertyName?: string
  buildingLat: number
  buildingLng: number
}) {
  const pois = content.pois ?? []
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="area-map" aria-label={content.heading || 'Local area map'}>
      <div className="area-map-head">
        {content.kicker && <p className="kicker">{content.kicker}</p>}
        {content.heading && <h2>{content.heading}</h2>}
        {content.supportingLine && <p className="area-map-support">{content.supportingLine}</p>}
      </div>

      <div className="area-map-stage">
        <ol className="area-map-list" aria-label="Nearby places">
          {pois.map((poi, index) => (
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
          <NeighbourhoodMap
            pois={pois}
            buildingLat={buildingLat}
            buildingLng={buildingLng}
            propertyName={propertyName}
            hoveredPoiId={hoveredId}
            onPoiHover={setHoveredId}
          />
        </div>
      </div>
    </section>
  )
}
