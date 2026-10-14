import puppeteer from 'puppeteer-core';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const BASE = process.argv[2] || 'http://localhost:3000';
const sha = (b) => createHash('sha1').update(b).digest('hex').slice(0, 10);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const responses = [];
page.on('response', async (r) => {
  const u = r.url();
  if (/\/images\/products\//.test(u) || /sw\.js$/.test(u) || /index-\w+\.js$/.test(u)) {
    responses.push({
      url: u.replace(BASE, ''),
      status: r.status(),
      cache: r.headers()['x-cache'] || r.headers()['cf-cache-status'] || '',
      cacheControl: r.headers()['cache-control'] || '',
      fromServiceWorker: r.fromServiceWorker ? r.fromServiceWorker() : undefined,
      fromDiskCache: r.fromDiskCache ? r.fromDiskCache() : undefined,
    });
  }
});

await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
await wait(2500);

const diag = await page.evaluate(async () => {
  const regs = await navigator.serviceWorker.getRegistrations();
  const cacheNames = await caches.keys();
  const cacheStats = {};
  for (const name of cacheNames) {
    const c = await caches.open(name);
    const keys = await c.keys();
    cacheStats[name] = { entries: keys.length, sample: keys.slice(0, 6).map((k) => new URL(k.url).pathname) };
  }
  const imgs = [...document.querySelectorAll('img')]
    .filter((i) => i.src.includes('/images/products/'))
    .map((i) => ({ src: i.src.split('/').pop(), current: i.currentSrc.split('/').pop(), nw: i.naturalWidth, complete: i.complete }));
  return {
    origin: location.origin,
    sw: regs.map((r) => ({ scope: r.scope, script: r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || null, state: r.state })),
    caches: cacheStats,
    imgs,
  };
});

// byte-compare a served image with the file on disk
const served = await page.evaluate(async () => {
  const img = [...document.querySelectorAll('img')].find((i) => i.src.includes('/images/products/'));
  if (!img) return null;
  const r = await fetch(img.src, { cache: 'no-store' });
  const b = new Uint8Array(await r.arrayBuffer());
  let h = 5381;
  for (const x of b) h = ((h * 33) ^ x) >>> 0;
  return { src: new URL(img.src).pathname, bytes: b.length, hash: h.toString(16) };
});
let disk = null;
try {
  const buf = await readFile(`C:/Users/Abcom/Documents/Walnut/public${served.src}`);
  let h = 5381;
  for (const x of buf) h = ((h * 33) ^ x) >>> 0;
  disk = { bytes: buf.length, hash: h.toString(16) };
} catch (e) { disk = { error: e.message }; }

console.log(JSON.stringify({ diag, served, disk, responses }, null, 2));
await browser.close();
