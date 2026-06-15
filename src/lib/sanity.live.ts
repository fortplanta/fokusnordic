import { defineLive } from 'next-sanity/live'
import { client } from './sanity.client'

/**
 * Live content for the Presentation tool.
 *
 * sanityFetch — drop-in replacement for client.fetch on the server. Outside
 * draft mode it serves published content with live revalidation; inside the
 * Studio's preview pane (draft mode on) it streams draft changes in real time.
 *
 * SanityLive — mounted once in the root layout; opens the event stream.
 *
 * Requires SANITY_API_READ_TOKEN (a *Viewer*-level token) in .env.local for
 * dev and in the Netlify environment for production. Never commit it.
 */

const token = process.env.SANITY_API_READ_TOKEN

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    // Live Content API requires the vX api version
    apiVersion: 'vX',
    // Draft mode must never go through the CDN — CDN only serves published
    // content and will silently ignore perspective:'drafts'.
    useCdn: false,
    // Stega embeds invisible edit-source metadata in strings so the
    // Presentation tool can map click → field. Only active in draft mode.
    stega: { studioUrl: '/studio' },
  }),
  serverToken: token,
  // Exposed to the browser ONLY while draft mode is active inside the
  // Presentation iframe — must be a read-only Viewer token.
  browserToken: token,
})
