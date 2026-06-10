'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { POI } from '@/types/sanity'

// Palette tokens (mirrors CSS custom properties — kept in sync manually)
// Used for runtime map paint overrides post-load.
const PALETTE = {
  paper:   '#FAF7F3',   // --c-paper
  paper2:  '#F5F2EB',   // --c-paper-2
  stone3:  '#C2BBB1',   // --c-stone-3
  stone4:  '#DCD8D1',   // --c-stone-4
  water:   '#C5CDB8',   // muted sage for water — between sage and stone-4
  road:    '#E0DBD3',   // very faint road lines
  roadMaj: '#C8C2B8',   // slightly more visible for major roads
  ink30:   'rgba(18,16,13,0.18)', // faint ink for borders
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
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<unknown>(null)
  const markerRefs   = useRef<Record<string, HTMLDivElement>>({})
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY

  const hasKey = apiKey && apiKey !== 'your-maptiler-key' && apiKey.length > 8

  const applyPaperTone = useCallback((map: {
    getStyle: () => { layers: Array<{ id: string; type: string; 'source-layer'?: string }> }
    setPaintProperty: (id: string, prop: string, value: unknown) => void
  }) => {
    // Walk every layer in the loaded style and override the colours that
    // make the map feel like a widget rather than a drawn document.
    const { layers } = map.getStyle()

    layers.forEach((layer) => {
      const sl = layer['source-layer']
      const id = layer.id
      const t  = layer.type

      // Background / land
      if (t === 'background') {
        map.setPaintProperty(id, 'background-color', PALETTE.paper)
        return
      }

      // Water areas → muted sage
      if (sl === 'water' && t === 'fill') {
        map.setPaintProperty(id, 'fill-color', PALETTE.water)
        return
      }
      if (sl === 'water' && t === 'line') {
        map.setPaintProperty(id, 'line-color', PALETTE.water)
        return
      }

      // Waterways (rivers, canals)
      if (sl === 'waterway') {
        map.setPaintProperty(id, 'line-color', PALETTE.water)
        return
      }

      // Parks, landcover, green areas → paper-2 (warmer, barely distinct from land)
      if (sl === 'landuse' || sl === 'landcover' || sl === 'park') {
        if (t === 'fill') {
          map.setPaintProperty(id, 'fill-color', PALETTE.paper2)
          map.setPaintProperty(id, 'fill-opacity', 0.6)
        }
        return
      }

      // Buildings → stone-4 (very faint footprints)
      if (sl === 'building' && t === 'fill') {
        map.setPaintProperty(id, 'fill-color', PALETTE.stone4)
        map.setPaintProperty(id, 'fill-opacity', 0.7)
        return
      }
      if (sl === 'building' && t === 'line') {
        map.setPaintProperty(id, 'line-color', PALETTE.stone3)
        map.setPaintProperty(id, 'line-opacity', 0.5)
        return
      }

      // Roads — keep them readable but faint
      if (sl === 'transportation' || sl === 'road') {
        if (t === 'fill') {
          map.setPaintProperty(id, 'fill-color', PALETTE.road)
          return
        }
        if (t === 'line') {
          // Major roads slightly stronger
          const isMajor = /motorway|trunk|primary/.test(id)
          map.setPaintProperty(id, 'line-color', isMajor ? PALETTE.roadMaj : PALETTE.road)
          return
        }
      }

      // Road casings / outlines
      if (sl === 'transportation_name' || id.includes('casing') || id.includes('outline')) {
        if (t === 'line') {
          map.setPaintProperty(id, 'line-color', PALETTE.paper)
          return
        }
      }
    })
  }, [])

  const initMap = useCallback(async () => {
    if (!containerRef.current || !hasKey) return

    const sdk = await import('@maptiler/sdk')

    // Inject Maptiler SDK CSS — try local copy first, CDN fallback
    if (!document.querySelector('link[data-maptiler-css]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.setAttribute('data-maptiler-css', '1')
      link.href = '/_next/static/css/maptiler-sdk.css'
      link.onerror = () => {
        link.href = 'https://cdn.maptiler.com/maptiler-sdk-js/latest/maptiler-sdk.css'
      }
      document.head.appendChild(link)
    }

    sdk.config.apiKey = apiKey!

    // Use the Maptiler Backdrop style — the most minimal, neutral base available.
    // We override all key colours at runtime via applyPaperTone() after load.
    const styleUrl = `https://api.maptiler.com/maps/backdrop/style.json?key=${apiKey}`

    const map = new sdk.Map({
      container: containerRef.current!,
      style: styleUrl,
      center:  [buildingLng, buildingLat],
      zoom:    14.5,
      navigationControl: false,
      // Keep attribution legally present; visual treatment handled in CSS
      attributionControl: { compact: true },
    })

    mapRef.current = map

    map.on('load', () => {
      // Apply paper-palette colour overrides to the loaded style
      applyPaperTone(map as Parameters<typeof applyPaperTone>[0])

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
        el.title = `${poi.name} — ${poi.walkingMinutes} min`

        el.addEventListener('mouseenter', () => onPoiHover(poi._id))
        el.addEventListener('mouseleave', () => onPoiHover(null))

        markerRefs.current[poi._id] = el

        new sdk.Marker({ element: el })
          .setLngLat([poi.lng, poi.lat])
          .addTo(map)
      })
    })

    return () => map.remove()
  }, [hasKey, apiKey, buildingLat, buildingLng, pois, onPoiHover, applyPaperTone])

  useEffect(() => {
    let cleanup: (() => void) | undefined
    initMap().then((fn) => { cleanup = fn })
    return () => cleanup?.()
  }, [initMap])

  // Sync hover state from list → map markers
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
          <p>Add <code>NEXT_PUBLIC_MAPTILER_API_KEY</code> to <code>.env.local</code> to enable the map.</p>
          <a href="https://www.maptiler.com/cloud/" target="_blank" rel="noopener noreferrer">
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
