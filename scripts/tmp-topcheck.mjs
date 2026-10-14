// Top-strip check: top 9% of each current tile, enlarged 2x, stacked with a
// red line marking the very top row of the canvas, so padding/extension seams
// or blank bands at the container top are visible.
import sharp from 'sharp';

const FILES = [
  ['neuro', 'public/images/products/neuro_rehab_device-home.webp'],
  ['bp', 'public/images/products/bp-home.webp'],
  ['box (payment)', 'public/images/products/boxsound-home.webp'],
  ['cluster', 'public/images/products/cluster1-home.webp'],
  ['lock', 'public/images/products/iot-lock-smart-home.webp'],
];

const TW = 900; // display width
const STRIP = 0.09; // top fraction
const LH = 22;
const ZOOM = 2;

const rows = [];
for (const [name, file] of FILES) {
  const m = await sharp(file).metadata();
  const sh = Math.round(m.height * STRIP);
  const strip = await sharp(file)
    .extract({ top: 0, left: 0, width: m.width, height: sh })
    .resize(TW, Math.round((sh * TW) / m.width))
    .png()
    .toBuffer();
  const label = await sharp({
    text: { text: name, font: 'Arial', fontfile: 'C:/Windows/Fonts/arial.ttf', width: 160, height: LH },
  }).png().toBuffer();
  rows.push({ strip, label });
}

const W = TW + 8;
const totalH = rows.reduce((s, r) => s + LH + 8, 0) + 8;
const comps = [];
let y = 4;
for (const r of rows) {
  comps.push({ input: r.label, left: 4, top: y });
  comps.push({ input: r.strip, left: 4, top: y + LH });
  comps.push({ input: { create: { width: W, height: 1, channels: 3, background: '#ff3b30' } }, left: 0, top: y + LH });
  y += LH + 8;
}

await sharp({ create: { width: W, height: totalH, channels: 3, background: '#10233d' } })
  .composite(comps)
  .png()
  .toFile('C:/Users/Abcom/AppData/Local/Temp/opencode/proc-sheets/top-check.png');

// numeric check: is the top row near-uniform (extension/blank) vs varied (content)?
for (const [name, file] of FILES) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W0, height: H0, channels: ch } = info;
  for (const row of [0, 8, 24]) {
    let min = 255, max = 0, sum = 0;
    for (let x = 0; x < W0; x++) {
      const i = (row * W0 + x) * ch;
      const v = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      min = Math.min(min, v); max = Math.max(max, v); sum += v;
    }
    console.log(`${name.padEnd(14)} row ${String(row).padStart(3)}: min=${min.toFixed(0)} max=${max.toFixed(0)} spread=${(max - min).toFixed(0)} avg=${(sum / W0).toFixed(1)}`);
  }
}
