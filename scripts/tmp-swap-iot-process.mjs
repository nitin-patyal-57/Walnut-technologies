// Swap the homepage process step 02 image: process "IoT Software Development.jpg"
// with the exact same pipeline as scripts/tmp-apply.mjs (1000x1000 attention
// crop + shared blue grade) and write it over research-and-market-analysis.webp,
// then drop its stale responsive variants.
import sharp from 'sharp';
import { readdir, unlink, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

const PROC = 'public/images/process';
const SRC = 'public/images/process/IoT Software Development.jpg';
const DEST = 'public/images/process/research-and-market-analysis.webp';
const BACKUP_DIR = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-orig';
const SIZE = 1000;

const meta = await sharp(SRC).metadata();
console.log(`source: ${meta.width}x${meta.height}`);

// keep a copy of whatever is being replaced
await mkdir(BACKUP_DIR, { recursive: true });
await copyFile(DEST, path.join(BACKUP_DIR, 'research-and-market-analysis-before-iot.webp'));

// clear stale responsive variants so they get regenerated
for (const f of await readdir(PROC)) {
  if (f.startsWith('research-and-market-analysis-') && /\.(webp|avif)$/i.test(f)) {
    await unlink(path.join(PROC, f));
  }
}

await sharp(SRC)
  .resize(SIZE, SIZE, { fit: 'cover', position: 'attention' })
  .modulate({ brightness: 1.06, saturation: 1.03 })
  .linear([0.98, 1.0, 1.05], [2, 2, 6])
  .webp({ quality: 78, effort: 6 })
  .toFile(DEST + '.new');

import { rename } from 'node:fs/promises';
let ok = false;
for (let i = 0; i < 8 && !ok; i++) {
  try { await rename(DEST + '.new', DEST); ok = true; }
  catch { await new Promise((r) => setTimeout(r, 300)); }
}
if (!ok) throw new Error('could not replace ' + DEST);

const m = await sharp(DEST).metadata();
console.log(`research-and-market-analysis.webp  <- IoT Software Development.jpg  ${m.width}x${m.height}`);

execSync('node scripts/responsive-images.mjs', { stdio: 'inherit' });
