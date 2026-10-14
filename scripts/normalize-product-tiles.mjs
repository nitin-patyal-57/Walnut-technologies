// Normalise the 5 homepage Solutions-tile product shots to one identical frame.
//
// Every source is the same studio setup (glow ring + podium + product) but each
// photo was shot/framed differently (4:3, 1:1, 3:2). The tile container is a
// fixed 4:3 box with object-cover, so mixed sources made the podiums, rings and
// products sit at different scales and heights across the row.
//
// This script re-frames every source onto one 1200x900 (4:3) canvas where:
//   - the glow ring has the same diameter (74% of canvas width)
//   - the ring is horizontally centred
//   - the podium baseline sits at the same height (87.3% of canvas height),
//     averaged with ring-centre alignment so neither drifts more than ~4%
// Margins are filled by edge-extension with a feathered blur so the smooth
// studio background continues seamlessly. A very light cool grade unifies the set.
//
// Landmarks below were measured on the grid sheet (proc-sheets/product-grid.jpg)
// as fractions of each source's own width/height. Re-measure if sources change.
//
// After running: delete stale -480/-768/-1280 variants, then
//   node scripts/responsive-images.mjs

import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { writeFile, rename, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIR = 'public/images/products';
const OUT_W = 1200;
const OUT_H = 900;
const TARGET_RING = 0.74 * OUT_W;   // ring diameter on canvas
const TARGET_RING_CY = 0.45 * OUT_H; // ring centre height
const TARGET_BASELINE = 0.873 * OUT_H; // podium bottom edge height
const FEATHER = 28;                  // px blend ramp at the image seam

// file: [ringCentreX, ringDiameterY, podiumBottomY] as fraction of source w/h
const SOURCES = {
  'neuro_rehab_device.webp': [0.50, 0.76, 0.880],
  'BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw1.webp': [0.50, 0.86, 0.885],
  'boxsound.webp': [0.50, 0.70, 0.880],
  'cluster1.webp': [0.50, 0.74, 0.880],
  'iot-lock-smart.webp': [0.50, 0.60, 0.890],
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

async function build(name, [ringCx, ringDia, podiumBottom]) {
  const src = path.join(DIR, name);
  // read into memory first: libvips mmaps input files on Windows and that
  // mapping blocks renaming over the same path later
  const srcBuf = await readFile(src);
  const meta = await sharp(srcBuf).metadata();

  // scale so the ring matches the canvas target
  const scale = TARGET_RING / (ringDia * meta.width);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);

  const { data, info } = await sharp(srcBuf)
    .resize({ width: w, height: h })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // position: ring centre x -> canvas centre; y = mean of ring-centre and
  // podium-baseline alignment (keeps both within ~4% across the set)
  const ringCxPx = ringCx * w;
  const ringCyScaled = RING_CY[name] * h;
  const podiumPx = podiumBottom * h;

  const offX = Math.round(OUT_W / 2 - ringCxPx);
  const offY = Math.round((TARGET_RING_CY - ringCyScaled + TARGET_BASELINE - podiumPx) / 2);

  // edge-extension canvas: sample clamped source coords
  const out = Buffer.alloc(OUT_W * OUT_H * 3);
  for (let y = 0; y < OUT_H; y++) {
    const sy = clamp(y - offY, 0, h - 1);
    for (let x = 0; x < OUT_W; x++) {
      const sx = clamp(x - offX, 0, w - 1);
      const si = (sy * w + sx) * 3;
      const oi = (y * OUT_W + x) * 3;
      out[oi] = data[si];
      out[oi + 1] = data[si + 1];
      out[oi + 2] = data[si + 2];
    }
  }

  // feathered blur over the extension zone only, so seams disappear
  const mask = Buffer.alloc(OUT_W * OUT_H);
  for (let y = 0; y < OUT_H; y++) {
    const dy = y < offY ? offY - y : y >= offY + h ? y - (offY + h - 1) : -FEATHER;
    for (let x = 0; x < OUT_W; x++) {
      const dx = x < offX ? offX - x : x >= offX + w ? x - (offX + w - 1) : -FEATHER;
      const dist = Math.max(dx, dy);
      mask[y * OUT_W + x] = dist >= 0 ? 255 : Math.round(255 * clamp((dist + FEATHER) / FEATHER, 0, 1));
    }
  }

  const base = sharp(out, { raw: { width: OUT_W, height: OUT_H, channels: 3 } });
  const blurRgb = await base.clone().blur(12).removeAlpha().raw().toBuffer();
  const rgba = Buffer.alloc(OUT_W * OUT_H * 4);
  for (let i = 0; i < OUT_W * OUT_H; i++) {
    rgba[i * 4] = blurRgb[i * 3];
    rgba[i * 4 + 1] = blurRgb[i * 3 + 1];
    rgba[i * 4 + 2] = blurRgb[i * 3 + 2];
    rgba[i * 4 + 3] = mask[i];
  }
  const blurredPng = await sharp(rgba, { raw: { width: OUT_W, height: OUT_H, channels: 4 } })
    .png()
    .toBuffer();

  const tmp = src + '.new';
  await base
    .composite([{ input: blurredPng, blend: 'over' }])
    .modulate({ brightness: 1.02, saturation: 1.02 })
    .linear([0.995, 1.0, 1.02], [1, 1.5, 3.5])
    .webp({ quality: 82 })
    .toFile(tmp);

  // Windows: Chrome/dev-server may briefly hold the old file; retry the swap
  const { copyFile, unlink } = await import('node:fs/promises');
  let swapped = false;
  for (let i = 0; i < 8 && !swapped; i++) {
    try {
      await rename(tmp, src);
      swapped = true;
    } catch {
      try {
        await copyFile(tmp, src); // overwrite works even when rename is blocked
        await unlink(tmp);
        swapped = true;
      } catch {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }
  if (!swapped) throw new Error(`could not replace ${src}`);

  console.log(`${name}: src ${meta.width}x${meta.height} -> ${w}x${h} @ (${offX},${offY})`);
}

// ring centre y as fraction of source height (measured on the grid sheet)
const RING_CY = {
  'neuro_rehab_device.webp': 0.430,
  'BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw1.webp': 0.495,
  'boxsound.webp': 0.465,
  'cluster1.webp': 0.460,
  'iot-lock-smart.webp': 0.475,
};

for (const [name, marks] of Object.entries(SOURCES)) {
  await build(name, marks);
  // drop stale responsive variants so the pipeline regenerates them
  for (const f of readdirSync(DIR)) {
    if (f.startsWith(name.replace(/\.webp$/, '')) && /-(480|768|1280)\.(webp|avif)$/.test(f)) {
      const { unlink } = await import('node:fs/promises');
      await unlink(path.join(DIR, f));
    }
  }
}

const { execSync } = await import('node:child_process');
execSync('node scripts/responsive-images.mjs', { stdio: 'inherit' });
console.log('done');
