import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const P = 'C:/Users/Abcom/Documents/Walnut/public/images/products';
const OUT = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-sheets';
const FILES = [
  ['A neuro-home', 'neuro_rehab_device home .jpg'],
  ['B box-home', 'boxsound home.jpg'],
  ['C cluster-home', 'cluster1 home.jpg'],
  ['D lock-home', 'iot-lock-smart home.jpg'],
];
const W = 760;
const LABEL = 30;

async function grid(name, file) {
  const img = sharp(`${P}/${file}`);
  const m = await img.metadata();
  const h = Math.round((W * m.height) / m.width);
  const base = await img.resize(W, h).png().toBuffer();
  const lines = [];
  for (let i = 1; i < 10; i++) {
    const x = Math.round((W * i) / 10);
    const y = Math.round((h * i) / 10);
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="red" stroke-width="1" stroke-opacity="0.7"/>`);
    lines.push(`<text x="${x + 2}" y="14" font-family="Arial" font-size="12" fill="red">${i * 10}</text>`);
    lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="lime" stroke-width="1" stroke-opacity="0.7"/>`);
    lines.push(`<text x="2" y="${y - 2}" font-family="Arial" font-size="12" fill="lime">${i * 10}</text>`);
  }
  // reference guides from the normalised standard: ring centre 45% h, baseline 87.3% h
  for (const [frac, color] of [[0.45, '#ff3b30'], [0.873, '#34c759']]) {
    const y = Math.round(frac * h);
    lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${color}" stroke-width="2" stroke-opacity="0.95"/>`);
  }
  const overlay = Buffer.from(`<svg width="${W}" height="${h}">${lines.join('')}</svg>`);
  const label = Buffer.from(
    `<svg width="${W}" height="${LABEL}"><rect width="100%" height="100%" fill="#003366"/>
     <text x="8" y="21" font-family="Arial" font-size="17" fill="#ffff66">${name}  ${m.width}x${m.height}</text></svg>`
  );
  return {
    buf: await sharp(base).composite([{ input: overlay }]).png().toBuffer(),
    label,
    w: W,
    h,
  };
}

const parts = [];
for (const [name, file] of FILES) parts.push(await grid(name, file));
const H = parts.reduce((s, p) => s + p.h + LABEL, 0);
let y = 0;
const comps = [];
for (const p of parts) {
  comps.push({ input: p.label, left: 0, top: y });
  comps.push({ input: p.buf, left: 0, top: y + LABEL });
  y += p.h + LABEL;
}
await mkdir(OUT, { recursive: true });
await sharp({ create: { width: W, height: H, channels: 3, background: '#222' } })
  .composite(comps).jpeg({ quality: 85 }).toFile(`${OUT}/home-grid.jpg`);
console.log('written home-grid.jpg', W, H);
