import { createApp } from './app.js';
import { config } from './config.js';
import { connectDb, disconnectDb } from './db.js';

await connectDb();

// Built at import time: serverless has no listener, and Vercel's Services
// builder dispatches the DEFAULT export of the entrypoint. Exporting only a
// named `app` makes it die at runtime with "Invalid export found in module …
// The default export must be a function or server."
export const app = createApp();
export default app;

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
