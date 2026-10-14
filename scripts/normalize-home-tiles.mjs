// Normalise the user-supplied "* home" JPG renders into homepage tile webps.
//
// Same pipeline as normalize-product-tiles.mjs (one 1200x900 4:3 canvas, glow
// ring at 74% of width, ring centred, podium baseline at 87.3% height, light
// cool grade), but reads the new source JPGs and writes *-home.webp so the
// shared originals used by other pages are untouched.
//
// Landmarks [ringCentreX, ringDiameterX, ringCentreY, podiumBottomY] as
// fractions of the source, measured on proc-sheets/home-grid.jpg.

import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { writeFile, rename, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIR = 'public/images/products';
const OUT_W = 1200;
const OUT_H = 900;
const TARGET_RING = 0.74 * OUT_W;
const TARGET_RING_CY = 0.45 * OUT_H;
const TARGET_BASELINE = 0.873 * OUT_H;
const FEATHER = 28;

const SOURCES = {
  'neuro_rehab_device home .jpg': {
    out: 'neuro_rehab_device-home.webp',
    marks: [0.465, 0.63, 0.42, 0.86],
  },
  'boxsound home.jpg': {
    out: 'boxsound-home.webp',
    marks: [0.48, 0.52, 0.47, 0.79],
  },
  'cluster1 home.jpg': {
    out: 'cluster1-home.webp',
    marks: [0.425, 0.59, 0.41, 0.77],
  },
  'iot-lock-smart home.jpg': {
    out: 'iot-lock-smart-home.webp',
    marks: [0.50, 0.70, 0.41, 0.86],
  },
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

async function build(srcName, { out, marks: [ringCx, ringDia, ringCy, podiumBottom] }) {
  const src = path.join(DIR, srcName);
  const dst = path.join(DIR, out);
  // read into memory first: libvips mmaps input files on Windows and that
  // mapping blocks renaming over the same path later
  const srcBuf = await readFile(src);
  const meta = await sharp(srcBuf).metadata();

  const scale = TARGET_RING / (ringDia * meta.width);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);

  const { data } = await sharp(srcBuf)
    .resize({ width: w, height: h })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ringCxPx = ringCx * w;
  const ringCyScaled = ringCy * h;
  const podiumPx = podiumBottom * h;
  const offX = Math.round(OUT_W / 2 - ringCxPx);
  const offY = Math.round((TARGET_RING_CY - ringCyScaled + TARGET_BASELINE - podiumPx) / 2);

  // edge-extension canvas: sample clamped source coords (no-op where the
  // scaled source already covers the canvas)
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

  const base = sharp(outBuf, { raw: { width: OUT_W, height: OUT_H, channels: 3 } });
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

  const tmp = dst + '.new';
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
      await rename(tmp, dst);
      swapped = true;
    } catch {
      try {
        await copyFile(tmp, dst);
        await unlink(tmp);
        swapped = true;
      } catch {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }
  if (!swapped) throw new Error(`could not replace ${dst}`);

  console.log(`${srcName} -> ${out}: ${meta.width}x${meta.height} -> ${w}x${h} @ (${offX},${offY})`);
}

for (const [srcName, spec] of Object.entries(SOURCES)) {
  await build(srcName, spec);
  // drop stale responsive variants so the pipeline regenerates them
  const stem = spec.out.replace(/\.webp$/, '');
  for (const f of readdirSync(DIR)) {
    if (f.startsWith(stem) && /-(480|768|1280)\.(webp|avif)$/.test(f)) {
      const { unlink } = await import('node:fs/promises');
      await unlink(path.join(DIR, f));
    }
  }
}

const { execSync } = await import('node:child_process');
execSync('node scripts/responsive-images.mjs', { stdio: 'inherit' });
console.log('done');
