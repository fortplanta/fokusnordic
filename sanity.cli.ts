import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'wvgj6m8r',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  },
  deployment: {
    appId: 'vtzxi91h76nful2l42kdixy1',
  },
})
