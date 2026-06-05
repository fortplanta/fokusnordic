import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'neighbourhoodSection',
  title: 'Neighbourhood',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'The neighbourhood',
    }),
    defineField({
      name: 'label',
      title: 'Eyebrow label',
      type: 'string',
      initialValue: 'Södermalm',
    }),
    defineField({
      name: 'pois',
      title: 'Points of interest',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'poi' }] }],
      description: 'Each POI feeds both the list and the Maptiler map markers.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Neighbourhood' }),
  },
})
