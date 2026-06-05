'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { POI } from '@/types/sanity'

// Category emoji shortcuts for marker tooltips
const CAT_ICON: Record<string, string> = {
  coffee:  '☕',
  park:    '🌿',
  transit: '🚇',
  lunch:   '🍽',
  run:     '🏃',
  wine:    '🍷',
  gym:     '💪',
  culture: '🎨',
}

interface Props {
  pois: POI[]
  buildingLat: number
  buildingLng: number
  hoveredPoiId: string | null
  onPoiHover: (id: string | null) => void
}

export default function NeighbourhoodMap({
  pois,
  buildingLat,
  buildingLng,
  hoveredPoiId,
  onPoiHover,
}: Props) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<unknown>(null)
  const markerRefs    = useRef<Record<string, HTMLDivElement>>({})
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY

  const hasKey = apiKey && apiKey !== 'your-maptiler-key' && apiKey.length > 8

  const initMap = useCallback(async () => {
    if (!containerRef.current || !hasKey) return

    const sdk = await import('@maptiler/sdk')
    // CSS must be loaded dynamically — TypeScript doesn't resolve CSS imports
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/_next/static/css/maptiler-sdk.css'
    // Prefer the published CDN copy which is always available
    link.onerror = () => { link.href = 'https://cdn.maptiler.com/maptiler-sdk-js/latest/maptiler-sdk.css' }
    document.head.appendChild(link)

    sdk.config.apiKey = apiKey!

    const map = new sdk.Map({
      container: containerRef.current!,
      // BASIC_V2 is clean, minimal — closest to paper-toned without a custom style
      style: sdk.MapStyle.BASIC_V2,
      center: [buildingLng, buildingLat],
      zoom: 14.5,
      navigationControl: false,
    })

    mapRef.current = map

    map.on('load', () => {
      // ── Building pin ──────────────────────────────────────────────────
      const buildingEl = document.createElement('div')
      buildingEl.className = 'map-marker building'
      buildingEl.setAttribute('aria-label', 'Barnängshuset')
      new sdk.Marker({ element: buildingEl })
        .setLngLat([buildingLng, buildingLat])
        .addTo(map)

      // ── POI markers ───────────────────────────────────────────────────
      pois.forEach((poi) => {
        const el = document.createElement('div')
        el.className = 'map-marker'
        el.setAttribute('aria-label', poi.name)
        el.title = `${CAT_ICON[poi.category] ?? ''} ${poi.name} — ${poi.walkingMinutes} min`

        el.addEventListener('mouseenter', () => onPoiHover(poi._id))
        el.addEventListener('mouseleave', () => onPoiHover(null))

        markerRefs.current[poi._id] = el

        new sdk.Marker({ element: el })
          .setLngLat([poi.lng, poi.lat])
          .addTo(map)
      })
    })

    return () => map.remove()
  }, [hasKey, apiKey, buildingLat, buildingLng, pois, onPoiHover])

  useEffect(() => {
    let cleanup: (() => void) | undefined
    initMap().then((fn) => { cleanup = fn })
    return () => cleanup?.()
  }, [initMap])

  // Sync highlighted state from list → marker
  useEffect(() => {
    Object.entries(markerRefs.current).forEach(([id, el]) => {
      el.classList.toggle('hovered', id === hoveredPoiId)
    })
  }, [hoveredPoiId])

  if (!hasKey) {
    return (
      <div className="map-container">
        <div className="map-placeholder">
          <p style={{ fontSize: 'var(--step-1)', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
            Map
          </p>
          <p>
            Add your Maptiler API key to <code>.env.local</code> to enable the map.
          </p>
          <a
            href="https://www.maptiler.com/cloud/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get a free key at maptiler.com →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="map-container"
      aria-label="Neighbourhood map"
      role="application"
    />
  )
}
