import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'C:/Users/Abcom/AppData/Local/Temp/opencode/proc-candidates';
const META = path.join(OUT, '_meta.json');
const PAGES = 3;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const QUERIES = [
  'indian electronics factory worker',
  'pcb assembly worker',
  'circuit board manufacturing factory',
  'smt production line electronics',
  'cleanroom worker electronics',
  'engineer inspecting circuit board',
  'indian engineer laboratory electronics',
  'factory workers blue uniform india',
  'electronics technician india',
  'woman engineer factory india',
  'industrial engineer computer factory',
  'quality control inspector factory electronics',
  'warehouse packaging boxes worker india',
  'call center agent india headset',
  'cad designer computer engineering',
  'scientist research lab india',
  'cnc machine operator factory india',
  'iot device testing engineer',
];

const seen = new Map();
try {
  for (const [id, url] of Object.entries(JSON.parse(await readFile(META, 'utf8')))) seen.set(id, url);
} catch {}

const listPage = async (q, page) => {
  const url = `https://www.pexels.com/search/${encodeURIComponent(q)}/${
    page > 1 ? `?page=${page}` : ''
  }`;
  const res = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9' } });
  if (!res.ok) {
    console.log(`  ! ${res.status} for "${q}" p${page}`);
    return '';
  }
  return res.text();
};

let hits = 0;
for (const q of QUERIES) {
  for (let p = 1; p <= PAGES; p++) {
    let html = '';
    try {
      html = await listPage(q, p);
    } catch (e) {
      console.log(`  ! err "${q}" p${p}: ${e.message}`);
      break;
    }
    if (!html) break;
    const re = /images\.pexels\.com\/photos\/(\d+)\/([A-Za-z0-9._/-]+\.jpeg)/g;
    let m;
    let before = seen.size;
    while ((m = re.exec(html))) {
      const [, id, file] = m;
      if (!seen.has(id)) seen.set(id, `https://images.pexels.com/photos/${id}/${file}`);
    }
    hits = seen.size;
    if (seen.size === before && p > 1) break;
    await new Promise((r) => setTimeout(r, 400));
  }
  console.log(`"${q}" -> ${hits} unique so far`);
}

const entries = [...seen.entries()].map(([id, url]) => [
  id,
  url.split('?')[0] + '?auto=compress&cs=tinysrgb&w=1600',
]);
await mkdir(OUT, { recursive: true });
await writeFile(META, JSON.stringify(Object.fromEntries(entries), null, 2));
console.log(`\ncollected ${entries.length} candidate ids -> ${OUT}`);

const limit = Number(process.argv[2] || 180);
const pool = entries.slice(0, limit);
let done = 0;
let failed = 0;

async function download([id, url]) {
  const dest = path.join(OUT, `${id}.jpg`);
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, referer: 'https://www.pexels.com/' } });
    if (!res.ok) throw new Error(String(res.status));
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5000) throw new Error('too small');
    await writeFile(dest, buf);
    done++;
  } catch (e) {
    failed++;
    console.log(`  x ${id}: ${e.message}`);
  }
}

for (let i = 0; i < pool.length; i += 8) {
  await Promise.all(pool.slice(i, i + 8).map(download));
  if ((i / 8) % 5 === 0) console.log(`progress ${Math.min(i + 8, pool.length)}/${pool.length}`);
}
console.log(`downloaded ${done}, failed ${failed}`);

