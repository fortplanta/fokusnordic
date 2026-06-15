import Image from 'next/image'
import type { BridgeSection as T } from '@/types/sanity'
import { cleanHeadingTag } from '@/lib/stega'

export default function BridgeSection({ section }: { section: T }) {
  const {
    headingLevel,
    colorTheme,
    eyebrow,
    headline      = 'Four point nine / meters',
    supportingLine = 'Not a specification. A condition for the kind of work that needs room to happen.',
    drawing,
  } = section
  const Tag = cleanHeadingTag(headingLevel)

  // Split on ' / ' for an explicit two-line display.
  // Editors can move the break by repositioning the ' / ' separator.
  const lines = headline.split(' / ')

  return (
    <section className="bridge" aria-label="Key statistic" data-section-theme={colorTheme ?? 'light'}>
      <div className="container">
        <div className="bridge__grid">

          {/* ── Left: text column ── */}
          <div className="bridge__text">
            <div className="bridge__top">
              {eyebrow && (
                <p className="bridge__eyebrow" data-fade data-delay="0">{eyebrow}</p>
              )}
              <Tag className="bridge__headline">
                {lines.map((line, i) => (
                  <span key={i} className="bridge__headline-line">
                    {i === 0 ? line : `/ ${line}`}
                  </span>
                ))}
              </Tag>
            </div>
            {supportingLine && (
              <p className="bridge__support">{supportingLine}</p>
            )}
          </div>

          {/* ── Right: architectural drawing ── */}
          <div className="bridge__drawing" data-fade data-delay="0.12">
            {drawing?.asset ? (
              <div className="bridge__img-wrap">
                <Image
                  src={drawing.asset.url}
                  alt={drawing.alt ?? 'Architectural cross-section of Barnängshuset'}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: 'contain', objectPosition: 'center right' }}
                />
              </div>
            ) : (
              <div
                className="bridge__img-placeholder"
                aria-label="Architectural drawing — upload in Sanity Studio"
              />
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
