import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — only one document of this type should ever exist.
  // Enforced via the structure builder (no list view, direct document link).
  groups: [
    { name: 'identity',  title: 'Identity' },
    { name: 'contact',   title: 'Leasing Contact' },
    { name: 'social',    title: 'Social & Newsletter' },
    { name: 'seo',       title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'propertyName',
      title: 'Property name',
      type: 'string',
      group: 'identity',
      initialValue: 'Barnängshuset',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      group: 'identity',
      initialValue: 'Nackagatan 4, 116 40 Stockholm',
    }),
    defineField({
      name: 'coordinates',
      title: 'Building coordinates',
      type: 'object',
      group: 'identity',
      fields: [
        defineField({ name: 'lat', title: 'Latitude',  type: 'number', initialValue: 59.3148 }),
        defineField({ name: 'lng', title: 'Longitude', type: 'number', initialValue: 18.0717 }),
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo (SVG or image)',
      type: 'image',
      group: 'identity',
    }),

    // ── Leasing contact ──────────────────────────────────────────────────────
    defineField({
      name: 'leasingContact',
      title: 'Leasing contact',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'name',  title: 'Full name', type: 'string', initialValue: 'Anna Lindqvist' }),
        defineField({ name: 'role',  title: 'Role',      type: 'string', initialValue: 'Leasing Manager' }),
        defineField({ name: 'email', title: 'Email',     type: 'string' }),
        defineField({ name: 'phone', title: 'Phone',     type: 'string' }),
        defineField({
          name: 'photo',
          title: 'Headshot',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'calLink',
          title: 'Cal.com / Calendly link',
          description: 'Direct booking link for viewing appointments',
          type: 'url',
        }),
      ],
    }),

    // ── Social & newsletter ──────────────────────────────────────────────────
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'social',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: ['Instagram', 'LinkedIn', 'Facebook', 'X'],
              },
            }),
            defineField({ name: 'url', type: 'url' }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'newsletterWebhook',
      title: 'Newsletter webhook URL',
      description: 'Resend / Mailchimp / Buttondown endpoint for the footer form',
      type: 'url',
      group: 'social',
    }),

    // ── SEO ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Default meta title',
      type: 'string',
      group: 'seo',
      initialValue: 'Barnängshuset — Office Space in Södermalm',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Default meta description',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG / share image',
      type: 'image',
      group: 'seo',
    }),

    // ── Footer ───────────────────────────────────────────────────────────────
    defineField({
      name: 'footerInvite',
      title: 'Footer invite headline',
      type: 'string',
      description: 'The oversized serif line at the top of the footer.',
      initialValue: 'Work somewhere worth coming back to.',
      group: 'identity',
    }),
  ],

  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
