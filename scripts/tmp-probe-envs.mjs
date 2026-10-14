import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = 'C:/Users/Abcom/AppData/Local/Temp/opencode';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });

for (const target of [
  { name: 'local', url: 'http://localhost:3000/' },
  { name: 'live', url: 'https://walnutmedical.in/' },
]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1900, height: 1000, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  try {
    await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 60000 });
    await wait(1500);
    const handle = await page.evaluateHandle(() => {
      const h2 = [...document.querySelectorAll('h2')].find((h) => h.innerText.includes('Technology That Powers'));
      return h2 ? h2.closest('section') : null;
    });
    const el = handle.asElement();
    if (!el) { console.log(target.name, ': section not found'); await page.close(); continue; }
    await el.scrollIntoView();
    await wait(2500);
    await el.screenshot({ path: `${OUT}/probe-${target.name}.png` });
    // which image bytes is the tile actually showing?
    const info = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')].filter((i) => i.src.includes('/images/products/'));
      return imgs.map((i) => {
        const u = new URL(i.currentSrc || i.src);
        return { file: u.pathname.split('/').pop(), w: i.naturalWidth, h: i.naturalHeight };
      });
    });
    console.log(target.name, ':', JSON.stringify(info));
  } catch (e) {
    console.log(target.name, 'error:', e.message.slice(0, 100));
  }
  await page.close();
}

await browser.close();
process.exit(0);
