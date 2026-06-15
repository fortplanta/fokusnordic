import { defineField, defineType } from 'sanity'
import { headingLevelField, colorThemeField } from '../fields/sectionMeta'

export default defineType({
  name: 'gallerySection',
  title: 'Gallery',
  type: 'object',
  description: 'A freeform grid of images and text captions. Drag items to control layout order.',
  fields: [
    headingLevelField('h2'),
    colorThemeField('light'),
    defineField({
      name: 'title',
      title: 'Eyebrow label',
      type: 'string',
      description: 'Optional label above the gallery (e.g. "The building").',
    }),
    defineField({
      name: 'galleryItems',
      title: 'Gallery items',
      type: 'array',
      description: 'Mix images and captions in any order. Drag to reorder.',
      of: [
        {
          type: 'object',
          name: 'galleryItemImage',
          title: 'Image',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Describe the image for screen readers.',
            }),
            defineField({
              name: 'span',
              title: 'Column span',
              type: 'number',
              description: 'How many grid columns this image occupies (1–3). Leave blank for auto.',
              options: {
                list: [
                  { title: 'Narrow (1 col)', value: 1 },
                  { title: 'Medium (2 col)', value: 2 },
                  { title: 'Wide (3 col)',   value: 3 },
                ],
                layout: 'radio',
              },
            }),
          ],
          preview: {
            select: { media: 'image', subtitle: 'alt' },
            prepare({ media, subtitle }) {
              return { title: 'Image', subtitle: subtitle ?? '(no alt)', media }
            },
          },
        },
        {
          type: 'object',
          name: 'galleryItemCaption',
          title: 'Caption / text block',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'text',
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { subtitle: 'text' },
            prepare({ subtitle }) {
              return { title: 'Caption', subtitle }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { subtitle: 'title' },
    prepare({ subtitle }) {
      return { title: 'Gallery', subtitle: subtitle ?? '' }
    },
  },
})
