import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

export const revalidate = 3600 // Rebuild the sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://barnangshuset.se'

  // Fetch published journal slugs
  const posts = await client.fetch<Array<{ slug: { current: string }; date: string }>>(
    `*[_type == "journalPost" && defined(slug.current)] | order(date desc) { slug, date }`,
    {},
    { next: { revalidate: 3600 } }
  )

  return [
    {
      url:              base,
      lastModified:     new Date(),
      changeFrequency:  'daily',
      priority:         1,
    },
    ...posts.map((post) => ({
      url:             `${base}/journal/${post.slug.current}`,
      lastModified:    new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority:        0.6,
    })),
  ]
}
