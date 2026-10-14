import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'C:\\Users\\Abcom\\AppData\\Local\\Temp\\opencode\\candidates';
const OUT = 'C:\\Users\\Abcom\\AppData\\Local\\Temp\\opencode\\sheets';
const CELL_W = 300;
const CELL_H = 225;
const LABEL_H = 30;
const COLS = 6;
const TITLE_H = 46;
const PER_SHEET = 24;

const files = (await readdir(SRC)).filter((f) => f.endsWith('.jpg')).sort();
await mkdir(OUT, { recursive: true });

for (let s = 0; s * PER_SHEET < files.length; s++) {
  const group = files.slice(s * PER_SHEET, (s + 1) * PER_SHEET);
  const rows = Math.ceil(group.length / COLS);
  const W = COLS * CELL_W;
  const H = TITLE_H + rows * (CELL_H + LABEL_H);
  const composites = [
    {
      input: Buffer.from(
        `<svg width="${W}" height="${TITLE_H}"><rect width="100%" height="100%" fill="#660066"/>
         <text x="10" y="33" font-family="Arial" font-size="28" fill="#ffff00">CAND-B${s + 1} :: ${group.length} candidates</text></svg>`
      ),
      left: 0,
      top: 0,
    },
  ];
  for (const [i, f] of group.entries()) {
    const x = (i % COLS) * CELL_W;
    const y = TITLE_H + Math.floor(i / COLS) * (CELL_H + LABEL_H);
    const thumb = await sharp(path.join(SRC, f))
      .resize(CELL_W, CELL_H, { fit: 'cover', position: 'attention' })
      .toBuffer();
    composites.push({ input: thumb, left: x, top: y });
    const label = Buffer.from(
      `<svg width="${CELL_W}" height="${LABEL_H}"><rect width="100%" height="100%" fill="#111"/>
       <text x="6" y="22" font-family="Arial" font-size="18" fill="#0ff">${f.replace('.jpg', '')}</text></svg>`
    );
    composites.push({ input: label, left: x, top: y + CELL_H });
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: '#222' } })
    .composite(composites)
    .jpeg({ quality: 78 })
    .toFile(path.join(OUT, `cand-B${s + 1}.jpg`));
  console.log(`cand-B${s + 1}.jpg ${W}x${H} cells=${group.length}`);
}
