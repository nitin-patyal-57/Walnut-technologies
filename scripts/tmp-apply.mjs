import sharp from 'sharp';
import { readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROC = path.join(ROOT, 'public', 'images', 'process');
const SRC = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-candidates';

// target file (public/images/process/<name>.webp)  <-  pexels photo id
const MAP = [
  ['idea-and-requirement', '4238498'],                    // 01 IDEA - sketching product concepts
  ['research-and-market-analysis', '31321047'],           // 02 RESEARCH - two engineers at terminal
  ['design-and-engineering', '19895919'],                 // 03 DESIGN - CAD on screen
  ['manufacturing-engineering-and-mold-design', '32972129'], // 04 - CNC control panel
  ['validation-and-testing', '36594160'],                 // 05 TESTING - probing a tray of devices
  ['prototype-development', '39351225'],                  // 06 - electronics assembly line
  ['quality-assurance', '31090818'],                      // 07 QA - inspection station
  ['packaging-and-dispatch', '31112254'],                 // 08 PACKAGING - cartons/warehouse
  ['after-sales-support', '4267526'],                     // 09 SUPPORT - headset agents
  ['continuous-improvement', '31259265'],                 // 10 IMPROVEMENT - monitoring terminal
];

const SIZE = 1000;

for (const [name, id] of MAP) {
  const src = path.join(SRC, `${id}.jpg`);
  const dest = path.join(PROC, `${name}.webp`);

  // clear stale responsive variants so they get regenerated
  for (const f of await readdir(PROC)) {
    if (f.startsWith(`${name}-`) && /\.(webp|avif)$/i.test(f)) await unlink(path.join(PROC, f));
  }

  await sharp(src)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'attention' })
    .modulate({ brightness: 1.06, saturation: 1.03 })
    .linear([0.98, 1.0, 1.05], [2, 2, 6])
    .webp({ quality: 78, effort: 6 })
    .toFile(dest);

  const m = await sharp(dest).metadata();
  console.log(`${name}.webp  <- pexels ${id}  ${m.width}x${m.height}`);
}
console.log('done');
