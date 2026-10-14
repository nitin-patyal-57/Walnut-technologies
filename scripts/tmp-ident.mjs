import sharp from 'sharp';
const svg = `<svg width="600" height="200"><rect width="100%" height="100%" fill="#ff0000"/><text x="20" y="120" font-size="60" font-family="Arial" fill="white">XYZUNIQUE-7391</text></svg>`;
await sharp({ create: { width: 600, height: 200, channels: 3, background: '#ff0000' } })
  .composite([{ input: Buffer.from(svg), left: 0, top: 0 }])
  .png()
  .toFile('C:/Users/Abcom/AppData/Local/Temp/opencode/sheets/ident-test.png');
console.log('written');
