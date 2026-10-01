import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import puppeteer from 'puppeteer-core';

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const WIDTHS = [320, 375, 425, 768, 1024, 1280, 1440, 1920, 2560];

const ROUTES = [
  '/', '/about',
  '/about/evolution/foundation', '/about/evolution/innovation',
  '/about/evolution/expansion', '/about/evolution/today',
  '/about/future/global', '/about/future/intelligent', '/about/future/scalable',
  '/solutions', '/process', '/expertise',
  '/expertise/medical-electronics', '/expertise/embedded-electronic-and-iot',
  '/expertise/ip-oriented-product', '/expertise/pcb-design-development',
  '/expertise/it-electronics', '/expertise/iot-software-development',
  '/expertise/large-scale-manufacturing', '/expertise/payment-systems',
  '/clients', '/resources', '/news', '/contact', '/career', '/apply',
  '/privacy', '/terms',
];

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: process.cwd(),
  shell: true,
  stdio: 'ignore',
});

for (let i = 0; i < 40; i++) {
  try {
    const r = await fetch(BASE);
    if (r.ok) break;
  } catch {}
  await sleep(500);
  if (i === 39) {
    preview.kill();
    console.error('preview server failed to start');
    process.exit(1);
  }
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
});

const failures = [];

const CHECK_FN = () => {
  const doc = document.documentElement;
  const scrollX = doc.scrollWidth - window.innerWidth;
  const offenders = [];
  const seen = new Set();
  const tags = new Set(['p','h1','h2','h3','h4','h5','h6','a','button','span','li','td','th','label','input','select']);
  const els = document.querySelectorAll('body *');
  for (const el of els) {
    if (!tags.has(el.tagName.toLowerCase())) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (el.tagName.toLowerCase() !== 'input' && el.tagName.toLowerCase() !== 'select' && !(el.textContent || '').trim()) continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    if (r.right > window.innerWidth + 1 || r.left < -1) {
      const cls = (el.className && el.className.toString ? el.className.toString() : '').slice(0, 60);
      const key = el.tagName + '|' + cls;
      if (seen.has(key)) continue;
      seen.add(key);
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls,
        left: Math.round(r.left),
        right: Math.round(r.right),
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
      });
    }
  }
  return { scrollX, innerW: window.innerWidth, offenders: offenders.slice(0, 8) };
};

async function runWidth(width) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  const local = [];
  for (const route of ROUTES) {
    try {
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await sleep(400);
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let y = 0; y < h; y += 1200) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      await sleep(900);
      const result = await page.evaluate(CHECK_FN);

      if (result.scrollX > 1) {
        local.push({ width, route, type: 'SCROLL', detail: `scrollWidth exceeds viewport by ${result.scrollX}px` });
      }
      if (result.offenders.length) {
        local.push({ width, route, type: 'OFFSCREEN', detail: result.offenders });
      }
    } catch (e) {
      local.push({ width, route, type: 'ERROR', detail: String(e).slice(0, 120) });
    }
  }
  await page.close();
  console.log(`width ${width}: done`);
  return local;
}

const results = await Promise.all(WIDTHS.map(runWidth));
for (const r of results) failures.push(...r);

await browser.close();
preview.kill();

console.log('\n===== RESULTS =====');
if (!failures.length) {
  console.log('PASS: no horizontal overflow detected at any breakpoint');
} else {
  for (const f of failures) {
    console.log(`[${f.width}px] ${f.route} ${f.type}`);
    if (typeof f.detail === 'string') console.log(`   ${f.detail}`);
    else for (const o of f.detail) console.log(`   <${o.tag} class="${o.cls}"> [${o.left}..${o.right}] "${o.text}"`);
  }
  console.log(`\n${failures.length} issue(s)`);
}
process.exit(failures.length ? 1 : 0);
