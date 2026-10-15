# Walnut Admin

Admin panel for **walnutmedical.in**. It's a separate MERN app (MongoDB, Express, React, Node) that lets staff:

- **Edit website content.** Company details, divisions, products, process, expertise, clients, resources, news and chat greetings, with drafts, publishing and one-click rollback. If two people edit the same section, the second save gets a clear "someone else saved this" conflict (HTTP 409) instead of silently overwriting the first person's work.
- **Work the leads inbox.** Every contact, quote, resource and job-application form, with status tracking, assignment, notes, résumé download and CSV export.
- **Manage images.** Uploads are automatically resized, converted to WebP and stripped of metadata.
- **Manage users.** Invite-only accounts, six roles, two-factor authentication and a full audit log.

```
 Admin (admin.walnutmedical.in) ── Express API + React UI ── MongoDB Atlas
        │ Publish → Vercel deploy hook                          ▲
        ▼                                                       │ leads
 Website build: scripts/fetch-content.mjs pulls published content │
 Website /api/contact ───────────────────────────────────────────┘
```

The public website stays fully static. Visitors never touch the admin or the database. A publish triggers a normal Vercel rebuild, and the site is live 1–2 minutes later.

---

## Run it locally (no accounts needed)

Requires **Node 22.9+**.

```bash
npm install
npm run seed                 # imports the website's current content
npm run create-admin -- --email you@walnutmedical.in --name "Your Name"
npm run dev                  # API on :4000, admin UI on http://localhost:5174
```

`create-admin` prints a one-time link. Open it, set a password, then scan the QR code with an authenticator app. Two-factor authentication is mandatory for Super Admins.

Local mode needs no configuration:
- **Database:** without `MONGODB_URI`, an embedded MongoDB starts and keeps its data in `server/.data/`. The first run downloads it (about 600 MB, once).
- **Email:** without `RESEND_API_KEY`, emails (invites, password resets) are printed in the terminal, and invite links are also shown in the UI.
- **Secrets:** generated automatically into `server/.data/dev-secrets.json`.

To start over, stop the server, delete `server/.data/db`, then run `seed` and `create-admin` again.

```bash
npm test     # 63 end-to-end checks against a throwaway database
```

---

## Roles

| Role | Can do |
|---|---|
| **Super Admin** | Everything: users, audit log, deleting leads. Two-factor required. |
| **Publisher** | Edit website content **and** publish it live, manage images |
| **Editor** | Prepare content drafts and images — a Publisher pushes them live |
| **Sales** | Contact, quote and resource leads |
| **HR** | Job applications and résumés |
| **Viewer** | Read-only access to content, images and enquiries |

The rules live in `server/src/lib/permissions.js` and are enforced on every API route. The UI only hides what a role can't use.

## Security model

- **Passwords:** bcrypt (cost 12). The policy requires at least 10 characters, rejects common passwords and passwords containing the email name. Responses take the same time whether or not an email exists.
- **Sessions:** httpOnly, `Secure`, `SameSite=Strict` cookies. The access token lasts 15 minutes. The refresh token rotates on every use, and replaying an old one revokes the session (theft detection). Sessions end after 30 minutes idle or 12 hours total. The server rechecks the user and session on every request, so disabling a user or changing a role takes effect immediately.
- **Two-factor authentication:** TOTP via any authenticator app, with 8 single-use recovery codes. A used code can't be replayed. Secrets are encrypted at rest (AES-256-GCM, `ENCRYPTION_KEY`).
- **Brute force:** an account locks for 15 minutes after 5 failed attempts. Login is also rate-limited per IP.
- **CSRF:** SameSite=Strict cookies plus a required `X-Requested-With` header.
- **Access:** invite-only, limited to `@walnutmedical.in` addresses (`ALLOWED_EMAIL_DOMAINS`). There is no public sign-up.
- **Uploads:** every image is decoded and re-encoded by sharp. Anything that isn't a real image is rejected, and EXIF/GPS metadata is stripped.
- **Leads:** the website pushes leads server-to-server with a shared secret (`LEADS_INGEST_KEY`). CSV exports neutralise spreadsheet formulas.
- **Audit log:** sign-ins, failures, edits, publishes, exports, résumé downloads and permission changes are recorded and kept for 1 year.
- **HTTP hardening:** strict CSP, HSTS and frame-blocking via helmet. The admin is `noindex`.

---

## Going live (one-time setup, about an hour)

### 1. MongoDB Atlas
1. Create a cluster at <https://cloud.mongodb.com>. M0 (free) is fine to start; choose region **Mumbai (ap-south-1)**.
2. Create a database user with a long random password.
3. Under Network Access, allow your host's outbound IPs, or `0.0.0.0/0` for Render (the password protects it).
4. Copy the connection string (`mongodb+srv://…/walnut_admin`) and add the database name `walnut_admin`.

> M0 has 512 MB of storage. Images and résumés are stored in MongoDB (GridFS), and at about 200 KB per WebP image that's thousands of images. Move to M10 (about $57/month) when you need automated backups. Until then, see [Backups](#backups).

### 2. Host the server on Render
1. Push this folder to a **private** GitHub repo, for example `walnut-admin`.
2. In Render, choose New → **Blueprint** and select the repo. `render.yaml` configures everything.
3. Fill in the secret variables:

| Variable | Value |
|---|---|
| `MONGODB_URI` | From step 1 |
| `ENCRYPTION_KEY` | `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. Store it in your password manager. **If it changes, everyone's two-factor setup stops working.** |
| `RESEND_API_KEY` | Same Resend account as the website. Verify the `walnutmedical.in` domain in Resend. |
| `VERCEL_DEPLOY_HOOK_URL` | From step 4 |

`JWT_ACCESS_SECRET` and `LEADS_INGEST_KEY` are generated by Render.

4. **Custom domain:** in Render → Settings → Custom Domains, add `admin.walnutmedical.in`. Then add the CNAME record it shows at your DNS provider.
5. **First admin:** open Render → Shell and run `npm run seed && npm run create-admin -- --email you@walnutmedical.in --name "Your Name"`.

Any Node host works (Railway, a VPS with PM2 behind Nginx, etc.): run `npm ci && npm run build`, then `NODE_ENV=production npm start`. The server expects exactly one reverse proxy in front of it (`trust proxy = 1`).

### 3. Connect the website (Vercel project)
In **Vercel → website project → Settings → Environment Variables** (Production):

| Variable | Value |
|---|---|
| `CMS_API_URL` | `https://admin.walnutmedical.in` |
| `LEADS_INGEST_KEY` | The same value Render generated for the admin |

With these set, every website build pulls published content from the admin (the build fails instead of shipping blank content if the admin is unreachable), and every form submission is saved to the leads inbox as well as emailed.

### 4. Deploy hook (the Publish button)
1. In Vercel → website project → Settings → Git → **Deploy Hooks**, create a hook named `walnut-admin` on branch `main`.
2. Put the URL into `VERCEL_DEPLOY_HOOK_URL` on Render.
3. Publish once from the admin and check that a deployment appears in Vercel.

---

## Day-to-day operations

| Situation | What to do |
|---|---|
| Someone lost their phone (2FA) | They sign in with a recovery code. If they have none, a Super Admin uses Users → ⋮ → **Reset two-factor** after confirming who they are. |
| The only Super Admin lost 2FA *and* their codes | On the server shell (Render → Shell): `npm run reset-mfa -- --email them@walnutmedical.in`. This is logged in the audit log. Keep **two** Super Admins so this is rarely needed. |
| The only Super Admin forgot their password | Use "Forgot password?" on the sign-in page (needs Resend configured). |
| Someone left the company | Users → ⋮ → **Disable account**. They're signed out immediately, and their history stays in the audit log. |
| Locked out after failed logins | Wait 15 minutes, or a Super Admin uses **Unlock account**. |
| Bad publish | Publish & History → **Restore** on the previous version. It republishes immediately. |
| Data-deletion request | Leads → open the lead → **Delete lead** (Super Admin). The résumé is deleted too. |
| Leaked `LEADS_INGEST_KEY` | Generate a new one, set it on Render **and** Vercel, then redeploy both. |

### Backups
On M0, run a weekly `mongodump --uri "$MONGODB_URI" --archive=walnut-$(date +%F).gz --gzip` from a trusted machine and keep the archives off-site. On M10 and above, turn on Atlas Cloud Backup instead.

---

## Project layout

```
server/
  src/app.js               Express app: security headers, routes, serves client/dist
  src/config.js            Env vars + security policy (timeouts, lockout, TTLs)
  src/content/schemas.js   ★ Every editable website section is defined here
  src/routes/              auth, users, content, leads, media, audit, dashboard, public
  src/models/              User, Session, UserToken, Content(+Version), Lead, Media, AuditLog
  scripts/                 seed.js, create-admin.js
  seed/content.json        Snapshot of the website's content used for the first import
  test/e2e.mjs             End-to-end test suite
client/
  src/pages/               Dashboard, Leads, Content editor, Publish, Media, Users, Audit, Security
  src/components/fields.jsx  Form engine that renders editors from schemas.js
```

### Adding an editable field or section
1. Add the field to its collection in `server/src/content/schemas.js` (types: `text`, `textarea`, `url`, `email`, `image`, `number`, `tags`, `select`, `gradient`, `object`, `list`). The admin form and validation update automatically.
2. Use it in the website component (it arrives through `src/data/content.js`).
3. For a brand-new section, also add its key to `REQUIRED` in the website's `scripts/fetch-content.mjs` and an export in `src/data/content.js`.

### Not yet managed by the admin (phase 2)
Some website copy is still hard-coded inside page components rather than `content.js`: job openings (`CareerPage.jsx`, translated via `translations.js`), homepage milestones and stats, the four division showcase pages, and the legal pages. Making them editable means moving that data into `content.json` and adding a schema here. Job openings are the obvious next step for HR.

The admin doesn't send its own new-lead alert emails. The website's `/api/contact` keeps emailing `CONTACT_TO_EMAIL` as before.
