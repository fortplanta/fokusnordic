import { preloadModule } from 'react-dom'

const dashboardBridge = 'https://core.sanity-cdn.com/bridge.js'

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  preloadModule(dashboardBridge, { as: 'script' })

  return (
    <>
      <script src={dashboardBridge} async type="module" />
      {children}
    </>
  )
}
