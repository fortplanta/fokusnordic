import { getCliClient } from 'sanity/cli'
import { homeFallback } from '../src/content/homeFallback'

/*
  Populates the "Close at hand" map section: creates/updates one `poi`
  document per neighbourhood place (content lifted from homeFallback, which
  mirrors the brief's reference list) and points homePage.areaMap at them
  by reference. mapX/mapY position each pin on the static map image, which
  is NOT uploaded here — do that once in Sanity Studio (Area map → Map
  image), then fine-tune each poi's map position and areaMap.buildingX/Y
  against the real image.

  Run with:
    npx sanity exec scripts/seed-neighbourhood-pois.ts --with-user-token
*/

const client = getCliClient({ apiVersion: '2025-01-01' })

async function main() {
  const pois = homeFallback.areaMap.pois

  const transaction = client.transaction()
  for (const poi of pois) {
    transaction.createOrReplace({
      _id: poi._id,
      _type: 'poi',
      name: poi.name,
      description: poi.description,
      category: poi.category,
      walkingMinutes: poi.walkingMinutes,
      mapX: poi.mapX,
      mapY: poi.mapY,
      lat: poi.lat,
      lng: poi.lng,
      sortOrder: poi.sortOrder,
      showRoute: poi.showRoute ?? false,
    })
  }
  await transaction.commit()
  console.log(`Created/updated ${pois.length} poi documents.`)

  const documents = await client.fetch<Array<{ _id: string }>>(
    '*[_id in ["homePage", "drafts.homePage"]]{_id}',
  )

  for (const document of documents) {
    await client.patch(document._id).set({
      'areaMap.kicker': homeFallback.areaMap.kicker,
      'areaMap.heading': homeFallback.areaMap.heading,
      'areaMap.supportingLine': homeFallback.areaMap.supportingLine,
      'areaMap.buildingX': homeFallback.areaMap.buildingX,
      'areaMap.buildingY': homeFallback.areaMap.buildingY,
      'areaMap.pois': pois.map((poi) => ({
        _type: 'reference',
        _ref: poi._id,
        _key: poi._id,
      })),
    }).commit()
    console.log(`Wired areaMap on ${document._id} — remember to upload areaMap.mapImage in Studio.`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
