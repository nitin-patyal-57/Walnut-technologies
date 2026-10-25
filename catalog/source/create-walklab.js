const sharp = require('sharp');

async function createWalklabJourney() {
  const W = 344, H = 396;
  const targetH = 396;
  const targetW = Math.round(targetH * (432 / 630)); // 272
  const padX = Math.round((W - targetW) / 2); // 36

  // Scaled original to full height
  const scaled = await sharp('assets/walklab-test.jpg')
    .resize(targetW, targetH, { fit: 'fill' })
    .toBuffer();

  // Blurred background that fills the entire container, but blurred more heavily
  // so it creates a soft ambient hospital room lighting
  const bg = await sharp('assets/walklab-test.jpg')
    .resize(W, H, { fit: 'cover' })
    .blur(40)
    .toBuffer();

  // Subtle gradient feather mask on the left and right edges (only 12px)
  const maskSvg = Buffer.from(
    '<svg width="' + targetW + '" height="' + targetH + '">' +
    '<defs>' +
    '<linearGradient id="g" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0%" stop-color="#fff" stop-opacity="0"/>' +
    '<stop offset="4%" stop-color="#fff" stop-opacity="1"/>' +
    '<stop offset="96%" stop-color="#fff" stop-opacity="1"/>' +
    '<stop offset="100%" stop-color="#fff" stop-opacity="0"/>' +
    '</linearGradient>' +
    '</defs>' +
    '<rect width="' + targetW + '" height="' + targetH + '" fill="url(#g)"/>' +
    '</svg>'
  );

  const feathered = await sharp(scaled)
    .ensureAlpha()
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .toBuffer();

  await sharp(bg)
    .composite([{ input: feathered, left: padX, top: 0 }])
    .jpeg({ quality: 92 })
    .toFile('assets/walklab-journey.jpg');

  console.log('walklab-journey.jpg created successfully');
}
createWalklabJourney().catch(console.error);
