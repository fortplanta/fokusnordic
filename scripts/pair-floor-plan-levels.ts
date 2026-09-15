import {getCliClient} from 'sanity/cli'

type Image = {asset?: {_ref?: string}; alt?: string}
type Configuration = {
  _key: string
  title?: string
  name?: string
  body?: string
  facts?: unknown[]
  planImage?: Image
  explodedImage?: Image
}
type Floor = {_key: string; label?: string; configurations?: Configuration[]}

const client = getCliClient({apiVersion: '2025-01-01'})

function suiteNumber(configuration: Configuration) {
  const reference = configuration.planImage?.asset?._ref
  return reference
}

async function main() {
  const documents = await client.fetch<Array<{_id: string; floorPlans?: {floors?: Floor[]}}>>(
    `*[_id in ["homePage", "drafts.homePage"]]{_id,floorPlans{floors[]{_key,label,configurations[]{_key,title,name,body,facts,planImage,explodedImage}}}}`,
  )

  for (const document of documents) {
    const floors = []
    let suite = 1

    for (const floor of document.floorPlans?.floors ?? []) {
      const configurations = floor.configurations ?? []
      if (configurations.length % 2 !== 0) {
        throw new Error(`${document._id}: ${floor.label || floor._key} does not contain complete level pairs`)
      }

      const paired = []
      for (let index = 0; index < configurations.length; index += 2) {
        const main = configurations[index]
        const mezzanine = configurations[index + 1]
        if (!suiteNumber(main) || !suiteNumber(mezzanine)) {
          throw new Error(`${document._id}: Suite ${suite} is missing a plan image`)
        }

        paired.push({
          ...main,
          _key: `suite-${suite}`,
          title: `Suite ${suite}`,
          mainLevelLabel: 'Main level',
          mezzanineLevelLabel: 'Mezzanine',
          mezzaninePlanImage: mezzanine.planImage,
          mezzanineExplodedImage: mezzanine.explodedImage,
        })
        suite += 1
      }

      floors.push({...floor, configurations: paired})
    }

    if (suite !== 8) throw new Error(`${document._id}: expected seven suites, found ${suite - 1}`)
    await client.patch(document._id).set({'floorPlans.floors': floors}).commit({autoGenerateArrayKeys: true})
    console.log(`Paired seven suites across ${floors.length} floors in ${document._id}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
