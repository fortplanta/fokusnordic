'use client'

import Image from 'next/image'
import { useState } from 'react'

type CmsImage = { alt?: string; asset?: { url?: string } }
type MapMarker = { _key?: string; name: string; detail?: string; category?: string; url?: string; x: number; y: number }
type BuildingMarker = { alt?: string; x: number; y: number; width: number; icon?: { asset?: { url?: string } } }

export default function AreaMap({ content, fallback }: {
  content: { kicker: string; heading: string; mapImage?: CmsImage; buildingMarker?: BuildingMarker; markers: MapMarker[] }
  fallback: string
}) {
  const [activeMarker, setActiveMarker] = useState<string | null>(null)
  const imageSource = content.mapImage?.asset?.url || fallback

  const keyFor = (marker: MapMarker, index: number) => marker._key || `marker-${index}`

  return (
    <section className="area-map grid-section" aria-labelledby="area-map-title">
      <div className="area-map-list">
        <p className="kicker">{content.kicker}</p>
        <p className="section-display" id="area-map-title">{content.heading}</p>
        <ol>
          {content.markers.map((marker, index) => {
            const markerKey = keyFor(marker, index)
            return (
              <li
                className={activeMarker === markerKey ? 'is-active' : undefined}
                id={`area-location-${markerKey}`}
                key={markerKey}
                onMouseEnter={() => setActiveMarker(markerKey)}
                onMouseLeave={() => setActiveMarker(null)}
                onFocus={() => setActiveMarker(markerKey)}
                onBlur={() => setActiveMarker(null)}
              >
                <a href={marker.url || `#area-location-${markerKey}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span><strong>{marker.name}</strong>{marker.detail && <small>{marker.detail}</small>}</span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>
      <div className="area-map-plate">
        <figure className="site-media area-map-image">
          <Image src={imageSource} alt={content.mapImage?.alt || ''} fill sizes="75vw" />
        </figure>
        <div className="area-map-markers" aria-label="Map locations">
          {content.buildingMarker?.icon?.asset?.url && (
            <img
              className="area-map-building-marker"
              src={content.buildingMarker.icon.asset.url}
              alt={content.buildingMarker.alt || 'Barnängshuset'}
              style={{
                left: `${content.buildingMarker.x}%`,
                top: `${content.buildingMarker.y}%`,
                width: `${content.buildingMarker.width}%`,
              }}
            />
          )}
          {content.markers.map((marker, index) => {
            const markerKey = keyFor(marker, index)
            return (
              <a
                className={`area-map-marker${activeMarker === markerKey ? ' is-active' : ''}`}
                href={`#area-location-${markerKey}`}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                aria-label={`${marker.name}${marker.detail ? `, ${marker.detail}` : ''}`}
                key={markerKey}
                onMouseEnter={() => setActiveMarker(markerKey)}
                onMouseLeave={() => setActiveMarker(null)}
                onFocus={() => setActiveMarker(markerKey)}
                onBlur={() => setActiveMarker(null)}
              >
                {index + 1}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
