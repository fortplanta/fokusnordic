import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bridgeSection',
  title: 'Bridge',
  type: 'object',
  description: 'Two-column section: ceiling-height stat (left) + architectural cross-section drawing (right).',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow label',
      type: 'string',
      initialValue: 'EYEBROW CONTENT',
      description: 'Small uppercase label above the headline.',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Four point nine / meters',
      description: 'Display headline. Use " / " (space-slash-space) to split across two lines.',
    }),
    defineField({
      name: 'supportingLine',
      title: 'Supporting line',
      type: 'string',
      initialValue: 'Not a specification. A condition for the kind of work that needs room to happen.',
      description: 'Quiet line pinned to the bottom of the text column.',
    }),
    defineField({
      name: 'drawing',
      title: 'Section drawing',
      type: 'image',
      description: 'Architectural cross-section — black line art on Blekäng ground. Upload the supplied drawing asset here.',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) {
      return { title: 'Bridge', subtitle: title ?? 'Four point nine / meters' }
    },
  },
})
