import { createClient } from 'next-sanity'
import imageUrlBuilder  from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

// ─── Client ──────────────────────────────────────────────────────────────────
// Lives in its own module so both sanity.ts (queries) and sanity.live.ts
// (Presentation live preview) can import it without a circular dependency.

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
