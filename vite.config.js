import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Runs the Vercel serverless handlers locally so forms work in `npm run dev`
function localApi() {
  const routes = {
    '/api/contact': () => import('./api/contact.js'),
  }
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || '').split('?')[0]
        const load = routes[url]
        if (!load || req.method !== 'POST') return next()

        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const raw = Buffer.concat(chunks).toString('utf8')
          req.body = raw ? JSON.parse(raw) : undefined
        } catch {
          req.body = undefined
        }

        const mod = await load()
        // Vercel handlers are a *default* export (api/contact.js) but some are
        // named `handler`. Destructuring the named one made this undefined and
        // crashed the whole dev server the moment a form was submitted.
        const handler = mod?.default || mod?.handler
        if (typeof handler !== 'function') {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Local API handler not found' }))
          return
        }

        const statusCode = { code: 200 }
        res.status = (code) => { statusCode.code = code; return res }
        res.json = (data) => {
          res.statusCode = statusCode.code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
          return res
        }
        const originalEnd = res.end.bind(res)
        res.end = (...args) => {
          if (!res.headersSent) res.statusCode = statusCode.code
          return originalEnd(...args)
        }
        try {
          await handler(req, res)
        } catch (err) {
          // A throw inside the handler must never take the dev server down.
          console.error('[local-api]', err)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err?.message || 'Local API error' }))
          }
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localApi()],
  server: {
    host: true,
    port: 3001,
    allowedHosts: ['fancy-entrench-stoke.ngrok-free.dev', '.ngrok-free.dev'],
    // One origin in local dev, exactly like production: open this server for
    // the site and /admin for the panel. Order matters — the API path is
    // matched before the admin UI fallback, and the UI needs websockets so
    // the admin's HMR keeps working through the proxy.
    proxy: {
      '/admin/api': {
        target: 'http://localhost:4000',
        rewrite: (path) => path.replace(/^\/admin/, ''),
      },
      '/media': 'http://localhost:4000',
      '/admin': { target: 'http://localhost:5174', ws: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          icons: ['react-icons'],
        },
      },
    },
    target: 'es2015',
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 200,
  },
})
