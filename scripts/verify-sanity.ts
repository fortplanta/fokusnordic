import { getCliClient } from 'sanity/cli'

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
    '*[_id in ["homePage", "drafts.homePage"]]{_id,_type,mosaicGallery{items[]{_key,size,side}}}',
  )
  const published = documents.find((document) => document._id === 'homePage')

  assert(published, 'Published homePage document is missing')
  assert(published._type === 'page', 'Published homePage does not use the page schema')
  documents.forEach(verifyGallery)

  await Promise.all(credentialedOrigins.map(verifyCors))

  const studioResponse = await fetch(studioUrl, { redirect: 'follow' })
  assert(studioResponse.ok, `Hosted Studio is unavailable: ${studioResponse.status}`)

  console.log(`Sanity verified: ${expectedProjectId}/${expectedDataset}`)
  console.log(`Documents checked: ${documents.map((document) => document._id).join(', ')}`)
  console.log(`Credentialed origins checked: ${credentialedOrigins.join(', ')}`)
  console.log(`Hosted Studio checked: ${studioResponse.url}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
