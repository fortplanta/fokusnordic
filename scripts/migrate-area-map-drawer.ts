import { getCliClient } from 'sanity/cli'

type Marker = {
  _key?: string
  name: string
  detail?: string
  category?: string
  url?: string
  x: number
  y: number
}

type HomeDocument = {
  _id: string
  areaMap?: Record<string, unknown> & { markers?: Marker[]; categories?: unknown[] }
}

const categoryConfig = [
  { key: 'food', title: 'Food & Drinks', source: 'Food', tone: 'wine', openMobile: true },
  { key: 'transport', title: 'Metro stations', source: 'Transport', tone: 'ink', openMobile: false },
  { key: 'outdoors', title: 'Parks', source: 'Outdoors', tone: 'coral', openMobile: false },
]

async function main() {
  const client = getCliClient({ apiVersion: '2025-01-01' })
  const documents = await client.fetch<HomeDocument[]>(
    '*[_id in ["homePage", "drafts.homePage"]]{_id,areaMap}',
  )

  for (const document of documents) {
    const areaMap = document.areaMap
    if (!areaMap || areaMap.categories?.length) continue

    const markers = areaMap.markers ?? []
    const categories = categoryConfig.map((category) => ({
    _key: category.key,
    _type: 'object',
    title: category.title,
    tone: category.tone,
    openDesktop: true,
    openMobile: category.openMobile,
    locations: markers
      .filter((marker) => marker.category === category.source)
      .map(({ category: _category, ...marker }) => ({ ...marker, _type: 'object' })),
    })).filter((category) => category.locations.length)

    await client.patch(document._id).set({
    'areaMap.drawerTitle': 'Map guide',
    'areaMap.drawerOpenDesktop': true,
    'areaMap.drawerOpenMobile': false,
    'areaMap.nearbyTitle': 'Close at hand',
    'areaMap.nearbyOpenDesktop': true,
    'areaMap.nearbyOpenMobile': true,
    'areaMap.categories': categories,
    'areaMap.travelTitle': 'Travel times',
    'areaMap.travelOpenDesktop': true,
    'areaMap.travelOpenMobile': false,
    'areaMap.travelTimes': [
      { _key: 'skanstull', _type: 'object', name: 'Skanstull', duration: '8 min' },
      { _key: 'hammarby', _type: 'object', name: 'Hammarby kanal', duration: '8 min' },
    ],
    }).unset(['areaMap.markers']).commit()

    console.log(`Migrated ${document._id}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
