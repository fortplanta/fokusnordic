import { getCliClient } from 'sanity/cli'

// Reverses "Pair floor plan levels by suite": a suite's main level and its
// mezzanine are separate, independently rentable units that happen to share a
// floor (e.g. "Suite 1" and "Suite 1 Mezzanine") — never one combined listing.
// This splits each paired configuration back into two, immediately adjacent
// entries in the same floor's configurations array.

type Image = { _type: 'image'; asset?: { _ref?: string; _type: 'reference' }; alt?: string }
type Fact = { _key?: string; label?: string; value?: string }
type TableRow = { _key?: string; label?: string; value?: string; accent?: boolean }
type DetailTable = { _key?: string; title?: string; labelHeading?: string; valueHeading?: string; rows?: TableRow[]; footer?: string }

type Configuration = {
  _key: string
  title?: string
  name?: string
  body?: string
  facts?: Fact[]
  detailTables?: DetailTable[]
  mainLevelLabel?: string
  planImage?: Image
  explodedImage?: Image
  mezzanineLevelLabel?: string
  mezzaninePlanImage?: Image
  mezzanineExplodedImage?: Image
}

type Floor = { _key: string; label?: string; configurations?: Configuration[] }
type HomeDocument = { _id: string; floorPlans?: { floors?: Floor[] } }

function splitAreaTable(table: DetailTable): { main: DetailTable; mezzanine: DetailTable } | null {
  const rows = table.rows ?? []
  const mainRow = rows.find((row) => row._key === 'main-level')
  const mezzanineRow = rows.find((row) => row._key === 'mezzanine')
  if (!mainRow || !mezzanineRow) return null

  const unit = table.footer?.match(/[^\d,.\s]+$/)?.[0]?.trim() || 'm²'
  return {
    main: { ...table, rows: [mainRow], footer: `${mainRow.value} ${unit}` },
    mezzanine: { ...table, rows: [mezzanineRow], footer: `${mezzanineRow.value} ${unit}` },
  }
}

function splitConfiguration(configuration: Configuration): Configuration[] {
  if (!configuration.mezzaninePlanImage && !configuration.mezzanineExplodedImage) {
    // Not a paired configuration — nothing to split, pass it through unchanged.
    return [{
      _key: configuration._key,
      title: configuration.title,
      name: configuration.name,
      body: configuration.body,
      facts: configuration.facts,
      detailTables: configuration.detailTables,
      planImage: configuration.planImage,
      explodedImage: configuration.explodedImage,
    }]
  }

  const [areaTable, ...otherTables] = configuration.detailTables ?? []
  const split = areaTable ? splitAreaTable(areaTable) : null

  const mainTitle = configuration.title || configuration.name || configuration._key
  const mezzanineTitle = `${mainTitle} Mezzanine`

  const mainConfig: Configuration & { levelLabel: string } = {
    _key: configuration._key,
    title: configuration.title,
    name: configuration.name,
    body: configuration.body?.toLowerCase().includes('shown as one configuration') ? undefined : configuration.body,
    levelLabel: 'Main level',
    facts: configuration.facts,
    detailTables: split ? [split.main, ...otherTables] : configuration.detailTables,
    planImage: configuration.planImage,
    explodedImage: configuration.explodedImage,
  }

  const mezzanineConfig: Configuration & { levelLabel: string } = {
    _key: `${configuration._key}-mezzanine`,
    title: mezzanineTitle,
    levelLabel: 'Mezzanine',
    detailTables: split ? [split.mezzanine] : undefined,
    planImage: configuration.mezzaninePlanImage,
    explodedImage: configuration.mezzanineExplodedImage,
  }

  return [mainConfig, mezzanineConfig]
}

async function main() {
  console.log('Starting floor-plan mezzanine split')
  const client = getCliClient({ apiVersion: '2025-01-01' }).withConfig({ perspective: 'raw' })
  const documents = await client.fetch<HomeDocument[]>(
    `*[_id in ["homePage", "drafts.homePage"]]{
      _id,
      floorPlans{floors[]{_key,label,configurations[]{
        _key, title, name, body, facts, detailTables,
        mainLevelLabel, planImage, explodedImage,
        mezzanineLevelLabel, mezzaninePlanImage, mezzanineExplodedImage
      }}}
    }`,
  )
  console.log(`Found ${documents.length} home page document(s)`)

  for (const document of documents) {
    const floors = document.floorPlans?.floors ?? []
    if (!floors.length) continue

    let before = 0
    let after = 0
    const splitFloors = floors.map((floor) => {
      const configurations = floor.configurations ?? []
      before += configurations.length
      const expanded = configurations.flatMap(splitConfiguration)
      after += expanded.length
      return { ...floor, configurations: expanded }
    })

    await client.patch(document._id).set({ 'floorPlans.floors': splitFloors }).commit({ autoGenerateArrayKeys: true })
    console.log(`${document._id}: split ${before} configuration(s) into ${after}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
