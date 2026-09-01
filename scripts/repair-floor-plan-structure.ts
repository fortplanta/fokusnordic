import {getCliClient} from 'sanity/cli'

type Configuration = {
  _key: string
  title?: string
  body?: string
  facts?: unknown[]
  planImage?: {asset?: {_ref?: string}}
  explodedImage?: unknown
}

type Floor = {_key: string; label?: string; configurations?: Configuration[]}

const client = getCliClient({apiVersion: '2024-01-01'})
const mistakenAssetId = 'image-582ee2cdaf05a85db311e4772968904fa0682518-3456x2234-png'
const requiredFloors = [
  {key: 'ground-floor', label: 'Ground floor', configurations: 2},
  {key: 'first-floor', label: 'First floor', configurations: 2},
  {key: 'second-floor', label: 'Second floor', configurations: 3},
]

async function main() {
  const documents = await client.fetch<Array<{_id: string; floorPlans?: {floors?: Floor[]}}>>(
    `*[_id in ["homePage", "drafts.homePage"]]{_id, floorPlans}`,
  )

  for (const document of documents) {
    if (!document.floorPlans) continue

    const floors = requiredFloors.map((required) => {
      const existing = document.floorPlans?.floors?.find(
        (floor) => floor._key === required.key || floor.label === required.label,
      )

      const configurations = Array.from({length: required.configurations}, (_, index) => {
        const key = `${required.key}-${String(index + 1).padStart(2, '0')}`
        const current = existing?.configurations?.find((item) => item._key === key) || existing?.configurations?.[index]
        const planImage = current?.planImage?.asset?._ref === mistakenAssetId ? undefined : current?.planImage

        return {
          ...current,
          _key: key,
          title: current?.title || `Configuration ${String(index + 1).padStart(2, '0')}`,
          ...(planImage ? {planImage} : {planImage: undefined}),
        }
      })

      return {...existing, _key: required.key, label: required.label, configurations}
    })

    await client.patch(document._id).set({'floorPlans.floors': floors}).commit({autoGenerateArrayKeys: true})
    console.log(`Repaired floor-plan structure in ${document._id}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
