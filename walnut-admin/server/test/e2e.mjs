// End-to-end API test: boots the real app against a throwaway MongoDB and
// exercises auth, MFA, sessions, roles, content publishing, leads and audit.
//   npm test   (from the repo root or server/)
import fs from 'node:fs';
import path from 'node:path';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import mongoose from 'mongoose';
import { authenticator } from 'otplib';

const mongo = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongo.getUri('walnut_test');
process.env.RESEND_API_KEY = '';
process.env.VERCEL_DEPLOY_HOOK_URL = '';
process.env.ALLOWED_EMAIL_DOMAINS = 'walnutmedical.in';

const { config, SERVER_ROOT } = await import('../src/config.js');
const { connectDb } = await import('../src/db.js');
const { createApp } = await import('../src/app.js');
const { COLLECTIONS } = await import('../src/content/schemas.js');
const { Content, ContentVersion } = await import('../src/models/Content.js');
const { User } = await import('../src/models/User.js');
const { UserToken } = await import('../src/models/UserToken.js');
const { randomToken, sha256 } = await import('../src/lib/crypto.js');

await connectDb();
const server = createApp().listen(0);
const BASE = `http://localhost:${server.address().port}`;

// Seed content + a super admin invite.
const seed = JSON.parse(fs.readFileSync(path.join(SERVER_ROOT, 'seed/content.json'), 'utf8'));
for (const def of COLLECTIONS) {
  await Content.create({ key: def.key, draft: seed[def.key], published: seed[def.key], publishedAt: new Date() });
}
await ContentVersion.create({ snapshot: seed, changedKeys: [], note: 'Initial import from website', publishedByName: 'System' });
const admin = await User.create({ name: 'Pooran Kharol', email: 'pooran.kharol@walnutmedical.in', role: 'superadmin', status: 'invited' });
const TOKEN = randomToken();
await UserToken.create({ user: admin._id, type: 'invite', tokenHash: sha256(TOKEN), expiresAt: new Date(Date.now() + 3600000) });
const ingestKey = config.leadsIngestKey;

const PASSWORD = 'Str0ng-Test-Pass!';
let failures = 0;

function jar() {
  const cookies = new Map();
  return {
    header: () => [...cookies].map(([k, v]) => `${k}=${v}`).join('; '),
    store(res) {
      for (const c of res.headers.getSetCookie()) {
        const [pair] = c.split(';');
        const [k, v] = pair.split('=');
        if (v === '' || /Expires=Thu, 01 Jan 1970/.test(c)) cookies.delete(k);
        else cookies.set(k, v);
      }
    },
    get: (k) => cookies.get(k),
    set: (k, v) => cookies.set(k, v),
  };
}

async function call(j, method, urlPath, body, extra = {}) {
  const headers = { 'X-Requested-With': 'walnut-admin', Cookie: j.header(), ...extra };
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(BASE + urlPath, { method, headers, body: body ? JSON.stringify(body) : undefined });
  j.store(res);
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

function check(name, cond, detail) {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  → ' + JSON.stringify(detail)}`);
  if (!cond) failures++;
}

const a = jar();

let r = await call(a, 'GET', `/api/auth/invite/${TOKEN}`);
check('invite token resolves', r.status === 200 && r.data.email, r);

r = await call(a, 'POST', '/api/auth/accept-invite', { token: TOKEN, password: 'short' });
check('weak password rejected', r.status === 400 && r.data.code === 'WEAK_PASSWORD', r);

r = await call(a, 'POST', '/api/auth/accept-invite', { token: TOKEN, password: PASSWORD });
check('accept invite signs in', r.status === 200 && r.data.user.mfaSetupRequired === true, r);

r = await call(a, 'POST', '/api/auth/accept-invite', { token: TOKEN, password: PASSWORD });
check('invite token is single-use', r.status === 400, r);

r = await call(a, 'GET', '/api/dashboard');
check('super admin blocked until MFA set up', r.status === 403 && r.data.code === 'MFA_SETUP_REQUIRED', r);

r = await call(a, 'GET', '/api/auth/me');
check('/me works before MFA', r.status === 200, r);

r = await call(a, 'POST', '/api/auth/mfa/setup');
check('mfa setup returns QR', r.status === 200 && r.data.qrDataUrl?.startsWith('data:image/png'), r.status);
const secret = r.data.secret;

r = await call(a, 'POST', '/api/auth/mfa/enable', { code: '000000' });
check('wrong MFA code rejected', r.status === 400, r);

r = await call(a, 'POST', '/api/auth/mfa/enable', { code: authenticator.generate(secret) });
check('MFA enabled + 8 recovery codes', r.status === 200 && r.data.recoveryCodes.length === 8, r);
const recovery = r.data.recoveryCodes;

r = await call(a, 'GET', '/api/dashboard');
check('dashboard reachable after MFA', r.status === 200 && r.data.content, r);

r = await call(a, 'POST', '/api/content/publish', {}, { 'X-Requested-With': '' });
check('CSRF header required', r.status === 403 && r.data.code === 'CSRF', r);

// Fresh browser: password then TOTP
const b = jar();
r = await call(b, 'POST', '/api/auth/login', { email: 'POORAN.KHAROL@walnutmedical.in', password: PASSWORD });
check('login asks for MFA', r.status === 200 && r.data.mfaRequired && !b.get('wa_access'), r);
const challenge = r.data.challenge;

r = await call(b, 'POST', '/api/auth/login/mfa', { challenge, code: authenticator.generate(secret) });
check('same TOTP code cannot be replayed', r.status === 401, r);

r = await call(b, 'POST', '/api/auth/login/mfa', { challenge, recoveryCode: recovery[0].toLowerCase() });
check('recovery code signs in', r.status === 200 && b.get('wa_access'), r);

r = await call(b, 'POST', '/api/auth/login/mfa', { challenge, recoveryCode: recovery[0] });
check('recovery code is single-use', r.status === 401, r);

// Refresh rotation + reuse detection
const oldRefresh = b.get('wa_refresh');
r = await call(b, 'POST', '/api/auth/refresh');
check('refresh rotates token', r.status === 200 && b.get('wa_refresh') !== oldRefresh, r);
const thief = jar();
thief.set('wa_refresh', oldRefresh);
r = await call(thief, 'POST', '/api/auth/refresh');
check('reused refresh token rejected', r.status === 401, r);
r = await call(b, 'GET', '/api/dashboard');
check('reuse revokes the whole session', r.status === 401, r);

// Content: validation + save + optimistic locking + publish
r = await call(a, 'GET', '/api/content/brand');
const brand = r.data.draft;
const brandBase = r.data.draftUpdatedAt ?? null; // version we loaded (null = never edited)
r = await call(a, 'PUT', '/api/content/brand', { data: { ...brand, email: 'not-an-email' }, baseUpdatedAt: brandBase });
check('invalid content rejected', r.status === 400 && /email/.test(r.data.error), r);
r = await call(a, 'PUT', '/api/content/brand', { data: { ...brand, tagline: 'Electronics for the World (test)' }, baseUpdatedAt: brandBase });
check('draft saved, marked changed', r.status === 200 && r.data.changed === true, r);
const savedBase = r.data.draftUpdatedAt;

// Optimistic locking (409): writes from a stale version must never clobber.
r = await call(a, 'PUT', '/api/content/brand', { data: { ...brand, tagline: 'Stale write' }, baseUpdatedAt: '2020-01-01T00:00:00.000Z' });
check('stale save rejected with 409 conflict', r.status === 409 && r.data.code === 'CONFLICT', r);
check('409 meta says who saved and when', r.data.meta?.draftUpdatedBy === 'Pooran Kharol' && !!r.data.meta?.draftUpdatedAt, r.data.meta);
r = await call(a, 'PUT', '/api/content/brand', { data: { ...brand, tagline: 'No base' } });
check('save without baseUpdatedAt rejected as bad request', r.status === 400 && r.data.code === 'VALIDATION', r);
r = await call(a, 'GET', '/api/content/brand');
check('conflict left the saved draft intact', r.data.draft.tagline === 'Electronics for the World (test)' && r.data.draftUpdatedAt === savedBase, r.data);
r = await call(a, 'PUT', '/api/content/brand', { data: { ...brand, tagline: 'Electronics for the World (test)' }, baseUpdatedAt: savedBase });
check('save with fresh version succeeds', r.status === 200 && r.data.changed === true, r);

r = await call(a, 'GET', '/api/public/content');
check('public content still shows published', r.data.content.brand.tagline === 'Electronics for the World', r.data?.content?.brand?.tagline);
r = await call(a, 'POST', '/api/content/publish', { note: 'e2e test' });
check('publish works (deploy skipped w/o hook)', r.status === 200 && r.data.deploy.status === 'skipped', r);
r = await call(a, 'GET', '/api/public/content');
check('public content updated', r.data.content.brand.tagline.endsWith('(test)'), r.data.content.brand.tagline);
r = await call(a, 'GET', '/api/content/versions');
const initial = r.data.versions.find((v) => v.note === 'Initial import from website');
r = await call(a, 'POST', `/api/content/versions/${initial._id}/restore`);
check('rollback restores version', r.status === 200, r);
r = await call(a, 'GET', '/api/public/content');
check('public content rolled back', r.data.content.brand.tagline === 'Electronics for the World', r.data.content.brand.tagline);

// Lead ingest
let res = await fetch(BASE + '/api/public/leads', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-ingest-key': 'wrong' }, body: JSON.stringify({ type: 'contact', name: 'X', email: 'x@y.com' }) });
check('ingest rejects bad key', res.status === 403, res.status);
res = await fetch(BASE + '/api/public/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-ingest-key': ingestKey },
  body: JSON.stringify({ type: 'application', name: 'Asha Verma', email: 'asha@example.com', jobTitle: 'Embedded Engineer', message: 'Hello', resume: { filename: 'cv.pdf', content: Buffer.from('%PDF-1.4 test').toString('base64') } }),
});
check('ingest stores application', res.status === 201, res.status);
await fetch(BASE + '/api/public/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-ingest-key': ingestKey },
  body: JSON.stringify({ type: 'quote', name: 'Ravi Mehta', email: 'ravi@acme.in', company: 'Acme Health', subject: 'Digital Blood Pressure', quantity: '5000', message: '=HYPERLINK("x")' }),
});
r = await call(a, 'GET', '/api/leads?q=Acme');
check('lead search finds quote', r.data.leads?.length === 1, r);
const leadId = r.data.leads[0].id;
r = await call(a, 'PATCH', `/api/leads/${leadId}`, { status: 'contacted' });
check('lead status update', r.status === 200, r);
res = await fetch(BASE + '/api/leads/export.csv', { headers: { Cookie: a.header() } });
const csv = await res.text();
check('CSV export neutralises formulas', res.status === 200 && csv.includes(`"'=HYPERLINK`), csv.slice(0, 200));

// Invite a sales user; ensure role scoping
r = await call(a, 'POST', '/api/users/invite', { name: 'Outside', email: 'someone@gmail.com', role: 'sales' });
check('non-company email blocked', r.status === 400 && r.data.code === 'DOMAIN_NOT_ALLOWED', r);
r = await call(a, 'POST', '/api/users/invite', { name: 'Sales Person', email: 'sales.test@walnutmedical.in', role: 'sales' });
check('invite sales user', r.status === 201 && r.data.inviteLink, r);
const salesToken = new URL(r.data.inviteLink).searchParams.get('token');
const s = jar();
await call(s, 'POST', '/api/auth/accept-invite', { token: salesToken, password: 'Sales-Pass-2026' });
r = await call(s, 'GET', '/api/leads');
check('sales sees only enquiries', r.status === 200 && r.data.leads.every((l) => l.type !== 'application'), r);
r = await call(s, 'GET', '/api/leads?type=application');
check('sales cannot list applications', r.status === 403, r);
r = await call(s, 'PUT', '/api/content/brand', { data: brand });
check('sales cannot edit content', r.status === 403, r);
r = await call(s, 'GET', '/api/users');
check('sales cannot manage users', r.status === 403, r);

// Disable → immediate logout
const salesId = (await call(a, 'GET', '/api/users')).data.users.find((u) => u.email === 'sales.test@walnutmedical.in').id;
await call(a, 'PATCH', `/api/users/${salesId}`, { status: 'disabled' });
r = await call(s, 'GET', '/api/leads');
check('disabled user is signed out immediately', r.status === 401, r);

// Lockout
const l = jar();
for (let i = 0; i < 5; i++) await call(l, 'POST', '/api/auth/login', { email: 'pooran.kharol@walnutmedical.in', password: 'wrong-password-1' });
r = await call(l, 'POST', '/api/auth/login', { email: 'pooran.kharol@walnutmedical.in', password: PASSWORD });
check('account locks after 5 failures', r.status === 401 && r.data.code === 'LOCKED', r);

r = await call(a, 'GET', '/api/audit');
check('audit log recorded actions', r.data.total > 15, r.data.total);

// Media upload: real image → resized WebP; fake image rejected; in-use image protected
const sharp = (await import('sharp')).default;
const png = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: '#0e7490' } }).png().toBuffer();
async function upload(buffer, name) {
  const form = new FormData();
  form.append('file', new Blob([buffer]), name);
  const up = await fetch(BASE + '/api/media-library', { method: 'POST', headers: { 'X-Requested-With': 'walnut-admin', Cookie: a.header() }, body: form });
  return { status: up.status, data: await up.json() };
}
r = await upload(png, 'Factory Floor.PNG');
check('image upload → resized WebP', r.status === 201 && r.data.media.width === 2400 && r.data.media.filename === 'factory-floor.webp', r);
const media = r.data.media;
res = await fetch(BASE + new URL(media.url).pathname);
check('media served publicly as webp', res.ok && res.headers.get('content-type') === 'image/webp' && /immutable/.test(res.headers.get('cache-control')), res.status);
r = await upload(Buffer.from('<?php echo 1; ?>'), 'evil.png');
check('non-image upload rejected', r.status === 400, r);
const newsResp = await call(a, 'GET', '/api/content/news');
const news = newsResp.data.draft;
news[0].image = media.url;
r = await call(a, 'PUT', '/api/content/news', { data: news, baseUpdatedAt: newsResp.data.draftUpdatedAt ?? null });
check('uploaded image usable in content', r.status === 200, r);
r = await call(a, 'DELETE', `/api/media-library/${media.id}`);
check('in-use image cannot be deleted', r.status === 400 && r.data.code === 'IN_USE', r);

// ─── Role matrix: Publisher edits AND publishes; Editor drafts only ───
r = await call(a, 'POST', '/api/users/invite', { name: 'Pub Lisher', email: 'publisher.test@walnutmedical.in', role: 'publisher' });
check('invite publisher', r.status === 201 && r.data.inviteLink, r);
const p = jar();
await call(p, 'POST', '/api/auth/accept-invite', { token: new URL(r.data.inviteLink).searchParams.get('token'), password: 'Publisher-Pass-2026' });
r = await call(p, 'GET', '/api/content/brand');
check('publisher can read content', r.status === 200, r);
const pDraft = r.data.draft;
r = await call(p, 'PUT', '/api/content/brand', { data: { ...pDraft, tagline: pDraft.tagline + ' (publisher)' }, baseUpdatedAt: r.data.draftUpdatedAt ?? null });
check('publisher can edit content', r.status === 200, r);
r = await call(p, 'POST', '/api/content/publish', { note: 'publisher publishes' });
check('publisher can publish', r.status === 200, r);
r = await call(p, 'GET', '/api/users');
check('publisher cannot manage users', r.status === 403, r);
r = await call(p, 'GET', '/api/leads');
check('publisher cannot read leads', r.status === 403, r);
r = await call(p, 'GET', '/api/audit');
check('publisher cannot read audit log', r.status === 403, r);

r = await call(a, 'POST', '/api/users/invite', { name: 'Ed Itor', email: 'editor.test@walnutmedical.in', role: 'editor' });
check('invite editor', r.status === 201 && r.data.inviteLink, r);
const ed = jar();
await call(ed, 'POST', '/api/auth/accept-invite', { token: new URL(r.data.inviteLink).searchParams.get('token'), password: 'Editor-Pass-2026' });
r = await call(ed, 'GET', '/api/content/brand');
check('editor can read content', r.status === 200, r);
const edDraft = r.data.draft;
r = await call(ed, 'PUT', '/api/content/brand', { data: { ...edDraft, tagline: edDraft.tagline + ' (editor)' }, baseUpdatedAt: r.data.draftUpdatedAt ?? null });
check('editor can save a draft', r.status === 200, r);
r = await call(ed, 'POST', '/api/content/publish', { note: 'editor tries to publish' });
check('editor cannot publish (403)', r.status === 403 && r.data.code === 'FORBIDDEN', r);
r = await call(ed, 'GET', '/api/users');
check('editor cannot manage users', r.status === 403, r);
r = await call(ed, 'GET', '/api/leads');
check('editor cannot read leads', r.status === 403, r);
r = await call(ed, 'GET', '/api/audit');
check('editor cannot read audit log', r.status === 403, r);

console.log(failures ? `\n${failures} FAILED` : '\nALL PASSED');
server.close();
await mongoose.disconnect();
await mongo.stop();
process.exit(failures ? 1 : 0);
