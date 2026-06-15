import type { NeighbourhoodDetailsSection as T } from '@/types/sanity'
import { cleanHeadingTag } from '@/lib/stega'

export default function NeighbourhoodDetailsSection({ section }: { section: T }) {
  const {
    headingLevel,
    colorTheme,
    title,
    introText,
    ctaText,
    ctaUrl,
  } = section
  const categories = section.categories ?? []
  const Tag = cleanHeadingTag(headingLevel)

  return (
    <section
      className="nhood-det"
      aria-label="Neighbourhood details"
      data-section-theme={colorTheme ?? 'light'}
    >
      <div className="container">
        {title && <Tag className="nhood-det__heading">{title}</Tag>}

        <div className="nhood-det__grid">

          {/* ── Left: intro text + CTA ── */}
          <div className="nhood-det__intro">
            {introText && (
              <p className="nhood-det__intro-text">{introText}</p>
            )}
            {ctaText && ctaUrl && (
              <a className="nhood-det__cta" href={ctaUrl}>
                {ctaText}&nbsp;<span aria-hidden="true">→</span>
              </a>
            )}
          </div>

          {/* ── Right: categorised place listings ── */}
          {categories.length > 0 && (
            <div className="nhood-det__categories">
              {categories.map((cat, i) => (
                <div key={cat._key ?? i} className="nhood-det__category">
                  {i > 0 && <div className="nhood-det__rule" aria-hidden="true" />}
                  <p className="nhood-det__cat-name">{cat.categoryName}</p>
                  {cat.items && cat.items.length > 0 && (
                    <ul className="nhood-det__items">
                      {cat.items.map((item, j) => (
                        <li key={j} className="nhood-det__item">
                          <span className="nhood-det__item-name">{item.itemName}</span>
                          {item.itemDetail && (
                            <span className="nhood-det__item-detail">{item.itemDetail}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
