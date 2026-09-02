import { createReadStream } from 'node:fs'
import { getCliClient } from 'sanity/cli'
import { homeFallback } from '../src/content/homeFallback'

const client = getCliClient({ apiVersion: '2025-01-01' })
const mapPath = '/tmp/barnangshuset-area-map.png'

async function updateMosaicAndMap() {
  const current = await client.fetch<{
    images?: Array<{ asset?: { _ref?: string }; alt?: string } | null>
    mapImage?: { asset?: { _ref?: string }; alt?: string }
  }>(`*[_type == "page" && _id == "homePage"][0] {
    "images": [
      building.image,
      gallery.items[0].image,
      gallery.items[1].image,
      gallery.items[2].image,
      gallery.items[3].image,
      materials.mainImage,
      materials.detailImage,
      place.image
    ],
    "mapImage": areaMap.mapImage
  }`)

  const images = (current?.images || []).filter((item): item is NonNullable<typeof item> => Boolean(item?.asset?._ref))
  const items = homeFallback.mosaicGallery.items.map((item, index) => ({
    ...item,
    image: images.length ? images[index % images.length] : undefined,
  }))

  const existingMapRef = current?.mapImage?.asset?._ref
  const mapAsset = existingMapRef ? null : await client.assets.upload('image', createReadStream(mapPath), {
      filename: 'barnangshuset-area-map.png',
      title: 'Barnängshuset area map',
    })
  const mapRef = existingMapRef || mapAsset?._id

  await client.patch('homePage').set({
    mosaicGallery: { ...homeFallback.mosaicGallery, items },
    areaMap: {
      ...homeFallback.areaMap,
      mapImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: mapRef },
        alt: 'Map of eastern Södermalm around Barnängshuset',
      },
    },
  }).commit()

  console.log('Updated the scrolling gallery and area map on homePage.')
}

updateMosaicAndMap().catch((error) => {
  console.error(error)
  process.exit(1)
})
