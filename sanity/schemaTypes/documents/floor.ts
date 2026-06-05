import { defineField, defineType } from 'sanity'

/*
  One document per leasable unit. Status drives everything: availability bar
  count, floor-plan colours (coral=available, sage=reserved, stone=leased),
  and the "2 floors remaining" copy. Never hardcode availability in components.
*/
export default defineType({
  name: 'floor',
  title: 'Floor / Unit',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'E.g. "Floor 1" or "Unit 1A" — shown in the detail panel',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Available',  value: 'available' },
          { title: 'Reserved',   value: 'reserved' },
          { title: 'Leased',     value: 'leased' },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'areaSqm',
      title: 'Area (m²)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'ceilingHeightM',
      title: 'Ceiling height (m)',
      type: 'number',
      initialValue: 4.9,
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity (people)',
      type: 'number',
      validation: (r) => r.positive(),
    }),
    defineField({
      name: 'orientation',
      title: 'Orientation / aspect',
      type: 'string',
      description: 'E.g. "South-west, courtyard views"',
    }),
    defineField({
      name: 'planImage',
      title: 'Floor plan image',
      description: 'The architectural plan for this unit (used in the detail panel)',
      type: 'image',
      options: { hotspot: false },
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'E.g. "Private terrace", "Exposed brick", "Separate entrance"',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first in the floor plan legend',
      initialValue: 0,
    }),
  ],

  orderings: [
    {
      title: 'Sort order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title:    'label',
      status:   'status',
      area:     'areaSqm',
    },
    prepare({ title, status, area }) {
      const badge = status === 'available' ? '🟠' : status === 'reserved' ? '🟢' : '⚫'
      return {
        title,
        subtitle: `${badge} ${status}  ·  ${area}m²`,
      }
    },
  },
})
