import { defineField, defineType } from 'sanity'
import { headingLevelField, colorThemeField } from '../fields/sectionMeta'

// The leasing agent's section. Agent details come from siteSettings.leasingContact
// so they only need to be updated in one place.
export default defineType({
  name: 'viewingSection',
  title: 'Arrange a Viewing',
  type: 'object',
  fields: [
    headingLevelField('h2'),
    colorThemeField('light'),
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'string',
      initialValue: 'See it in person.',
    }),
    defineField({
      name: 'bodyText',
      title: 'Body text',
      type: 'text',
      rows: 3,
      initialValue: 'Spaces like this read differently in photographs. The light, the volume, the quiet — come and spend an hour.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA button label',
      type: 'string',
      initialValue: 'Arrange a viewing',
    }),
    defineField({
      name: 'ctaType',
      title: 'CTA action',
      type: 'string',
      options: {
        list: [
          { title: 'Email the agent',          value: 'mailto' },
          { title: 'Cal.com / Calendly embed', value: 'calendar' },
          { title: 'Custom URL',               value: 'url' },
        ],
        layout: 'radio',
      },
      initialValue: 'mailto',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Custom CTA URL',
      type: 'url',
      hidden: ({ parent }) => parent?.ctaType !== 'url',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Arrange a Viewing' }),
  },
})
