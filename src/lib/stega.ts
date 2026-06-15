import { stegaClean } from '@sanity/client/stega'
import type { HeadingLevel } from '@/types/sanity'

/**
 * Stega encodes string values returned by sanityFetch to embed click-to-edit
 * metadata for the Presentation tool. That's fine for display strings, but
 * dangerous when a value is used as a JSX tag — React rejects any tag name
 * that isn't clean ASCII (e.g. 'h2⁠…' throws "Invalid tag: h2").
 *
 * Call this before using a CMS string as a dynamic HTML element tag.
 */
export function cleanHeadingTag(
  level?: HeadingLevel | null,
  fallback: HeadingLevel = 'h2',
): 'h1' | 'h2' | 'h3' | 'h4' {
  const clean = stegaClean(level) as HeadingLevel | undefined | null
  if (clean === 'h1' || clean === 'h2' || clean === 'h3' || clean === 'h4') return clean
  return fallback
}
