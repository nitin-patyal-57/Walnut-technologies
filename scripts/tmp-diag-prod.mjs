import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { writeFile, copyFile, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT = 'C:/Users/Abcom/Documents/Walnut';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const sha = (b) => createHash('sha1').update(b).digest('hex').slice(0, 10);

const preview = spawn('npx', ['vite', 'preview', '--port', '4193', '--strictPort'], {
  shell: true, stdio: 'ignore', cwd: ROOT,
});
for (let i = 0; i < 60; i++) {
  try { if ((await fetch('http://localhost:4193')).ok) break; } catch {}
  await wait(500);
}

const TEST = `${ROOT}/dist/images/_swtest.webp`;
const SRC_A = `${ROOT}/public/images/brand/favicon-32.webp`;
const SRC_B = `${ROOT}/public/images/logos/rate.webp`;
const hashOf = async (p) => {
  const buf = await (await import('node:fs/promises')).readFile(p);
  let h = 5381;
  for (const x of buf) h = ((h * 33) ^ x) >>> 0;
  return h.toString(16);
};

await copyFile(SRC_A, TEST);
const hashA = await hashOf(TEST);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:4193/', { waitUntil: 'networkidle2', timeout: 60000 });
await wait(2500);

const swState = async () => page.evaluate(async () => {
  const regs = await navigator.serviceWorker.getRegistrations();
  const names = await caches.keys();
  return {
    sw: regs.map((r) => ({ script: r.active?.scriptURL || null, state: r.state })),
    caches: names,
    rendered: !!document.querySelector('#root')?.children.length,
    imgsOk: [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length === 0,
  };
});
console.log('prod first load:', JSON.stringify(await swState()));

const get = () => page.evaluate(async (p) => {
  const r = await fetch(p, { cache: 'no-store' });
  const b = new Uint8Array(await r.arrayBuffer());
  let h = 5381;
  for (const x of b) h = ((h * 33) ^ x) >>> 0;
  return { hash: h.toString(16), bytes: b.length, sw: r.headers.get('x-sw') || null };
}, '/images/_swtest.webp');

const first = await get();
console.log('fetch A (in cache):', JSON.stringify(first), 'disk:', hashA);

// change the file on disk, then fetch again through the service worker
await copyFile(SRC_B, TEST);
const hashB = await hashOf(TEST);
const second = await get();
console.log('after change     :', JSON.stringify(second), 'disk:', hashB);
console.log('network-first OK :', second.hash === hashB);

await page.reload({ waitUntil: 'networkidle2' });
await wait(2000);
console.log('prod after reload:', JSON.stringify(await swState()));
console.log('errors:', errors.length ? JSON.stringify(errors.slice(0, 5)) : 'none');

await browser.close();
preview.kill();
await unlink(TEST).catch(() => {});
process.exit(0);
