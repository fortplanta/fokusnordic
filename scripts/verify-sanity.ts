import { getCliClient } from 'sanity/cli'
import { vercelStegaCombine } from '@vercel/stega'
import { gallerySide, gallerySize } from '../src/lib/sanityControls'

const expectedProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'wvgj6m8r'
const expectedDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const studioUrl = process.env.SANITY_STUDIO_URL ?? 'https://barnangshuset.netlify.app/studio'
const credentialedOrigins = [
  'https://barnangshuset.netlify.app',
  'http://localhost:4176',
]

const allowedGallerySizes = new Set(['compact', 'wide', 'portrait'])
const allowedGallerySides = new Set(['left', 'right'])

type GalleryItem = { _key?: string; size?: string; side?: string }
type HomeDocument = {
  _id: string
  _type: string
  mosaicGallery?: { items?: GalleryItem[] }
  volume?: {
    featureStatements?: Array<{ heading?: string; body?: string }>
    specificationGroups?: Array<{ title?: string; facts?: Array<{ value?: string }> }>
  }
  areaMap?: {
    mapImage?: { asset?: { _ref?: string } }
    drawerTitle?: string
    buildingMarker?: {
      alt?: string
      x?: number
      y?: number
      width?: number
      icon?: { asset?: { _ref?: string } }
    }
    categories?: Array<{
      title?: string
      tone?: string
      locations?: Array<{ name?: string; x?: number; y?: number }>
    }>
    travelTimes?: Array<{ name?: string; duration?: string }>
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function verifyGallery(document: HomeDocument) {
  const items = document.mosaicGallery?.items ?? []

  items.forEach((item, index) => {
    assert(item.size && allowedGallerySizes.has(item.size), `${document._id}: gallery item ${index + 1} has an invalid or missing size`)
    assert(item.side && allowedGallerySides.has(item.side), `${document._id}: gallery item ${index + 1} has an invalid or missing side`)
  })
}

function verifyVolume(document: HomeDocument) {
  const statements = document.volume?.featureStatements ?? []
  const groups = document.volume?.specificationGroups ?? []

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
  const categories = document.areaMap?.categories ?? []

  assert(document.areaMap?.mapImage?.asset?._ref, `${document._id}: Area map has no image`)
  assert(document.areaMap?.drawerTitle, `${document._id}: Area map has no drawer title`)
  assert(document.areaMap?.buildingMarker?.icon?.asset?._ref, `${document._id}: Area map has no building marker SVG`)
  assert(document.areaMap?.buildingMarker?.alt, `${document._id}: Area map building marker has no accessible label`)
  assert(typeof document.areaMap?.buildingMarker?.x === 'number' && typeof document.areaMap?.buildingMarker?.y === 'number', `${document._id}: Area map building marker has no coordinates`)
  assert(typeof document.areaMap?.buildingMarker?.width === 'number', `${document._id}: Area map building marker has no width`)
  assert(categories.length > 0, `${document._id}: Area map has no location categories`)
  categories.forEach((category, categoryIndex) => {
    assert(category.title, `${document._id}: Area map category ${categoryIndex + 1} has no title`)
    assert(category.locations?.length, `${document._id}: Area map category ${categoryIndex + 1} has no locations`)
    category.locations.forEach((marker, markerIndex) => {
      assert(marker.name, `${document._id}: Area map category ${categoryIndex + 1}, location ${markerIndex + 1} has no name`)
      assert(typeof marker.x === 'number' && typeof marker.y === 'number', `${document._id}: Area map location ${marker.name || markerIndex + 1} has no coordinates`)
    })
  })
}

function verifyPresentationControls() {
  const metadata = { origin: 'sanity.io', href: studioUrl }

  for (const size of allowedGallerySizes) {
    assert(gallerySize(vercelStegaCombine(size, metadata)) === size, `Presentation metadata breaks the ${size} gallery format`)
  }
  for (const side of allowedGallerySides) {
    assert(gallerySide(vercelStegaCombine(side, metadata)) === side, `Presentation metadata breaks the ${side} gallery position`)
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
    '*[_id in ["homePage", "drafts.homePage"]]{_id,_type,mosaicGallery{items[]{_key,size,side}},volume{featureStatements[]{heading,body},specificationGroups[]{title,facts[]{value}}},areaMap{mapImage{asset},drawerTitle,buildingMarker{alt,x,y,width,icon{asset}},categories[]{title,tone,locations[]{name,x,y}},travelTimes[]{name,duration}}}',
  )
  const published = documents.find((document) => document._id === 'homePage')

  assert(published, 'Published homePage document is missing')
  assert(published._type === 'page', 'Published homePage does not use the page schema')
  documents.forEach((document) => {
    verifyGallery(document)
    verifyVolume(document)
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
  console.log('Presentation control encoding checked: gallery size and side')
  console.log(`Credentialed origins checked: ${credentialedOrigins.join(', ')}`)
  console.log(`Hosted Studio checked: ${studioResponse.url}`)
  console.log(`Dashboard bridge and manifest checked: ${studioUrl}/static/create-manifest.json`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
