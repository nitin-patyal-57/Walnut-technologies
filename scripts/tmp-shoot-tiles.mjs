import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = 'C:/Users/Abcom/AppData/Local/Temp/opencode';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const BASE = process.argv[2] || 'http://localhost:3000';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });

for (const vp of [
  { name: 'desktop', width: 1900, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
  await wait(1500);

  const handle = await page.evaluateHandle(() => {
    const h2 = [...document.querySelectorAll('h2')].find((h) => h.innerText.includes('Technology That Powers'));
    return h2 ? h2.closest('section') : null;
  });
  const el = handle.asElement();
  if (!el) { console.log(`${vp.name}: section not found`); await page.close(); continue; }
  await el.scrollIntoView();
  await wait(2500);
  await el.screenshot({ path: `${OUT}/tiles-${vp.name}.png` });
  console.log(`${vp.name}: saved`);

  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll('img')].filter((i) => i.src.includes('/images/products/')).map((i) => ({
      file: i.currentSrc.split('/').pop().split('?')[0], ok: i.complete && i.naturalWidth > 0,
    }))
  );
  console.log(`${vp.name} imgs: ${JSON.stringify(imgs)}`);
  await page.close();
}

await browser.close();
process.exit(0);
