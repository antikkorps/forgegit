import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { fileURLToPath, URL } from 'node:url'
import { appConfig } from './app.config'

// Dev-only middleware: dynamic proxy to any Forgejo instance.
// Frontend calls /__forge/<host>/api/v1/... → we forward to https://<host>/api/v1/...
// Works around browser CORS during dev. Not needed in production (Capacitor).
function forgeDevProxy(): Plugin {
  return {
    name: 'anvil:forge-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/__forge', async (req, res) => {
        const match = (req.url ?? '').match(/^\/([^/?#]+)(.*)$/)
        if (!match) {
          res.statusCode = 400
          res.end('Invalid /__forge path')
          return
        }
        const [, host, rest] = match
        const target = `https://${host}${rest}`

        const headers: Record<string, string> = {}
        for (const [k, v] of Object.entries(req.headers)) {
          if (v == null) continue
          const lower = k.toLowerCase()
          if (['host', 'connection', 'content-length', 'origin', 'referer'].includes(lower)) continue
          headers[k] = Array.isArray(v) ? v.join(', ') : v
        }

        try {
          const method = (req.method ?? 'GET').toUpperCase()
          const upstream = await fetch(target, {
            method,
            headers,
            body: method === 'GET' || method === 'HEAD' ? undefined : (req as unknown as BodyInit),
            // @ts-expect-error -- duplex required by Node fetch when streaming a body
            duplex: 'half',
            redirect: 'manual',
          })

          res.statusCode = upstream.status
          upstream.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'content-encoding') return // body already decoded by fetch
            res.setHeader(key, value)
          })
          const buf = Buffer.from(await upstream.arrayBuffer())
          res.end(buf)
        } catch (err) {
          res.statusCode = 502
          res.end(`Forge proxy error: ${(err as Error).message}`)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    forgeDevProxy(),
    {
      name: 'anvil:html-vars',
      transformIndexHtml(html) {
        return html
          .replace(/%APP_NAME%/g, appConfig.name)
          .replace(/%APP_TAGLINE%/g, appConfig.tagline)
      },
    },
  ],
  define: {
    __APP_NAME__: JSON.stringify(appConfig.name),
    __APP_ID__: JSON.stringify(appConfig.id),
    __APP_TAGLINE__: JSON.stringify(appConfig.tagline),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
