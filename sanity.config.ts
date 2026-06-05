import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
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
