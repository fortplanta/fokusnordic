import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2025-01-01' })

type HomeSections = {
  areaMap?: unknown
  volume?: {
    featureStatements?: unknown[]
    specificationGroups?: unknown[]
  }
}

async function repairDraftSections() {
  const [published, draft] = await Promise.all([
    client.fetch<HomeSections | null>('*[_id == "homePage"][0]{areaMap,volume}'),
    client.fetch<HomeSections | null>('*[_id == "drafts.homePage"][0]{areaMap,volume}'),
  ])

  if (!published || !draft) throw new Error('Both published and draft home pages are required')

  const missing: Record<string, unknown> = {}
  if (!draft.areaMap && published.areaMap) missing.areaMap = published.areaMap
  if (!draft.volume?.featureStatements?.length && published.volume?.featureStatements) {
    missing['volume.featureStatements'] = published.volume.featureStatements
  }
  if (!draft.volume?.specificationGroups?.length && published.volume?.specificationGroups) {
    missing['volume.specificationGroups'] = published.volume.specificationGroups
  }

  if (!Object.keys(missing).length) {
    console.log('No required draft sections were missing.')
    return
  }

  await client.patch('drafts.homePage').setIfMissing({ volume: {} }).set(missing).commit()
  console.log(`Restored draft fields: ${Object.keys(missing).join(', ')}`)
}

repairDraftSections().catch((error) => {
  console.error(error)
  process.exit(1)
})
