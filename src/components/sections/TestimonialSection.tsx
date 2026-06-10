import Image from 'next/image'
import type { TestimonialSection as T } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'

// Suppresses known-placeholder values so they never render in the live layout.
// Real content must replace these before launch (see CONTENT-CHECKLIST.md).
const isPlaceholder = (s?: string | null) =>
  !s || s.trim() === '' || /placeholder/i.test(s)

export default function TestimonialSection({ section }: { section: T }) {
  const {
    eyebrow    = 'From our tenants',
    quote,
    authorName,
    authorRole,
    image,
    projectCard,
  } = section

  const imgSrc = image?.asset?.url
    ? urlFor(image).width(1200).url()
    : '/assets/img-street.jpg'

  // The right-column card is a structural element that always renders.
  // When projectCard has a real image use it; otherwise use the editorial fallback.
  const cardImgSrc = projectCard?.image?.asset?.url
    ? urlFor(projectCard.image).width(800).url()
    : '/assets/img-moodboard.png'

  const cardHref = projectCard?.url ?? '#spaces'
  const cardLabel = projectCard?.projectName ?? 'The spaces'

  // Gate attribution on real, non-placeholder content
  const showQuote       = !isPlaceholder(quote)
  const showAuthorName  = !isPlaceholder(authorName)
  const showAuthorRole  = !isPlaceholder(authorRole)
  const showAttribution = showAuthorName || showAuthorRole

  return (
    <section className="testi" aria-label="Testimonial">
      <div className="container">
        <p className="testi__eyebrow" data-fade>{eyebrow}</p>

        <div className="testi__grid">

          {/* ── Left column: image → quote → attribution ─────────────────── */}
          <div className="testi__left">
            <div className="testi__img reveal-img">
              <Image
                src={imgSrc}
                alt="Barnängshuset interior"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            {showQuote && (
              <blockquote className="testi__quote" data-fade>
                <p>&ldquo;{quote}&rdquo;</p>
                {showAttribution && (
                  <footer className="testi__owner">
                    {showAuthorName && (
                      <span className="nm">{authorName}</span>
                    )}
                    {showAuthorRole && (
                      <span className="role">{authorRole}</span>
                    )}
                  </footer>
                )}
              </blockquote>
            )}
          </div>

          {/* ── Right column: portrait card — always structural ───────────── */}
          <a
            className="testi__aside"
            href={cardHref}
            aria-label={`View ${cardLabel}`}
          >
            <div className="testi__card">
              <Image
                src={cardImgSrc}
                alt={cardLabel}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              {/* Gradient + cover-label hover reveal */}
              <div className="testi__card-overlay" aria-hidden="true">
                <span className="testi__card-cover-label">
                  View the spaces&nbsp;→
                </span>
              </div>
            </div>

            <div className="testi__meta">
              <div className="left">
                {projectCard?.year && (
                  <span className="yr">{projectCard.year}</span>
                )}
                {!isPlaceholder(projectCard?.projectName) && (
                  <span className="proj">{projectCard!.projectName}</span>
                )}
              </div>
              <span className="cta" aria-hidden="true">
                View spaces&nbsp;→
              </span>
            </div>
          </a>

        </div>
      </div>
    </section>
  )
}
