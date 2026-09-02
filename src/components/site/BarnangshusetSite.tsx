import Image from 'next/image'
import type { FloorPlanSection } from '@/types/sanity'
import FloorPlans from './FloorPlans'
import SiteHeader from './SiteHeader'

type CmsImage = { alt?: string; asset?: { url?: string } }
type Pair = { _key?: string; label: string; value: string }
type Nearby = { _key?: string; name: string; detail: string }
type GalleryItem = { _key?: string; caption: string; layout?: string; image?: CmsImage }
type Content = {
  hero: { heading: string; body: string; ctaLabel: string; image?: CmsImage }
  building: { kicker: string; heading: string; body: string; image?: CmsImage }
  volume: {
    kicker: string
    heading: string
    body?: string
    featureStatements: Array<{ _key?: string; heading: string; body: string }>
    specificationGroups: Array<{ _key?: string; title: string; facts: Pair[] }>
  }
  gallery: { kicker: string; heading: string; body: string; items: GalleryItem[] }
  opportunity: { kicker: string; heading: string; body: string; ctaLabel: string; facts: Pair[]; image?: CmsImage }
  floorPlans?: FloorPlanSection
  materials: { kicker: string; heading: string; body: string; mainImage?: CmsImage; detailImage?: CmsImage }
  place: { kicker: string; heading: string; body: string; nearby: Nearby[]; image?: CmsImage }
  viewing: { kicker: string; heading: string; body: string; ctaLabel: string; image?: CmsImage }
}

type Contact = { name: string; role?: string; email: string; phone?: string; photo?: CmsImage }
type Identity = { propertyName?: string; address?: string }

const fallbacks = {
  hero: '/assets/img-hero.jpg', building: '/assets/img-editorial.jpg', volume: '/assets/img-lifestyle.png',
  stair: '/assets/img-detail.jpg', opportunity: '/assets/img-hero.jpg', material: '/assets/img-moodboard.png',
  detail: '/assets/img-detail.jpg', place: '/assets/img-street.jpg', viewing: '/assets/img-portrait.jpg',
}

function Media({ image, fallback, className = '', priority = false, sizes = '100vw' }: { image?: CmsImage; fallback: string; className?: string; priority?: boolean; sizes?: string }) {
  const src = image?.asset?.url || fallback
  return <figure className={`site-media ${className}`}><Image src={src} alt={image?.alt || ''} fill priority={priority} sizes={sizes} /></figure>
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="text-link" href={href}><span>{children}</span><span aria-hidden="true">↗</span></a>
}

export default function BarnangshusetSite({ content, contact, identity }: { content: Content; contact: Contact; identity?: Identity }) {
  const mailto = `mailto:${contact.email}?subject=Viewing%20at%20Barn%C3%A4ngshuset`
  return <div className="bh-site">
    <SiteHeader />
    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <Media image={content.hero.image} fallback={fallbacks.hero} className="hero-media" priority />
        <div className="hero-heading" data-motion-hero><h1 id="hero-title">{content.hero.heading}</h1></div>
        <div className="hero-summary" data-motion-hero><p className="lede">{content.hero.body}</p><TextLink href="#spaces">{content.hero.ctaLabel}</TextLink></div>
      </section>
      <section className="origin grid-section" id="building">
        <Media image={content.building.image} fallback={fallbacks.building} className="origin-archive motion-media" sizes="58vw" />
        <div className="origin-copy" data-motion-copy><p className="kicker">{content.building.kicker}</p><h2>{content.building.heading}</h2><p>{content.building.body}</p></div>
      </section>
      <section className="volume grid-section" aria-labelledby="volume-title">
        <header className="volume-title" data-motion-copy>
          <p className="kicker">{content.volume.kicker}</p>
          <h2 id="volume-title">{content.volume.heading}</h2>
        </header>
        <div className="volume-left-column">
          {content.volume.body && <p className="volume-introduction" data-motion-copy>{content.volume.body}</p>}
          <div className="volume-accordion" aria-label="Building conditions">
            {(content.volume.featureStatements || []).map((item, index) => (
              <details className="volume-disclosure" name="volume-condition" open={index === 0} key={item._key || item.heading}>
                <summary>{item.heading}</summary>
                <p>{item.body}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="volume-groups" aria-label="Property specifications">
          {(content.volume.specificationGroups || []).map((group) => (
            <section className="volume-group" key={group._key || group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.facts.map((item) => (
                  <li key={item._key || item.label}>{item.value}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
      <section className="gallery grid-section" id="gallery" aria-labelledby="gallery-title">
        <div className="gallery-stream">{content.gallery.items.map((item,index)=><Media key={item._key || item.caption} image={item.image} fallback={[fallbacks.hero,fallbacks.stair,fallbacks.volume,fallbacks.detail][index%4]} className={`gallery-item gallery-${item.layout || 'wide'}`} sizes="58vw" />)}</div>
        <aside className="gallery-aside" data-motion-copy><p className="kicker">{content.gallery.kicker}</p><h2 id="gallery-title">{content.gallery.heading}</h2><p>{content.gallery.body}</p></aside>
      </section>
      <section className="spaces grid-section" id="spaces" aria-labelledby="spaces-title">
        <div className="spaces-heading" data-motion-copy><p className="kicker">{content.opportunity.kicker}</p><h2 id="spaces-title">{content.opportunity.heading}</h2><p>{content.opportunity.body}</p></div>
        <div className="opportunity-facts"><dl>{content.opportunity.facts.map((fact)=><div key={fact._key || fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl><TextLink href="#viewing">{content.opportunity.ctaLabel}</TextLink></div>
        <Media image={content.opportunity.image} fallback={fallbacks.opportunity} className="opportunity-image motion-media" sizes="100vw" />
      </section>
      {content.floorPlans && <FloorPlans content={content.floorPlans} />}
      <section className="materials grid-section" aria-labelledby="materials-title">
        <div className="materials-copy" data-motion-copy><p className="kicker">{content.materials.kicker}</p><h2 id="materials-title">{content.materials.heading}</h2><p>{content.materials.body}</p></div>
        <Media image={content.materials.mainImage} fallback={fallbacks.material} className="material-board motion-media" sizes="50vw" />
        <Media image={content.materials.detailImage} fallback={fallbacks.detail} className="material-detail" sizes="25vw" />
      </section>
      <section className="place grid-section" id="place">
        <div className="place-copy" data-motion-copy><p className="kicker">{content.place.kicker}</p><h2>{content.place.heading}</h2><p>{content.place.body}</p></div>
        <Media image={content.place.image} fallback={fallbacks.place} className="place-view motion-media" sizes="50vw" />
        <div className="nearby-list">{content.place.nearby.map((item)=><div key={item._key || item.name}><strong>{item.name}</strong><span>{item.detail}</span></div>)}</div>
      </section>
      <section className="viewing grid-section" id="viewing">
        <div className="viewing-copy" data-motion-copy><p className="kicker">{content.viewing.kicker}</p><h2>{content.viewing.heading}</h2></div>
        <div className="contact-copy" data-motion-copy><p>{content.viewing.body}</p><p><strong>{contact.name}</strong><br />{contact.role}<br /><a href={`mailto:${contact.email}`}>{contact.email}</a>{contact.phone && <><br /><a href={`tel:${contact.phone.replace(/\s/g,'')}`}>{contact.phone}</a></>}</p><TextLink href={mailto}>{content.viewing.ctaLabel}</TextLink></div>
        <Media image={content.viewing.image || contact.photo} fallback={fallbacks.viewing} className="contact-portrait motion-media" sizes="20vw" />
      </section>
    </main>
    <footer className="site-footer"><p>{identity?.propertyName || 'Barnängshuset'}<br />{identity?.address || 'Nackagatan 4, 116 40 Stockholm'}</p><p><a href="#building">Building</a><br /><a href="#spaces">Space</a><br /><a href="#place">Address</a></p><a className="back-to-top" href="#top">Back to top ↑</a><a className="footer-mark" href="#top" aria-label="Barnängshuset, back to top"><Image src="/assets/barnangshuset_logo-neg.svg" alt="" width={600} height={391} /></a><p className="footer-legal">© {new Date().getFullYear()} {identity?.propertyName || 'Barnängshuset'} · Privacy</p></footer>
  </div>
}
