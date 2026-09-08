import { getCliClient } from 'sanity/cli'
import { homeFallback } from '../src/content/homeFallback'

const client = getCliClient({ apiVersion: '2025-01-01' })

// Copies the specificationGroups (and a distinct kicker/heading) from the
// existing `volume` field into the new independent `specifications` field.
// Safe to run multiple times — uses setIfMissing so it won't overwrite edits.
async function migrateIndependentSpecifications() {
  const published = await client.fetch<{
    volume?: { kicker?: string; heading?: string; body?: string; specificationGroups?: unknown[] }
    specifications?: unknown
  } | null>('*[_id == "homePage"][0]{volume, specifications}')

  if (published?.specifications) {
    console.log('`specifications` already populated — nothing to migrate.')
    return
  }

  const source = published?.volume ?? homeFallback.volume
  const specs = {
    kicker: homeFallback.specifications.kicker,
    heading: homeFallback.specifications.heading,
    specificationGroups: source.specificationGroups ?? homeFallback.specifications.specificationGroups,
  }

  await Promise.all([
    client.patch('homePage').setIfMissing({ specifications: specs }).commit(),
    client.patch('drafts.homePage').setIfMissing({ specifications: specs }).commit(),
  ])

  console.log('Migrated specification groups to the independent `specifications` field.')
  console.log(`Groups: ${(specs.specificationGroups ?? []).length}`)
  console.log('You can now edit the kicker, heading, and groups for each section independently in Sanity.')
}

migrateIndependentSpecifications().catch((error) => {
  console.error(error)
  process.exit(1)
})
