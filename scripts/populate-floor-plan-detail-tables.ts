import {getCliClient} from 'sanity/cli'

type SuiteData = {
  floor: string
  mainArea: string
  mezzanineArea: string
  totalArea: string
  rooms: Array<[string, string]>
  seating: Array<[string, string]>
}

const suites: Record<number, SuiteData> = {
  1: {floor: 'Floor 0', mainArea: '864', mezzanineArea: '423', totalArea: '1 287 m²', rooms: [['Focus', '3'], ['Meeting 4', '1'], ['Meeting 6', '4'], ['Meeting 8', '1']], seating: [['Lunch room', '29'], ['Open workstation', '69'], ['Touch down', '34']]},
  2: {floor: 'Floor 0', mainArea: '1 007', mezzanineArea: '417', totalArea: '1 424 m²', rooms: [['Meeting 10', '3'], ['Meeting 12', '1'], ['Meeting 14', '1'], ['Meeting 4', '1'], ['Meeting 6', '4'], ['Meeting 8', '1'], ['Phone', '2']], seating: [['Lunch room', '71'], ['Open workstation', '90'], ['Touch down', '16']]},
  3: {floor: 'Floor 1', mainArea: '989', mezzanineArea: '341', totalArea: '1 330 m²', rooms: [['Focus', '1'], ['Meeting 12', '2'], ['Meeting 18', '1'], ['Meeting 4', '4'], ['Meeting 6', '3']], seating: [['Lunch room', '66'], ['Open workstation', '76'], ['Touch down', '21']]},
  4: {floor: 'Floor 1', mainArea: '952', mezzanineArea: '303', totalArea: '1 255 m²', rooms: [['Focus', '1'], ['Meeting 14', '1'], ['Meeting 4', '4'], ['Meeting 6', '2'], ['Meeting 8', '1'], ['Phone', '1']], seating: [['Lunch room', '60'], ['Open workstation', '82'], ['Touch down', '46']]},
  5: {floor: 'Floor 2', mainArea: '1 292', mezzanineArea: '821', totalArea: '2 113 m²', rooms: [['Focus', '15'], ['Meeting 10', '1'], ['Meeting 14', '1'], ['Meeting 16', '1'], ['Meeting 4', '3'], ['Meeting 6', '5'], ['Meeting 8', '2'], ['Phone', '6']], seating: [['Lunch room', '71'], ['Open workstation', '120'], ['Touch down', '33']]},
  6: {floor: 'Floor 2', mainArea: '859', mezzanineArea: '393', totalArea: '1 252 m²', rooms: [['Focus', '3'], ['Meeting 10', '1'], ['Meeting 10/studio', '1'], ['Meeting 12', '1'], ['Meeting 2', '2'], ['Meeting 4', '3'], ['Meeting 6', '2']], seating: [['Lunch room', '32'], ['Open workstation', '90'], ['Touch down', '24']]},
  7: {floor: 'Floor 2', mainArea: '755', mezzanineArea: '347', totalArea: '1 102 m²', rooms: [['Focus', '2'], ['Meeting 14', '1'], ['Meeting 4', '3'], ['Meeting 6', '2'], ['Meeting 8', '3'], ['Phone', '3']], seating: [['Lunch room', '48'], ['Open workstation', '80'], ['Touch down', '22']]},
}

function tablesForSuite(number: number, data: SuiteData) {
  const row = ([label, value]: [string, string], index: number) => ({_key: `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`, label, value})
  return [
    {
      _key: `suite-${number}-area`, title: `Suite ${number}`, labelHeading: 'Floor', valueHeading: 'Area',
      rows: [
        {_key: 'main-level', label: data.floor, value: data.mainArea, accent: true},
        {_key: 'mezzanine', label: `${data.floor} [Mezzanine]`, value: data.mezzanineArea, accent: true},
      ],
      footer: data.totalArea,
    },
    {_key: `suite-${number}-room`, title: `Suite ${number} room`, labelHeading: 'Room', valueHeading: 'Quantity', rows: data.rooms.map(row)},
    {_key: `suite-${number}-seating`, title: `Suite ${number} seating`, labelHeading: 'Seating', valueHeading: 'Quantity', rows: data.seating.map(row)},
  ]
}

async function main() {
  const client = getCliClient({apiVersion: '2025-01-01'}).withConfig({perspective: 'raw'})
  const documents = await client.fetch<Array<{_id: string; floorPlans?: {floors?: Array<{_key: string; configurations?: Array<{_key: string; title?: string; name?: string}>}>}}>>(
    '*[_id in ["homePage", "drafts.homePage"]]{_id,floorPlans{floors[]{_key,configurations[]{_key,title,name}}}}',
  )
  for (const document of documents) {
    const patch: Record<string, unknown> = {}
    for (const [numberText, data] of Object.entries(suites)) {
      const number = Number(numberText)
      const suiteName = `Suite ${number}`
      const floor = document.floorPlans?.floors?.find((item) => item.configurations?.some((configuration) => configuration.name === suiteName || configuration.title === suiteName))
      const configuration = floor?.configurations?.find((item) => item.name === suiteName || item.title === suiteName)
      if (!floor || !configuration) throw new Error(`${document._id}: ${suiteName} configuration was not found`)
      patch[`floorPlans.floors[_key=="${floor._key}"].configurations[_key=="${configuration._key}"].detailTables`] = tablesForSuite(number, data)
    }
    await client.patch(document._id).set(patch).commit({autoGenerateArrayKeys: true})
    console.log(`Populated all seven suite information tables in ${document._id}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
