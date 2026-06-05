import Image from 'next/image'
import type { TestimonialSection as T } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'

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

  const cardImgSrc = projectCard?.image?.asset?.url
    ? urlFor(projectCard.image).width(800).url()
    : '/assets/img-moodboard.png'

  return (
    <section className="testi" aria-label="Testimonial">
      <div className="container">
        <p className="testi__eyebrow">{eyebrow}</p>
        <div className="testi__grid">
          {/* Left — quote */}
          <div>
            <div className="testi__img reveal-img">
              <Image
                src={imgSrc}
                alt="Building interior"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            {quote && (
              <blockquote className="testi__quote">
                <p>&ldquo;{quote}&rdquo;</p>
                {(authorName || authorRole) && (
                  <footer className="testi__owner">
                    {authorName && <span className="nm">{authorName}</span>}
                    {authorRole && <span className="role">{authorRole}</span>}
                  </footer>
                )}
              </blockquote>
            )}
          </div>

          {/* Right — project card (hover reveal) */}
          {projectCard && (
            <a
              className="testi__aside"
              href={projectCard.url ?? '#spaces'}
              aria-label={`View ${projectCard.projectName ?? 'spaces'}`}
            >
              <div className="testi__card">
                <Image
                  className="base"
                  src={cardImgSrc}
                  alt={projectCard.projectName ?? 'Tenant space'}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="testi__meta">
                <div className="left">
                  {projectCard.year && (
                    <span className="yr">{projectCard.year}</span>
                  )}
                  {projectCard.projectName && (
                    <span className="proj">{projectCard.projectName}</span>
                  )}
                </div>
                <span className="cta">
                  View spaces&nbsp;<span aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
