import type { SiteSettings } from '@/types/sanity'

/**
 * Injects JSON-LD structured data for the property listing.
 * Uses LocalBusiness + additional typing for a commercial office space.
 * Renders as a <script type="application/ld+json"> in the <head> (server-side).
 */
export default function JsonLd({ settings }: { settings?: SiteSettings }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://barnangshuset.se'

  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name:        settings?.propertyName ?? 'Barnängshuset',
    description: settings?.metaDescription ??
      'A restored 1917 cotton mill at Nackagatan 4, Södermalm — two floors of calm, focused workspace.',
    url: siteUrl,
    address: {
      '@type':          'PostalAddress',
      streetAddress:    'Nackagatan 4',
      addressLocality:  'Stockholm',
      addressRegion:    'Södermalm',
      postalCode:       '116 40',
      addressCountry:   'SE',
    },
    geo: {
      '@type':    'GeoCoordinates',
      latitude:   settings?.coordinates?.lat ?? 59.3148,
      longitude:  settings?.coordinates?.lng ?? 18.0717,
    },
    ...(settings?.leasingContact?.email ? {
      contactPoint: {
        '@type':       'ContactPoint',
        email:         settings.leasingContact.email,
        telephone:     settings.leasingContact.phone,
        contactType:   'sales',
        availableLanguage: ['English', 'Swedish'],
      },
    } : {}),
    ...(settings?.ogImage?.asset?.url ? {
      image: settings.ogImage.asset.url,
    } : {}),
    openingHoursSpecification: {
      '@type':     'OpeningHoursSpecification',
      dayOfWeek:   ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens:       '08:00',
      closes:      '18:00',
    },
    currenciesAccepted: 'SEK',
    priceRange:         '$$',
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is server-generated, not user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
