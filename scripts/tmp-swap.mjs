import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const FINAL = 'C:/Users/Abcom/AppData/Local/Temp/opencode/final';

const MAP = [
  ['images/about/02_Electronics_Engineer_Lab.webp', '14797919'],
  ['images/about/04_Engineering_Team.webp', '31321061'],
  ['images/about/08_Electronics_Manufacturing_Factory.webp', '31336008'],
  ['images/about/09_Team_Collaboration.webp', '38763816'],
  ['images/expertise/hero-engineer.webp', '37799104'],
  ['images/expertise/medical-tech.webp', '19438560'],
  ['images/expertise/payment-terminal.webp', '13326556'],
  ['images/backgrounds/career-background.webp', '31112188'],
  ['images/process/after-sales-support.webp', '4267526'],
  ['images/process/continuous-improvement.webp', '31336010'],
  ['images/process/contract-manufacturing.webp', '31112229'],
  ['images/process/design-and-engineering.webp', '31199539'],
  ['images/process/embedded-electronics-and-iot.webp', '37340089'],
  ['images/process/idea-and-requirement.webp', '4308105'],
  ['images/process/quality-assurance.webp', '31030921'],
  ['images/process/research-and-market-analysis.webp', '31047142'],
];

const exists = async (f) => {
  try {
    await stat(f);
    return true;
  } catch {
    return false;
  }
};

const ONLY = process.argv.slice(2);
const pairs = [];
for (const [rel, id] of MAP) {
  if (ONLY.length && !ONLY.some((o) => rel.includes(o))) continue;
  const base = path.join(PUBLIC, rel);
  const src = path.join(FINAL, `${id}.jpg`);
  if (!(await exists(src)) || !(await exists(base))) {
    console.log(`SKIP ${rel}`);
    continue;
  }
  const tmp = base.replace(/\.webp$/, '.swapnew.webp');
  const before = await sharp(base).metadata();
  await sharp(src).webp({ quality: 75, effort: 5 }).toFile(tmp);
  const after = await sharp(tmp).metadata();
  pairs.push({ base: base.replace(/\\/g, '/'), tmp: tmp.replace(/\\/g, '/') });
  console.log(`prepared ${rel}  ${before.width}x${before.height} -> ${after.width}x${after.height}  (pexels ${id})`);
}
console.log(JSON.stringify(pairs, null, 2));
