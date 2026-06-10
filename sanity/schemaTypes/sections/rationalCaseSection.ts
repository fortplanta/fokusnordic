import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'rationalCaseSection',
  title: 'The Case (Procurement / ESG)',
  type: 'object',
  description: 'The formal business-case block for CFOs, operations, and procurement. Ink ground. Self-sufficient — must make sense to someone who arrived cold.',
  fields: [
    defineField({
      name: 'orientLine',
      title: 'Self-orienting header',
      type: 'string',
      description: 'One line that re-establishes what the building is, for someone who landed here without reading the rest of the page.',
      initialValue: 'Barnängshuset — Nackagatan 4, Södermalm. A 1917 textile mill, restored for office use.',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'The case',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Everything the spreadsheet needs.',
    }),
    defineField({
      name: 'facts',
      title: 'Facts',
      type: 'array',
      description: 'Ordered list of label / copy pairs. These render as a spec-sheet ledger.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label',  type: 'string', description: 'E.g. "BREEAM In-Use" or "Lease"' }),
            defineField({ name: 'value', title: 'Value',  type: 'text',   rows: 3 }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
    }),
    defineField({
      name: 'closingLine',
      title: 'Closing line',
      type: 'text',
      rows: 2,
      description: 'Final statement below the ledger. Sets the tone on the way out.',
      initialValue: 'Managed by PPP Group, who have looked after buildings like this long enough to know the details are the point.',
    }),
  ],
  preview: {
    select: { subtitle: 'headline' },
    prepare({ subtitle }) {
      return { title: 'The Case', subtitle: subtitle ?? 'Everything the spreadsheet needs.' }
    },
  },
})
