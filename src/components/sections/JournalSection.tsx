import Image from 'next/image'
import type { JournalSection as T, JournalPost } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'

const PLACEHOLDER_IMAGES = [
  '/assets/img-detail.jpg',
  '/assets/img-lifestyle.png',
  '/assets/img-moodboard.png',
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-SE', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}

export default function JournalSection({
  section,
  posts,
}: {
  section: T
  posts: JournalPost[]
}) {
  const {
    headingLevel,
    colorTheme,
    heading       = 'A working building, with a life worth following.',
    subheading    = 'From the building',
    allPostsLabel = 'View all',
  } = section
  const Tag = (headingLevel ?? 'h2') as 'h1' | 'h2' | 'h3' | 'h4'

  return (
    <section className="journal" id="journal" aria-label="Journal" data-section-theme={colorTheme ?? 'light'}>
      <div className="container">
        <div className="journal__head">
          <div className="journal__statement">
            <Tag>{heading}</Tag>
          </div>
          <p className="journal__sub">{subheading}</p>
          <div className="journal__all">
            <a href="/journal">
              {allPostsLabel}&nbsp;<span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="journal__rule" aria-hidden="true" />

        <div className="journal__grid">
          {posts.map((post, i) => {
            const imgSrc = post.coverImage?.asset?.url
              ? urlFor(post.coverImage).width(900).url()
              : PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]

            return (
              <article key={post._id} className="jcard">
                <a href={`/journal/${post.slug.current}`} aria-label={post.title}>
                  <div className="jcard__img">
                    <Image
                      src={imgSrc}
                      alt={post.title}
                      fill
                      sizes="(max-width: 760px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </a>
                <div className="jcard__meta">
                  {post.category && (
                    <span className="jcard__cat">{post.category}</span>
                  )}
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
                <h3 className="jcard__title">
                  <a href={`/journal/${post.slug.current}`}>{post.title}</a>
                </h3>
                {post.excerpt && (
                  <p className="jcard__excerpt">{post.excerpt}</p>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
