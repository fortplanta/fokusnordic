import { defineField, defineType } from 'sanity'

// Latest 3 journal posts are queried automatically — no manual selection needed.
export default defineType({
  name: 'journalSection',
  title: 'Journal',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'A working building, with a life worth following.',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      initialValue: 'From the building',
    }),
    defineField({
      name: 'allPostsLabel',
      title: '"All posts" link label',
      type: 'string',
      initialValue: 'View all',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Journal (latest 3 auto)' }),
  },
})
