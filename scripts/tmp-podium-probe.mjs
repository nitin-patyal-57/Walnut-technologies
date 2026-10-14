// Measure the podium platform position in each current on-disk tile.
// The podium is the bright horizontal slab near the bottom; we scan the
// central 40% columns for the LOWEST row whose brightness rises above the
// floor level (the podium front face + its lit rim), i.e. the platform's
// bottom edge, and also the platform TOP edge (first strong rise going down).
import sharp from 'sharp';

const FILES = [
  ['neuro', 'public/images/products/neuro_rehab_device-home.webp'],
  ['bp', 'public/images/products/bp-home.webp'],
  ['box', 'public/images/products/boxsound-home.webp'],
  ['cluster', 'public/images/products/cluster1-home.webp'],
  ['lock', 'public/images/products/iot-lock-smart-home.webp'],
];

for (const [name, file] of FILES) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: ch } = info;
  const gray = (x, y) => {
    const i = (y * W + x) * ch;
    return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  };
  // mean brightness per row, central 30-70% band
  const x0 = Math.floor(W * 0.3), x1 = Math.floor(W * 0.7);
  const rows = [];
  for (let y = 0; y < H; y++) {
    let s = 0;
    for (let x = x0; x < x1; x += 2) s += gray(x, y);
    rows.push(s / ((x1 - x0) / 2));
  }
  // podium bottom edge: lowest row (scanning up from bottom) where brightness
  // is clearly above the dark floor strip below it
  let podBottom = -1;
  for (let y = H - 2; y > H * 0.55; y--) {
    if (rows[y] > 235 && rows[y + 1] <= 235) { podBottom = y; break; }
  }
  // platform top: first row from 55% down where brightness jumps well above
  // the mid-grey backdrop, sustained for 10+ rows
  let podTop = -1;
  for (let y = Math.floor(H * 0.55); y < H - 20; y++) {
    let ok = true;
    for (let k = 0; k < 12; k++) if (rows[y + k] < 235) { ok = false; break; }
    if (ok) { podTop = y; break; }
  }
  console.log(
    `${name.padEnd(8)} ${W}x${H}  podiumTop=${podTop} (${(podTop / H).toFixed(3)})  ` +
    `podiumBottom=${podBottom} (${(podBottom / H).toFixed(3)})`
  );
}
