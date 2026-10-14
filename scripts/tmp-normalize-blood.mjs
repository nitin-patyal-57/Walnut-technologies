// Normalise the new blood-pressure source (blood home.png) with the same
// pipeline/standard as the other homepage tiles:
//   ring dia = 74% of 1200px canvas, ring centred, podium baseline ~87.3%,
//   edge-extension fill + feathered blur, light cool grade.
// Writes bp-home.webp (1200x900) + regenerates responsive variants.
import sharp from 'sharp';
import { readFile, rename, copyFile, unlink } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const SRC = 'public/images/products/blood home.png';
const DST = 'public/images/products/bp-home.webp';
const OUT_W = 1200, OUT_H = 900;
const TARGET_RING = 0.74 * OUT_W;
const TARGET_RING_CY = 0.45 * OUT_H;
const TARGET_BASELINE = 0.873 * OUT_H;
const FEATHER = 28;
// landmarks measured on blood home.png (fraction of source w/h)
const RING_CX = 0.498, RING_DIA = 0.591, RING_CY = 0.423, PODIUM_BOTTOM = 0.88;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const srcBuf = await readFile(SRC);
const meta = await sharp(srcBuf).metadata();
// user asked for a little zoom-out vs the ring-matched default
const ZOOM_OUT = 0.79;
const scale = (TARGET_RING / (RING_DIA * meta.width)) * ZOOM_OUT;
const w = Math.round(meta.width * scale);
const h = Math.round(meta.height * scale);

const { data } = await sharp(srcBuf)
  .resize({ width: w, height: h })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const offX = Math.round(OUT_W / 2 - RING_CX * w);
const offY = Math.round((TARGET_RING_CY - RING_CY * h + TARGET_BASELINE - PODIUM_BOTTOM * h) / 2);

const outBuf = Buffer.alloc(OUT_W * OUT_H * 3);
for (let y = 0; y < OUT_H; y++) {
  const sy = clamp(y - offY, 0, h - 1);
  for (let x = 0; x < OUT_W; x++) {
    const sx = clamp(x - offX, 0, w - 1);
    const si = (sy * w + sx) * 3;
    const oi = (y * OUT_W + x) * 3;
    outBuf[oi] = data[si];
    outBuf[oi + 1] = data[si + 1];
    outBuf[oi + 2] = data[si + 2];
  }
}

const mask = Buffer.alloc(OUT_W * OUT_H);
for (let y = 0; y < OUT_H; y++) {
  const dy = y < offY ? offY - y : y >= offY + h ? y - (offY + h - 1) : -FEATHER;
  for (let x = 0; x < OUT_W; x++) {
    const dx = x < offX ? offX - x : x >= offX + w ? x - (offX + w - 1) : -FEATHER;
    const dist = Math.max(dx, dy);
    mask[y * OUT_W + x] = dist >= 0 ? 255 : Math.round(255 * clamp((dist + FEATHER) / FEATHER, 0, 1));
  }
}

const base = sharp(outBuf, { raw: { width: OUT_W, height: OUT_H, channels: 3 } });
const blurRgb = await base.clone().blur(12).removeAlpha().raw().toBuffer();
const rgba = Buffer.alloc(OUT_W * OUT_H * 4);
for (let i = 0; i < OUT_W * OUT_H; i++) {
  rgba[i * 4] = blurRgb[i * 3];
  rgba[i * 4 + 1] = blurRgb[i * 3 + 1];
  rgba[i * 4 + 2] = blurRgb[i * 3 + 2];
  rgba[i * 4 + 3] = mask[i];
}
const blurredPng = await sharp(rgba, { raw: { width: OUT_W, height: OUT_H, channels: 4 } }).png().toBuffer();

const tmp = DST + '.new';
await base
  .composite([{ input: blurredPng, blend: 'over' }])
  .modulate({ brightness: 1.02, saturation: 1.02 })
  .linear([0.995, 1.0, 1.02], [1, 1.5, 3.5])
  .webp({ quality: 82 })
  .toFile(tmp);

let swapped = false;
for (let i = 0; i < 8 && !swapped; i++) {
  try { await rename(tmp, DST); swapped = true; } catch {
    try { await copyFile(tmp, DST); await unlink(tmp); swapped = true; }
    catch { await new Promise((r) => setTimeout(r, 400)); }
  }
}
if (!swapped) throw new Error('could not replace ' + DST);

for (const f of readdirSync('public/images/products')) {
  if (f.startsWith('bp-home') && /-(480|768|1280)\.(webp|avif)$/.test(f)) {
    await unlink('public/images/products/' + f);
  }
}
execSync('node scripts/responsive-images.mjs', { stdio: 'inherit' });
console.log(`bp-home: ${meta.width}x${meta.height} -> ${w}x${h} @ (${offX},${offY})`);
