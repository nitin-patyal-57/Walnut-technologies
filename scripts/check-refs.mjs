// Pre-launch integrity check: do the image paths the site actually references exist on disk?
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');
const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
  );

const problems = [];

// ---- 1. hardcoded /images/ refs inside src/ ----
const srcFiles = walk(path.join(ROOT, 'src')).filter((f) => /\.(jsx|js)$/.test(f));
const hardcoded = new Set();
for (const f of srcFiles) {
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(/["'`](\/images\/[^"'`?]+\.(?:webp|png|jpe?g|avif))["'`]/g)) {
    hardcoded.add(m[1]);
  }
}
console.log(`1. hardcoded /images/ refs in src/ : ${hardcoded.size}`);
for (const p of [...hardcoded].sort()) {
  if (!existsSync(path.join(ROOT, 'public', decodeURIComponent(p)))) {
    problems.push(`MISSING image referenced in code: ${p}`);
  }
}

// ---- 2. every path inside content.json ----
let contentImages = new Set();
try {
  const raw = readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8');
  JSON.parse(raw); // throws if invalid
  for (const m of raw.matchAll(/"(\/images\/[^"]+\.(?:webp|png|jpe?g|avif))"/g)) contentImages.add(m[1]);
  console.log(`2. image paths in content.json    : ${contentImages.size}  (valid JSON)`);
} catch (e) {
  problems.push(`content.json is NOT valid JSON: ${e.message}`);
  console.log('2. content.json PARSE ERROR');
}
for (const p of [...contentImages].sort()) {
  if (!existsSync(path.join(ROOT, 'public', decodeURIComponent(p)))) {
    problems.push(`MISSING image referenced in content.json: ${p}`);
  }
}

// ---- 3. every variant in the manifest must have its files on disk ----
let manifestEntries = 0;
let missingVariants = 0;
try {
  const manifest = JSON.parse(readFileSync(path.join(ROOT, 'src/data/imageVariants.json'), 'utf8'));
  manifestEntries = Object.keys(manifest).length;
  for (const [key, entry] of Object.entries(manifest)) {
    if (!existsSync(path.join(ROOT, 'public', entry.fallback))) {
      problems.push(`manifest fallback missing on disk: ${entry.fallback}`);
      missingVariants++;
    }
    for (const w of entry.avif) {
      const f = path.join(ROOT, 'public', `${key}-${w}.avif`);
      if (!existsSync(f)) { problems.push(`missing AVIF variant: ${key}-${w}.avif`); missingVariants++; }
    }
    for (const w of entry.webp) {
      const f = path.join(ROOT, 'public', `${key}-${w}.webp`);
      if (!existsSync(f)) { problems.push(`missing WebP variant: ${key}-${w}.webp`); missingVariants++; }
    }
  }
  console.log(`3. manifest entries                : ${manifestEntries}  (missing variant files: ${missingVariants})`);
} catch (e) {
  problems.push(`imageVariants.json unreadable: ${e.message}`);
}

console.log('');
if (problems.length) {
  console.log(`*** ${problems.length} PROBLEM(S):`);
  for (const p of problems) console.log('    ' + p);
  process.exitCode = 1;
} else {
  console.log('ALL IMAGE REFERENCES RESOLVE - no broken images.');
}
