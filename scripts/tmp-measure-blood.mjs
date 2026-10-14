// Measure ring circle in the new blood pressure source with the same
// estimator used for the accepted tiles (bright pixels, upper 62%, Kasa fit).
import sharp from 'sharp';

const file = 'public/images/products/blood home.png';

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

const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: ch } = info;
const gray = (x, y) => {
  const i = (y * W + x) * ch;
  return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
};
let pts = [];
for (let y = 0; y < H * 0.62; y += 1) {
  for (let x = 0; x < W; x += 1) {
    if (gray(x, y) > 248) pts.push([x, y]);
  }
}
let fit = fitCircle(pts);
let kept = pts.length;
if (fit) {
  for (let round = 0; round < 2; round++) {
    const keep = pts.filter(([x, y]) => Math.abs(Math.hypot(x - fit.cx, y - fit.cy) - fit.r) < 0.03 * fit.r);
    if (keep.length < 300 || keep.length === kept) break;
    kept = keep.length;
    fit = fitCircle(keep);
    pts = keep;
  }
}
console.log(`blood-home ${W}x${H} cx=${(fit.cx / W).toFixed(3)} cy=${(fit.cy / H).toFixed(3)} dia=${((2 * fit.r) / W).toFixed(3)} inliers=${kept}`);
