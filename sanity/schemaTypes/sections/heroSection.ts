import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'image',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      description: 'Muted MP4 loop — host on S3/CloudFront or Mux',
      type: 'url',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster image (video fallback)',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (top-left)',
      type: 'string',
      initialValue: 'Södermalm, Stockholm',
    }),
    defineField({
      name: 'aboutLabel',
      title: '"About" label',
      type: 'string',
      initialValue: 'About the building',
    }),
    defineField({
      name: 'aboutText',
      title: 'About paragraph',
      type: 'text',
      rows: 3,
      initialValue: 'A restored 1917 cotton mill — 300m² across two quiet floors, 4.9m ceilings, eight minutes from Slussen.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label (top-right)',
      type: 'string',
      initialValue: 'View available spaces',
    }),
    defineField({
      name: 'headlineRow1',
      title: 'Headline — row 1',
      type: 'string',
      initialValue: 'A WORLD AWAY',
    }),
    defineField({
      name: 'headlineRow2',
      title: 'Headline — row 2',
      type: 'string',
      initialValue: 'FROM THE NOISE',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Hero' }),
  },
})
