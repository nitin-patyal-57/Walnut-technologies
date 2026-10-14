import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-candidates';
const OUT = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-sheets';
const IDS = ['35290693', '35155421', '36594160', '19895784', '34642915', '31862950'];
const D = 280, LABEL_H = 30, TITLE_H = 48, COLS = 6;

async function circle(id) {
  const buf = await sharp(path.join(SRC, `${id}.jpg`))
    .resize(D, D, { fit: 'cover', position: 'attention' })
    .modulate({ brightness: 1.06, saturation: 1.03 })
    .linear([0.98, 1.0, 1.05], [2, 2, 6])
    .png().toBuffer();
  const mask = Buffer.from(`<svg width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2}" fill="#fff"/></svg>`);
  return sharp(buf).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
}

const W = COLS * (D + 20), H = TITLE_H + D + LABEL_H + 24;
const comps = [{
  input: Buffer.from(`<svg width="${W}" height="${TITLE_H}"><rect width="100%" height="100%" fill="#003366"/>
    <text x="12" y="33" font-family="Arial" font-size="26" fill="#ffff66">STEP 05 TESTING - options</text></svg>`),
  left: 0, top: 0,
}];
for (const [i, id] of IDS.entries()) {
  const x = i * (D + 20) + 10, y = TITLE_H + 12;
  comps.push({ input: await circle(id), left: x, top: y });
  comps.push({
    input: Buffer.from(`<svg width="${D}" height="${LABEL_H}"><text x="${D / 2}" y="21" text-anchor="middle" font-family="Arial" font-size="19" font-weight="bold" fill="#001a33">${id}</text></svg>`),
    left: x, top: y + D + 6,
  });
}
await mkdir(OUT, { recursive: true });
await sharp({ create: { width: W, height: H, channels: 4, background: '#fff' } })
  .composite(comps).jpeg({ quality: 88 }).toFile(path.join(OUT, 'step05-options.jpg'));
console.log('written step05-options.jpg');
