import sharp from 'sharp';
import { readdir, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-candidates';
const OUT = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-sheets';
const CELL = 240;
const LABEL_H = 26;
const COLS = 6;
const ROWS = 5;
const PER = COLS * ROWS;
const TITLE_H = 44;

const TAGS = {
  'indian man sketching ideas notebook office': 'sketch',
  'indian team meeting laptop research office': 'research',
  'cad design engineer computer screen 3d': 'cad',
  'cnc machine mold factory india': 'cnc',
  'electronics testing oscilloscope lab engineer': 'scope',
  'indian factory worker blue uniform': 'blueuni',
  'electronics factory india workers': 'elecfac',
  'cleanroom worker india': 'cleanroom',
  'pcb assembly line worker factory': 'pcb',
  'quality inspection electronics factory india': 'qa',
  'packing boxes warehouse worker india': 'pack',
  'business analytics dashboard computer india': 'dash',
  'customer support agent headset india': 'support',
  'woman engineer india factory': 'weng',
  'indian technicians laboratory': 'lab',
  'smartphone repair technician india': 'repair',
};

const meta = JSON.parse(await readFile(path.join(SRC, '_meta.json'), 'utf8'));
const files = (await readdir(SRC)).filter((f) => f.endsWith('.jpg')).sort((a, b) => {
  const na = parseInt(a), nb = parseInt(b);
  return Number.isNaN(na) || Number.isNaN(nb) ? a.localeCompare(b) : na - nb;
});

await mkdir(OUT, { recursive: true });

const W = COLS * CELL;
const H = TITLE_H + ROWS * (CELL + LABEL_H);

for (let s = 0; s * PER < files.length; s++) {
  const group = files.slice(s * PER, (s + 1) * PER);
  const composites = [
    {
      input: Buffer.from(
        `<svg width="${W}" height="${TITLE_H}"><rect width="100%" height="100%" fill="#003366"/>
         <text x="12" y="31" font-family="Arial" font-size="26" fill="#ffff66">PROC SHEET ${s + 1} :: ${group.length} imgs</text></svg>`
      ),
      left: 0,
      top: 0,
    },
  ];
  for (const [i, f] of group.entries()) {
    const id = f.replace('.jpg', '');
    const x = (i % COLS) * CELL;
    const y = TITLE_H + Math.floor(i / COLS) * (CELL + LABEL_H);
    try {
      const thumb = await sharp(path.join(SRC, f))
        .resize(CELL, CELL, { fit: 'cover', position: 'attention' })
        .toBuffer();
      composites.push({ input: thumb, left: x, top: y });
    } catch {
      composites.push({
        input: Buffer.from(`<svg width="${CELL}" height="${CELL}"><rect width="100%" height="100%" fill="#900"/></svg>`),
        left: x,
        top: y,
      });
    }
    const tags = (meta[id] || []).map((q) => TAGS[q] || q.slice(0, 8)).join(',');
    const label = Buffer.from(
      `<svg width="${CELL}" height="${LABEL_H}"><rect width="100%" height="100%" fill="#111"/>
       <text x="5" y="19" font-family="Arial" font-size="16" fill="#0ff">${id} ${tags}</text></svg>`
    );
    composites.push({ input: label, left: x, top: y + CELL });
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: '#222' } })
    .composite(composites)
    .jpeg({ quality: 80 })
    .toFile(path.join(OUT, `proc-${s + 1}.jpg`));
  console.log(`proc-${s + 1}.jpg  ${W}x${H}  imgs=${group.length}`);
}
