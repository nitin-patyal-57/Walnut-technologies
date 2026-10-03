import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p);
    else if (p.endsWith('.jsx')) {
      const t = fs.readFileSync(p, 'utf8');
      const n = t
        .replace(/max-w-(?:7xl|6xl)\s+mx-auto/g, 'mx-auto')
        .replace(/mx-auto\s+max-w-(?:7xl|6xl)/g, 'mx-auto');
      if (n !== t) {
        fs.writeFileSync(p, n, 'utf8');
        console.log('changed', p);
      }
    }
  }
}
walk('src');
console.log(execSync('git diff --numstat', { encoding: 'utf8' }));

let bad = 0;
function check(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) check(p);
    else if (p.endsWith('.jsx')) {
      const b = fs.readFileSync(p);
      if (b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf) { console.log('BOM!', p); bad++; }
      const t = b.toString('utf8');
      if (t.includes('â€') || t.includes('â•') || t.includes('\ufffd')) { console.log('MOJIBAKE!', p); bad++; }
    }
  }
}
check('src');
console.log(bad === 0 ? 'CLEAN: no BOM, no mojibake' : 'PROBLEMS: ' + bad);
