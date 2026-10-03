import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');

const RENAMES = [
  { from: 'Tilt Bed.png', to: 'tilt-bed.webp', width: 1280, quality: 80 },
  { from: 'walklab product dropdown.png', to: 'walklab-product.webp', width: 1280, quality: 80 },
  { from: 'smartlock product dropdown.png', to: 'smartlock-product.webp', width: 1280, quality: 80 },
];

const RECOMPRESS_MIN_BYTES = 300 * 1024;
const RECOMPRESS_MAX_WIDTH = 1600;
const RECOMPRESS_QUALITY = 75;

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
};

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function convert(file, outName, width, quality) {
  const out = path.join(path.dirname(file), outName);
  const before = (await stat(file)).size;
  await sharp(file).resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(out);
  const after = (await stat(out)).size;
  console.log(`convert ${path.relative(ROOT, file)} -> ${path.basename(out)}: ${kb(before)} -> ${kb(after)}`);
  await unlink(file);
}

async function recompress(file) {
  const before = (await stat(file)).size;
  const tmp = `${file}.tmp.webp`;
  await sharp(file)
    .resize({ width: RECOMPRESS_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: RECOMPRESS_QUALITY, effort: 6 })
    .toFile(tmp);
  const after = (await stat(tmp)).size;
  if (after >= before * 0.95) {
    await unlink(tmp);
    console.log(`skip ${path.relative(ROOT, file)}: no gain (${kb(before)})`);
    return;
  }
  await unlink(file);
  await (await import('node:fs/promises')).rename(tmp, file.replace(/\.\w+$/, '.webp'));
  console.log(`recompress ${path.relative(ROOT, file)}: ${kb(before)} -> ${kb(after)}`);
}

for (const { from, to, width, quality } of RENAMES) {
  const file = path.join(PUBLIC, from);
  try {
    await stat(file);
  } catch {
    console.log(`missing ${from}, skipping`);
    continue;
  }
  await convert(file, to, width, quality);
}

const files = (await walk(PUBLIC)).filter((f) => /\.(webp|jpe?g|png)$/i.test(f));
const renamedTargets = new Set(RENAMES.map((r) => r.to));
for (const file of files) {
  const base = path.basename(file);
  if (renamedTargets.has(base)) continue;
  const { size } = await stat(file);
  const isJpg = /\.jpe?g$/i.test(file);
  if (isJpg) {
    await convert(file, base.replace(/\.\w+$/, '.webp'), RECOMPRESS_MAX_WIDTH, RECOMPRESS_QUALITY);
  } else if (size > RECOMPRESS_MIN_BYTES) {
    await recompress(file);
  }
}
console.log('done');
