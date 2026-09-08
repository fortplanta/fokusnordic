import { getCliClient } from 'sanity/cli'

// Additive and revision-guarded: the live site's legacy fields remain usable
// until the frontend deployment. Existing independent content is never replaced.
async function main() {
  const client = getCliClient({ apiVersion: '2025-01-01' }).withConfig({ perspective: 'raw', useCdn: false })
  const documents = await client.fetch<Array<{
    _id: string
    _rev: string
    volume?: { kicker?: string; heading?: string; body?: string; specificationGroups?: unknown[] }
    specifications?: unknown
  }>>('*[_id in ["homePage", "drafts.homePage"]]{_id,_rev,volume,specifications}')

  let transaction = client.transaction()
  const changed: string[] = []
  for (const document of documents) {
    if (document.specifications != null) continue
    const source = document.volume
    if (!source?.heading || !source.specificationGroups) {
      throw new Error(`${document._id}: source copy or categories are missing; migration aborted`)
    }
    const { kicker, heading, body, specificationGroups } = source
    transaction = transaction.patch(document._id, (patch) => patch
      .ifRevisionId(document._rev)
      .set({ specifications: {
        ...(kicker !== undefined ? { kicker } : {}),
        heading,
        ...(body !== undefined ? { body } : {}),
        specificationGroups,
      } }))
    changed.push(document._id)
  }
  if (changed.length) await transaction.commit()
  console.log(changed.length ? `Created independent specifications in: ${changed.join(', ')}` : 'Independent specifications already exist; no changes made.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
