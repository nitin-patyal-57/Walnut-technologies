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

const probes = [
  { route: '/contact', width: 320, selector: 'h2' },
  { route: '/expertise/medical-electronics', width: 320, selector: 'h1' },
  { route: '/about/evolution/foundation', width: 320, selector: 'h3' },
];

for (const p of probes) {
  const page = await browser.newPage();
  await page.setViewport({ width: p.width, height: 900 });
  await page.goto(BASE + p.route, { waitUntil: 'domcontentloaded' });
  await sleep(500);
  // Slow, realistic scroll into view
  await page.evaluate(async (sel) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ block: 'center' });
  }, p.selector);
  await sleep(2000);
  const res = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    const r = el.getBoundingClientRect();
    let transforms = [];
    let n = el;
    for (let i = 0; i < 4 && n; i++) {
      const t = getComputedStyle(n).transform;
      if (t && t !== 'none') transforms.push(`${n.tagName}:${t}`);
      n = n.parentElement;
    }
    return { left: Math.round(r.left), right: Math.round(r.right), text: (el.textContent||'').trim().slice(0,40), transform: transforms.join(' | ') || 'none' };
  }, p.selector);
  console.log(`${p.route} @${p.width}: left=${res.left} right=${res.right} parentTransform=${res.transform} "${res.text}"`);
  await page.close();
}

await browser.close();
preview.kill();
process.exit(0);
