import { getCliClient } from 'sanity/cli'
import { homeFallback } from '../src/content/homeFallback'

const client = getCliClient({ apiVersion: '2025-01-01' })

async function updateVolumeSection() {
  await client
    .patch('homePage')
    .set({ volume: homeFallback.volume })
    .commit()

  console.log('Updated the Light and volume section on homePage.')
}

updateVolumeSection().catch((error) => {
  console.error(error)
  process.exit(1)
})
