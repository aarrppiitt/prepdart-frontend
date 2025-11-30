import { defineConfig, loadEnv } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const API_BACKEND = 'http://localhost:7777'
  const apiPrefixes = ['questions', 'papers', 'auth', 'uploads', 'files', 'courses']

  const proxy = {}

  for (const p of apiPrefixes) {
    proxy[`/${p}`] = {
      target: API_BACKEND,
      changeOrigin: true,
      secure: false,
      configure(proxyInstance) {
        proxyInstance.on('proxyReq', (proxyReq, req) => {
          const token = env.VITE_DEV_BEARER
          console.log('proxyReq event for', req.url)
          if (token) {
            proxyReq.setHeader('Authorization', `Bearer ${token}`)
            console.log('[Vite Proxy] Injected token:', token.slice(0, 10) + '...')
          }
        })
      }
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy
    }
  }
})
