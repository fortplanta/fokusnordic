import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
} from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  name:    'barnangshuset',
  title:   'Barnängshuset Studio',
  basePath: '/studio',
  projectId,
  dataset,

  plugins: [
    // Live preview — split view: document editor left, running site right.
    // The Studio is embedded in the Next.js app, so the preview origin is the
    // same origin; /api/draft-mode/enable lets the preview iframe see drafts.
    presentationTool({
      previewUrl: {
        previewMode: { enable: '/api/draft-mode/enable' },
      },
      resolve: {
        // Which document "owns" a given preview route
        mainDocuments: defineDocuments([
          { route: '/', filter: `_type == "page" && _id == "homePage"` },
        ]),
        // Where to send the preview when a document of this type is opened.
        // Section anchors scroll the preview to the relevant block instead of
        // the top of the page.
        locations: {
          page: defineLocations({
            select: { title: 'title' },
            resolve: () => ({
              locations: [{ title: 'Home', href: '/' }],
            }),
          }),
          floor: defineLocations({
            select: { label: 'label' },
            resolve: (doc) => ({
              locations: [
                { title: `Floor plan — ${doc?.label ?? 'unit'}`, href: '/#spaces' },
              ],
            }),
          }),
          poi: defineLocations({
            select: { name: 'name' },
            resolve: (doc) => ({
              locations: [
                { title: `Neighbourhood — ${doc?.name ?? 'POI'}`, href: '/#neighbourhood' },
              ],
            }),
          }),
          journalPost: defineLocations({
            select: { title: 'title' },
            resolve: (doc) => ({
              locations: [
                { title: `Journal — ${doc?.title ?? 'post'}`, href: '/#journal' },
              ],
            }),
          }),
          siteSettings: defineLocations({
            select: { name: 'propertyName' },
            resolve: () => ({
              locations: [{ title: 'Home', href: '/' }],
            }),
          }),
        },
      },
    }),

    structureTool({
      structure: (S: any) =>
        S.list()
          .title('Content')
          .items([
            // Singletons — no list view, open directly
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(
                S.document()
                  .schemaType('page')
                  .documentId('homePage')
              ),
            S.divider(),
            // Collections
            S.documentTypeListItem('floor').title('Floors / Units'),
            S.documentTypeListItem('journalPost').title('Journal'),
            S.documentTypeListItem('poi').title('Neighbourhood POIs'),
          ]),
    }),
    visionTool(),
  ],

  schema: { types: schemaTypes },
})
