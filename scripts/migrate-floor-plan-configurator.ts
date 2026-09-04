import { getCliClient } from 'sanity/cli'

type HomeDocument = {
  _id: string
}

async function main() {
  console.log('Starting floor-plan configurator migration')
  const client = getCliClient({ apiVersion: '2025-01-01' }).withConfig({ perspective: 'raw' })
  const documents = await client.fetch<HomeDocument[]>(
    '*[_id in ["homePage", "drafts.homePage"]]{_id}',
  )
  console.log(`Found ${documents.length} home page document(s)`)

  for (const document of documents) {
    await client.patch(document._id)
      .unset(['floorPlans.configurationLabel'])
      .setIfMissing({
        'floorPlans.detailsLabel': 'View details',
        'floorPlans.ctaLabel': 'Discuss this floor',
        'floorPlans.ctaUrl': '#viewing',
      })
      .commit()
    console.log(`Migrated ${document._id}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
