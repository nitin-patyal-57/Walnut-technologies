// Draw the fitted ring circle + centre cross on each source for visual check.
import sharp from 'sharp';

const FILES = [
  ['neuro-home', 'public/images/products/neuro_rehab_device home .jpg'],
  ['box-home', 'public/images/products/boxsound home.jpg'],
  ['cluster-home', 'public/images/products/cluster1 home.jpg'],
  ['lock-home', 'public/images/products/iot-lock-smart home.jpg'],
  ['bp-orig', 'C:/Users/Abcom/AppData/Local/Temp/opencode/prod-orig/BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw1.webp'],
];

function fitCircle(pts) {
  let sX = 0, sY = 0, sX2 = 0, sY2 = 0, sXY = 0, sX3 = 0, sY3 = 0, sX2Y = 0, sXY2 = 0;
  const n = pts.length;
  for (const [x, y] of pts) {
    const x2 = x * x, y2 = y * y;
    sX += x; sY += y; sX2 += x2; sY2 += y2; sXY += x * y;
    sX3 += x2 * x; sY3 += y2 * y; sX2Y += x2 * y; sXY2 += x * y2;
  }
  const A = n * sX2 - sX * sX, B = n * sXY - sX * sY, C = n * sY2 - sY * sY;
  const D = 0.5 * (n * sX3 + n * sXY2 - sX * (sX2 + sY2));
  const E = 0.5 * (n * sY3 + n * sX2Y - sY * (sX2 + sY2));
  const det = A * C - B * B;
  if (!det) return null;
  const cx = (D * C - E * B) / det;
  const cy = (E * A - D * B) / det;
  const r = Math.sqrt(Math.max(0, (sX2 + sY2 - 2 * cx * sX - 2 * cy * sY) / n + cx * cx + cy * cy));
  return { cx, cy, r };
}

const TW = 420;
const tiles = [];
for (const [name, file] of FILES) {
  const meta = await sharp(file).metadata();
  const W = TW, H = Math.round((TW * meta.height) / meta.width);
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: SW, height: SH, channels: ch } = info;
  const gray = (x, y) => {
    const i = (y * SW + x) * ch;
    return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  };
  let pts = [];
  for (let y = 0; y < SH * 0.88; y += 2) for (let x = 0; x < SW; x += 2) if (gray(x, y) > 246) pts.push([x, y]);
  let fit = fitCircle(pts);
  for (let round = 0; round < 3 && fit; round++) {
    const tol = 0.02 * fit.r;
    const keep = pts.filter(([x, y]) => Math.abs(Math.hypot(x - fit.cx, y - fit.cy) - fit.r) < tol);
    if (keep.length < 200 || keep.length === pts.length) break;
    fit = fitCircle(keep); pts = keep;
  }
  const sx = W / SW, sy = H / SH;
  const overlay = Buffer.from(`<svg width="${W}" height="${H}">
    <circle cx="${fit.cx * sx}" cy="${fit.cy * sy}" r="${fit.r * sx}" fill="none" stroke="#ff3b30" stroke-width="2"/>
    <line x1="${fit.cx * sx - 12}" y1="${fit.cy * sy}" x2="${fit.cx * sx + 12}" y2="${fit.cy * sy}" stroke="#00e676" stroke-width="2"/>
    <line x1="${fit.cx * sx}" y1="${fit.cy * sy - 12}" x2="${fit.cx * sx}" y2="${fit.cy * sy + 12}" stroke="#00e676" stroke-width="2"/>
    <text x="6" y="16" font-family="Arial" font-size="13" fill="#ff3b30">${name} cx=${(fit.cx / SW).toFixed(3)} cy=${(fit.cy / SH).toFixed(3)} dia=${((2 * fit.r) / SW).toFixed(3)}</text>
  </svg>`);
  const img = await sharp(file).resize(W, H).png().toBuffer();
  tiles.push(await sharp(img).composite([{ input: overlay }]).png().toBuffer());
}

const LH = 22, PAD = 4;
const H = tiles.reduce((s, t) => s + t.height + LH + PAD, 0) + PAD;
const comps = [];
let y = PAD;
tiles.forEach((t) => {
  comps.push({ input: t, left: PAD, top: y });
  y += t.height + LH + PAD;
});
await sharp({ create: { width: TW + PAD * 2, height: H, channels: 3, background: '#10233d' } })
  .composite(comps)
  .png()
  .toFile('C:/Users/Abcom/AppData/Local/Temp/opencode/proc-sheets/ring-fit-check.png');
console.log('saved ring-fit-check.png');
