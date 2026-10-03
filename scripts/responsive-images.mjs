import sharp from 'sharp';
import { readdir, writeFile, stat, unlink, mkdir } from 'node:fs/promises';
import { statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const MANIFEST = path.join(ROOT, 'src', 'data', 'imageVariants.json');

const WIDTHS = [480, 768, 1280, 1920];
const MIN_WIDTH = 600;
const AVIF = { quality: 55, effort: 4 };
const WEBP = { quality: 78, effort: 5 };

const SKIP = (rel) =>
  rel.startsWith('walnut-logo/') || /^(favicon|apple-touch-icon|android-chrome|logo)/i.test(rel);

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
};

const exists = async (f) => {
  try {
    await stat(f);
    return true;
  } catch {
    return false;
  }
};

const existsSyncSafe = (p) => {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
};

const kb = (n) => `${Math.round(n / 1024)} KB`;
const toPosix = (p) => p.split(path.sep).join('/');

const files = (await walk(PUBLIC)).filter((f) => /\.(webp|jpe?g|png)$/i.test(f));
const manifest = {};

let created = 0;
let reused = 0;

for (const file of files) {
  const rel = toPosix(path.relative(PUBLIC, file));
  if (SKIP(rel)) continue;
  if (/-\d+\.(webp|avif)$/i.test(rel)) continue;

  const meta = await sharp(file).metadata();
  if (!meta.width || meta.width < MIN_WIDTH) continue;

  const ext = path.extname(rel);
  const base = rel.slice(0, -ext.length);
  const avifWidths = WIDTHS.filter((w) => w <= meta.width);
  const webpWidths = WIDTHS.filter(
    (w) => w <= meta.width && !(ext.toLowerCase() === '.webp' && w === meta.width)
  );

  for (const [widths, format, options] of [
    [avifWidths, 'avif', AVIF],
    [webpWidths, 'webp', WEBP],
  ]) {
    for (const w of widths) {
      const out = path.join(PUBLIC, `${base}-${w}.${format}`);
      if (await exists(out)) {
        reused++;
        continue;
      }
      await sharp(file).resize({ width: w, withoutEnlargement: true })[format](options).toFile(out);
      created++;
    }
  }

  manifest[base] = {
    fallback: `/${rel}`,
    fallbackWidth: meta.width,
    avif: avifWidths,
    webp: webpWidths,
  };
  console.log(`variants ${rel} (${meta.width}px): avif[${avifWidths}] webp[${webpWidths}]`);
}

const sorted = Object.fromEntries(
  Object.keys(manifest)
    .sort()
    .map((k) => [k, manifest[k]])
);
await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + '\n');

const hero = sorted['home-background'];
if (hero && hero.avif.length) {
  const srcset = hero.avif.map((w) => `/home-background-${w}.avif ${w}w`).join(', ');
  const preload = `(function () {
  var p = location.pathname;
  if (p !== '/' && p !== '/index.html' && p !== '') return;
  var l = document.createElement('link');
  l.rel = 'preload';
  l.as = 'image';
  l.type = 'image/avif';
  l.setAttribute('imagesizes', '100vw');
  l.setAttribute('imagesrcset', '${srcset}');
  document.head.appendChild(l);
})();
`;
  await writeFile(path.join(PUBLIC, 'preload.js'), preload);
  console.log(`wrote public/preload.js (avif srcset: ${srcset})`);
}

const VARIANT_RE = /^(.+)-(480|768|1280|1920)\.(avif|webp)$/;
let pruned = 0;
for (const file of await walk(PUBLIC)) {
  const rel = toPosix(path.relative(PUBLIC, file));
  const m = rel.match(VARIANT_RE);
  if (!m) continue;
  const base = path.join(PUBLIC, m[1]);
  if (!['.webp', '.jpg', '.jpeg', '.png'].some((e) => existsSyncSafe(base + e))) {
    await unlink(file);
    pruned++;
    console.log(`pruned orphan ${rel}`);
  }
}

const total = (await Promise.all((await walk(PUBLIC)).map((f) => stat(f).then((s) => s.size)))).reduce(
  (a, b) => a + b,
  0
);
console.log(
  `done: ${created} created, ${reused} reused, ${pruned} pruned, manifest entries: ${Object.keys(sorted).length}, public total: ${kb(total)}`
);
