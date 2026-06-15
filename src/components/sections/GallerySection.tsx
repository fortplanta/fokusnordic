import Image from 'next/image'
import type { GallerySection as T } from '@/types/sanity'
import { cleanHeadingTag } from '@/lib/stega'

export default function GallerySection({ section }: { section: T }) {
  const {
    headingLevel,
    colorTheme,
    title,
  } = section
  const galleryItems = section.galleryItems ?? []
  const Tag = cleanHeadingTag(headingLevel)

  return (
    <section
      className="gallery"
      aria-label="Gallery"
      data-section-theme={colorTheme ?? 'light'}
    >
      <div className="container">
        {title && (
          <Tag className="gallery__label">{title}</Tag>
        )}

        {galleryItems.length > 0 && (
          <div className="gallery__grid">
            {galleryItems.map((item) => {
              if (item._type === 'galleryItemImage') {
                return (
                  <div
                    key={item._key}
                    className="gallery__item gallery__item--image"
                    data-span={item.span ?? 1}
                  >
                    {item.image?.asset ? (
                      <div className="gallery__img-wrap">
                        <Image
                          src={item.image.asset.url}
                          alt={item.alt ?? ''}
                          fill
                          sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div
                        className="gallery__img-placeholder"
                        aria-label="Image — upload in Sanity Studio"
                      />
                    )}
                  </div>
                )
              }

              if (item._type === 'galleryItemCaption') {
                return (
                  <div key={item._key} className="gallery__item gallery__item--caption">
                    {item.text && <p>{item.text}</p>}
                  </div>
                )
              }

              return null
            })}
          </div>
        )}
      </div>
    </section>
  )
}
