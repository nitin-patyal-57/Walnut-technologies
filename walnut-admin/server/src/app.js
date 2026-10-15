import fs from 'node:fs';
import path from 'node:path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config, SERVER_ROOT } from './config.js';
import { errorHandler, notFound } from './lib/http.js';
import { requireAuth, requireCsrfHeader } from './middleware/auth.js';
import auditRoutes from './routes/audit.js';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import dashboardRoutes from './routes/dashboard.js';
import leadRoutes from './routes/leads.js';
import mediaRoutes from './routes/media.js';
import { mediaFiles, publicApi } from './routes/public.js';
import userRoutes from './routes/users.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  // Behind Render / Railway / Nginx there is exactly one proxy hop.
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );
  app.use(compression());
  app.use(morgan(config.isProd ? 'combined' : 'dev'));
  app.use(cookieParser());

  app.get('/healthz', (req, res) => res.json({ ok: true }));

  // The API is mounted at /api and, on the website's domain, at /admin/api —
  // vercel.json routes /admin/api/* to this service with the full path intact,
  // so both prefixes have to resolve to the same handlers.
  const apiPrefixes = [`${config.adminPath}/api`, '/api'];

  // Public surface used by the website.
  app.use('/media', mediaFiles);
  app.use(apiPrefixes.map((p) => `${p}/public`), publicApi);

  // Admin API.
  const api = express.Router();
  api.use(express.json({ limit: '2mb' }));
  api.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  api.use(requireCsrfHeader);
  api.use('/auth', authRoutes);
  api.use(requireAuth);
  api.use('/dashboard', dashboardRoutes);
  api.use('/users', userRoutes);
  api.use('/content', contentRoutes);
  api.use('/leads', leadRoutes);
  api.use('/media-library', mediaRoutes);
  api.use('/audit', auditRoutes);
  api.use(() => {
    throw notFound('Unknown API route');
  });
  app.use(apiPrefixes, api);

  // In production the same server hosts the built React admin.
  const clientDist = path.resolve(SERVER_ROOT, '../client/dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist, { index: false, maxAge: '1y', immutable: true }));
    app.get('/{*splat}', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  app.use(errorHandler);
  return app;
}
