import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import puppeteer from 'puppeteer-core';

const PORT = 4179;
const BASE = `http://localhost:${PORT}`;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  shell: true, stdio: 'ignore',
});
for (let i = 0; i < 40; i++) {
  try { if ((await fetch(BASE)).ok) break; } catch {}
  await sleep(500);
}

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu'],
});

const page = await browser.newPage();
await page.setViewport({ width: 375, height: 812 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

const dismissPreloader = async () => {
  await page.waitForFunction(
    () => !document.body.innerText.includes('ELECTRONICS FOR THE WORLD'),
    { timeout: 20000 }
  ).catch(() => {});
  await sleep(600);
};

const CATEGORIES = [
  'Neuro Rehab Devices', 'Medical', 'Fintech', 'Automotive', 'IoT',
].map((c) => '/solutions?category=' + encodeURIComponent(c));
console.log('categories:', JSON.stringify(CATEGORIES));

for (const href of CATEGORIES) {
  await page.goto(BASE + href, { waitUntil: 'domcontentloaded' });
  await dismissPreloader();
  await sleep(1200);
  const r = await page.evaluate(() => {
    const nav = document.querySelector('nav, header');
    const imgs = [...document.querySelectorAll('section img')];
    const hero = imgs.find((i) => i.getBoundingClientRect().height > 80);
    if (!hero) return { noimg: true };
    const nr = nav ? nav.getBoundingClientRect() : { bottom: 0 };
    const ir = hero.getBoundingClientRect();
    return {
      alt: hero.getAttribute('alt'),
      hiddenPx: Math.round(nr.bottom - ir.top),
      imgTop: Math.round(ir.top),
      imgH: Math.round(ir.height),
      navBottom: Math.round(nr.bottom),
      docOverflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  const name = (href.split('=').pop() || 'x').replace(/%20/g, '_');
  console.log(name, JSON.stringify(r));
  await page.screenshot({ path: `C:/Users/Abcom/AppData/Local/Temp/opencode/fix-${name}.png` });
}

await browser.close();
preview.kill();
process.exit(0);
