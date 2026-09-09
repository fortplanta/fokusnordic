import { createReadStream } from 'node:fs'
import { basename, resolve } from 'node:path'
import { getCliClient } from 'sanity/cli'

const imageDirectory = process.env.AXO_IMAGE_DIR || ''

if (!imageDirectory) throw new Error('Set AXO_IMAGE_DIR to the directory containing the AXO Suite SVG files.')

type Configuration = { _key: string; title?: string; planFilename?: string }
type Floor = { _key: string; label?: string; configurations?: Configuration[] }
type HomeDocument = { _id: string; floorPlans?: { floors?: Floor[] } }

function diagramFor(configuration: Configuration) {
  const planFilename = configuration.planFilename || ''
  const suite = planFilename.match(/suite(\d+)-/i)?.[1]
  if (!suite) return null

  const mezzanine = planFilename.toLowerCase().includes('mezzanine')
  const filename = `AXO SUITE ${suite}${mezzanine ? ' mezzanine' : ''} 1.svg`
  return {
    filename,
    path: resolve(imageDirectory, filename),
    alt: `Axonometric diagram of Suite ${suite}${mezzanine ? ' mezzanine' : ''}`,
  }
}

async function main() {
  const client = getCliClient({ apiVersion: '2025-01-01' })
  const documents = await client.fetch<HomeDocument[]>(
    '*[_id in ["homePage", "drafts.homePage"]]{_id,floorPlans{floors[]{_key,label,configurations[]{_key,title,"planFilename":planImage.asset->originalFilename}}}}',
  )

  for (const document of documents) {
    const patch = client.patch(document._id)
    let updated = 0

    for (const floor of document.floorPlans?.floors ?? []) {
      for (const configuration of floor.configurations ?? []) {
        const diagram = diagramFor(configuration)
        if (!diagram) throw new Error(`${document._id}: could not map ${floor.label || floor._key} / ${configuration.title || configuration._key}`)

        const existingAssetId = await client.fetch<string | null>(
          '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
          { filename: diagram.filename },
        )
        const assetId = existingAssetId ?? (await client.assets.upload('image', createReadStream(diagram.path), {
          filename: basename(diagram.path),
          title: diagram.filename.replace(/ 1\.svg$/, ''),
          contentType: 'image/svg+xml',
        }))._id

        patch.set({
          [`floorPlans.floors[_key=="${floor._key}"].configurations[_key=="${configuration._key}"].explodedImage`]: {
            _type: 'image',
            alt: diagram.alt,
            asset: { _type: 'reference', _ref: assetId },
          },
        })
        updated += 1
      }
    }

    if (updated !== 14) throw new Error(`${document._id}: expected 14 configurations, found ${updated}`)
    await patch.commit({ autoGenerateArrayKeys: true })
    console.log(`Updated ${updated} AXO diagrams on ${document._id}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
