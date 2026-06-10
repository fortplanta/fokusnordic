import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bridgeSection',
  title: 'Bridge',
  type: 'object',
  description: 'Transitional pause between the testimonial and the floor plan. Large display type, generous space.',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Four point nine metres.',
      description: 'The single large statement. Should be short — one clause, one breath.',
    }),
    defineField({
      name: 'supportingLine',
      title: 'Supporting line',
      type: 'string',
      initialValue: 'Not a specification. A condition for the kind of work that needs room to happen.',
      description: 'Optional quieter line below the headline. Leave blank to suppress.',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) {
      return { title: 'Bridge', subtitle: title ?? 'Four point nine metres.' }
    },
  },
})
