import { defineField, defineType } from 'sanity'

/*
  Point of interest — feeds both the neighbourhood list and the Maptiler map.
  Coordinates must be verified against Google Maps / actual walking routes
  before launch (see PRODUCTION-BRIEF.md §11).
*/
export default defineType({
  name: 'poi',
  title: 'Neighbourhood — Point of Interest',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'string',
      description: 'One line — shown beneath the name in the list',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Coffee',  value: 'coffee' },
          { title: 'Park',    value: 'park' },
          { title: 'Transit', value: 'transit' },
          { title: 'Lunch',   value: 'lunch' },
          { title: 'Run',     value: 'run' },
          { title: 'Wine',    value: 'wine' },
          { title: 'Gym',     value: 'gym' },
          { title: 'Culture', value: 'culture' },
        ],
        layout: 'dropdown',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'walkingMinutes',
      title: 'Walking minutes from building',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'lat',
      title: 'Latitude',
      type: 'number',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'lng',
      title: 'Longitude',
      type: 'number',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
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
      title: 'Walking time',
      name: 'walkingAsc',
      by: [{ field: 'walkingMinutes', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title:    'name',
      category: 'category',
      minutes:  'walkingMinutes',
    },
    prepare({ title, category, minutes }) {
      return {
        title,
        subtitle: `${category}  ·  ${minutes} min`,
      }
    },
  },
})
