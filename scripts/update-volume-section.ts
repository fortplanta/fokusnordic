import { getCliClient } from 'sanity/cli'
import { homeFallback } from '../src/content/homeFallback'

const client = getCliClient({ apiVersion: '2025-01-01' })

async function updateVolumeSection() {
  const published = await client.fetch<{ volume?: typeof homeFallback.volume } | null>(
    '*[_id == "homePage"][0]{volume}',
  )
  const source = published?.volume ?? homeFallback.volume

  await Promise.all([
    client.patch('homePage').set({ volume: source }).commit(),
    client.patch('drafts.homePage').setIfMissing({ volume: {} }).set({
      'volume.featureStatements': source.featureStatements,
      'volume.specificationGroups': source.specificationGroups,
    }).commit(),
  ])

  console.log('Restored the Light and volume data in the published and draft home page.')
}

updateVolumeSection().catch((error) => {
  console.error(error)
  process.exit(1)
})
