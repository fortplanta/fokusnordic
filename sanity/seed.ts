import { createReadStream } from 'node:fs'
import { resolve } from 'node:path'
import { getCliClient } from 'sanity/cli'
import { figmaImageMap } from './figma-image-map'

const client = getCliClient({ apiVersion: '2025-01-01' })

type ImageKey = keyof typeof figmaImageMap

async function uploadImage(key: ImageKey) {
  const item = figmaImageMap[key]
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename: item.file },
  )
  const asset = existing
    ? { _id: existing }
    : await client.assets.upload('image', createReadStream(resolve(process.cwd(), 'sanity/seed-assets', item.file)), {
        filename: item.file,
        title: `${item.group} — ${item.sourceName}`,
      })

  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: item.alt }
}

async function seed() {
  console.log('Uploading selected Figma photography…')
  const entries = await Promise.all(
    (Object.keys(figmaImageMap) as ImageKey[]).map(async (key) => [key, await uploadImage(key)] as const),
  )
  const image = Object.fromEntries(entries) as Record<ImageKey, Awaited<ReturnType<typeof uploadImage>>>
  const existingHomePage = await client.fetch<{ floorPlans?: unknown } | null>(
    `*[_id == "homePage"][0]{floorPlans}`,
  )

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    propertyName: 'Barnängshuset',
    address: 'Nackagatan 4, 116 40 Stockholm',
    coordinates: { lat: 59.3148, lng: 18.0717 },
    leasingContact: {
      name: 'Nina de Besche',
      role: 'Managing Partner',
      email: 'nina.debesche@avantipartners.se',
      phone: '+46 733 49 87 46',
    },
    metaTitle: 'Barnängshuset — Office Space in Södermalm',
    metaDescription: 'Up to 9,762 m² of office space across three principal floors at Nackagatan 4, Södermalm.',
    ogImage: image.hero,
    footerInvite: 'Barnängshuset',
  })

  await client.createOrReplace({
    _id: 'homePage',
    _type: 'page',
    title: 'Home',
    hero: {
      heading: 'Room to think.',
      body: 'Three principal floors, up to 9,762 m², in a building made for daylight. Nackagatan 4 is close to central Stockholm, without sharing its pace.',
      ctaLabel: 'See the available space',
      image: image.hero,
    },
    building: {
      kicker: 'The building',
      heading: 'A 1917 mill with nearly five metres overhead.',
      body: 'Barnängshuset began as a cotton-spinning mill. The reason for its scale was practical: large working floors, ceilings approaching five metres and windows that carried daylight deep into the building. Refurbished between 2019 and 2023, those conditions now frame up to 9,762 m² of office space.',
      image: image.building,
    },
    volume: {
      kicker: 'Light and volume',
      heading: 'Daylight, all the way through.',
      mainImage: image.volumeMain,
      detailImage: image.volumeDetail,
      qualities: [
        { _key: 'ceiling', label: 'Ceiling height', value: '4.9 metres' },
        { _key: 'windows', label: 'Windows', value: 'Floor to ceiling' },
        { _key: 'breeam', label: 'Environmental standard', value: 'BREEAM In-Use · Excellent' },
        { _key: 'ventilation', label: 'Ventilation capacity', value: '1 person per 8 m²' },
      ],
    },
    gallery: {
      kicker: 'A closer look',
      heading: 'From Nackagatan to the floorplate.',
      body: 'The gallery follows the route through the building: façade, stair, working floor and material detail.',
      items: [
        { _key: 'arrival', caption: 'Arrival · Nackagatan façade', layout: 'wide', image: image.galleryArrival },
        { _key: 'vertical', caption: 'Vertical core · stair and light', layout: 'portrait', image: image.galleryLobby },
        { _key: 'working', caption: 'Working volume · windows and floorplate', layout: 'wide', image: image.galleryWorkplace },
        { _key: 'material', caption: 'Material detail · brick and stone', layout: 'compact', image: image.galleryMaterial },
      ],
    },
    opportunity: {
      kicker: 'The opportunity',
      heading: 'Nearly 10,000 m² on Södermalm.',
      body: 'The available space extends across three principal office floors. It is presented as one coherent workplace.',
      ctaLabel: 'Discuss the space',
      image: image.opportunity,
      facts: [
        { _key: 'area', label: 'Available area', value: 'Up to 9,762 m²' },
        { _key: 'floors', label: 'Office floors', value: 'Three principal floors' },
        { _key: 'move-in', label: 'Move-in', value: 'By agreement' },
      ],
    },
    ...(existingHomePage?.floorPlans ? { floorPlans: existingHomePage.floorPlans } : {}),
    materials: {
      kicker: 'Material character',
      heading: 'Brick, steel, oak and stone.',
      body: 'Original brick and structural steel sit alongside oak, terrazzo, stone and dark metalwork introduced during refurbishment.',
      mainImage: image.materialsMain,
      detailImage: image.materialsDetail,
    },
    place: {
      kicker: 'The address',
      heading: 'Södermalm, at a quieter edge.',
      body: 'Nackagatan 4 is close to Vitabergsparken, local restaurants and the water.',
      image: image.place,
      nearby: [
        { _key: 'vita', name: 'Vitabergsparken', detail: 'A short walk' },
        { _key: 'slussen', name: 'Slussen', detail: '9 min by bus' },
        { _key: 'skanstull', name: 'Skanstull', detail: '2 min by metro' },
        { _key: 'kanal', name: 'Hammarby kanal', detail: 'Future metro, 2030' },
      ],
    },
    viewing: {
      kicker: 'Arrange a viewing',
      heading: 'See the floors in person.',
      body: 'A viewing covers the available floors, daylight conditions and the practical requirements of your organisation.',
      ctaLabel: 'Arrange a viewing',
      image: image.viewing,
    },
  })

  console.log('Sanity now contains the current page copy and selected Figma photography.')
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
