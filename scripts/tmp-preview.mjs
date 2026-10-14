import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-candidates';
const OUT = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-sheets';

const PICKS = [
  ['01', 'IDEA', '4238498'],
  ['02', 'RESEARCH', '7691696'],
  ['03', 'DESIGN', '19895919'],
  ['04', 'MANUFACTURING', '32972129'],
  ['05', 'TESTING', '35290693'],
  ['06', 'MOLDING', '39351225'],
  ['07', 'QA', '31090818'],
  ['08', 'PACKAGING', '31112254'],
  ['09', 'SUPPORT', '31259265'],
  ['10', 'IMPROVEMENT', '4267526'],
];

const ALTS = [
  ['01', 'IDEA', '5124844'],
  ['01', 'IDEA', '10474153'],
  ['02', 'RESEARCH', '31321047'],
  ['02', 'RESEARCH', '7691693'],
  ['03', 'DESIGN', '19895882'],
  ['03', 'DESIGN', '3912948'],
  ['04', 'MANUFACTURING', '33748028'],
  ['04', 'MANUFACTURING', '28929513'],
  ['05', 'TESTING', '36594160'],
  ['05', 'TESTING', '35155421'],
  ['06', 'MOLDING', '5554948'],
  ['06', 'MOLDING', '31336007'],
  ['07', 'QA', '31030921'],
  ['07', 'QA', '32399715'],
  ['08', 'PACKAGING', '39351202'],
  ['08', 'PACKAGING', '31112245'],
  ['09', 'SUPPORT', '31321061'],
  ['09', 'SUPPORT', '34642915'],
  ['10', 'IMPROVEMENT', '13062478'],
  ['10', 'IMPROVEMENT', '4267524'],
];

const D = 280; // circle diameter
const LABEL_H = 30;
const COLS = 5;
const TITLE_H = 48;
const GRADE = true;

async function circle(id, graded) {
  const file = path.join(SRC, `${id}.jpg`);
  let img = sharp(file).resize(D, D, { fit: 'cover', position: 'attention' });
  if (graded) img = img.modulate({ brightness: 1.06, saturation: 1.03 }).linear([0.98, 1.0, 1.05], [2, 2, 6]);
  const buf = await img.png().toBuffer();
  // circular mask
  const mask = Buffer.from(
    `<svg width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2}" fill="#fff"/></svg>`
  );
  return sharp(buf).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
}

async function sheet(items, file, title) {
  const rows = Math.ceil(items.length / COLS);
  const W = COLS * (D + 20);
  const H = TITLE_H + rows * (D + LABEL_H + 16);
  const composites = [
    {
      input: Buffer.from(
        `<svg width="${W}" height="${TITLE_H}"><rect width="100%" height="100%" fill="#003366"/>
         <text x="12" y="33" font-family="Arial" font-size="26" fill="#ffff66">${title}</text></svg>`
      ),
      left: 0,
      top: 0,
    },
  ];
  for (const [i, [num, name, id]] of items.entries()) {
    const x = (i % COLS) * (D + 20) + 10;
    const y = TITLE_H + Math.floor(i / COLS) * (D + LABEL_H + 16) + 8;
    try {
      const c = await circle(id, GRADE);
      composites.push({ input: c, left: x, top: y });
    } catch (e) {
      console.log('  x', id, e.message);
    }
    const label = Buffer.from(
      `<svg width="${D}" height="${LABEL_H}"><text x="${D / 2}" y="21" text-anchor="middle" font-family="Arial" font-size="19" font-weight="bold" fill="#001a33">${num} ${name} <tspan fill="#0066cc">[${id}]</tspan></text></svg>`
    );
    composites.push({ input: label, left: x, top: y + D + 4 });
  }
  await sharp({ create: { width: W, height: H, channels: 4, background: '#ffffff' } })
    .composite(composites)
    .jpeg({ quality: 88 })
    .toFile(path.join(OUT, file));
  console.log(`${file} ${W}x${H}`);
}

await mkdir(OUT, { recursive: true });
await sheet(PICKS, 'preview-picks.jpg', 'PRODUCTION PROCESS - RECOMMENDED 10 (graded)');
await sheet(ALTS, 'preview-alts.jpg', 'ALTERNATES per step (say a swap, e.g. "05 -> 36594160")');
