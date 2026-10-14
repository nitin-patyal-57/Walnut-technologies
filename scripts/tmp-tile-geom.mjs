// Measure the Solutions tile container vs rendered <img> boxes in the browser,
// and sample the top rows of the rendered tile to detect any empty band.
import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.argv[2] || 'http://localhost:3001';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1900, height: 1000, deviceScaleFactor: 1 });
await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
await wait(1200);

const info = await page.evaluate(() => {
  const h2 = [...document.querySelectorAll('h2')].find((h) => h.innerText.includes('Technology That Powers'));
  const section = h2 && h2.closest('section');
  if (!section) return null;
  section.scrollIntoView();
  const wrap = [...section.querySelectorAll('div')].find((d) => d.className.includes('aspect-[4/3]'));
  const boxes = [...section.querySelectorAll('div')]
    .filter((d) => d.className.includes('aspect-[4/3]'))
    .map((d, i) => {
      const r = d.getBoundingClientRect();
      const img = d.querySelector('img');
      const ir = img && img.getBoundingClientRect();
      return {
        i,
        container: { w: +r.width.toFixed(2), h: +r.height.toFixed(2), ratio: +(r.width / r.height).toFixed(4), top: +r.top.toFixed(1) },
        img: ir ? { w: +ir.width.toFixed(2), h: +ir.height.toFixed(2), top: +ir.top.toFixed(1), src: img.currentSrc.split('/').pop() } : null,
        gapTop: ir ? +(ir.top - r.top).toFixed(2) : null,
        gapBottom: ir ? +(r.bottom - ir.bottom).toFixed(2) : null,
        objPos: img ? getComputedStyle(img).objectPosition : null,
        objFit: img ? getComputedStyle(img).objectFit : null,
      };
    });
  return { wrapFound: !!wrap, boxes };
});

console.log(JSON.stringify(info, null, 1));

// Screenshot each tile container top 60px for pixel inspection
const handles = await page.$$eval('div', (els) =>
  els.filter((d) => d.className.includes('aspect-[4/3]')).length
);
console.log('containers:', handles);

await browser.close();
process.exit(0);
