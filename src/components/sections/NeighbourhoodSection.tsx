'use client'

import { useState } from 'react'
import type { NeighbourhoodSection as T } from '@/types/sanity'
import NeighbourhoodMap from './NeighbourhoodMap'

// Building coordinates — from Sanity siteSettings in production
const BUILDING = { lat: 59.3148, lng: 18.0717 }

export default function NeighbourhoodSection({ section }: { section: T }) {
  const {
    heading        = 'Södermalm has always been where people come to make things.',
    label          = 'The address',
    supportingLine = 'Not to be seen making them — to actually make them. Barnängshuset sits at the quieter end of that tradition, eight minutes from the centre and a world away from its noise.',
    pois           = [],
  } = section

  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="hood" id="neighbourhood" aria-label="Neighbourhood">
      <div className="container">
        <div className="hood__head">
          <span className="lab">{label}</span>
          <h2>{heading}</h2>
          {supportingLine && (
            <p className="hood__support" data-fade data-delay="0.1">{supportingLine}</p>
          )}
        </div>

        {/* Map + list side by side */}
        <div className="hood__stage">
          <NeighbourhoodMap
            pois={pois}
            buildingLat={BUILDING.lat}
            buildingLng={BUILDING.lng}
            hoveredPoiId={hoveredId}
            onPoiHover={setHoveredId}
          />

          {/* POI list — hover syncs with map markers */}
          <ul className="hood__list" aria-label="Nearby places">
            {pois.map((poi) => (
              <li
                key={poi._id}
                className={`spot${hoveredId === poi._id ? ' highlighted' : ''}`}
                onMouseEnter={() => setHoveredId(poi._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <span className="cat" aria-label={`Category: ${poi.category}`}>
                  {poi.category}
                </span>
                <span className="nm">
                  {poi.name}
                  {poi.description && <span className="d">{poi.description}</span>}
                </span>
                <span className="wt" aria-label={`${poi.walkingMinutes} minutes walk`}>
                  {poi.walkingMinutes} min
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
