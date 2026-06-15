import type { FloorsSection as T } from '@/types/sanity'
import FloorPlanInteractive from './FloorPlanInteractive'
import { cleanHeadingTag } from '@/lib/stega'

export default function FloorsSection({
  section,
  contactEmail,
}: {
  section: T
  contactEmail?: string
}) {
  const {
    headingLevel,
    colorTheme,
    heading = 'The spaces',
    label   = 'Floor plan',
  } = section
  const Tag = cleanHeadingTag(headingLevel)

  const floors = section.floors ?? []
  const sorted = [...floors].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <section className="floors" id="spaces" aria-label="Floor plan" data-section-theme={colorTheme ?? 'light'}>
      <div className="container">
        {/* Header */}
        <div className="floors__head">
          <span className="lab">{label}</span>
          <Tag>{heading}</Tag>
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
