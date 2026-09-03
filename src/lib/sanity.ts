// Client + image builder live in sanity.client.ts (avoids a circular import
// with sanity.live.ts); re-exported here so existing imports keep working.
export { client, urlFor } from './sanity.client'

import { sanityFetch } from './sanity.live'
import type { CurrentHomePage, SiteSettings } from '@/types/sanity'

// ─── Reusable image projection ────────────────────────────────────────────────

const IMAGE_FIELDS = /* groq */ `
  asset->{
    _id,
    url,
    metadata { dimensions, lqip }
  },
  hotspot,
  crop,
  alt
`

// ─── GROQ queries ─────────────────────────────────────────────────────────────

/** Site-wide settings (singleton) */
export const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0] {
    propertyName,
    address,
    coordinates,
    logo { ${IMAGE_FIELDS} },
    leasingContact {
      name, role, email, phone, calLink,
      photo { ${IMAGE_FIELDS} }
    },
    socialLinks,
    newsletterWebhook,
    metaTitle,
    metaDescription,
    ogImage { ${IMAGE_FIELDS} },
    footerInvite
  }
`

/** Current editorial home page — every visible text and image is CMS-owned. */
export const CURRENT_HOME_QUERY = /* groq */ `
  *[_type == "page" && _id == "homePage"][0] {
    title,
    hero { heading, body, ctaLabel, image { ${IMAGE_FIELDS} } },
    building { kicker, heading, body, image { ${IMAGE_FIELDS} } },
    volume {
      kicker, heading, body,
      featureStatements[] { _key, heading, body },
      specificationGroups[] { _key, title, facts[] { _key, label, value } }
    },
    gallery {
      kicker, heading, body,
      items[] { _key, caption, layout, image { ${IMAGE_FIELDS} } }
    },
    mosaicGallery {
      kicker, heading,
      items[] { _key, caption, size, side, image { ${IMAGE_FIELDS} } }
    },
    opportunity {
      kicker, heading, body, ctaLabel,
      facts[] { _key, label, value }, image { ${IMAGE_FIELDS} }
    },
    floorPlans {
      kicker, heading, body,
      floors[] {
        _key, label,
        configurations[] {
          _key, title, body, facts[] { _key, label, value },
          planImage { ${IMAGE_FIELDS} }, explodedImage { ${IMAGE_FIELDS} }
        }
      }
    },
    materials {
      kicker, heading, body,
      mainImage { ${IMAGE_FIELDS} }, detailImage { ${IMAGE_FIELDS} }
    },
    place {
      kicker, heading, body, nearby[] { _key, name, detail },
      image { ${IMAGE_FIELDS} }
    },
    areaMap {
      kicker, heading, mapImage { ${IMAGE_FIELDS} },
      buildingMarker {
        alt, x, y, width,
        icon { asset->{ _id, url, originalFilename, mimeType } }
      },
      markers[] { _key, name, detail, category, url, x, y }
    },
    viewing { kicker, heading, body, ctaLabel, image { ${IMAGE_FIELDS} } }
  }
`

/** Home page — sections with all references dereferenced */
export const HOME_PAGE_QUERY = /* groq */ `
  *[_type == "page" && _id == "homePage"][0] {
    sections[] {
      _type,
      _key,

      // heroSection
      _type == "heroSection" => {
        headingLevel, colorTheme,
        mediaType, videoUrl,
        image { ${IMAGE_FIELDS} },
        posterImage { ${IMAGE_FIELDS} },
        tagline, aboutLabel, aboutText, ctaLabel,
        headlineRow1, headlineRow2
      },

      // statementSection
      _type == "statementSection" => {
        statement, headingLevel, colorTheme,
        media { ${IMAGE_FIELDS} },
        enableParallax,
        ledgerLabel, bodyParagraphs, ctaLabel, ctaUrl
      },

      // figuresSection
      _type == "figuresSection" => { headingLevel, colorTheme, figures },

      // testimonialSection
      _type == "testimonialSection" => {
        headingLevel, colorTheme,
        eyebrow, quote, authorName, authorRole, textSize, typographicStyle,
        image { ${IMAGE_FIELDS} },
        projectCard {
          image { ${IMAGE_FIELDS} },
          projectName, projectType, year, url
        }
      },

      // bridgeSection — two-column: ceiling-height stat + architectural drawing
      _type == "bridgeSection" => {
        headingLevel, colorTheme,
        eyebrow, headline, supportingLine,
        drawing { ${IMAGE_FIELDS} }
      },

      // floorsSection — dereference floor documents
      _type == "floorsSection" => {
        headingLevel, colorTheme,
        heading, label,
        floors[]-> {
          _id, label, status, areaSqm, ceilingHeightM,
          capacity, orientation, features, sortOrder,
          planImage { ${IMAGE_FIELDS} }
        }
      },

      // neighbourhoodSection — dereference poi documents
      _type == "neighbourhoodSection" => {
        headingLevel, colorTheme,
        heading, label, supportingLine,
        pois[]-> {
          _id, name, description, category,
          walkingMinutes, lat, lng, sortOrder
        }
      },

      // rationalCaseSection — procurement / ESG block
      _type == "rationalCaseSection" => {
        headingLevel, colorTheme,
        orientLine, eyebrow, headline,
        facts[] { _key, label, value },
        closingLine
      },

      // journalSection (posts fetched separately via LATEST_JOURNAL_QUERY)
      _type == "journalSection" => {
        headingLevel, colorTheme,
        heading, subheading, allPostsLabel
      },

      // viewingSection
      _type == "viewingSection" => {
        headingLevel, colorTheme,
        heading, bodyText, ctaLabel, ctaType, ctaUrl
      },

      // gallerySection — mixed image + caption items
      // Flat projection (no nested conditionals) for Live API compatibility.
      // Non-matching fields return null and are ignored in the component.
      _type == "gallerySection" => {
        headingLevel, colorTheme, title,
        galleryItems[] {
          _type,
          _key,
          image { ${IMAGE_FIELDS} },
          alt,
          span,
          text
        }
      },

      // neighbourhoodDetailsSection — intro + categorised place listings
      _type == "neighbourhoodDetailsSection" => {
        headingLevel, colorTheme, title,
        introText, ctaText, ctaUrl,
        categories[] {
          _key,
          categoryName,
          items[] { itemName, itemDetail }
        }
      },
    }
  }
`

/** Latest 3 journal posts — fetched alongside the home page */
export const LATEST_JOURNAL_QUERY = /* groq */ `
  *[_type == "journalPost"] | order(date desc) [0...3] {
    _id,
    title,
    slug,
    date,
    category,
    excerpt,
    coverImage { ${IMAGE_FIELDS} }
  }
`

/** Live floor availability — used by the sticky bar to get the real count */
export const FLOOR_AVAILABILITY_QUERY = /* groq */ `
  {
    "available": count(*[_type == "floor" && status == "available"]),
    "total":     count(*[_type == "floor"])
  }
`

// ─── Typed fetch helpers ──────────────────────────────────────────────────────
// All page-level reads go through sanityFetch (next-sanity live) so the
// Presentation tool can stream draft changes into the preview in real time.
// Outside draft mode it behaves like a cached, tag-revalidated client.fetch.

export async function getSiteSettings() {
  try {
    const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY })
    return data as SiteSettings | null
  } catch (err) {
    console.error('[sanityFetch] getSiteSettings failed:', err)
    return null
  }
}

export async function getHomePage() {
  try {
    const { data } = await sanityFetch({ query: HOME_PAGE_QUERY })
    return data
  } catch (err) {
    console.error('[sanityFetch] getHomePage failed:', err)
    return null
  }
}

export async function getCurrentHomePage() {
  try {
    const { data } = await sanityFetch({ query: CURRENT_HOME_QUERY })
    return data as CurrentHomePage | null
  } catch (err) {
    console.error('[sanityFetch] getCurrentHomePage failed:', err)
    return null
  }
}

export async function getLatestJournalPosts() {
  try {
    const { data } = await sanityFetch({ query: LATEST_JOURNAL_QUERY })
    return data
  } catch (err) {
    console.error('[sanityFetch] getLatestJournalPosts failed:', err)
    return []
  }
}

export async function getFloorAvailability() {
  try {
    const { data } = await sanityFetch({ query: FLOOR_AVAILABILITY_QUERY })
    return data
  } catch (err) {
    console.error('[sanityFetch] getFloorAvailability failed:', err)
    return { available: 0, total: 0 }
  }
}
