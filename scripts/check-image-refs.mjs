import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
  );

const files = [
  ...walk('src').filter((f) => /\.(jsx?|css|json)$/.test(f)),
  'index.html',
  'public/sw.js',
  'public/manifest.json',
  'public/preload.js',
];

let bad = 0;
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(/['"`](\/[^'"`\s]*?\.(?:png|jpe?g|webp|gif|svg|avif))['"`]/g)) {
    const rel = m[1].split('?')[0];
    if (!existsSync(path.join('public', rel))) {
      bad++;
      console.log(`MISSING ${m[1]} in ${f}`);
    }
  }
}
console.log(`missing base refs: ${bad}`);

const manifest = JSON.parse(readFileSync('src/data/imageVariants.json', 'utf8'));
let vm = 0;
for (const [k, v] of Object.entries(manifest)) {
  for (const w of v.avif) {
    if (!existsSync(path.join('public', `${k}-${w}.avif`))) { vm++; console.log(`MISSING variant ${k}-${w}.avif`); }
  }
  for (const w of v.webp) {
    if (!existsSync(path.join('public', `${k}-${w}.webp`))) { vm++; console.log(`MISSING variant ${k}-${w}.webp`); }
  }
  if (!existsSync(path.join('public', v.fallback.slice(1)))) { vm++; console.log(`MISSING fallback ${v.fallback}`); }
}
console.log(`missing variants: ${vm}`);
process.exit(bad + vm ? 1 : 0);
