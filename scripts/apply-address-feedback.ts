import { createReadStream } from 'node:fs'
import { basename, resolve } from 'node:path'
import { getCliClient } from 'sanity/cli'

const imageDirectory = process.env.ADDRESS_IMAGE_DIR

if (!imageDirectory) {
  throw new Error('Set ADDRESS_IMAGE_DIR to the directory containing the three supplied photographs.')
}

const photographs = [
  {
    key: 'cafe-nizza',
    path: resolve(imageDirectory, 'Nytorget_26-09-02__DSF9508_klar-1.jpg'),
    caption: 'Café Nizza',
    alt: 'Café Nizza sign mounted on a brick façade in Södermalm',
  },
  {
    key: 'rot',
    path: resolve(imageDirectory, 'Nytorget_26-09-02__DSF9530_klar-1.jpg'),
    caption: 'Local food shops',
    alt: 'Cyclists passing ROT Butik och Kök on Renstiernas gata',
  },
  {
    key: 'vitabergsparken',
    path: resolve(imageDirectory, 'Nytorget_26-09-02__DSF9494_klar-1.jpg'),
    caption: 'Vitabergsparken',
    alt: 'A footpath through Vitabergsparken overlooking Södermalm',
  },
] as const

type Location = { _key?: string; _type?: string; name: string; detail?: string; url?: string; x: number; y: number }
type Category = { _key?: string; _type?: string; title: string; tone?: string; openDesktop?: boolean; openMobile?: boolean; locations?: Location[] }
type HomeDocument = { _id: string; areaMap?: { categories?: Category[] } }

const additions: Location[] = [
  { _key: 'balue', _type: 'object', name: 'Balue', detail: 'Coffee bar', x: 82, y: 54 },
  { _key: 'stella', _type: 'object', name: 'Stella', detail: 'Pizza restaurant', x: 84, y: 61 },
  { _key: 'svedjan', _type: 'object', name: 'Svedjan', detail: 'Bakery', x: 66, y: 70 },
]

const managedLocationKeys = new Set(['balue', 'stella', 'sairu', 'svedjan'])

async function main() {
  const client = getCliClient({ apiVersion: '2025-01-01' })
  const documents = await client.fetch<HomeDocument[]>('*[_id in ["homePage", "drafts.homePage"]]{_id,areaMap{categories}}')

  const gallery = []
  for (const photograph of photographs) {
    const filename = basename(photograph.path)
    const existingRef = await client.fetch<string | null>('*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id', { filename })
    const assetId = existingRef ?? (await client.assets.upload('image', createReadStream(photograph.path), { filename, title: photograph.caption }))._id
    gallery.push({
      _key: photograph.key,
      _type: 'object',
      caption: photograph.caption,
      image: { _type: 'image', alt: photograph.alt, asset: { _type: 'reference', _ref: assetId } },
    })
  }

  for (const document of documents) {
    const categories = (document.areaMap?.categories ?? []).map((category) => {
      if (category._key === 'transport') return { ...category, tone: 'sage' }
      if (category._key !== 'food') return category
      return { ...category, locations: [...(category.locations ?? []).filter((location) => !managedLocationKeys.has(location._key || '')), ...additions] }
    })

    await client.patch(document._id).set({
      'place.gallery': gallery,
      'areaMap.categories': categories,
      'areaMap.travelTitle': 'By bus from Mandelparken',
      'areaMap.travelTimes': [
        { _key: 'slussen', _type: 'object', name: 'Slussen', duration: '9 min' },
        { _key: 'kungstradgarden', _type: 'object', name: 'Kungsträdgården', duration: '15 min' },
        { _key: 'stureplan', _type: 'object', name: 'Stureplan', duration: '19 min' },
      ],
    }).commit({ autoGenerateArrayKeys: true })

    console.log(`Updated ${document._id}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
