import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const BASE = process.argv[2] || 'http://localhost:3000';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)); });

const state = async (label) => {
  const s = await page.evaluate(async () => {
    const regs = await navigator.serviceWorker.getRegistrations();
    const names = ('caches' in window) ? await caches.keys() : [];
    const counts = {};
    for (const n of names) counts[n] = (await (await caches.open(n)).keys()).length;
    return {
      sw: regs.map((r) => ({ script: r.active?.scriptURL || null, state: r.state })),
      caches: counts,
      rendered: !!document.querySelector('#root')?.children.length,
    };
  });
  console.log(label, JSON.stringify(s));
  return s;
};

// 1) reproduce the user's browser state: an old SW + walnut-v9 cache present
await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
await page.evaluate(async () => {
  const reg = await navigator.serviceWorker.register('/sw.js');
  for (let i = 0; i < 40 && !reg.active; i++) await new Promise((r) => setTimeout(r, 100));
  const cache = await caches.open('walnut-v9');
  await cache.put('/src/pages/HomePage.jsx', new Response('// stale module'));
  await cache.put('/images/products/boxsound.webp', new Response('stale image'));
});
await wait(500);
await state('before fix  ');

// 2) reload with the new code -> must unregister + purge
await page.reload({ waitUntil: 'networkidle2' });
await wait(2500);
await state('after reload1');
await page.reload({ waitUntil: 'networkidle2' });
await wait(2000);
await state('after reload2');

console.log('errors:', errors.length ? JSON.stringify(errors.slice(0, 8), null, 1) : 'none');
await browser.close();
