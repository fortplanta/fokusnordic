import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { StatementSection as T } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import { cleanHeadingTag } from '@/lib/stega'
import { stegaClean } from '@sanity/client/stega'

// Portable text component map — maps Sanity block types to HTML elements
const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p>{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em>{children}</em>
    ),
  },
}

// Shown only when no bodyParagraphs have been set in Sanity.
// Replace via Studio: Home Page → statementSection → Body paragraphs.
const FALLBACK_BODY = (
  <>
    <p>
      Built in <strong>1917</strong> as a cotton mill, Barnängshuset has been
      carefully restored into two floors of calm, light-filled workspace. The
      building retains its original character —{' '}
      <strong>4.9m ceilings</strong>, exposed brick, wide-plank timber floors —
      while meeting contemporary standards for energy performance and comfort.
    </p>
    <p>
      Eight minutes on foot from Slussen. The kind of address that lets your
      team walk to Fotografiska on a Thursday and still be deep in work by ten.
    </p>
  </>
)

export default function StatementSection({ section }: { section: T }) {
  const {
    statement       = 'The room you work in changes the work you do.',
    headingLevel,
    colorTheme,
    media,
    enableParallax,
    ledgerLabel     = 'The building',
    bodyParagraphs,
    ctaLabel        = 'Read the full story',
    ctaUrl          = '/about',
  } = section

  // Semantic tag only — visual size stays on the CSS type scale
  const Heading = cleanHeadingTag(headingLevel)
  const parallax = stegaClean(enableParallax) === true

  const imgSrc = media?.asset?.url
    ? urlFor(media).width(800).url()
    : '/assets/img-editorial.jpg'

  const hasBody = Array.isArray(bodyParagraphs) && bodyParagraphs.length > 0

  return (
    <section
      className="intro"
      id="building"
      aria-label="Introduction"
      data-section-theme={colorTheme ?? 'light'}
    >
      <div className="container">
        <div className="intro__grid">
          {/* Statement headline */}
          <div className="intro__statement">
            <Heading>{statement}</Heading>
          </div>

          {/* Offset parallax image — clip-wipe on scroll, parallax in PageAnimations */}
          <div className="intro__media reveal-img" {...(parallax ? { 'data-parallax': '' } : {})}>
            <Image
              src={imgSrc}
              alt="Barnängshuset interior"
              fill
              sizes="(max-width: 900px) 50vw, 25vw"
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Hairline rule */}
          <div className="intro__rule" aria-hidden="true" />

          {/* Body ledger */}
          <div className="intro__ledger">
            <p className="intro__label" data-fade>{ledgerLabel}</p>
            <div className="intro__body" data-fade data-delay="0.1">
              {hasBody
                ? <PortableText value={bodyParagraphs as any} components={ptComponents} />
                : FALLBACK_BODY
              }
            </div>
            <div className="intro__cta" data-fade data-delay="0.18">
              <a href={ctaUrl}>
                {ctaLabel}&nbsp;<span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
