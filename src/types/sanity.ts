// ─── Shared ───────────────────────────────────────────────────────────────────

export type SanityImage = {
  asset?: {
    _id: string
    url: string
    metadata?: {
      lqip?: string
      dimensions?: { width: number; height: number }
    }
  }
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
}

// ─── Documents ────────────────────────────────────────────────────────────────

export type LeasingContact = {
  name: string
  role: string
  email?: string
  phone?: string
  photo?: SanityImage
  calLink?: string
}

export type SiteSettings = {
  propertyName: string
  address?: string
  coordinates?: { lat: number; lng: number }
  logo?: SanityImage
  leasingContact?: LeasingContact
  socialLinks?: Array<{ platform: string; url: string }>
  newsletterWebhook?: string
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  footerInvite?: string
}

export type Floor = {
  _id: string
  label: string
  status: 'available' | 'reserved' | 'leased'
  areaSqm: number
  ceilingHeightM: number
  capacity?: number
  orientation?: string
  planImage?: SanityImage
  features?: string[]
  sortOrder: number
}

export type POI = {
  _id: string
  name: string
  description?: string
  category: string
  walkingMinutes: number
  lat: number
  lng: number
  sortOrder: number
}

export type JournalPost = {
  _id: string
  title: string
  slug: { current: string }
  date: string
  category?: string
  excerpt?: string
  coverImage?: SanityImage
}

// ─── Section types ────────────────────────────────────────────────────────────

export type HeroSection = {
  _type: 'heroSection'
  _key: string
  mediaType?: 'image' | 'video'
  image?: SanityImage
  videoUrl?: string
  posterImage?: SanityImage
  tagline?: string
  aboutLabel?: string
  aboutText?: string
  ctaLabel?: string
  headlineRow1?: string
  headlineRow2?: string
}

export type StatementSection = {
  _type: 'statementSection'
  _key: string
  statement?: string
  media?: SanityImage
  ledgerLabel?: string
  bodyParagraphs?: unknown[]
  ctaLabel?: string
  ctaUrl?: string
}

export type FiguresSection = {
  _type: 'figuresSection'
  _key: string
  figures?: Array<{ value: string; label: string }>
}

export type TestimonialSection = {
  _type: 'testimonialSection'
  _key: string
  eyebrow?: string
  quote?: string
  authorName?: string
  authorRole?: string
  image?: SanityImage
  projectCard?: {
    image?: SanityImage
    projectName?: string
    projectType?: string
    year?: string
    url?: string
  }
}

export type FloorsSection = {
  _type: 'floorsSection'
  _key: string
  heading?: string
  label?: string
  floors?: Floor[]
}

export type NeighbourhoodSection = {
  _type: 'neighbourhoodSection'
  _key: string
  heading?: string
  label?: string
  pois?: POI[]
}

export type JournalSection = {
  _type: 'journalSection'
  _key: string
  heading?: string
  subheading?: string
  allPostsLabel?: string
}

export type ViewingSection = {
  _type: 'viewingSection'
  _key: string
  heading?: string
  bodyText?: string
  ctaLabel?: string
  ctaType?: 'mailto' | 'calendar' | 'url'
  ctaUrl?: string
}

export type PageSection =
  | HeroSection
  | StatementSection
  | FiguresSection
  | TestimonialSection
  | FloorsSection
  | NeighbourhoodSection
  | JournalSection
  | ViewingSection
