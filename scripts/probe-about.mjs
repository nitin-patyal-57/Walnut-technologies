import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import puppeteer from 'puppeteer-core';

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: process.cwd(), shell: true, stdio: 'ignore',
});
for (let i = 0; i < 40; i++) {
  try { const r = await fetch(BASE); if (r.ok) break; } catch {}
  await sleep(500);
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });

for (const [width, height] of [[1440, 900], [1312, 620], [1024, 768]]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.goto(BASE + '/about', { waitUntil: 'domcontentloaded' });
  await sleep(2000);
  const res = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('a')].find(a => a.textContent.includes('Discover Walnut'));
    const cards = [...document.querySelectorAll('div')].filter(d => d.className.includes('shadow-xl') && d.textContent.includes('Years of Excellence'));
    const b = btn.getBoundingClientRect();
    const c = cards[0]?.getBoundingClientRect();
    return {
      btn: { top: Math.round(b.top), bottom: Math.round(b.bottom) },
      card: c ? { top: Math.round(c.top) } : null,
      gap: c ? Math.round(c.top - b.bottom) : null,
    };
  });
  console.log(`${width}x${height}: btn ${res.btn.top}-${res.btn.bottom}, card top ${res.card?.top}, gap ${res.gap}px`);
  await page.close();
}

await browser.close();
preview.kill();
process.exit(0);
