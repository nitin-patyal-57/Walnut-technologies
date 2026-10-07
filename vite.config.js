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

        const { handler } = await load()
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
        await handler(req, res)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localApi()],
  server: {
    host: true,
    port: 3000,
    allowedHosts: ['fancy-entrench-stoke.ngrok-free.dev', '.ngrok-free.dev'],
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
