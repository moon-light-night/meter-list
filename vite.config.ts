import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const API_PREFIX = '/api'

const normalizeApiUrl = (rawUrl?: string) => {
  const trimmedUrl = rawUrl?.trim()

  if (!trimmedUrl) {
    return undefined
  }

  try {
    const parsedUrl = new URL(trimmedUrl)

    if (parsedUrl.protocol === 'http:') {
      parsedUrl.protocol = 'https:'
    }

    const pathPrefix =
      parsedUrl.pathname === '/'
        ? ''
        : parsedUrl.pathname.replace(/\/+$/, '')

    return {
      origin: parsedUrl.origin,
      pathPrefix,
      fullUrl: `${parsedUrl.origin}${pathPrefix}`,
    }
  } catch {
    throw new Error(
      `Environment variable VITE_APP_API_URL has invalid URL: ${trimmedUrl}`,
    )
  }
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = normalizeApiUrl(env.VITE_APP_API_URL)

  if (command === 'serve' && !apiUrl) {
    throw new Error('Environment variable VITE_APP_API_URL is required')
  }

  if (command === 'serve') {
    console.info(`[vite proxy] ${API_PREFIX} -> ${apiUrl?.fullUrl}`)
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        [API_PREFIX]: {
          target: apiUrl?.origin,
          changeOrigin: true,
          secure: false,
          followRedirects: true,
          rewrite: (path) => {
            return path.replace(/^\/api/, apiUrl?.pathPrefix ?? '')
          },
        },
      },
    },
  }
})