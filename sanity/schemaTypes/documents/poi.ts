import { defineField, defineType } from 'sanity'

/*
  Point of interest — feeds both the numbered neighbourhood list and its
  matching pin on the static map image (see areaMap.mapImage on the page
  document). mapX/mapY position the pin on that image; lat/lng are kept as
  a real-world reference for verifying walking times, not for rendering.
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
      name: 'mapX',
      title: 'Map position — horizontal (%)',
      type: 'number',
      description: 'Position on the static map image. 0 is the left edge, 100 is the right edge.',
      validation: (r) => r.min(0).max(100).precision(2),
    }),
    defineField({
      name: 'mapY',
      title: 'Map position — vertical (%)',
      type: 'number',
      description: 'Position on the static map image. 0 is the top edge, 100 is the bottom edge.',
      validation: (r) => r.min(0).max(100).precision(2),
    }),
    defineField({
      name: 'lat',
      title: 'Latitude (reference only)',
      type: 'number',
      description: 'Not used for rendering — kept to verify walking times against a real map.',
    }),
    defineField({
      name: 'lng',
      title: 'Longitude (reference only)',
      type: 'number',
      description: 'Not used for rendering — kept to verify walking times against a real map.',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'showRoute',
      title: 'Show walking route on map',
      type: 'boolean',
      initialValue: false,
      description: 'Draws a dashed line from the building to this point, labelled with the walking time. Use sparingly — one or two points make it a fact; every point makes it noise.',
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
