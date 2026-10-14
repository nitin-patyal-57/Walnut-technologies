import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public', 'images');
const OUT = 'C:\\Users\\Abcom\\AppData\\Local\\Temp\\opencode\\sheets';

const DIRS = ['about', 'expertise', 'process'];
const CELL_W = 340;
const CELL_H = 250;
const LABEL_H = 30;
const COLS = 5;
const TITLE_H = 48;

const base = (dir) =>
  readdir(path.join(PUBLIC, dir)).then((f) =>
    f.filter((n) => n.endsWith('.webp') && !/-\d+\./.test(n)).sort().map((n) => ({ dir, name: n }))
  );

const cells = (await Promise.all(DIRS.map(base))).flat();
cells.push({ dir: 'backgrounds', name: 'career-background.webp' });

await mkdir(OUT, { recursive: true });

const rows = Math.ceil(cells.length / COLS);
const W = COLS * CELL_W;
const H = TITLE_H + rows * (CELL_H + LABEL_H);
const composites = [
  {
    input: Buffer.from(
      `<svg width="${W}" height="${TITLE_H}"><rect width="100%" height="100%" fill="#003366"/>
       <text x="10" y="34" font-family="Arial" font-size="30" fill="#ffff00">MEGA-A v1 :: ${cells.length} project images</text></svg>`
    ),
    left: 0,
    top: 0,
  },
];

for (const [i, c] of cells.entries()) {
  const x = (i % COLS) * CELL_W;
  const y = TITLE_H + Math.floor(i / COLS) * (CELL_H + LABEL_H);
  const thumb = await sharp(path.join(PUBLIC, c.dir, c.name))
    .resize(CELL_W, CELL_H, { fit: 'cover', position: 'attention' })
    .toBuffer();
  composites.push({ input: thumb, left: x, top: y });
  const label = Buffer.from(
    `<svg width="${CELL_W}" height="${LABEL_H}"><rect width="100%" height="100%" fill="#111"/>
     <text x="6" y="22" font-family="Arial" font-size="17" fill="#0f0">${c.dir}/${c.name}</text></svg>`
  );
  composites.push({ input: label, left: x, top: y + CELL_H });
}

await sharp({ create: { width: W, height: H, channels: 3, background: '#222' } })
  .composite(composites)
  .jpeg({ quality: 78 })
  .toFile(path.join(OUT, 'mega-A.jpg'));

console.log(`mega-A.jpg ${W}x${H} cells=${cells.length}`);
