// Bottom-strip comparison: bottom 32% of each tile stacked with a guide line,
// to eyeball podium platform alignment across the row.
import sharp from 'sharp';

const FILES = [
  ['neuro', 'public/images/products/neuro_rehab_device-home.webp'],
  ['bp', 'public/images/products/BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw1.webp'],
  ['box', 'public/images/products/boxsound-home.webp'],
  ['cluster', 'public/images/products/cluster1-home.webp'],
  ['lock', 'public/images/products/iot-lock-smart-home.webp'],
];

const TW = 760;
const STRIP = 0.32; // bottom fraction shown
const LH = 24;
const rows = [];
for (const [name, file] of FILES) {
  const m = await sharp(file).metadata();
  const H = Math.round((TW * m.height) / m.width);
  const sh = Math.round(H * STRIP);
  const img = await sharp(file).resize(TW, H).extract({ top: H - sh, left: 0, width: TW, height: sh }).png().toBuffer();
  const label = await sharp({
    text: { text: name, font: 'Arial', fontfile: 'C:/Windows/Fonts/arial.ttf', width: 100, height: LH },
  }).png().toBuffer();
  rows.push({ img, label, sh });
}

const W = TW + 4;
const totalH = rows.reduce((s, r) => s + r.sh + LH + 4, 0) + 4;
const comps = [];
let y = 4;
for (const r of rows) {
  comps.push({ input: r.label, left: 4, top: y });
  comps.push({ input: r.img, left: 4, top: y + LH });
  // guide line at 50% of the strip height
  comps.push({
    input: { create: { width: W, height: 1, channels: 3, background: '#ff3b30' } },
    left: 0, top: y + LH + Math.round(r.sh * 0.5),
  });
  y += r.sh + LH + 4;
}

await sharp({ create: { width: W, height: totalH, channels: 3, background: '#10233d' } })
  .composite(comps)
  .png()
  .toFile('C:/Users/Abcom/AppData/Local/Temp/opencode/proc-sheets/podium-strips.png');
console.log('saved podium-strips.png');
