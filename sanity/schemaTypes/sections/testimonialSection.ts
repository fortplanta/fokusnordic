import { defineField, defineType } from 'sanity'
import { headingLevelField, colorThemeField } from '../fields/sectionMeta'

export default defineType({
  name: 'testimonialSection',
  title: 'Testimonial',
  type: 'object',
  fields: [
    headingLevelField('h2'),
    colorThemeField('light'),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow label',
      type: 'string',
      initialValue: 'From our tenants',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      description: 'PLACEHOLDER — must be replaced with a real, attributed tenant quote before launch.',
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
    }),
    defineField({
      name: 'authorRole',
      title: 'Author role / company',
      type: 'string',
    }),
    defineField({
      name: 'textSize',
      title: 'Quote text size',
      type: 'string',
      options: {
        list: [
          { title: 'Large', value: 'large' },
          { title: 'Medium', value: 'medium' },
          { title: 'Small', value: 'small' },
        ],
        layout: 'radio',
      },
      initialValue: 'large',
      description: 'Use Medium or Small for longer quotes that overflow the Large size.',
    }),
    defineField({
      name: 'typographicStyle',
      title: 'Typographic style',
      type: 'string',
      options: {
        list: [
          { title: 'Body — Small',  value: 'body-sm'  },
          { title: 'Body — Regular', value: 'body-md' },
          { title: 'Body — Large',  value: 'body-lg'  },
          { title: 'Quote (Mona Sans light)', value: 'quote' },
          { title: 'Display (serif)', value: 'display' },
        ],
        layout: 'radio',
      },
      initialValue: 'quote',
      description: 'Controls font-family and weight. textSize above still sets the size for Quote and Display styles.',
    }),
    defineField({
      name: 'image',
      title: 'Wide image (left side)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'projectCard',
      title: 'Project card (hover reveal, right side)',
      type: 'object',
      fields: [
        defineField({ name: 'image',       title: 'Card image',    type: 'image', options: { hotspot: true } }),
        defineField({ name: 'projectName', title: 'Project name',  type: 'string' }),
        defineField({ name: 'projectType', title: 'Project type',  type: 'string' }),
        defineField({ name: 'year',        title: 'Year',          type: 'string' }),
        defineField({ name: 'url',         title: 'Link URL',      type: 'string' }),
      ],
    }),
  ],
  preview: {
    select: { subtitle: 'authorName' },
    prepare({ subtitle }) {
      return { title: 'Testimonial', subtitle: subtitle ?? '(no author set)' }
    },
  },
})
