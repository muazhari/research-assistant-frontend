import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as process from 'node:process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      port: parseInt(env.NODE_PORT as string)
    },
    preview: {
      port: parseInt(env.NODE_PORT as string)
    },
    plugins: [react()]
  }
})
