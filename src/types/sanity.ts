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

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'
export type SectionColorTheme = 'light' | 'warm' | 'dark' | 'brand' | 'deep' | 'neutral'

export type HeroSection = {
    _type: 'heroSection'
    _key: string
    headingLevel?: HeadingLevel
    colorTheme?: SectionColorTheme
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
    headingLevel?: HeadingLevel
    colorTheme?: SectionColorTheme
    media?: SanityImage
    enableParallax?: boolean
    ledgerLabel?: string
    bodyParagraphs?: unknown[]
    ctaLabel?: string
    ctaUrl?: string
}

export type FiguresSection = {
    _type: 'figuresSection'
    _key: string
    headingLevel?: HeadingLevel
    colorTheme?: SectionColorTheme
    figures?: Array<{ value: string; label: string }>
}

export type TestimonialSection = {
    _type: 'testimonialSection'
    _key: string
    headingLevel?: HeadingLevel
    colorTheme?: SectionColorTheme
    eyebrow?: string
    quote?: string
    authorName?: string
    authorRole?: string
    textSize?: 'large' | 'medium' | 'small'
    typographicStyle?: 'body-sm' | 'body-md' | 'body-lg' | 'quote' | 'display'
    image?: SanityImage
    projectCard?: {
        image?: SanityImage
        projectName?: string
        projectType?: string
        year?: string
        url?: string
    }
}

export type BridgeSection = {
    _type: 'bridgeSection'
    _key: string
    headingLevel?: HeadingLevel
    colorTheme?: SectionColorTheme
    eyebrow?: string
    headline?: string
    supportingLine?: string
    drawing?: SanityImage
}

export type FloorsSection = {
    _type: 'floorsSection'
    _key: string
    headingLevel?: HeadingLevel
    colorTheme?: SectionColorTheme
    heading?: string
    label?: string
    floors?: Floor[]
}

export type NeighbourhoodSection = {
    _type: 'neighbourhoodSection'
    _key: string
    headingLevel?: HeadingLevel
    colorTheme?: SectionColorTheme
    heading?: string
    label?: string
    supportingLine?: string
    pois?: POI[]
}

export type RationalCaseFact = {
    _key: string
    label?: string
    value?: string
}

export type RationalCaseSection = {
    _type: 'rationalCaseSection'
    _key: string
    headingLevel?: HeadingLevel
    colorTheme?: SectionColorTheme
    orientLine?: string
    eyebrow?: string
    headline?: string
    facts?: RationalCaseFact[]
    closingLine?: string
}

export type JournalSection = {
    _type: 'journalSection'
    _key: string
    headingLevel?: HeadingLevel
    colorTheme?: SectionColorTheme
    heading?: string
    subheading?: string
    allPostsLabel?: string
}

export type ViewingSection = {
    _type: 'viewingSection'
    _key: string
    headingLevel?: HeadingLevel
    colorTheme?: SectionColorTheme
    heading?: string
    bodyText?: string
    ctaLabel?: string
    ctaType?: 'mailto' | 'calendar' | 'url'
    ctaUrl?: string
}

// Flat shape — all fields present on every item, nulled for non-matching type.
// (Nested conditional projections inside arrays are avoided for Live API compat.)
export type GalleryItem = {
    _type: 'galleryItemImage' | 'galleryItemCaption'
    _key: string
    image?: SanityImage
    alt?: string
    span?: 1 | 2 | 3
    text?: string
}

export type GallerySection = {
    _type: 'gallerySection'
    _key: string
    headingLevel?: HeadingLevel
    colorTheme?: SectionColorTheme
    title?: string
    galleryItems?: GalleryItem[]
}

export type NeighbourhoodDetailsItem = {
    itemName: string
    itemDetail?: string
}

export type NeighbourhoodDetailsCategory = {
    _key: string
    categoryName: string
    items?: NeighbourhoodDetailsItem[]
}

export type NeighbourhoodDetailsSection = {
    _type: 'neighbourhoodDetailsSection'
    _key: string
    headingLevel?: HeadingLevel
    colorTheme?: SectionColorTheme
    title?: string
    introText?: string
    ctaText?: string
    ctaUrl?: string
    categories?: NeighbourhoodDetailsCategory[]
}

export type PageSection =
    | HeroSection
    | StatementSection
    | FiguresSection
    | TestimonialSection
    | BridgeSection
    | FloorsSection
    | NeighbourhoodSection
    | RationalCaseSection
    | JournalSection
    | ViewingSection
    | GallerySection
    | NeighbourhoodDetailsSection
