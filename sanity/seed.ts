/**
 * Seed script — populates the Sanity dataset with placeholder content
 * that mirrors the prototype.
 *
 * Run with:
 *   npx sanity@latest exec sanity/seed.ts --with-user-token
 *
 * This is DESTRUCTIVE on existing documents with matching IDs.
 * Safe to re-run; it uses createOrReplace.
 *
 * All placeholder content must be replaced before launch — see §11 of
 * PRODUCTION-BRIEF.md for the full inventory.
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset:   process.env.SANITY_STUDIO_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token:     process.env.SANITY_STUDIO_TOKEN,
  useCdn:    false,
})

async function seed() {
  console.log('🌱 Seeding Barnängshuset dataset…\n')

  // ── Site Settings ──────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id:   'siteSettings',
    _type: 'siteSettings',
    propertyName: 'Barnängshuset',
    address:      'Nackagatan 4, 116 40 Stockholm',
    coordinates:  { lat: 59.3148, lng: 18.0717 },
    leasingContact: {
      name:  'Anna Lindqvist',   // PLACEHOLDER — replace before launch
      role:  'Leasing Manager',
      email: 'anna@barnangshuset.se',
      phone: '+46 70 000 00 00',
    },
    metaTitle:       'Barnängshuset — Office Space in Södermalm',
    metaDescription: 'A restored 1917 cotton mill at Nackagatan 4. Two floors of calm, focused workspace for founders, studios, and small teams.',
    footerInvite:    'Work somewhere worth coming back to.',
  })
  console.log('✓ siteSettings')

  // ── Floors ─────────────────────────────────────────────────────────────────
  const floors = [
    {
      _id:   'floor-1',
      _type: 'floor',
      label:          'Floor 1',
      status:         'available',
      areaSqm:        300,
      ceilingHeightM: 4.9,
      capacity:       50,
      orientation:    'South-west, courtyard views',
      features:       ['Exposed brick', 'Polished concrete', 'Private entrance'],
      sortOrder:      1,
    },
    {
      _id:   'floor-2',
      _type: 'floor',
      label:          'Floor 2',
      status:         'available',
      areaSqm:        300,
      ceilingHeightM: 4.9,
      capacity:       50,
      orientation:    'North-east, rooftop views',
      features:       ['Original timber beams', 'Skylights', 'Roof terrace access'],
      sortOrder:      2,
    },
  ]
  for (const floor of floors) {
    await client.createOrReplace(floor)
    console.log(`✓ floor: ${floor.label}`)
  }

  // ── POIs ───────────────────────────────────────────────────────────────────
  // NOTE: Coordinates and walking times are PLACEHOLDER — verify before launch.
  const pois = [
    { _id: 'poi-1', _type: 'poi', name: 'Café Pascal',           description: 'Neighbourhood staple', category: 'coffee',  walkingMinutes: 3, lat: 59.3160, lng: 18.0690, sortOrder: 1 },
    { _id: 'poi-2', _type: 'poi', name: 'Tantolunden',           description: 'Park & allotment gardens', category: 'park', walkingMinutes: 4, lat: 59.3115, lng: 18.0610, sortOrder: 2 },
    { _id: 'poi-3', _type: 'poi', name: 'Slussen T-bana',        description: 'Metro, 3 min to city',  category: 'transit', walkingMinutes: 8, lat: 59.3192, lng: 18.0722, sortOrder: 3 },
    { _id: 'poi-4', _type: 'poi', name: 'Urban Deli Nytorget',   description: 'Lunch & provisions',    category: 'lunch',   walkingMinutes: 5, lat: 59.3155, lng: 18.0750, sortOrder: 4 },
    { _id: 'poi-5', _type: 'poi', name: 'Tantolundens motionsspår', description: '3km trail loop',    category: 'run',     walkingMinutes: 5, lat: 59.3110, lng: 18.0600, sortOrder: 5 },
    { _id: 'poi-6', _type: 'poi', name: 'Akkurat',               description: 'Beer & natural wine',  category: 'wine',    walkingMinutes: 6, lat: 59.3178, lng: 18.0710, sortOrder: 6 },
    { _id: 'poi-7', _type: 'poi', name: 'SATS Hornstull',        description: 'Full gym & classes',   category: 'gym',     walkingMinutes: 7, lat: 59.3130, lng: 18.0580, sortOrder: 7 },
    { _id: 'poi-8', _type: 'poi', name: 'Fotografiska',          description: 'Photography museum',   category: 'culture', walkingMinutes: 9, lat: 59.3185, lng: 18.0843, sortOrder: 8 },
  ]
  for (const poi of pois) {
    await client.createOrReplace(poi)
    console.log(`✓ poi: ${poi.name}`)
  }

  // ── Journal Posts ──────────────────────────────────────────────────────────
  const posts = [
    {
      _id:      'journal-1',
      _type:    'journalPost',
      title:    'What a 108-year-old building teaches you about patience',
      slug:     { _type: 'slug', current: 'what-a-108-year-old-building-teaches-you' },
      date:     '2025-10-12',
      category: 'building',
      excerpt:  'The original pine floors creak in a specific sequence — the restoration crew learned them like a score.',
    },
    {
      _id:      'journal-2',
      _type:    'journalPost',
      title:    'The case for working without windows you can see through',
      slug:     { _type: 'slug', current: 'the-case-for-working-without-windows' },
      date:     '2025-09-03',
      category: 'tenants',
      excerpt:  'Three tenants on why the diffuse northern light — not the view — is the thing that keeps them here.',
    },
    {
      _id:      'journal-3',
      _type:    'journalPost',
      title:    'Södermalm at six in the morning',
      slug:     { _type: 'slug', current: 'sodermalm-at-six-in-the-morning' },
      date:     '2025-07-22',
      category: 'neighbourhood',
      excerpt:  'The bakery on Hornsgatan, the market at Medborgarplatsen, the quiet before the city decides to be loud.',
    },
  ]
  for (const post of posts) {
    await client.createOrReplace(post)
    console.log(`✓ journalPost: ${post.title.slice(0, 40)}…`)
  }

  // ── Home Page ──────────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id:   'homePage',
    _type: 'page',
    title: 'Home',
    sections: [
      {
        _type: 'heroSection',
        _key:  'hero',
        mediaType:    'image',
        tagline:      'Södermalm, Stockholm',
        aboutLabel:   'About the building',
        aboutText:    'Some buildings are designed to impress visitors. Barnängshuset was built in 1917 for people who were too busy making things to care about that. It still is.',
        ctaLabel:     'View available spaces',
        headlineRow1: 'A WORLD AWAY',
        headlineRow2: 'FROM THE NOISE',
      },
      {
        _type: 'statementSection',
        _key:  'statement',
        statement:    'The room you work in changes the work you do.',
        ledgerLabel:  'The building',
        bodyParagraphs: [
          {
            _type: 'block',
            _key:  'bp1',
            style: 'normal',
            children: [
              { _type: 'span', _key: 's1', text: 'Built in ' },
              { _type: 'span', _key: 's2', text: '1917', marks: ['strong'] },
              { _type: 'span', _key: 's3', text: ' as a cotton mill, Barnängshuset has been carefully restored into two floors of calm, light-filled workspace. The building retains its original character — ' },
              { _type: 'span', _key: 's4', text: '4.9m ceilings', marks: ['strong'] },
              { _type: 'span', _key: 's5', text: ', exposed brick, wide-plank timber floors — while meeting contemporary standards for energy performance and comfort.' },
            ],
          },
          {
            _type: 'block',
            _key:  'bp2',
            style: 'normal',
            children: [
              { _type: 'span', _key: 's6', text: 'Eight minutes on foot from Slussen. The kind of address that lets your team walk to Fotografiska on a Thursday and still be deep in work by ten.' },
            ],
          },
        ],
        ctaLabel:     'Read the full story',
        ctaUrl:       '/about',
      },
      {
        _type: 'figuresSection',
        _key:  'figures',
        figures: [
          { _type: 'object', _key: 'f1', value: '4.9m',        label: 'Ceiling height' },
          { _type: 'object', _key: 'f2', value: '2',            label: 'Floors' },
          { _type: 'object', _key: 'f3', value: '300m²',        label: 'Total area' },
          { _type: 'object', _key: 'f4', value: '8 min',        label: 'To Slussen' },
          { _type: 'object', _key: 'f5', value: '1917',           label: 'BREEAM Very Good' },
        ],
      },
      {
        _type: 'testimonialSection',
        _key:  'testimonial',
        eyebrow:    'From our tenants',
        // quote/authorName/authorRole intentionally absent until real tenant copy is confirmed
      },
      {
        _type: 'bridgeSection',
        _key:  'bridge',
        headline:       'Four point nine metres.',
        supportingLine: 'Not a specification. A condition for the kind of work that needs room to happen.',
      },
      {
        _type: 'floorsSection',
        _key:  'floors',
        heading: 'The spaces',
        label:   'Floor plan',
        floors: [
          { _type: 'reference', _ref: 'floor-1', _key: 'floor-1' },
          { _type: 'reference', _ref: 'floor-2', _key: 'floor-2' },
        ],
      },
      {
        _type: 'neighbourhoodSection',
        _key:  'neighbourhood',
        heading:       'Södermalm has always been where people come to make things.',
        label:         'The address',
        supportingLine: 'Not to be seen making them — to actually make them. Barnängshuset sits at the quieter end of that tradition, eight minutes from the centre and a world away from its noise.',
        pois: pois.map((p) => ({ _type: 'reference', _ref: p._id, _key: p._id })),
      },
      {
        _type: 'rationalCaseSection',
        _key:  'rationalCase',
        orientLine:  'Barnängshuset — Nackagatan 4, Södermalm. A 1917 textile mill, restored for office use.',
        eyebrow:     'The case',
        headline:    'Everything the spreadsheet needs.',
        facts: [
          {
            _type: 'object',
            _key:  'breeam',
            label: 'BREEAM In-Use',
            value: 'BREEAM In-Use: Very Good — which means the building carries its own environmental credentials, so your tenancy starts with the reporting already done.',
          },
          {
            _type: 'object',
            _key:  'lease',
            label: 'Lease',
            value: 'Flexible terms available, from 12 months. Full details on request.',
          },
          {
            _type: 'object',
            _key:  'available',
            label: 'Available',
            value: 'Available from Q4 2025.',
          },
          {
            _type: 'object',
            _key:  'owner',
            label: 'Owner',
            value: 'PPP Group, Stockholm.',
          },
        ],
        closingLine: 'Managed by PPP Group, who have looked after buildings like this long enough to know the details are the point.',
      },
      {
        _type: 'journalSection',
        _key:  'journal',
        heading:       'A working building, with a life worth following.',
        subheading:    'From the building',
        allPostsLabel: 'View all',
      },
      {
        _type: 'viewingSection',
        _key:  'viewing',
        heading:  'See it in person.',
        bodyText: 'Spaces like this read differently in photographs. The light, the volume, the quiet — come and spend an hour.',
        ctaLabel: 'Arrange a viewing',
        ctaType:  'mailto',
      },
    ],
  })
  console.log('✓ homePage')

  console.log('\n✅ Seed complete.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
