import { createClient } from 'next-sanity'
import imageUrlBuilder  from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

// ─── Client ──────────────────────────────────────────────────────────────────

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  // Token only needed for draft previews — set SANITY_API_READ_TOKEN in .env.local
  token: process.env.SANITY_API_READ_TOKEN,
})

// ─── Image URL builder ────────────────────────────────────────────────────────

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

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

/** Home page — sections with all references dereferenced */
export const HOME_PAGE_QUERY = /* groq */ `
  *[_type == "page" && _id == "homePage"][0] {
    sections[] {
      _type,
      _key,

      // heroSection
      _type == "heroSection" => {
        mediaType, videoUrl,
        image { ${IMAGE_FIELDS} },
        posterImage { ${IMAGE_FIELDS} },
        tagline, aboutLabel, aboutText, ctaLabel,
        headlineRow1, headlineRow2
      },

      // statementSection
      _type == "statementSection" => {
        statement,
        media { ${IMAGE_FIELDS} },
        ledgerLabel, bodyParagraphs, ctaLabel, ctaUrl
      },

      // figuresSection
      _type == "figuresSection" => { figures },

      // testimonialSection
      _type == "testimonialSection" => {
        eyebrow, quote, authorName, authorRole,
        image { ${IMAGE_FIELDS} },
        projectCard {
          image { ${IMAGE_FIELDS} },
          projectName, projectType, year, url
        }
      },

      // bridgeSection — two-column: ceiling-height stat + architectural drawing
      _type == "bridgeSection" => {
        eyebrow, headline, supportingLine,
        drawing { ${IMAGE_FIELDS} }
      },

      // floorsSection — dereference floor documents
      _type == "floorsSection" => {
        heading, label,
        floors[]-> {
          _id, label, status, areaSqm, ceilingHeightM,
          capacity, orientation, features, sortOrder,
          planImage { ${IMAGE_FIELDS} }
        }
      },

      // neighbourhoodSection — dereference poi documents
      _type == "neighbourhoodSection" => {
        heading, label, supportingLine,
        pois[]-> {
          _id, name, description, category,
          walkingMinutes, lat, lng, sortOrder
        }
      },

      // rationalCaseSection — procurement / ESG block
      _type == "rationalCaseSection" => {
        orientLine, eyebrow, headline,
        facts[] { _key, label, value },
        closingLine
      },

      // journalSection (posts fetched separately via LATEST_JOURNAL_QUERY)
      _type == "journalSection" => {
        heading, subheading, allPostsLabel
      },

      // viewingSection
      _type == "viewingSection" => {
        heading, bodyText, ctaLabel, ctaType, ctaUrl
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

export async function getSiteSettings() {
  return client.fetch(SITE_SETTINGS_QUERY, {}, { next: { tags: ['siteSettings'] } })
}

export async function getHomePage() {
  return client.fetch(HOME_PAGE_QUERY, {}, { next: { tags: ['homePage'] } })
}

export async function getLatestJournalPosts() {
  return client.fetch(LATEST_JOURNAL_QUERY, {}, { next: { tags: ['journalPost'] } })
}

export async function getFloorAvailability() {
  return client.fetch(FLOOR_AVAILABILITY_QUERY, {}, { next: { revalidate: 60 } })
}
