// Where does the glow ring start (topmost bright arc) in each current tile?
// That's the point below which the top of the container looks empty.
import sharp from 'sharp';

const FILES = [
  ['neuro', 'public/images/products/neuro_rehab_device-home.webp'],
  ['bp', 'public/images/products/bp-home.webp'],
  ['box (payment)', 'public/images/products/boxsound-home.webp'],
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
  // central band; ring is a bright arc, backdrop sits ~200-235
  const x0 = Math.floor(W * 0.3), x1 = Math.floor(W * 0.7);
  let apex = -1, apexVal = 0;
  for (let y = 0; y < H * 0.5; y++) {
    let mx = 0;
    for (let x = x0; x < x1; x += 2) mx = Math.max(mx, gray(x, y));
    if (mx > 249) { apex = y; apexVal = mx; break; }
  }
  // backdrop level just right of the ring for reference
  const bg = gray(Math.floor(W * 0.06), Math.floor(H * 0.05));
  console.log(
    `${name.padEnd(14)} ringTop=${String(apex).padStart(3)}px = ${(apex / H).toFixed(3)} of height  (val ${apexVal.toFixed(0)})  bgTopLeft=${bg.toFixed(0)}`
  );
}
