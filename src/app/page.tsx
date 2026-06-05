import type { Metadata } from 'next'
import { getSiteSettings, getHomePage, getLatestJournalPosts, getFloorAvailability } from '@/lib/sanity'
import { SectionRenderer } from '@/lib/sections-registry'
import Nav             from '@/components/layout/Nav'
import Footer          from '@/components/layout/Footer'
import AvailabilityBar from '@/components/layout/AvailabilityBar'
import JsonLd          from '@/components/seo/JsonLd'
import type { PageSection, JournalPost, SiteSettings } from '@/types/sanity'

export const revalidate = 60 // ISR — revalidate every 60 seconds

// ─── Per-page metadata (overrides layout defaults) ────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings() as SiteSettings | null
  if (!settings) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://barnangshuset.se'
  const title   = settings.metaTitle       ?? 'Barnängshuset — Office Space in Södermalm'
  const desc    = settings.metaDescription ?? 'A restored 1917 cotton mill at Nackagatan 4, Södermalm. Two floors of calm, focused workspace.'
  const ogImg   = settings.ogImage?.asset?.url

  return {
    title,
    description: desc,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title,
      description: desc,
      url:         siteUrl,
      siteName:    settings.propertyName ?? 'Barnängshuset',
      locale:      'en_SE',
      type:        'website',
      ...(ogImg ? { images: [{ url: ogImg, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description: desc,
      ...(ogImg ? { images: [ogImg] } : {}),
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [settings, page, posts, availability] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getLatestJournalPosts(),
    getFloorAvailability(),
  ]) as [SiteSettings, { sections: PageSection[] } | null, JournalPost[], { available: number }]

  const sections = page?.sections ?? []
  const contact  = settings?.leasingContact

  return (
    <>
      {/* Structured data — injected into <head> by Next.js */}
      <JsonLd settings={settings} />

      <Nav propertyName={settings?.propertyName} />

      <main id="main">
        {sections.map((section) => (
          <SectionRenderer
            key={section._key}
            section={section}
            posts={posts}
            contact={contact}
          />
        ))}
      </main>

      <Footer settings={settings} />

      <AvailabilityBar
        available={availability?.available ?? 0}
        contactEmail={contact?.email}
      />
    </>
  )
}
