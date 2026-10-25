const sharp = require('sharp');
const fs = require('fs');

async function testFeather() {
  const W = 344, H = 396;
  const targetH = 396;
  const targetW = Math.round(targetH * (432 / 630)); // 272
  const padX = Math.round((W - targetW) / 2); // 36

  // Scaled original to full height
  const scaled = await sharp('assets/walklab-test.jpg')
    .resize(targetW, targetH, { fit: 'fill' })
    .toBuffer();

  // Blurred background that fills the entire container
  const bg = await sharp('assets/walklab-test.jpg')
    .resize(W, H, { fit: 'cover' })
    .blur(35)
    .toBuffer();

  // Subtle gradient feather mask on the left and right 15 pixels
  const maskSvg = Buffer.from(
    '<svg width="' + targetW + '" height="' + targetH + '">' +
    '<defs>' +
    '<linearGradient id="g" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0%" stop-color="#fff" stop-opacity="0.2"/>' +
    '<stop offset="6%" stop-color="#fff" stop-opacity="1"/>' +
    '<stop offset="94%" stop-color="#fff" stop-opacity="1"/>' +
    '<stop offset="100%" stop-color="#fff" stop-opacity="0.2"/>' +
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
    .toFile('assets/cache/test-walklab-feathered.jpg');

  console.log('done feathered successfully');
}
testFeather().catch(console.error);
