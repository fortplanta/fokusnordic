import { defineField, defineType } from 'sanity'

/*
  Singleton home page document — page-builder pattern.
  The sections[] array is reorderable in the Studio; each _type maps to a
  React component via the sections registry (src/lib/sections-registry.ts).
*/
export default defineType({
  name: 'page',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Home',
    }),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      of: [
        { type: 'heroSection' },
        { type: 'statementSection' },
        { type: 'figuresSection' },
        { type: 'testimonialSection' },
        { type: 'bridgeSection' },
        { type: 'floorsSection' },
        { type: 'neighbourhoodSection' },
        { type: 'rationalCaseSection' },
        { type: 'journalSection' },
        { type: 'viewingSection' },
        { type: 'gallerySection' },
        { type: 'neighbourhoodDetailsSection' },
      ],
      options: {
        // Enables drag-to-reorder in Studio
        sortable: true,
      },
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
})
