// Swap the homepage process step 07 (QUALITY ASSURANCE) image: process QA.webp
// with the same pipeline as scripts/tmp-apply.mjs (1000x1000 attention crop +
// shared blue grade) over quality-assurance.webp, drop stale variants.
import sharp from 'sharp';
import { readdir, unlink, copyFile, mkdir, rename } from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

const PROC = 'public/images/process';
const SRC = 'public/images/process/QA.webp';
const DEST = 'public/images/process/quality-assurance.webp';
const BACKUP_DIR = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-orig';
const SIZE = 1000;

const meta = await sharp(SRC).metadata();
console.log(`source: ${meta.width}x${meta.height}`);

await mkdir(BACKUP_DIR, { recursive: true });
await copyFile(DEST, path.join(BACKUP_DIR, 'quality-assurance-before-qa.webp'));

for (const f of await readdir(PROC)) {
  if (f.startsWith('quality-assurance-') && /\.(webp|avif)$/i.test(f)) {
    await unlink(path.join(PROC, f));
  }
}

await sharp(SRC)
  .resize(SIZE, SIZE, { fit: 'cover', position: 'attention' })
  .modulate({ brightness: 1.06, saturation: 1.03 })
  .linear([0.98, 1.0, 1.05], [2, 2, 6])
  .webp({ quality: 78, effort: 6 })
  .toFile(DEST + '.new');

let ok = false;
for (let i = 0; i < 8 && !ok; i++) {
  try { await rename(DEST + '.new', DEST); ok = true; }
  catch { await new Promise((r) => setTimeout(r, 300)); }
}
if (!ok) throw new Error('could not replace ' + DEST);

const m = await sharp(DEST).metadata();
console.log(`quality-assurance.webp  <- QA.webp  ${m.width}x${m.height}`);

execSync('node scripts/responsive-images.mjs', { stdio: 'inherit' });
