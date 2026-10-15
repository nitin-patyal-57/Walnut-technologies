import { createApp } from './app.js';
import { config } from './config.js';
import { connectDb, disconnectDb } from './db.js';

await connectDb();

// Vercel invokes the exported `app` directly (vercel.json →
// services.admin_api.entrypoint "src/index.js:app"), so it is built at import
// time. Locally we listen on a port instead — serverless has no listener.
export const app = createApp();

if (!process.env.VERCEL) {
  const server = app.listen(config.port, () => {
    console.log(`[api] Walnut admin listening on http://localhost:${config.port} (${config.isProd ? 'production' : 'development'})`);
  });

  async function shutdown(signal) {
    console.log(`[api] ${signal} received, shutting down`);
    server.close();
    await disconnectDb();
    process.exit(0);
  }
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}
