# Updating the Walnut Technologies Website

Operational guide for anyone who needs to change content, images, or push updates
to production. For local setup and code structure, see [`README.md`](../README.md).

**Golden rule:** text/data lives in `src/data/*.js`, layout lives in components.
Prefer editing data files over markup when only copy changes.

---

## 1. Where to change content (cheat sheet)

| I want to change... | Edit this |
|---|---|
| Company name, tagline, contact details, trust signals | `src/data/content.js` → `brand`, `about`, `trustSignals` |
| Divisions (Medical, IoT, Fintech...), their products/images | `src/data/content.js` → `divisions` |
| Product cards on Solutions page | `src/data/content.js` → `products` |
| Process steps, expertise areas, resources, news items | `src/data/content.js` → `process`, `expertise`, `resources`, `news` |
| Homepage sections (hero, stats, showcase copy) | `src/pages/HomePage.jsx`, `src/components/Hero.jsx`, `ProductShowcase.jsx` |
| Medical / IoT / Automotive / Neuro division pages | `src/components/MedicalShowcase.jsx`, `IoTShowcase.jsx`, `AutomotiveShowcase.jsx`, `NeuroShowcase.jsx` (each has a `products` array) |
| Menu, footer links, WhatsApp button | `src/components/Navbar.jsx`, `Footer.jsx` |
| Chat widget answers | `src/data/chatKnowledge.js` |
| Page title / description / social preview | `<SEO ...>` props at the top of each file in `src/pages/` |
| Colors, fonts, design tokens | `tailwind.config.js`, `src/index.css` |
| New page / URL | `src/App.jsx` (route) + add the path to `vercel.json` rewrites **and** `public/sitemap.xml` |

---

## 2. Images

1. Put the file in `public/images/<folder>/` — keep names lowercase, hyphenated,
   **`.webp`** (e.g. `public/images/products/new-device.webp`).
2. Run the pipeline:
   ```bash
   npm run images
   ```
   This recompresses, generates responsive variants (`-480`, `-768`, `-1280`, `-1920`
   in WebP + AVIF), and rewrites `src/data/imageVariants.json`.
3. Reference it as `/images/<folder>/<name>.webp` — the `Picture` component
   (`src/components/Picture.jsx`) automatically picks AVIF/WebP sources.

Notes:
- Images **< 600px wide** get no variants; they still work (single file fallback).
- `imageVariants.json` is generated — never edit it by hand.
- Background-removed product shots follow the `*-removebg.webp` convention
  (white cut out to transparency, `mix-blend-multiply` in tiles).
- Sanity checks: `npm run verify-images`, `node scripts/check-responsive.mjs`
  (no horizontal overflow at any breakpoint).

---

## 3. Forms & email (the only backend)

All forms (contact, quote, resource request, job application) POST to `/api/contact`
via `src/utils/sendEmail.js`.

- Handler: `api/contact.js` — validates, sanitizes, rate-limits (5 req/min/IP), sends
  email through the **Resend** API.
- Allowed types: `contact`, `quote`, `resource`, `application`.

### Environment variables

Set in **Vercel → Project → Settings → Environment Variables** (never commit them):

| Var | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Yes | Resend API key — forms fail without it |
| `CONTACT_TO_EMAIL` | No | Where submissions are delivered (default in code) |
| `CONTACT_FROM_EMAIL` | No | Verified sender address |

For local testing, export them in the shell **before** `npm run dev`
(`.env.local` is git-ignored for keeping keys out of the repo, but note this project
does not auto-load it — the handler reads `process.env` directly):

```powershell
# PowerShell (Windows)
$env:RESEND_API_KEY="re_xxx"; npm run dev
```

```bash
# macOS / Linux
RESEND_API_KEY=re_xxx npm run dev
```

**Forms not sending email?** Check `RESEND_API_KEY` exists in Vercel env settings,
then inspect Vercel → Functions logs for `/api/contact`.

---

## 4. SEO, sitemap & PWA

- Per-page meta: `<SEO title description path image />` from `src/components/SEO.jsx`.
  The site URL constant (`https://walnutmedical.in`) is defined there — **update it
  if the domain changes**.
- New route? Add it to `public/sitemap.xml`, `public/robots.txt` (if needed) and
  `vercel.json` rewrites.
- Service worker `public/sw.js` caches assets; `src/main.jsx` detects new deploys and
  refreshes open tabs automatically.

---

## 5. How updates go live (deployment)

The GitHub repo is the source of truth; **Vercel builds and deploys on every push to
`main`** (~1 minute). No FTP/server access needed.

### Recommended workflow for any developer

```bash
git checkout -b update/homepage-copy   # 1. branch for your change
npm run dev                            # 2. make the edit, check it locally
npm run build                          # 3. verify the production build passes
git add -A && git commit -m "Describe the change"
git push origin update/homepage-copy   # 4. open a PR on GitHub
```

5. The PR gives a **preview URL** (Vercel deployment) to review before merging.
6. Merge to `main` → site updates automatically.

### Pre-push checklist

- [ ] `npm run build` passes
- [ ] `npm run images` run if images were added/changed
- [ ] Checked desktop + mobile views (`npm run preview`)
- [ ] No secrets/keys in the diff
- [ ] New routes added to `vercel.json` + `sitemap.xml`

### Access & safety

- Add team members as **GitHub collaborators** (never share one account).
- Protect `main` in repo settings (require a PR before merging).
- Keep `RESEND_API_KEY` only in Vercel env settings.

---

## 6. Verification scripts

| Command | Checks |
|---|---|
| `npm run verify-images` | Renders the built site and flags broken images / preload issues |
| `node scripts/check-responsive.mjs` | No horizontal overflow / clipped text at 16 viewport widths |
| `node scripts/check-image-refs.mjs` | Statically scans `src/` for image paths that don't exist |
| `npm run build` | Compile errors, bundle output |

---

## 7. Common tasks — recipes

**Update homepage hero text** → `src/pages/HomePage.jsx` / `src/components/Hero.jsx`

**Add a product to the Medical division** → `MedicalShowcase.jsx` → `products` array
(add `title`, `description`, `highlights`, `image`), then add the image per §2.

**Add a news article** → `src/data/content.js` → `news`

**Change the logo / favicon** → `public/images/brand/` + favicon files in `public/`
(`favicon.ico`, `apple-touch-icon.png`, `android-chrome-*.png`)

**Change site-wide colors** → `tailwind.config.js` (design tokens) and
`src/index.css`
