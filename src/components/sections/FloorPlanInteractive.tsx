'use client'

import { useState } from 'react'
import type { Floor } from '@/types/sanity'

const STATUS_LABEL: Record<Floor['status'], string> = {
  available: 'Available',
  reserved:  'Reserved',
  leased:    'Leased',
}
const STATUS_DOT: Record<Floor['status'], string> = {
  available: 'var(--c-coral)',
  reserved:  'var(--c-sage)',
  leased:    'var(--c-stone)',
}

// ─── SVG floor plate ──────────────────────────────────────────────────────────
// Schematic only — replace with traced SVG paths from architectural drawings.

function FloorSVG({
  floor,
  isActive,
  isHovered,
  onEnter,
  onLeave,
  onSelect,
}: {
  floor: Floor
  isActive: boolean
  isHovered: boolean
  onEnter: () => void
  onLeave: () => void
  onSelect: () => void
}) {
  const colX = [72, 172, 272, 372, 472, 556]
  const colY = [44, 268]
  const winSegments = 11

  const unitClass = [
    'unit',
    floor.status,
    isActive  ? 'active'  : '',
    isHovered ? 'hovered' : '',
  ].filter(Boolean).join(' ')

  return (
    <svg
      viewBox="0 0 600 316"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Schematic floor plan — ${floor.label}`}
      role="img"
    >
      {/* Outer perimeter */}
      <rect x="1" y="1" width="598" height="314"
        fill="none"
        stroke="rgba(250,247,243,0.1)"
        strokeWidth="1.5"
      />

      {/* Window dashes — top */}
      {Array.from({ length: winSegments }).map((_, i) => (
        <line key={`wt-${i}`}
          x1={24 + i * 52} y1="2"
          x2={60 + i * 52} y2="2"
          stroke="var(--c-sage)" strokeWidth="2.5" opacity="0.55"
        />
      ))}
      {/* Window dashes — bottom */}
      {Array.from({ length: winSegments }).map((_, i) => (
        <line key={`wb-${i}`}
          x1={24 + i * 52} y1="314"
          x2={60 + i * 52} y2="314"
          stroke="var(--c-sage)" strokeWidth="2.5" opacity="0.55"
        />
      ))}
      {/* Window dashes — left */}
      {[60, 130, 200].map((y) => (
        <line key={`wl-${y}`}
          x1="2" y1={y} x2="2" y2={y + 36}
          stroke="var(--c-sage)" strokeWidth="2.5" opacity="0.4"
        />
      ))}
      {/* Window dashes — right */}
      {[60, 130, 200].map((y) => (
        <line key={`wr-${y}`}
          x1="598" y1={y} x2="598" y2={y + 36}
          stroke="var(--c-sage)" strokeWidth="2.5" opacity="0.4"
        />
      ))}

      {/* Structural columns */}
      {colX.flatMap(x => colY.map(y => (
        <circle key={`col-${x}-${y}`} cx={x} cy={y} r={7}
          fill="color-mix(in oklab, var(--c-paper) 18%, transparent)"
          stroke="rgba(250,247,243,0.22)"
          strokeWidth="1.2"
        />
      )))}

      {/* Service core — stairwell / lift */}
      <rect x="2" y="2" width="54" height="90"
        fill="rgba(250,247,243,0.03)"
        stroke="rgba(250,247,243,0.12)"
        strokeWidth="1"
      />
      <text x="29" y="52"
        textAnchor="middle"
        fill="rgba(250,247,243,0.28)"
        fontSize="6.5"
        letterSpacing="0.14em"
        fontFamily="var(--font-sans)"
        style={{ textTransform: 'uppercase' }}
      >CORE</text>

      {/* Main unit — keyboard and mouse interactive */}
      <rect
        className={unitClass}
        x="58" y="18" width="538" height="280"
        rx="1"
        role={floor.status !== 'leased' ? 'button' : undefined}
        tabIndex={floor.status !== 'leased' ? 0 : undefined}
        aria-label={`${floor.label} — ${floor.status === 'available' ? 'Available' : floor.status === 'reserved' ? 'Reserved' : 'Leased'}. ${floor.status !== 'leased' ? 'Press Enter to view details.' : ''}`}
        aria-pressed={isActive}
        onClick={floor.status !== 'leased' ? onSelect : undefined}
        onMouseEnter={floor.status !== 'leased' ? onEnter : undefined}
        onMouseLeave={onLeave}
        onKeyDown={(e) => {
          if (floor.status !== 'leased' && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onSelect()
          }
        }}
        style={{ cursor: floor.status === 'leased' ? 'default' : 'pointer' }}
      />

      {/* Unit label */}
      <text
        x="327" y="166"
        textAnchor="middle"
        fill="var(--c-paper)"
        fontSize="11"
        letterSpacing="0.14em"
        fontFamily="var(--font-sans)"
        style={{ textTransform: 'uppercase', opacity: 0.5, pointerEvents: 'none' }}
      >
        {floor.label}
      </text>

      {/* "Schematic" watermark */}
      <text
        x="12" y="308"
        fill="rgba(250,247,243,0.18)"
        fontSize="7.5"
        letterSpacing="0.1em"
        fontFamily="var(--font-sans)"
        style={{ textTransform: 'uppercase' }}
      >Schematic</text>
    </svg>
  )
}

// ─── Info panel ───────────────────────────────────────────────────────────────

function PlanInfo({ floor, onContact }: { floor: Floor | null; onContact?: string }) {
  if (!floor) {
    return (
      <div className="planinfo">
        <p className="planinfo__hint">
          Click a unit to explore the space.
        </p>
      </div>
    )
  }

  return (
    <div className="planinfo" aria-live="polite" aria-label={`Details for ${floor.label}`}>
      <div className="planinfo__status">
        <span
          className="dot"
          style={{ background: STATUS_DOT[floor.status] }}
          aria-hidden="true"
        />
        {STATUS_LABEL[floor.status]}
      </div>

      <h3>{floor.label}</h3>

      <dl className="planinfo__specs">
        <div className="planinfo__spec">
          <dd className="v">{floor.areaSqm}m²</dd>
          <dt className="k">Area</dt>
        </div>
        <div className="planinfo__spec">
          <dd className="v">{floor.ceilingHeightM}m</dd>
          <dt className="k">Ceiling</dt>
        </div>
        {floor.capacity && (
          <div className="planinfo__spec">
            <dd className="v">{floor.capacity}</dd>
            <dt className="k">Capacity</dt>
          </div>
        )}
        {floor.orientation && (
          <div className="planinfo__spec">
            <dd className="v" style={{ fontSize: 'var(--step-0)', lineHeight: 1.3 }}>
              {floor.orientation}
            </dd>
            <dt className="k">Aspect</dt>
          </div>
        )}
      </dl>

      {floor.features && floor.features.length > 0 && (
        <ul className="planinfo__features" aria-label="Features">
          {floor.features.map(f => (
            <li key={f} className="planinfo__feature">{f}</li>
          ))}
        </ul>
      )}

      {floor.status === 'available' && onContact && (
        <div className="planinfo__cta">
          <a
            href={`mailto:${onContact}?subject=Viewing request — ${floor.label}`}
            className="btn-coral"
            style={{ fontSize: 'var(--step-00)' }}
          >
            Enquire about this floor →
          </a>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FloorPlanInteractive({
  floors,
  contactEmail,
}: {
  floors: Floor[]
  contactEmail?: string
}) {
  const [activeFloorIndex, setActiveFloorIndex] = useState(0)
  const [selectedId, setSelectedId]   = useState<string | null>(null)
  const [hoveredId,  setHoveredId]    = useState<string | null>(null)

  const currentFloor  = floors[activeFloorIndex]
  const selectedFloor = floors.find(f => f._id === selectedId) ?? null

  if (!floors.length) return null

  return (
    <>
      {/* Floor tabs */}
      {floors.length > 1 && (
        <div className="floor-tabs" role="tablist" aria-label="Select floor">
          {floors.map((floor, i) => (
            <button
              key={floor._id}
              role="tab"
              aria-selected={i === activeFloorIndex}
              className={`floor-tab${i === activeFloorIndex ? ' active' : ''}`}
              onClick={() => {
                setActiveFloorIndex(i)
                setSelectedId(null)
              }}
            >
              {floor.label}
            </button>
          ))}
        </div>
      )}

      <div className="floors__stage">
        {/* SVG plan */}
        <div className="plan">
          <FloorSVG
            floor={currentFloor}
            isActive={selectedId === currentFloor._id}
            isHovered={hoveredId === currentFloor._id}
            onEnter={() => setHoveredId(currentFloor._id)}
            onLeave={() => setHoveredId(null)}
            onSelect={() => setSelectedId(
              selectedId === currentFloor._id ? null : currentFloor._id
            )}
          />
        </div>

        {/* Detail panel */}
        <PlanInfo
          floor={selectedId === currentFloor._id ? currentFloor : null}
          onContact={contactEmail}
        />
      </div>
    </>
  )
}
