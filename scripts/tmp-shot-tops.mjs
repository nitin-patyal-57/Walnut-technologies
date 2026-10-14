// Crop the tile-row top band from the browser screenshot and enlarge it, to
// see whether the browser rendered any empty band at the container tops.
import sharp from 'sharp';

const SHOT = 'C:/Users/Abcom/AppData/Local/Temp/opencode/tiles-desktop.png';
const OUT = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-sheets/shot-tops.png';

const m = await sharp(SHOT).metadata();
console.log('shot', m.width + 'x' + m.height);

// tile row: find it as the band containing the tile tops (~y 150-330 in prior shots)
const top = Math.round(m.height * 0.26);
const h = Math.round(m.height * 0.28);
const crop = await sharp(SHOT).extract({ top, left: 0, width: m.width, height: h }).png().toBuffer();

// upscale 1.6x for detail
await sharp(crop).resize(Math.round(m.width * 1.6)).png().toFile(OUT);
console.log('saved', OUT, 'crop y', top, '..', top + h);
