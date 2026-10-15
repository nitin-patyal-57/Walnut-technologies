import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import mongoose from 'mongoose';
import { config, DATA_DIR } from './config.js';

let memoryServer = null;

// Dev helper: when `node --watch` restarts the API on Windows, the embedded
// MongoDB from the previous run is often still alive and holding the lock and
// the fixed port. Probing first lets the new process attach to it instead of
// crashing on DBPathInUse.
function embeddedAlreadyRunning(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host });
    const done = (result) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(800, () => done(false));
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
  });
}

// Connects to MONGODB_URI, or (development only) starts an embedded MongoDB
// whose data persists in server/.data/db.
export async function connectDb() {
  let uri = config.mongoUri;

  if (!uri) {
    if (config.isProd) throw new Error('MONGODB_URI is required in production');
    const EMBEDDED_PORT = 27027;

    if (await embeddedAlreadyRunning(EMBEDDED_PORT)) {
      uri = `mongodb://127.0.0.1:${EMBEDDED_PORT}/walnut_admin`;
      console.log('[db] reusing the embedded MongoDB already running on :27027');
    } else {
      const { MongoMemoryServer } = await import('mongodb-memory-server-core');
      const dbPath = path.join(DATA_DIR, 'db');
      fs.mkdirSync(dbPath, { recursive: true });
      memoryServer = await MongoMemoryServer.create({
        instance: { dbPath, storageEngine: 'wiredTiger', port: EMBEDDED_PORT },
      });
      uri = memoryServer.getUri('walnut_admin');
      console.log(`[db] embedded MongoDB running, data in ${dbPath}`);
    }
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    // The embedded server is hard-killed on Windows; journaled writes survive that.
    ...(memoryServer && { writeConcern: { w: 1, j: true } }),
  });
  console.log(`[db] connected to ${mongoose.connection.name}`);
}

export async function disconnectDb() {
  if (memoryServer) await mongoose.connection.db.admin().command({ fsync: 1 }).catch(() => {});
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop({ doCleanup: false });
}
