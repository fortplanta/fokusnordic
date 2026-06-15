import { defineField, defineType } from 'sanity'
import { headingLevelField, colorThemeField } from '../fields/sectionMeta'

export default defineType({
  name: 'neighbourhoodSection',
  title: 'Neighbourhood',
  type: 'object',
  fields: [
    headingLevelField('h2'),
    colorThemeField('light'),
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'Södermalm has always been where people come to make things.',
    }),
    defineField({
      name: 'label',
      title: 'Eyebrow label',
      type: 'string',
      initialValue: 'The address',
    }),
    defineField({
      name: 'supportingLine',
      title: 'Supporting line',
      type: 'text',
      rows: 3,
      description: 'One or two sentences below the headline. Shifts the argument from "convenient" to "deliberate".',
      initialValue: 'Not to be seen making them — to actually make them. Barnängshuset sits at the quieter end of that tradition, eight minutes from the centre and a world away from its noise.',
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
