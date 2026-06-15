import { defineField, defineType } from 'sanity'
import { headingLevelField, colorThemeField } from '../fields/sectionMeta'

export default defineType({
  name: 'floorsSection',
  title: 'Floor Plan',
  type: 'object',
  fields: [
    headingLevelField('h2'),
    colorThemeField('light'),
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'The spaces',
    }),
    defineField({
      name: 'label',
      title: 'Eyebrow label',
      type: 'string',
      initialValue: 'Floor plan',
    }),
    defineField({
      name: 'floors',
      title: 'Floors / Units',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'floor' }] }],
      description: 'Reference floor documents here. Order determines display order in the plan.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Floor Plan' }),
  },
})
