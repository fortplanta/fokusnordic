import { getCliClient } from 'sanity/cli'
import { homeFallback } from '../src/content/homeFallback'

const client = getCliClient({ apiVersion: '2025-01-01' })

async function updateVolumeSection() {
  const current = await client.fetch<{
    volume?: { featureStatements?: Array<{ _key?: string; image?: unknown }> }
    images?: unknown[]
  }>(`*[_type == "page" && _id == "homePage"][0] {
    volume { featureStatements[] { _key, image } },
    "images": [
      building.image,
      gallery.items[0].image,
      gallery.items[1].image,
      gallery.items[2].image,
      gallery.items[3].image,
      materials.mainImage,
      place.image,
      opportunity.image
    ]
  }`)

  const existingImages = new Map(
    (current?.volume?.featureStatements || []).map((item) => [item._key, item.image]),
  )
  const availableImages = (current?.images || []).filter(Boolean)
  const featureStatements = homeFallback.volume.featureStatements.map((item, index) => ({
    ...item,
    image: existingImages.get(item._key) || (availableImages.length ? availableImages[index % availableImages.length] : undefined),
  }))

  await client
    .patch('homePage')
    .set({ volume: { ...homeFallback.volume, featureStatements } })
    .commit()

  console.log('Updated the Light and volume section on homePage.')
}

updateVolumeSection().catch((error) => {
  console.error(error)
  process.exit(1)
})
