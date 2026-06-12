import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/lib/sanity'

/**
 * Entry point the Presentation tool calls to switch the preview iframe into
 * Next.js draft mode. The URL is signed by @sanity/preview-url-secret, so it
 * can't be used to leak drafts outside the Studio.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
})
