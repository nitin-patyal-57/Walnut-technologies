// Top-quarter comparison at full width for all 5 current tiles, stacked, to
// spot any blank/unfilled band at the container top.
import sharp from 'sharp';

const FILES = [
  ['neuro', 'public/images/products/neuro_rehab_device-home.webp'],
  ['bp', 'public/images/products/bp-home.webp'],
  ['box (payment)', 'public/images/products/boxsound-home.webp'],
  ['cluster', 'public/images/products/cluster1-home.webp'],
  ['lock', 'public/images/products/iot-lock-smart-home.webp'],
];

const TW = 1000;
const CROP = 0.3; // top 30%
const LH = 26;

const rows = [];
for (const [name, file] of FILES) {
  const m = await sharp(file).metadata();
  const ch = Math.round(m.height * CROP);
  const H = Math.round((TW * ch) / m.width);
  const img = await sharp(file)
    .extract({ top: 0, left: 0, width: m.width, height: ch })
    .resize(TW, H)
    .png()
    .toBuffer();
  const label = await sharp({
    text: { text: name, font: 'Arial', fontfile: 'C:/Windows/Fonts/arial.ttf', width: 180, height: LH },
  }).png().toBuffer();
  rows.push({ img, label, H });
}

const W = TW + 8;
const totalH = rows.reduce((s, r) => s + r.H + LH + 6, 0) + 8;
const comps = [];
let y = 4;
for (const r of rows) {
  comps.push({ input: r.label, left: 4, top: y });
  comps.push({ input: r.img, left: 4, top: y + LH });
  comps.push({ input: { create: { width: W, height: 2, channels: 3, background: '#ff3b30' } }, left: 0, top: y + LH });
  y += r.H + LH + 6;
}

await sharp({ create: { width: W, height: totalH, channels: 3, background: '#10233d' } })
  .composite(comps)
  .png()
  .toFile('C:/Users/Abcom/AppData/Local/Temp/opencode/proc-sheets/top-quarter.png');
console.log('saved top-quarter.png');
