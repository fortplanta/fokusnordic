import { getCliClient } from 'sanity/cli'
import { vercelStegaCombine } from '@vercel/stega'
import { gallerySide, gallerySize, mapTone } from '../src/lib/sanityControls'

const expectedProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'wvgj6m8r'
const expectedDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const studioUrl = process.env.SANITY_STUDIO_URL ?? 'https://barnangshuset.netlify.app/studio'
const credentialedOrigins = [
  'https://barnangshuset.netlify.app',
  'http://localhost:4176',
]

const allowedGallerySizes = new Set(['compact', 'wide', 'portrait'])
const allowedGallerySides = new Set(['left', 'right'])
const allowedMapTones = new Set(['wine', 'coral', 'sage', 'ink'])

// Main level and mezzanine are separate, independently rentable configurations
// that happen to share a floor — never merge them back into one listing.
const expectedSuiteTables: Record<string, { areas: string[]; total: string; rooms?: string[]; seating?: string[] }> = {
  'Suite 1': {areas: ['Floor 0=864'], total: '864 m²', rooms: ['Focus=3', 'Meeting 4=1', 'Meeting 6=4', 'Meeting 8=1'], seating: ['Lunch room=29', 'Open workstation=69', 'Touch down=34']},
  'Suite 1 Mezzanine': {areas: ['Floor 0 [Mezzanine]=423'], total: '423 m²'},
  'Suite 2': {areas: ['Floor 0=1 007'], total: '1 007 m²', rooms: ['Meeting 10=3', 'Meeting 12=1', 'Meeting 14=1', 'Meeting 4=1', 'Meeting 6=4', 'Meeting 8=1', 'Phone=2'], seating: ['Lunch room=71', 'Open workstation=90', 'Touch down=16']},
  'Suite 2 Mezzanine': {areas: ['Floor 0 [Mezzanine]=417'], total: '417 m²'},
  'Suite 3': {areas: ['Floor 1=989'], total: '989 m²', rooms: ['Focus=1', 'Meeting 12=2', 'Meeting 18=1', 'Meeting 4=4', 'Meeting 6=3'], seating: ['Lunch room=66', 'Open workstation=76', 'Touch down=21']},
  'Suite 3 Mezzanine': {areas: ['Floor 1 [Mezzanine]=341'], total: '341 m²'},
  'Suite 4': {areas: ['Floor 1=952'], total: '952 m²', rooms: ['Focus=1', 'Meeting 14=1', 'Meeting 4=4', 'Meeting 6=2', 'Meeting 8=1', 'Phone=1'], seating: ['Lunch room=60', 'Open workstation=82', 'Touch down=46']},
  'Suite 4 Mezzanine': {areas: ['Floor 1 [Mezzanine]=303'], total: '303 m²'},
  'Suite 5': {areas: ['Floor 2=1 292'], total: '1 292 m²', rooms: ['Focus=15', 'Meeting 10=1', 'Meeting 14=1', 'Meeting 16=1', 'Meeting 4=3', 'Meeting 6=5', 'Meeting 8=2', 'Phone=6'], seating: ['Lunch room=71', 'Open workstation=120', 'Touch down=33']},
  'Suite 5 Mezzanine': {areas: ['Floor 2 [Mezzanine]=821'], total: '821 m²'},
  'Suite 6': {areas: ['Floor 2=859'], total: '859 m²', rooms: ['Focus=3', 'Meeting 10=1', 'Meeting 10/studio=1', 'Meeting 12=1', 'Meeting 2=2', 'Meeting 4=3', 'Meeting 6=2'], seating: ['Lunch room=32', 'Open workstation=90', 'Touch down=24']},
  'Suite 6 Mezzanine': {areas: ['Floor 2 [Mezzanine]=393'], total: '393 m²'},
  'Suite 7': {areas: ['Floor 2=755'], total: '755 m²', rooms: ['Focus=2', 'Meeting 14=1', 'Meeting 4=3', 'Meeting 6=2', 'Meeting 8=3', 'Phone=3'], seating: ['Lunch room=48', 'Open workstation=80', 'Touch down=22']},
  'Suite 7 Mezzanine': {areas: ['Floor 2 [Mezzanine]=347'], total: '347 m²'},
}

type GalleryItem = { _key?: string; size?: string; side?: string; image?: { asset?: { _ref?: string } } }
type HomeDocument = {
  _id: string
  _type: string
  mosaicGallery?: { items?: GalleryItem[] }
  volume?: {
    kicker?: string
    heading?: string
    body?: string
    featureStatements?: Array<{ heading?: string; body?: string }>
  }
  specifications?: {
    kicker?: string
    heading?: string
    body?: string
    specificationGroups?: Array<{ title?: string; facts?: Array<{ value?: string }> }>
  }
  floorPlans?: {
    detailsLabel?: string
    ctaLabel?: string
    ctaUrl?: string
    floors?: Array<{
      label?: string
      configurations?: Array<{
        title?: string
        name?: string
        levelLabel?: string
        informationNote?: string
        detailTables?: Array<{ title?: string; rows?: Array<{ label?: string; value?: string }>; footer?: string }>
        planImage?: { asset?: { _ref?: string } }
        explodedImage?: { alt?: string; asset?: { _ref?: string }; originalFilename?: string }
      }>
    }>
  }
  areaMap?: {
    mapImage?: { asset?: { _ref?: string } }
    buildingX?: number
    buildingY?: number
    pois?: Array<{ _id?: string; name?: string; mapX?: number; mapY?: number } | null>
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function verifyGallery(document: HomeDocument) {
  const items = document.mosaicGallery?.items ?? []

  items.forEach((item, index) => {
    assert(item.image?.asset?._ref, `${document._id}: gallery item ${index + 1} has no image`)
    assert(item.size && allowedGallerySizes.has(item.size), `${document._id}: gallery item ${index + 1} has an invalid or missing size`)
    assert(item.side && allowedGallerySides.has(item.side), `${document._id}: gallery item ${index + 1} has an invalid or missing side`)
  })
}

function verifyVolume(document: HomeDocument) {
  const statements = document.volume?.featureStatements ?? []
  const groups = document.specifications?.specificationGroups ?? []

  assert(document.volume?.heading && document.volume?.kicker, `${document._id}: upper section copy is missing`)
  assert(document.specifications?.heading && document.specifications?.kicker, `${document._id}: independent lower section copy is missing`)
  assert(statements.length > 0, `${document._id}: Light and volume has no building conditions`)
  assert(groups.length > 0, `${document._id}: Light and volume has no specification groups`)
  statements.forEach((item, index) => {
    assert(item.heading && item.body, `${document._id}: building condition ${index + 1} is incomplete`)
  })
  groups.forEach((group, index) => {
    assert(group.title && group.facts?.length, `${document._id}: specification group ${index + 1} is incomplete`)
  })
}

function verifyAreaMap(document: HomeDocument) {
  const map = document.areaMap
  assert(map?.mapImage?.asset?._ref, `${document._id}: Area map has no image`)
  const coordinate = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100
  assert(coordinate(map.buildingX) && coordinate(map.buildingY), `${document._id}: Building pin has missing or invalid coordinates`)
  assert(map.pois?.length, `${document._id}: Area map has no points of interest`)
  map.pois.forEach((poi, index) => {
    assert(poi?._id && poi.name, `${document._id}: Map POI ${index + 1} is missing or unresolved`)
    assert(coordinate(poi.mapX) && coordinate(poi.mapY), `${document._id}: ${poi.name} has missing or invalid map coordinates`)
  })
}

function verifyFloorPlans(document: HomeDocument) {
  const section = document.floorPlans
  const floors = section?.floors ?? []

  assert(section?.detailsLabel, `${document._id}: Floor plans has no mobile details label`)
  assert(section?.ctaLabel && section.ctaUrl, `${document._id}: Floor plans has no enquiry link`)
  assert(floors.length > 0, `${document._id}: Floor plans has no floors`)
  let totalConfigurations = 0
  floors.forEach((floor, floorIndex) => {
    assert(floor.label, `${document._id}: Floor ${floorIndex + 1} has no label`)
    assert(floor.configurations?.length, `${document._id}: ${floor.label || `Floor ${floorIndex + 1}`} has no configurations`)
    totalConfigurations += floor.configurations.length
    floor.configurations.forEach((configuration, configurationIndex) => {
      const suiteName = configuration.name || configuration.title || ''
      assert(configuration.title, `${document._id}: ${floor.label} configuration ${configurationIndex + 1} has no title`)
      const expected = expectedSuiteTables[suiteName]
      assert(expected, `${document._id}: unexpected suite name ${suiteName}`)

      // Main level and mezzanine are separate, independently rentable listings —
      // a mezzanine configuration must never carry the main level's own room and
      // seating counts, since it does not include that space.
      const isMezzanine = suiteName.endsWith('Mezzanine')
      assert(isMezzanine === !expected.rooms, `${document._id}: ${suiteName} main/mezzanine split does not match its expected table shape`)
      assert(configuration.levelLabel === (isMezzanine ? 'Mezzanine' : 'Main level'), `${document._id}: ${suiteName} has an incorrect or missing level label`)

      if (isMezzanine) assert(configuration.informationNote, `${document._id}: ${suiteName} has no independent-rental information note`)

      const expectedTableCount = expected.rooms ? 3 : 1
      assert(configuration.detailTables?.length === expectedTableCount, `${document._id}: ${suiteName} must contain exactly ${expectedTableCount} information table(s)`)
      configuration.detailTables?.forEach((table, tableIndex) => {
        assert(table.title && table.rows?.length, `${document._id}: ${suiteName} information table ${tableIndex + 1} is incomplete`)
      })
      const tableRows = (index: number) => configuration.detailTables?.[index]?.rows?.map((row) => `${row.label}=${row.value}`) ?? []
      assert(JSON.stringify(tableRows(0)) === JSON.stringify(expected.areas), `${document._id}: ${suiteName} area values do not match the supplied PDF`)
      assert(configuration.detailTables?.[0]?.footer === expected.total, `${document._id}: ${suiteName} total area does not match the supplied PDF`)
      if (expected.rooms) assert(JSON.stringify(tableRows(1)) === JSON.stringify(expected.rooms), `${document._id}: ${suiteName} room values do not match the supplied PDF`)
      if (expected.seating) assert(JSON.stringify(tableRows(2)) === JSON.stringify(expected.seating), `${document._id}: ${suiteName} seating values do not match the supplied PDF`)

      assert(configuration.planImage?.asset?._ref, `${document._id}: ${floor.label} configuration ${configurationIndex + 1} has no plan image`)
      assert(configuration.explodedImage?.asset?._ref, `${document._id}: ${floor.label} configuration ${configurationIndex + 1} has no AXO diagram`)
      assert(configuration.explodedImage?.originalFilename?.toLowerCase().endsWith('.svg'), `${document._id}: ${floor.label} configuration ${configurationIndex + 1} AXO diagram is not an SVG`)
      assert(configuration.explodedImage?.alt, `${document._id}: ${floor.label} configuration ${configurationIndex + 1} AXO diagram has no alt text`)
    })
  })
  assert(totalConfigurations === Object.keys(expectedSuiteTables).length, `${document._id}: expected ${Object.keys(expectedSuiteTables).length} independently rentable configurations, found ${totalConfigurations}`)
}

function verifyPresentationControls() {
  const metadata = { origin: 'sanity.io', href: studioUrl }

  for (const size of allowedGallerySizes) {
    assert(gallerySize(vercelStegaCombine(size, metadata)) === size, `Presentation metadata breaks the ${size} gallery format`)
  }
  for (const side of allowedGallerySides) {
    assert(gallerySide(vercelStegaCombine(side, metadata)) === side, `Presentation metadata breaks the ${side} gallery position`)
  }
  for (const tone of allowedMapTones) {
    assert(mapTone(vercelStegaCombine(tone, metadata)) === tone, `Presentation metadata breaks the ${tone} map tone`)
  }
}

async function verifyCors(origin: string) {
  const query = encodeURIComponent('*[_id == "homePage"][0]._id')
  const endpoint = `https://${expectedProjectId}.api.sanity.io/v2025-01-01/data/query/${expectedDataset}?query=${query}`
  const response = await fetch(endpoint, { headers: { Origin: origin } })

  assert(response.ok, `Sanity API request failed for ${origin}: ${response.status}`)
  assert(response.headers.get('access-control-allow-origin') === origin, `${origin} is missing from Sanity CORS`)
  assert(response.headers.get('access-control-allow-credentials') === 'true', `${origin} does not allow credentialed Sanity requests`)
}

async function main() {
  const client = getCliClient({ apiVersion: '2025-01-01' })
  const config = client.config()

  assert(config.projectId === expectedProjectId, `Expected Sanity project ${expectedProjectId}, received ${config.projectId}`)
  assert(config.dataset === expectedDataset, `Expected Sanity dataset ${expectedDataset}, received ${config.dataset}`)

  const documents = await client.fetch<HomeDocument[]>(
    '*[_id in ["homePage", "drafts.homePage"]]{_id,_type,mosaicGallery{items[]{_key,size,side,image{asset}}},volume{kicker,heading,body,featureStatements[]{heading,body}},specifications{kicker,heading,body,specificationGroups[]{title,facts[]{value}}},floorPlans{detailsLabel,ctaLabel,ctaUrl,floors[]{label,configurations[]{title,name,levelLabel,informationNote,detailTables[]{title,rows[]{label,value},footer},planImage{asset},explodedImage{alt,asset,"originalFilename":asset->originalFilename}}}},areaMap{mapImage{asset},buildingX,buildingY,pois[]->{_id,name,mapX,mapY}}}',
  )
  const published = documents.find((document) => document._id === 'homePage')

  assert(published, 'Published homePage document is missing')
  assert(published._type === 'page', 'Published homePage does not use the page schema')
  documents.forEach((document) => {
    verifyGallery(document)
    verifyVolume(document)
    verifyFloorPlans(document)
    verifyAreaMap(document)
  })
  verifyPresentationControls()

  await Promise.all(credentialedOrigins.map(verifyCors))

  const studioResponse = await fetch(studioUrl, { redirect: 'follow' })
  assert(studioResponse.ok, `Hosted Studio is unavailable: ${studioResponse.status}`)
  const studioHtml = await studioResponse.text()
  assert(studioHtml.includes('https://core.sanity-cdn.com/bridge.js'), 'Hosted Studio is missing the Sanity Dashboard bridge')

  const manifestResponse = await fetch(`${studioUrl}/static/create-manifest.json`)
  assert(manifestResponse.ok, `Hosted Studio manifest is unavailable: ${manifestResponse.status}`)
  const manifest = await manifestResponse.json() as { workspaces?: unknown[] }
  assert(manifest.workspaces?.length, 'Hosted Studio manifest has no workspaces')

  console.log(`Sanity verified: ${expectedProjectId}/${expectedDataset}`)
  console.log(`Documents checked: ${documents.map((document) => document._id).join(', ')}`)
  console.log('Presentation control encoding checked: gallery size, side, and map tone')
  console.log(`Credentialed origins checked: ${credentialedOrigins.join(', ')}`)
  console.log(`Hosted Studio checked: ${studioResponse.url}`)
  console.log(`Dashboard bridge and manifest checked: ${studioUrl}/static/create-manifest.json`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
