// Re-frame the Walk Lab tile from its source JPG per user request:
//   - zoom OUT so the whole scene (ring top, device, podium base) is visible
//   - shift the content a little to the LEFT
// Same edge-extension + feathered-blur + light grade as the other tiles so it
// stays consistent with the set. Writes neuro_rehab_device-home.webp in place.
import sharp from 'sharp';
import { readFile, rename, copyFile, unlink } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const SRC = 'public/images/products/neuro_rehab_device home .jpg';
const DST = 'public/images/products/neuro_rehab_device-home.webp';
const OUT_W = 1200, OUT_H = 900;
const SCALE = 0.95;   // < 1 = zoom out; whole source frame fits with a margin
const SHIFT_X = -32;  // negative = move image content left
const FEATHER = 28;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const srcBuf = await readFile(SRC);
const meta = await sharp(srcBuf).metadata();
const w = Math.round(meta.width * SCALE);
const h = Math.round(meta.height * SCALE);

const { data } = await sharp(srcBuf)
  .resize({ width: w, height: h })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const offX = Math.round((OUT_W - w) / 2) + SHIFT_X;
const offY = Math.round((OUT_H - h) / 2);

// edge-extension canvas
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

// feathered blur over extension zone only
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
  try {
    await rename(tmp, DST);
    swapped = true;
  } catch {
    try {
      await copyFile(tmp, DST);
      await unlink(tmp);
      swapped = true;
    } catch {
      await new Promise((r) => setTimeout(r, 400));
    }
  }
}
if (!swapped) throw new Error('could not replace ' + DST);

// drop stale responsive variants and regenerate
const stem = 'neuro_rehab_device-home';
for (const f of readdirSync('public/images/products')) {
  if (f.startsWith(stem) && /-(480|768|1280)\.(webp|avif)$/.test(f)) {
    await unlink('public/images/products/' + f);
  }
}
execSync('node scripts/responsive-images.mjs', { stdio: 'inherit' });
console.log(`walklab tile: ${meta.width}x${meta.height} -> ${w}x${h} @ (${offX},${offY})  scale=${SCALE} shiftX=${SHIFT_X}`);
