import Image from 'next/image'
import type { HeroSection as T } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import { cleanHeadingTag } from '@/lib/stega'

export default function HeroSection({ section }: { section: T }) {
  const {
    headingLevel,
    colorTheme,
    mediaType = 'image',
    image,
    videoUrl,
    posterImage,
    tagline      = 'Södermalm, Stockholm',
    aboutLabel   = 'About the building',
    aboutText    = 'Some buildings are designed to impress visitors. Barnängshuset was built in 1917 for people who were too busy making things to care about that. It still is.',
    ctaLabel     = 'View available spaces',
    headlineRow1 = 'A WORLD AWAY',
    headlineRow2 = 'FROM THE NOISE',
  } = section
  const Tag = cleanHeadingTag(headingLevel, 'h1')

  const heroImgSrc = image?.asset?.url
    ? urlFor(image).width(2400).url()
    : '/assets/img-hero.jpg'

  const posterSrc = posterImage?.asset?.url
    ? urlFor(posterImage).width(2400).url()
    : '/assets/img-hero.jpg'

  return (
    <section className="hero" aria-label="Hero" data-section-theme={colorTheme ?? 'dark'}>
      {/* Media */}
      <div className="hero__media" aria-hidden="true">
        {mediaType === 'video' && videoUrl ? (
          <video
            src={videoUrl}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : (
          <Image
            src={heroImgSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', opacity: 0.62 }}
          />
        )}
      </div>

      <div className="hero__inner">
        {/* Top grid */}
        <div className="hero__top-wrap">
          <div className="container">
            <div className="hero__top">
              <div className="hero__rule" aria-hidden="true" />
              <p className="hero__tag">{tagline}</p>
              <div className="hero__about">
                <p className="lbl">{aboutLabel}</p>
                <p>{aboutText}</p>
                <div className="hero__about-secondary">
                  <a href="#spaces">
                    Spaces &amp; specifications&nbsp;<span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>
              <div className="hero__link">
                <a href="#spaces">
                  {ctaLabel}&nbsp;<span className="arr" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Giant headline anchored to bottom */}
        <Tag className="hero__h1 container">
          <span className="row">
            <span>{headlineRow1}</span>
          </span>
          <span className="row">
            <span className="push">{headlineRow2}</span>
          </span>
        </Tag>
      </div>

      <span className="hero__cue" aria-hidden="true">Scroll</span>
    </section>
  )
}
