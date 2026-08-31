import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
} from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'wvgj6m8r'
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  name:    'barnangshuset',
  title:   'Barnängshuset Studio',
  basePath: '/studio',
  projectId,
  dataset,

  plugins: [
    // The document editor is the everyday entry point. Keep Presentation as
    // the secondary tool for previewing and locating fields visually.
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
          ]),
    }),

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
          siteSettings: defineLocations({
            select: { name: 'propertyName' },
            resolve: () => ({
              locations: [{ title: 'Home', href: '/' }],
            }),
          }),
        },
      },
    }),

    visionTool(),
  ],

  schema: { types: schemaTypes },
})
