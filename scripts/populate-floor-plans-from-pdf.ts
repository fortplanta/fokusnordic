import {createReadStream} from 'node:fs'
import {basename, resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const imageDirectory = resolve(process.cwd(), 'output/floor-plans-2026-09-08')

type Configuration = {_key: string; title?: string; name?: string}
type Floor = {_key: string; label?: string; configurations?: Configuration[]}
type HomeDocument = {_id: string; floorPlans?: {floors?: Floor[]}}

function suiteNumber(configuration: Configuration) {
  const label = configuration.name || configuration.title || configuration._key
  const match = label.match(/suite[- ]?(\d+)/i)
  if (!match) throw new Error(`Could not map configuration ${label}`)
  return Number(match[1])
}

async function uploadOrReuse(client: ReturnType<typeof getCliClient>, filename: string) {
  const existing = await client.fetch<string | null>(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename] | order(_createdAt desc)[0]._id',
    {filename},
  )
  if (existing) return existing
  return (await client.assets.upload('image', createReadStream(resolve(imageDirectory, filename)), {
    filename,
    title: filename.replace(/\.svg$/, '').replaceAll('-', ' '),
    contentType: 'image/svg+xml',
  }))._id
}

async function main() {
  const client = getCliClient({apiVersion: '2025-01-01'})
  const documents = await client.fetch<HomeDocument[]>(
    '*[_id in ["homePage", "drafts.homePage"]]{_id,floorPlans{floors[]{_key,label,configurations[]{_key,title,name}}}}',
  )
  if (!documents.length) throw new Error('No home page document found')

  for (const document of documents) {
    const patch = client.patch(document._id)
    let updated = 0
    for (const floor of document.floorPlans?.floors ?? []) {
      for (const configuration of floor.configurations ?? []) {
        const suite = suiteNumber(configuration)
        for (const [field, level, altLevel] of [
          ['planImage', 'main', 'main level'],
          ['mezzaninePlanImage', 'mezzanine', 'mezzanine'],
        ] as const) {
          const filename = `suite-${suite}-${level}-2026-09-08.svg`
          const assetId = await uploadOrReuse(client, filename)
          patch.set({
            [`floorPlans.floors[_key=="${floor._key}"].configurations[_key=="${configuration._key}"].${field}`]: {
              _type: 'image',
              alt: `Suite ${suite} ${altLevel} floor plan`,
              asset: {_type: 'reference', _ref: assetId},
            },
          })
          updated += 1
        }
      }
    }
    if (updated !== 14) throw new Error(`${document._id}: expected 14 plans, found ${updated}`)
    await patch.commit({autoGenerateArrayKeys: true})
    console.log(`Updated ${updated} floor plans on ${document._id}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
