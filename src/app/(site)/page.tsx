import type { Metadata } from 'next'
import BarnangshusetSite from '@/components/site/BarnangshusetSite'
import JsonLd from '@/components/seo/JsonLd'
import { contactFallback, homeFallback } from '@/content/homeFallback'
import { getCurrentHomePage, getSiteSettings } from '@/lib/sanity'
import type { SiteSettings } from '@/types/sanity'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings() as SiteSettings | null
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://barnangshuset.se'
  const title = settings?.metaTitle ?? 'Barnängshuset — Office Space in Södermalm'
  const description = settings?.metaDescription ?? 'Up to 9,762 m² of office space at Nackagatan 4, Södermalm.'
  const image = settings?.ogImage?.asset?.url

  return {
    title,
    description,
    alternates: { canonical: siteUrl },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: settings?.propertyName ?? 'Barnängshuset',
      locale: 'en_SE',
      type: 'website',
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, ...(image ? { images: [image] } : {}) },
  }
}

export default async function HomePage() {
  const [page, settings] = await Promise.all([getCurrentHomePage(), getSiteSettings()])
  const content = page?.hero?.heading ? page : homeFallback
  const cmsContact = settings?.leasingContact
  const contact = cmsContact?.email && cmsContact?.name
    ? { ...cmsContact, email: cmsContact.email }
    : contactFallback

  return (
    <>
      <JsonLd settings={settings ?? undefined} />
      <BarnangshusetSite content={content} contact={contact} identity={settings ?? undefined} />
    </>
  )
}
