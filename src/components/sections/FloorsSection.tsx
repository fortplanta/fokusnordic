import type { FloorsSection as T } from '@/types/sanity'
import FloorPlanInteractive from './FloorPlanInteractive'

export default function FloorsSection({
  section,
  contactEmail,
}: {
  section: T
  contactEmail?: string
}) {
  const {
    heading = 'The spaces',
    label   = 'Floor plan',
    floors  = [],
  } = section

  const sorted = [...floors].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <section className="floors" id="spaces" aria-label="Floor plan">
      <div className="container">
        {/* Header */}
        <div className="floors__head">
          <span className="lab">{label}</span>
          <h2>{heading}</h2>
          <div className="floors__legend" aria-label="Status legend">
            <div className="row">
              <span className="dot dot-avail" aria-hidden="true" />
              <span>Available</span>
            </div>
            <div className="row">
              <span className="dot dot-res" aria-hidden="true" />
              <span>Reserved</span>
            </div>
            <div className="row">
              <span className="dot dot-leased" aria-hidden="true" />
              <span>Leased</span>
            </div>
          </div>
        </div>

        {/* Interactive floor plan */}
        <FloorPlanInteractive
          floors={sorted}
          contactEmail={contactEmail}
        />
      </div>
    </section>
  )
}
