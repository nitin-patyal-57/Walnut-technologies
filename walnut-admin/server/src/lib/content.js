import { config } from '../config.js';
import { COLLECTIONS } from '../content/schemas.js';
import { Content } from '../models/Content.js';

export const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

export async function loadAllContent() {
  const docs = await Content.find({ key: { $in: COLLECTIONS.map((c) => c.key) } });
  return new Map(docs.map((d) => [d.key, d]));
}

// Published content of every collection, shaped like the website's content.js exports.
export async function publishedSnapshot() {
  const docs = await loadAllContent();
  const out = {};
  for (const def of COLLECTIONS) {
    const doc = docs.get(def.key);
    out[def.key] = doc?.published ?? (def.kind === 'list' ? [] : {});
  }
  return out;
}

// Asks Vercel to rebuild the website, which pulls the freshly published content.
export async function triggerDeploy() {
  if (!config.deployHookUrl) {
    return { status: 'skipped', detail: 'VERCEL_DEPLOY_HOOK_URL is not set — website was not rebuilt' };
  }
  try {
    const res = await fetch(config.deployHookUrl, { method: 'POST', signal: AbortSignal.timeout(10000) });
    if (!res.ok) return { status: 'failed', detail: `Deploy hook responded ${res.status}` };
    return { status: 'triggered', detail: 'Website rebuild started (usually live in 1–2 minutes)' };
  } catch (err) {
    return { status: 'failed', detail: `Deploy hook error: ${err.message}` };
  }
}
