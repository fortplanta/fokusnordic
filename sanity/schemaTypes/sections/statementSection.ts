import { defineField, defineType } from 'sanity'
import { headingLevelField, colorThemeField } from '../fields/sectionMeta'

// The "intro" section — big serif statement + offset parallax image + body ledger
export default defineType({
  name: 'statementSection',
  title: 'Intro / Statement',
  type: 'object',
  fields: [
    defineField({
      name: 'statement',
      title: 'Statement headline',
      type: 'string',
      initialValue: 'The room you work in changes the work you do.',
      validation: (r) => r.required(),
    }),
    headingLevelField('h2'),
    colorThemeField('light'),
    defineField({
      name: 'media',
      title: 'Parallax image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ledgerLabel',
      title: 'Ledger label',
      type: 'string',
      initialValue: 'The building',
    }),
    defineField({
      name: 'bodyParagraphs',
      title: 'Body paragraphs',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
      initialValue: 'Read the full story',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA URL',
      type: 'string',
      initialValue: '/about',
    }),
  ],
  preview: {
    select: { subtitle: 'statement' },
    prepare({ subtitle }) {
      return { title: 'Intro / Statement', subtitle }
    },
  },
})
