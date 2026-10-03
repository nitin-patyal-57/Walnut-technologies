import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import puppeteer from 'puppeteer-core';

const PORT = 4174;
const BASE = `http://localhost:${PORT}`;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  shell: true,
  stdio: 'ignore',
});

let ready = false;
for (let i = 0; i < 40; i++) {
  try {
    if ((await fetch(BASE)).ok) { ready = true; break; }
  } catch {}
  await sleep(500);
}
if (!ready) { preview.kill(); console.error('preview failed'); process.exit(1); }

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
});

const issues = [];

function track(page) {
  const data = { images: [], errors: [] };
  page.on('response', (r) => {
    const url = r.url().replace(BASE, '');
    if (/\.(avif|webp|png|jpe?g|svg)(\?|$)/.test(url) || r.request().resourceType() === 'image') {
      data.images.push({ url, status: r.status(), type: r.headers()['content-type'] });
    }
  });
  page.on('requestfailed', (r) => data.errors.push(`REQFAIL ${r.url().replace(BASE, '')}`));
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') data.errors.push(`${m.type()}: ${m.text().slice(0, 180)}`);
  });
  return data;
}

async function loadHome(vp, label) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  const t = track(page);
  await page.goto(BASE + '/', { waitUntil: 'load', timeout: 30000 });
  await sleep(2500);

  const info = await page.evaluate(async () => {
    const preloads = [...document.head.querySelectorAll('link[rel="preload"]')].map((l) => ({
      href: l.getAttribute('href'),
      imagesrcset: l.getAttribute('imagesrcset'),
      imagesizes: l.getAttribute('imagesizes'),
      type: l.getAttribute('type'),
    }));
    const hero = document.querySelector('#hero img');
    const pictures = [...document.querySelectorAll('picture')];
    return {
      preloads,
      heroCurrentSrc: hero ? hero.currentSrc : null,
      heroComplete: hero ? hero.complete && hero.naturalWidth > 0 : null,
      pictureCount: pictures.length,
      plainImgCount: document.querySelectorAll('img:not(picture img)').length,
      pictureDisplay: pictures[0] ? getComputedStyle(pictures[0]).display : null,
      sources: pictures[0] ? [...pictures[0].querySelectorAll('source')].map((s) => s.srcset.slice(0, 90)) : [],
    };
  });
  console.log(`\n--- ${label} (/) ---`);
  console.log('preloads:', JSON.stringify(info.preloads));
  console.log('hero currentSrc:', info.heroCurrentSrc, '| loaded:', info.heroComplete);
  console.log('pictures:', info.pictureCount, '| plain imgs:', info.plainImgCount, '| display:', info.pictureDisplay);
  const bad = t.images.filter((i) => i.status !== 200);
  if (bad.length) issues.push(...bad.map((b) => `${label} image ${b.status} ${b.url}`));
  if (info.heroComplete === false) issues.push(`${label} hero image not loaded`);
  if (info.pictureCount < 5) issues.push(`${label} expected <picture> elements, got ${info.pictureCount}`);
  if (info.pictureDisplay && info.pictureDisplay !== 'contents') issues.push(`${label} picture display=${info.pictureDisplay}`);
  const nonAvif = t.images.filter((i) => i.url.includes('home-background'));
  console.log('home-background requests:', nonAvif.map((i) => `${i.url} [${i.status} ${i.type}]`));
  const wrongType = t.images.filter((i) => i.url.includes('.avif') && !(i.type || '').includes('image/avif'));
  if (wrongType.length) issues.push(`avif served with wrong content-type: ${JSON.stringify(wrongType)}`);
  for (const e of t.errors) issues.push(`${label} console: ${e}`);
  return { page, t };
}

const desktop = await loadHome({ width: 1440, height: 900 }, 'desktop');
await desktop.page.close();

const mobile = await loadHome({ width: 390, height: 844 }, 'mobile');
const mobileHero = mobile.page.evaluate(() => document.querySelector('#hero img')?.currentSrc);
console.log('mobile hero src:', await mobileHero);
await mobile.page.close();

const about = await browser.newPage();
await about.setViewport({ width: 1440, height: 900 });
const ta = track(about);
await about.goto(BASE + '/about', { waitUntil: 'load', timeout: 30000 });
await sleep(3000);
await about.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y < h; y += 800) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
});
await sleep(2000);
const aboutInfo = await about.evaluate(() => {
  const broken = [...document.querySelectorAll('img')]
    .filter((i) => i.complete && i.naturalWidth === 0 && i.src)
    .map((i) => i.src.replace(location.origin, ''));
  return {
    pictureCount: document.querySelectorAll('picture').length,
    broken,
    sources: [...document.querySelectorAll('picture source[type="image/avif"]')].slice(0, 3).map((s) => s.srcset.slice(0, 80)),
  };
});
console.log('\n--- /about ---');
console.log('pictures:', aboutInfo.pictureCount, '| avif sources sample:', aboutInfo.sources);
const homePreloads = ta.images.filter((i) => i.url.includes('home-background'));
console.log('home-background requests on /about:', homePreloads.length, '(must be 0)');
if (homePreloads.length) issues.push(`preload fired on /about: ${homePreloads.map((h) => h.url).join(', ')}`);
if (aboutInfo.broken.length) issues.push(`broken images: ${aboutInfo.broken.join(', ')}`);
const badA = ta.images.filter((i) => i.status !== 200);
if (badA.length) issues.push(...badA.map((b) => `/about image ${b.status} ${b.url}`));
for (const e of ta.errors) issues.push(`/about console: ${e}`);
await about.close();

await browser.close();
preview.kill();

console.log('\n===== RESULT =====');
if (!issues.length) {
  console.log('PASS: preload routing, responsive <picture>, and image loading all OK');
} else {
  for (const i of issues) console.log('ISSUE: ' + i);
  console.log(`${issues.length} issue(s)`);
}
process.exit(issues.length ? 1 : 0);
