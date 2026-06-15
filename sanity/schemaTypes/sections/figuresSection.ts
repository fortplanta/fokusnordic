import { defineField, defineType } from 'sanity'
import { headingLevelField, colorThemeField } from '../fields/sectionMeta'

// The five key-figure numbers band
export default defineType({
  name: 'figuresSection',
  title: 'Key Figures',
  type: 'object',
  fields: [
    headingLevelField('h2'),
    colorThemeField('light'),
    defineField({
      name: 'figures',
      title: 'Figures',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value',  type: 'string', description: 'E.g. "4.9m" or "1917 / BREEAM"' }),
            defineField({ name: 'label', title: 'Label',  type: 'string', description: 'E.g. "Ceiling height"' }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
      initialValue: [
        { _type: 'object', value: '4.9m',          label: 'Ceiling height' },
        { _type: 'object', value: '2',              label: 'Floors' },
        { _type: 'object', value: '300m²',          label: 'Total area' },
        { _type: 'object', value: '8 min',          label: 'To Slussen' },
        { _type: 'object', value: '1917 / BREEAM',  label: 'Built / Certified' },
      ],
      validation: (r) => r.min(1).max(8),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Key Figures' }),
  },
})
