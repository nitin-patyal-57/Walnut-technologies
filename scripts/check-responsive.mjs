import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import puppeteer from 'puppeteer-core';

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const WIDTHS = [280, 320, 360, 375, 414, 425, 540, 768, 820, 1024, 1280, 1440, 1920, 2560, 3440, 3840];

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

// only one tab may be visible at a time: other tabs' bringToFront() calls would
// steal visibility mid-check and freeze entrance animations / IO callbacks
let frontLock = Promise.resolve();
const withFront = (fn) => {
  const run = frontLock.then(fn, fn);
  frontLock = run.catch(() => {});
  return run;
};

// runs in-page: scroll through the page step by step (waiting for entrance
// animations to trigger at each step) and check only elements currently in
// the viewport - below-fold elements legitimately sit at their initial
// transform until scrolled to
const SCROLL_CHECK = async () => {
  document.documentElement.style.scrollBehavior = 'auto';
  const tags = new Set(['p','h1','h2','h3','h4','h5','h6','a','button','span','li','td','th','label','input','select']);
  const offenders = [];
  const seen = new Set();
  let scrollX = 0;

  const check = () => {
    const doc = document.documentElement;
    scrollX = Math.max(scrollX, doc.scrollWidth - window.innerWidth);
    for (const el of document.querySelectorAll('body *')) {
      if (!tags.has(el.tagName.toLowerCase())) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.bottom < 0 || r.top > window.innerHeight) continue; // in viewport only
      if (el.tagName.toLowerCase() !== 'input' && el.tagName.toLowerCase() !== 'select' && !(el.textContent || '').trim()) continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      const cls = (el.className && el.className.toString ? el.className.toString() : '').slice(0, 60);
      const key = el.tagName + '|' + cls;
      if (seen.has(key)) continue;
      const cs = getComputedStyle(el);
      const clipsX = (cs.overflowX === 'hidden' || cs.overflow === 'hidden');
      if (clipsX && !/truncate|line-clamp|whitespace-nowrap/.test(cls) && el.scrollWidth > el.clientWidth + 2) {
        seen.add(key);
        offenders.push({ tag: el.tagName.toLowerCase(), cls, type: 'TEXT_CLIP', detail: `scrollW ${el.scrollWidth} > clientW ${el.clientWidth}` });
        continue;
      }
      // inside a deliberate horizontal scroller (carousel): cards sitting past
      // the viewport edge are swipe content, not page overflow
      let anc = el.parentElement;
      let inScroller = false;
      while (anc && anc !== document.body) {
        const ox = getComputedStyle(anc).overflowX;
        if (ox === 'auto' || ox === 'scroll') { inScroller = true; break; }
        anc = anc.parentElement;
      }
      if (inScroller) continue;
      if (r.right > window.innerWidth + 1 || r.left < -1) {
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
  };

  const step = Math.max(400, Math.floor(window.innerHeight * 0.75));
  for (let y = 0, h = document.body.scrollHeight; y < h; y += step) {
    window.scrollTo({ top: y, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 300));
    check();
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
  return { scrollX, offenders: offenders.slice(0, 8) };
};

async function runWidth(width) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const local = [];
  for (const route of ROUTES) {
    try {
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await sleep(300);
      const result = await withFront(async () => {
        await page.bringToFront();
        await sleep(150);
        return page.evaluate(SCROLL_CHECK);
      });

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

const failures = [];
for (let i = 0; i < WIDTHS.length; i += 4) {
  const batch = WIDTHS.slice(i, i + 4);
  const out = await Promise.all(batch.map(runWidth));
  for (const r of out) failures.push(...r);
}

await browser.close();
preview.kill();

console.log('\n===== RESULTS =====');
if (!failures.length) {
  console.log('PASS: no horizontal overflow detected at any breakpoint');
} else {
  for (const f of failures) {
    console.log(`[${f.width}px] ${f.route} ${f.type}`);
    if (typeof f.detail === 'string') console.log(`   ${f.detail}`);
    else for (const o of f.detail) {
      if (o.type === 'TEXT_CLIP') console.log(`   TEXT_CLIP <${o.tag} class="${o.cls}"> ${o.detail}`);
      else console.log(`   <${o.tag} class="${o.cls}"> [${o.left}..${o.right}] "${o.text}"`);
    }
  }
  console.log(`\n${failures.length} issue(s)`);
}
process.exit(failures.length ? 1 : 0);
