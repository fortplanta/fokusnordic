import { defineField, defineType } from 'sanity'
import { headingLevelField, colorThemeField } from '../fields/sectionMeta'

export default defineType({
  name: 'neighbourhoodDetailsSection',
  title: 'Neighbourhood Details',
  type: 'object',
  description: 'Two-column layout: intro text + CTA on the left, categorised place listings on the right.',
  fields: [
    headingLevelField('h2'),
    colorThemeField('light'),
    defineField({
      name: 'title',
      title: 'Section heading',
      type: 'string',
      description: 'Optional section heading.',
    }),
    defineField({
      name: 'introText',
      title: 'Intro text',
      type: 'text',
      rows: 5,
      description: 'Left-column body copy — sets the tone for the neighbourhood.',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA label',
      type: 'string',
      description: 'e.g. "See our work" or "Learn more"',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA URL',
      type: 'url',
      hidden: ({ parent }) => !parent?.ctaText,
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description: 'Each category appears as a labelled group in the right column.',
      of: [
        {
          type: 'object',
          name: 'neighbourhoodCategory',
          title: 'Category',
          fields: [
            defineField({
              name: 'categoryName',
              title: 'Category name',
              type: 'string',
              description: 'e.g. "TRANSIT", "CULTURE", "FOOD"',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'neighbourhoodItem',
                  title: 'Item',
                  fields: [
                    defineField({
                      name: 'itemName',
                      title: 'Name',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'itemDetail',
                      title: 'Detail',
                      type: 'string',
                      description: 'Supporting info — time, distance, short description, etc.',
                    }),
                  ],
                  preview: {
                    select: { title: 'itemName', subtitle: 'itemDetail' },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'categoryName' },
            prepare({ title }) {
              return { title: title ?? 'Category' }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { subtitle: 'title' },
    prepare({ subtitle }) {
      return { title: 'Neighbourhood Details', subtitle: subtitle ?? '' }
    },
  },
})
