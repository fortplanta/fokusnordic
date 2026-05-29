import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { devFilesPlugin } from './vite-plugin-dev-files'

export default defineConfig({
  plugins: [react(), devFilesPlugin()],
  server: {
    port: 5173,
    open: true,
    historyApiFallback: true,
  },
})
