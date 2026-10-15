// Loads seed/content.json (exported from the website's src/data/content.js)
// into the database as both draft and published content.
//   npm run seed            → only fills sections that don't exist yet
//   npm run seed -- --force → overwrites every section (destructive!)
import fs from 'node:fs';
import path from 'node:path';
import { SERVER_ROOT } from '../src/config.js';
import { COLLECTIONS, validateCollection } from '../src/content/schemas.js';
import { connectDb, disconnectDb } from '../src/db.js';
import { Content, ContentVersion } from '../src/models/Content.js';

const force = process.argv.includes('--force');
const seed = JSON.parse(fs.readFileSync(path.join(SERVER_ROOT, 'seed/content.json'), 'utf8'));

await connectDb();
let written = 0;
for (const def of COLLECTIONS) {
  if (!(def.key in seed)) {
    console.warn(`- ${def.key}: not in seed file, skipped`);
    continue;
  }
  const { data, error } = validateCollection(def, seed[def.key]);
  if (error) {
    console.error(`✗ ${def.key}: ${error}`);
    process.exitCode = 1;
    continue;
  }
  const exists = await Content.exists({ key: def.key });
  if (exists && !force) {
    console.log(`- ${def.key}: already present, kept`);
    continue;
  }
  const now = new Date();
  await Content.updateOne(
    { key: def.key },
    { key: def.key, draft: data, published: data, draftUpdatedAt: now, publishedAt: now },
    { upsert: true },
  );
  written++;
  console.log(`✓ ${def.key}`);
}

if (written && !(await ContentVersion.exists({}))) {
  const snapshot = Object.fromEntries((await Content.find()).map((d) => [d.key, d.published]));
  await ContentVersion.create({ snapshot, changedKeys: Object.keys(snapshot), note: 'Initial import from website', publishedByName: 'System', deploy: { status: 'skipped', detail: 'Seed' } });
}
console.log(`\nDone — ${written} section(s) written.`);
await disconnectDb();
