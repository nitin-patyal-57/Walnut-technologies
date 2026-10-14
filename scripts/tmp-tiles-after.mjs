import sharp from 'sharp';

const files = [
  'neuro_rehab_device.webp',
  'BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw1.webp',
  'boxsound.webp',
  'cluster1.webp',
  'iot-lock-smart.webp',
];
const DIR = 'public/images/products';
const TW = 420, TH = 315;

const tiles = [];
for (const f of files) {
  const img = await sharp(DIR + '/' + f).resize({ width: TW, height: TH }).png().toBuffer();
  const label = await sharp({
    text: { text: f.slice(0, 34), font: 'Arial', fontfile: 'C:/Windows/Fonts/arial.ttf', width: TW - 8 },
  }).png().toBuffer();
  tiles.push({ img, label });
}

const PAD = 4, LH = 22;
const W = TW + PAD * 2;
const H = (TH + LH + PAD) * tiles.length + PAD;

// alignment guides: ring centre (45% h) and podium baseline (87.3% h)
const composites = [];
tiles.forEach((t, i) => {
  const y = PAD + i * (TH + LH + PAD);
  composites.push({ input: t.img, left: PAD, top: y + LH });
  composites.push({ input: t.label, left: PAD + 4, top: y });
  for (const [frac, color] of [[0.45, '#ff3b30'], [0.873, '#34c759']]) {
    const gy = y + LH + Math.round(frac * TH);
    composites.push({
      input: { create: { width: W, height: 1, channels: 3, background: color } },
      left: 0, top: gy,
    });
  }
});

await sharp({ create: { width: W, height: H, channels: 3, background: '#10233d' } })
  .composite(composites)
  .png()
  .toFile('C:/Users/Abcom/AppData/Local/Temp/opencode/proc-sheets/tiles-after.png');
console.log('saved tiles-after.png');
