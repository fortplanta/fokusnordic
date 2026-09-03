import { defineField, defineType } from 'sanity'

const copy = (name: string, title: string, rows = 3) => defineField({
  name,
  title,
  type: rows > 1 ? 'text' : 'string',
  ...(rows > 1 ? { rows } : {}),
})

const image = (name: string, title: string) => defineField({
  name,
  title,
  type: 'image',
  options: { hotspot: true },
  fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() })],
})

const sectionCopy = [copy('kicker', 'Kicker', 1), copy('heading', 'Heading', 1), copy('body', 'Body')]

export default defineType({
  name: 'page',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'building', title: 'Building' },
    { name: 'volume', title: 'Light & volume' },
    { name: 'gallery', title: 'Gallery' },
    { name: 'mosaicGallery', title: 'Scrolling gallery' },
    { name: 'opportunity', title: 'Opportunity' },
    { name: 'floorPlans', title: 'Floor plans' },
    { name: 'materials', title: 'Materials' },
    { name: 'place', title: 'Address' },
    { name: 'areaMap', title: 'Area map' },
    { name: 'viewing', title: 'Viewing' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Internal title', type: 'string', initialValue: 'Home' }),
    defineField({
      name: 'hero', title: 'Hero', type: 'object', group: 'hero',
      fields: [
        copy('heading', 'Heading', 1), copy('body', 'Body'), copy('ctaLabel', 'CTA label', 1), image('image', 'Background image'),
      ],
    }),
    defineField({
      name: 'building', title: 'Building', type: 'object', group: 'building',
      fields: [...sectionCopy, image('image', 'Historical image')],
    }),
    defineField({
      name: 'volume', title: 'Light and volume', type: 'object', group: 'volume',
      fields: [
        ...sectionCopy,
        defineField({
          name: 'featureStatements', title: 'Key building conditions', type: 'array',
          description: 'Editorial facts shown in the upper information register.',
          of: [{
            type: 'object',
            fields: [copy('heading', 'Fact heading', 1), copy('body', 'Explanation', 4)],
            preview: { select: { title: 'heading', subtitle: 'body' } },
          }],
        }),
        defineField({
          name: 'specificationGroups', title: 'Technical specification groups', type: 'array',
          description: 'Categories displayed in the right-hand information register.',
          of: [{
            type: 'object',
            fields: [
              copy('title', 'Category', 1),
              defineField({
                name: 'facts', title: 'Facts', type: 'array',
                of: [{ type: 'object', fields: [copy('label', 'Label', 1), copy('value', 'Value', 2)] }],
              }),
            ],
            preview: {
              select: { title: 'title', facts: 'facts' },
              prepare: ({ title, facts }) => ({ title, subtitle: `${facts?.length || 0} facts` }),
            },
          }],
        }),
      ],
    }),
    defineField({
      name: 'gallery', title: 'Gallery', type: 'object', group: 'gallery',
      fields: [
        ...sectionCopy,
        defineField({
          name: 'items', title: 'Images', type: 'array',
          of: [{
            type: 'object',
            fields: [image('image', 'Image'), copy('caption', 'Caption', 1), defineField({
              name: 'layout', title: 'Layout', type: 'string', initialValue: 'wide',
              options: { list: [{ title: 'Wide', value: 'wide' }, { title: 'Portrait', value: 'portrait' }, { title: 'Compact', value: 'compact' }] },
            })],
          }],
        }),
      ],
    }),
    defineField({
      name: 'mosaicGallery', title: 'Scrolling gallery', type: 'object', group: 'mosaicGallery',
      fields: [
        copy('kicker', 'Kicker', 1), copy('heading', 'Heading', 1),
        defineField({
          name: 'items', title: 'Images', type: 'array',
          description: 'Add, remove and reorder images freely. Size and side are controlled per image.',
          of: [{
            type: 'object',
            fields: [
              image('image', 'Image'),
              copy('caption', 'Caption', 1),
              defineField({
                name: 'size', title: 'Image format', type: 'string', initialValue: 'wide',
                options: { list: [
                  { title: 'Compact', value: 'compact' },
                  { title: 'Wide', value: 'wide' },
                  { title: 'Portrait', value: 'portrait' },
                ], layout: 'radio' },
              }),
              defineField({
                name: 'side', title: 'Screen position', type: 'string', initialValue: 'left',
                options: { list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Right', value: 'right' },
                ], layout: 'radio' },
              }),
            ],
            preview: {
              select: { title: 'caption', media: 'image', size: 'size', side: 'side' },
              prepare: ({ title, media, size, side }) => ({ title: title || 'Untitled image', media, subtitle: `${size || 'wide'} · ${side || 'left'}` }),
            },
          }],
        }),
      ],
    }),
    defineField({
      name: 'opportunity', title: 'Opportunity', type: 'object', group: 'opportunity',
      fields: [
        ...sectionCopy, copy('ctaLabel', 'CTA label', 1), image('image', 'Opportunity image'),
        defineField({
          name: 'facts', title: 'Facts', type: 'array',
          of: [{ type: 'object', fields: [copy('label', 'Label', 1), copy('value', 'Value', 1)] }],
        }),
      ],
    }),
    defineField({
      name: 'floorPlans', title: 'Floor plans', type: 'object', group: 'floorPlans',
      fields: [
        ...sectionCopy,
        defineField({
          name: 'floors', title: 'Floors', type: 'array',
          validation: (rule) => rule.min(1),
          of: [{
            type: 'object',
            fields: [
              copy('label', 'Floor label', 1),
              defineField({
                name: 'configurations', title: 'Configurations', type: 'array',
                validation: (rule) => rule.min(1),
                of: [{
                  type: 'object',
                  fields: [
                    copy('title', 'Configuration title', 1),
                    copy('body', 'Description'),
                    defineField({
                      name: 'facts', title: 'Facts', type: 'array',
                      of: [{ type: 'object', fields: [copy('label', 'Label', 1), copy('value', 'Value', 1)] }],
                    }),
                    image('planImage', 'Bird’s-eye floor plan'),
                    image('explodedImage', 'Exploded view for this configuration'),
                  ],
                  preview: {
                    select: { title: 'title', media: 'planImage' },
                    prepare: ({ title, media }) => ({ title: title || 'Untitled configuration', media }),
                  },
                }],
              }),
            ],
            preview: {
              select: { title: 'label', configurations: 'configurations' },
              prepare: ({ title, configurations }) => ({
                title: title || 'Untitled floor',
                subtitle: `${configurations?.length || 0} configuration${configurations?.length === 1 ? '' : 's'}`,
              }),
            },
          }],
        }),
      ],
    }),
    defineField({
      name: 'materials', title: 'Materials', type: 'object', group: 'materials',
      fields: [...sectionCopy, image('mainImage', 'Main material image'), image('detailImage', 'Material detail')],
    }),
    defineField({
      name: 'place', title: 'Address', type: 'object', group: 'place',
      fields: [
        ...sectionCopy, image('image', 'Neighbourhood image'),
        defineField({
          name: 'nearby', title: 'Nearby', type: 'array',
          of: [{ type: 'object', fields: [copy('name', 'Place', 1), copy('detail', 'Distance / detail', 1)] }],
        }),
      ],
    }),
    defineField({
      name: 'areaMap', title: 'Area map', type: 'object', group: 'areaMap',
      fields: [
        copy('kicker', 'Kicker', 1), copy('heading', 'Heading', 1), image('mapImage', 'Static map image'),
        defineField({
          name: 'buildingMarker', title: 'Barnängshuset marker', type: 'object',
          description: 'Upload the building SVG, then position and size it over the map.',
          fields: [
            defineField({
              name: 'icon', title: 'Building SVG', type: 'file',
              options: { accept: 'image/svg+xml' },
              validation: (r) => r.required(),
            }),
            copy('alt', 'Accessible label', 1),
            defineField({
              name: 'x', title: 'Horizontal position (%)', type: 'number', initialValue: 50,
              description: '0 is the left edge; 100 is the right edge. Decimals are supported.',
              validation: (r) => r.required().min(0).max(100).precision(2),
            }),
            defineField({
              name: 'y', title: 'Vertical position (%)', type: 'number', initialValue: 50,
              description: '0 is the top edge; 100 is the bottom edge. Decimals are supported.',
              validation: (r) => r.required().min(0).max(100).precision(2),
            }),
            defineField({
              name: 'width', title: 'Marker width (% of map)', type: 'number', initialValue: 10,
              description: 'Controls the displayed SVG width relative to the map.',
              validation: (r) => r.required().min(2).max(30).precision(2),
            }),
          ],
        }),
        defineField({
          name: 'markers', title: 'Locations', type: 'array',
          description: 'Each location creates both a numbered map dot and its corresponding list item. Add, remove and reorder freely.',
          of: [{
            type: 'object',
            fields: [
              copy('name', 'Name', 1), copy('detail', 'Detail', 1), copy('category', 'Category', 1),
              defineField({ name: 'url', title: 'Link', type: 'url' }),
              defineField({
                name: 'x', title: 'Horizontal position (%)', type: 'number',
                description: '0 is the left edge; 100 is the right edge. Decimals are supported.',
                validation: (r) => r.required().min(0).max(100).precision(2),
              }),
              defineField({
                name: 'y', title: 'Vertical position (%)', type: 'number',
                description: '0 is the top edge; 100 is the bottom edge. Decimals are supported.',
                validation: (r) => r.required().min(0).max(100).precision(2),
              }),
            ],
            preview: { select: { title: 'name', subtitle: 'detail' } },
          }],
        }),
      ],
    }),
    defineField({
      name: 'viewing', title: 'Viewing', type: 'object', group: 'viewing',
      fields: [...sectionCopy, copy('ctaLabel', 'CTA label', 1), image('image', 'Viewing image')],
    }),
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
})
