// Pulls published content from the Walnut Admin panel into src/data/content.json
// before every build. Runs as part of `npm run build`.
//
//   CMS_API_URL=https://walnut-technologies.vercel.app/admin  → fetch (build fails if unreachable,
//                                                  so a broken fetch never ships stale content
//                                                  as if it were a publish; the live site stays as is)
//   CMS_API_URL unset (local dev)                → skip, keep the committed content.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'src/data/content.json');
const REQUIRED = [
  'brand', 'about', 'trustSignals', 'divisions', 'products', 'process',
  'industryFourTechnologies', 'impactBenefits', 'expertise', 'clientSectors',
  'resources', 'news', 'chatbot',
];

const base = (process.env.CMS_API_URL || '').replace(/\/$/, '');
if (!base) {
  console.log('[content] CMS_API_URL not set — using committed src/data/content.json');
  process.exit(0);
}

async function fetchWithRetry(url, attempts = 3) {
  for (let i = 1; i <= attempts; i++) {
    try {
      // Generous timeout: a sleeping free-tier server can take ~60s to wake.
      const res = await fetch(url, { signal: AbortSignal.timeout(90_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[content] attempt ${i}/${attempts} failed: ${err.message}`);
      if (i === attempts) throw err;
      await new Promise((r) => setTimeout(r, 5000 * i));
    }
  }
}

try {
  const { content, generatedAt } = await fetchWithRetry(`${base}/api/public/content`);
  const missing = REQUIRED.filter((k) => !(k in content));
  if (missing.length) throw new Error(`response is missing sections: ${missing.join(', ')}`);
  if (!content.brand?.name) throw new Error('brand.name is empty — refusing to publish blank content');

  fs.writeFileSync(target, JSON.stringify(content, null, 2) + '\n');
  console.log(`[content] wrote ${path.relative(root, target)} (published ${generatedAt})`);
} catch (err) {
  console.error(`[content] could not load content from ${base}: ${err.message}`);
  process.exit(1);
}
