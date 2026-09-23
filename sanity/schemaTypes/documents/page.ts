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

const visibility = defineField({
  name: 'isVisible',
  title: 'Show this section on the site',
  type: 'boolean',
  initialValue: true,
  description: 'Turn off to hide this section without deleting its content.',
})

export default defineType({
  name: 'page',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Internal title', type: 'string', initialValue: 'Home' }),

    // ─── 1. Hero ───────────────────────────────────────────────────────────────
    defineField({
      name: 'hero', title: 'Hero', type: 'object',
      fields: [
        visibility, copy('heading', 'Heading', 1), copy('body', 'Body'), copy('ctaLabel', 'CTA label', 1), image('image', 'Background image'),
      ],
    }),

    // ─── 2. Building ───────────────────────────────────────────────────────────
    defineField({
      name: 'building', title: 'Building', type: 'object',
      fields: [visibility, ...sectionCopy, image('image', 'Historical image')],
    }),

    // ─── 3. Light and volume — editorial ──────────────────────────────────────
    defineField({
      name: 'volume', title: 'Light and volume — editorial', type: 'object',
      description: 'Kicker, heading and key building conditions. Spec groups live in "Property specifications" below.',
      fields: [
        visibility,
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
      ],
    }),

    // ─── 4. Gallery ────────────────────────────────────────────────────────────
    defineField({
      name: 'gallery', title: 'Gallery', type: 'object',
      fields: [
        visibility,
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

    // ─── 5. Opportunity ────────────────────────────────────────────────────────
    defineField({
      name: 'opportunity', title: 'Opportunity', type: 'object',
      fields: [
        visibility, ...sectionCopy, copy('ctaLabel', 'CTA label', 1), image('image', 'Opportunity image'),
        defineField({
          name: 'facts', title: 'Facts', type: 'array',
          of: [{ type: 'object', fields: [copy('label', 'Label', 1), copy('value', 'Value', 1)] }],
        }),
      ],
    }),

    // ─── 6. Floor plans ────────────────────────────────────────────────────────
    defineField({
      name: 'floorPlans', title: 'Floor plans', type: 'object',
      fields: [
        visibility,
        ...sectionCopy,
        copy('detailsLabel', 'Mobile information heading', 1),
        copy('ctaLabel', 'Enquiry link label', 1),
        defineField({
          name: 'ctaUrl', title: 'Enquiry link', type: 'string',
          description: 'Use a page anchor such as #viewing, a mailto link, or a full URL.',
        }),
        defineField({
          name: 'floors', title: 'Floors', type: 'array',
          validation: (rule) => rule.min(1),
          of: [{
            type: 'object',
            fields: [
              copy('label', 'Floor label', 1),
              defineField({
                name: 'configurations', title: 'Configurations', type: 'array',
                description: 'Each entry is one independently rentable unit — e.g. "Suite 1" (the main level) and "Suite 1 Mezzanine" are separate configurations, not one combined listing, even though they sit on the same floor.',
                validation: (rule) => rule.min(1),
                of: [{
                  type: 'object',
                  fields: [
                    copy('title', 'Configuration title', 1),
                    copy('name', 'Suite or option name', 1),
                    copy('body', 'Description'),
                    copy('informationNote', 'Information note (below the tables)'),
                    copy('levelLabel', 'Level label (e.g. "Main level" or "Mezzanine")', 1),
                    defineField({
                      name: 'facts', title: 'Facts', type: 'array',
                      of: [{ type: 'object', fields: [copy('label', 'Label', 1), copy('value', 'Value', 1)] }],
                    }),
                    defineField({
                      name: 'detailTables', title: 'Information tables', type: 'array',
                      description: 'Tables in the right-hand desktop panel. On mobile, the first two tables appear on the left and the third on the right. Add, remove or reorder tables as needed.',
                      of: [{
                        type: 'object',
                        fields: [
                          copy('title', 'Table title', 1),
                          copy('labelHeading', 'Left column heading', 1),
                          copy('valueHeading', 'Right column heading', 1),
                          defineField({
                            name: 'rows', title: 'Rows', type: 'array',
                            of: [{
                              type: 'object',
                              fields: [
                                copy('label', 'Label', 1),
                                copy('value', 'Value', 1),
                                defineField({ name: 'accent', title: 'Show colour key', type: 'boolean', initialValue: false }),
                              ],
                            }],
                          }),
                          copy('footer', 'Footer value', 1),
                        ],
                        preview: { select: { title: 'title', rows: 'rows' }, prepare: ({ title, rows }) => ({ title: title || 'Information table', subtitle: `${rows?.length || 0} rows` }) },
                      }],
                    }),
                    image('planImage', "Bird's-eye floor plan"),
                    image('explodedImage', 'Axonometric view'),
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

    // ─── 7. Materials ──────────────────────────────────────────────────────────
    defineField({
      name: 'materials', title: 'Materials', type: 'object',
      fields: [visibility, ...sectionCopy, image('mainImage', 'Main material image'), image('detailImage', 'Material detail')],
    }),

    // ─── 8. Address / place ────────────────────────────────────────────────────
    defineField({
      name: 'place', title: 'Address', type: 'object',
      fields: [
        visibility, ...sectionCopy, image('image', 'Neighbourhood image'),
        defineField({
          name: 'nearby', title: 'Nearby', type: 'array',
          of: [{ type: 'object', fields: [copy('name', 'Place', 1), copy('detail', 'Distance / detail', 1)] }],
        }),
      ],
    }),

    // ─── 9. Scrolling gallery ──────────────────────────────────────────────────
    defineField({
      name: 'mosaicGallery', title: 'Scrolling gallery — after address', type: 'object',
      description: 'Shown directly after the Address section on the website.',
      fields: [
        visibility, copy('kicker', 'Kicker', 1), copy('heading', 'Heading', 1),
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

    // ─── 10. Area map ──────────────────────────────────────────────────────────
    defineField({
      name: 'areaMap', title: 'Area map', type: 'object',
      description: 'A static map image with numbered pins positioned by percentage. Points come from the Points of Interest list — set each one’s map position there. Add, remove and reorder POIs there to change both the map pins and the numbered list.',
      fields: [
        visibility,
        copy('kicker', 'Kicker', 1), copy('heading', 'Heading', 1), copy('supportingLine', 'Supporting line', 2),
        image('mapImage', 'Map image'),
        defineField({
          name: 'buildingX', title: 'Building pin — horizontal (%)', type: 'number',
          description: '0 is the left edge, 100 is the right edge.',
          validation: (r) => r.min(0).max(100).precision(2),
        }),
        defineField({
          name: 'buildingY', title: 'Building pin — vertical (%)', type: 'number',
          description: '0 is the top edge, 100 is the bottom edge.',
          validation: (r) => r.min(0).max(100).precision(2),
        }),
        defineField({
          name: 'pois', title: 'Points of interest', type: 'array',
          of: [{ type: 'reference', to: [{ type: 'poi' }] }],
          description: 'Order here sets both the numbered list and the matching numbered map pins.',
        }),
      ],
    }),

    // ─── 11. Property specifications ───────────────────────────────────────────
    defineField({
      name: 'specifications', title: 'Property specifications', type: 'object',
      description: 'The lower technical register — separate heading and spec groups from the editorial section above.',
      fields: [
        visibility,
        ...sectionCopy,
        defineField({
          name: 'specificationGroups', title: 'Specification groups', type: 'array',
          description: 'Technical categories shown in the lower information register.',
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

    // ─── 12. Viewing ───────────────────────────────────────────────────────────
    defineField({
      name: 'viewing', title: 'Viewing', type: 'object',
      fields: [visibility, ...sectionCopy, copy('ctaLabel', 'CTA label', 1), image('image', 'Viewing image')],
    }),
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
})
