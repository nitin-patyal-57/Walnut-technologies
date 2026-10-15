import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const SERVER_ROOT = path.resolve(here, '..');
export const DATA_DIR = path.join(SERVER_ROOT, '.data');

const env = process.env;
const isProd = env.NODE_ENV === 'production';

// In development, missing secrets are generated once and kept in .data/ so
// sessions survive restarts. In production they must be provided.
function devSecrets() {
  const file = path.join(DATA_DIR, 'dev-secrets.json');
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    const secrets = {
      JWT_ACCESS_SECRET: crypto.randomBytes(48).toString('base64url'),
      ENCRYPTION_KEY: crypto.randomBytes(32).toString('base64'),
      LEADS_INGEST_KEY: crypto.randomBytes(24).toString('base64url'),
    };
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(secrets, null, 2));
    return secrets;
  }
}

function secret(name) {
  if (env[name]) return env[name];
  if (isProd) throw new Error(`Missing required environment variable ${name}`);
  return devSecrets()[name];
}

const list = (v) => (v || '').split(',').map((s) => s.trim()).filter(Boolean);

export const config = {
  isProd,
  port: Number(env.PORT) || 4000,
  appUrl: (env.APP_URL || 'http://localhost:5174').replace(/\/$/, ''),
  // The path the admin UI is served under ('/admin' on the website's domain,
  // '' when it is deployed standalone at the root). Used for invite/reset
  // links, API mounts and cookie scope. Media stays at the origin root.
  adminPath: `/${(env.ADMIN_PATH ?? 'admin').replace(/^\/+|\/+$/g, '')}`.replace(/\/$/, ''),
  mongoUri: env.MONGODB_URI || '',
  jwtAccessSecret: secret('JWT_ACCESS_SECRET'),
  encryptionKey: Buffer.from(secret('ENCRYPTION_KEY'), 'base64'),
  leadsIngestKey: secret('LEADS_INGEST_KEY'),
  allowedEmailDomains: list(env.ALLOWED_EMAIL_DOMAINS ?? 'walnutmedical.in').map((d) => d.toLowerCase()),
  resendApiKey: env.RESEND_API_KEY || '',
  mailFrom: env.MAIL_FROM || 'Walnut Admin <onboarding@resend.dev>',
  deployHookUrl: env.VERCEL_DEPLOY_HOOK_URL || '',
  publicCorsOrigins: list(env.PUBLIC_CORS_ORIGINS || 'https://walnutmedical.in,https://www.walnutmedical.in,http://localhost:3000,http://localhost:5173'),

  // Security policy
  accessTokenTtlSec: 15 * 60,
  refreshTokenTtlMs: 12 * 60 * 60 * 1000, // absolute session lifetime
  sessionIdleMs: 30 * 60 * 1000, // inactivity logout
  maxFailedLogins: 5,
  lockoutMs: 15 * 60 * 1000,
  inviteTtlMs: 72 * 60 * 60 * 1000,
  resetTtlMs: 30 * 60 * 1000,
  auditRetentionDays: 365,
};

if (config.encryptionKey.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 bytes, base64 encoded');
}
