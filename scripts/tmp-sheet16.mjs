import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = 'C:/Users/Abcom/AppData/Local/Temp/opencode/sheets/swap-final4.jpg';

const ITEMS = [
  ['about/02_Electronics_Engineer_Lab', '14797919'],
  ['about/04_Engineering_Team', '31321061'],
  ['about/08_Electronics_Manufacturing_Factory', '31336008'],
  ['about/09_Team_Collaboration', '38763816'],
  ['expertise/hero-engineer', '37799104'],
  ['expertise/medical-tech', '19438560'],
  ['expertise/payment-terminal', '13326556'],
  ['backgrounds/career-background', '31112188'],
  ['process/after-sales-support', '4267526'],
  ['process/continuous-improvement', '31336010'],
  ['process/contract-manufacturing', '31112229'],
  ['process/design-and-engineering', '31199539'],
  ['process/embedded-electronics-and-iot', '37340089'],
  ['process/idea-and-requirement', '4308105'],
  ['process/quality-assurance', '31030921'],
  ['process/research-and-market-analysis', '31047142'],
];

const TW = 440;
const TH = 300;
const LH = 34;
const GAP = 10;
const COLS = 4;
const TITLE = 70;

const label = (txt) =>
  Buffer.from(
    `<svg width="${TW}" height="${LH}"><rect width="${TW}" height="${LH}" fill="#101828"/>` +
      `<text x="8" y="23" font-family="Segoe UI, Arial, sans-serif" font-size="15" fill="#7dd3fc">${txt}</text></svg>`
  );

const tiles = [];
for (const [rel, id] of ITEMS) {
  const img = await sharp(path.join(ROOT, 'public', 'images', `${rel}.webp`))
    .resize(TW, TH, { fit: 'cover', position: 'attention' })
    .toBuffer();
  const tile = await sharp({ create: { width: TW, height: TH + LH, channels: 3, background: '#101828' } })
    .composite([
      { input: img, top: 0, left: 0 },
      { input: label(`${rel}  [pexels ${id}]`), top: TH, left: 0 },
    ])
    .png()
    .toBuffer();
  tiles.push(tile);
}

const rows = Math.ceil(ITEMS.length / COLS);
const W = COLS * TW + (COLS + 1) * GAP;
const H = TITLE + rows * (TH + LH) + (rows + 1) * GAP;

const titleSvg = Buffer.from(
  `<svg width="${W}" height="${TITLE}"><rect width="${W}" height="${TITLE}" fill="#0b1220"/>` +
    `<text x="24" y="46" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="bold" fill="#facc15">SWAP-FINAL v4 :: 16 replaced site images (Indian faces)</text></svg>`
);

const composites = [{ input: titleSvg, top: 0, left: 0 }];
tiles.forEach((t, i) => {
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  composites.push({
    input: t,
    top: TITLE + GAP + r * (TH + LH + GAP),
    left: GAP + c * (TW + GAP),
  });
});

await sharp({ create: { width: W, height: H, channels: 3, background: '#0b1220' } })
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(OUT);
console.log(`wrote ${OUT} ${W}x${H}`);
