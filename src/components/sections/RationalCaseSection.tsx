import type { RationalCaseSection as T } from '@/types/sanity'
import { cleanHeadingTag } from '@/lib/stega'

const DEFAULT_FACTS = [
  {
    _key: 'breeam',
    label: 'BREEAM In-Use',
    value: 'BREEAM In-Use: Very Good — which means the building carries its own environmental credentials, so your tenancy starts with the reporting already done.',
  },
  {
    _key: 'lease',
    label: 'Lease',
    value: 'Flexible terms available, from 12 months. Full details on request.',
  },
  {
    _key: 'available',
    label: 'Available',
    value: 'Available from Q4 2025.',
  },
  {
    _key: 'owner',
    label: 'Owner',
    value: 'PPP Group, Stockholm.',
  },
]

export default function RationalCaseSection({ section }: { section: T }) {
  const {
    headingLevel,
    colorTheme,
    orientLine  = 'Barnängshuset — Nackagatan 4, Södermalm. A 1917 textile mill, restored for office use.',
    eyebrow     = 'The case',
    headline    = 'Everything the spreadsheet needs.',
    closingLine = 'Managed by PPP Group, who have looked after buildings like this long enough to know the details are the point.',
  } = section
  const Tag = cleanHeadingTag(headingLevel)

  const activeFacts = section.facts?.length ? section.facts : DEFAULT_FACTS

  return (
    <section className="rcase" id="the-case" aria-label="The business case" data-section-theme={colorTheme ?? 'light'}>
      <div className="container">

        {/* Header */}
        <div className="rcase__header">
          <p className="rcase__orient" data-fade>{orientLine}</p>
          <p className="rcase__eyebrow" data-fade data-delay="0.08">{eyebrow}</p>
          <Tag className="rcase__headline">{headline}</Tag>
        </div>

        <div className="rcase__divider" aria-hidden="true" />

        {/* Ledger */}
        <dl className="rcase__facts">
          {activeFacts.map((fact, i) => (
            <div
              key={fact._key}
              className="rcase__fact"
              data-fade
              data-delay={String(i * 0.07)}
            >
              <dt className="rcase__fact-label">{fact.label}</dt>
              <dd className="rcase__fact-value">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="rcase__divider" aria-hidden="true" />

        {/* Closing */}
        {closingLine && (
          <p className="rcase__closing" data-fade>{closingLine}</p>
        )}

      </div>
    </section>
  )
}
