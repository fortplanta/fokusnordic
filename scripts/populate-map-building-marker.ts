import { createReadStream } from 'node:fs'
import { resolve } from 'node:path'
import { getCliClient } from 'sanity/cli'

type HomeDocument = {
  _id: string
  areaMap?: {
    buildingMarker?: { icon?: { asset?: { _ref?: string } } }
  }
}

async function main() {
  const client = getCliClient({ apiVersion: '2025-01-01' })
  const documents = await client.fetch<HomeDocument[]>(
    '*[_id in ["homePage", "drafts.homePage"]]{_id,areaMap{buildingMarker}}',
  )
  const existingRef = documents
    .map((document) => document.areaMap?.buildingMarker?.icon?.asset?._ref)
    .find(Boolean)

  const assetRef = existingRef ?? (await client.assets.upload(
    'file',
    createReadStream(resolve('public/assets/barnangshuset_logo-neg.svg')),
    { filename: 'barnangshuset-map-marker.svg', contentType: 'image/svg+xml' },
  ))._id

  for (const document of documents) {
    await client.patch(document._id).set({
      'areaMap.drawerTitle': 'Explore the area',
      'areaMap.buildingMarker': {
        _type: 'object',
        alt: 'Barnängshuset, Nackagatan 4',
        x: 74,
        y: 28,
        width: 13,
        icon: { _type: 'file', asset: { _type: 'reference', _ref: assetRef } },
      },
    }).commit()
    console.log(`Populated ${document._id}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
