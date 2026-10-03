import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import puppeteer from 'puppeteer-core';

const PORT = 4175;
const BASE = `http://localhost:${PORT}`;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  shell: true, stdio: 'ignore',
});
let ready = false;
for (let i = 0; i < 40; i++) {
  try { if ((await fetch(BASE)).ok) { ready = true; break; } } catch {}
  await sleep(500);
}
if (!ready) { preview.kill(); process.exit(1); }

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu'] });

const probe = async (route, waitMs, label) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 800 });
  await page.goto(BASE + route, { waitUntil: 'load', timeout: 30000 });
  await sleep(waitMs);
  const out = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const wrap = h1 ? h1.closest('[style], div') : null;
    const chain = [];
    let el = h1;
    while (el && chain.length < 5) {
      const cs = getComputedStyle(el);
      chain.push({
        tag: el.tagName,
        cls: (el.className || '').toString().slice(0, 60),
        opacity: cs.opacity,
        transform: cs.transform,
        left: Math.round(el.getBoundingClientRect().left),
        right: Math.round(el.getBoundingClientRect().right),
      });
      el = el.parentElement;
    }
    return { innerW: window.innerWidth, chain };
  });
  console.log(`\n=== ${label} ${route} (waited ${waitMs}ms) ===`);
  for (const c of out.chain) console.log(` ${c.tag}.${c.cls}\n   opacity=${c.opacity} transform=${c.transform} rect=[${c.left}..${c.right}]`);
  await page.close();
};

await probe('/expertise/medical-electronics', 4000, 'T+4s');
await probe('/contact', 4000, 'T+4s');
await probe('/about/evolution/foundation', 6000, 'T+6s');

await browser.close();
preview.kill();
