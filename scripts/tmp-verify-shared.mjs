import puppeteer from 'puppeteer-core';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const BASE = process.argv[2] || 'http://localhost:3000';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));

const targets = ['/solutions', '/products', '/'];
for (const path of targets) {
  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 45000 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await wait(2000);
    const imgs = await page.evaluate(() =>
      [...document.querySelectorAll('img')]
        .filter((i) => /neuro_rehab_device|BP-Gold|boxsound|cluster1|iot-lock-smart/.test(i.src))
        .map((i) => ({ file: i.currentSrc.split('/').pop().split('?')[0], ok: i.complete && i.naturalWidth > 0 }))
    );
    console.log(path, imgs.length ? JSON.stringify(imgs) : 'no shared images on page');
  } catch (e) {
    console.log(path, 'nav error:', e.message.slice(0, 80));
  }
}
console.log('pageerrors:', errs.length ? JSON.stringify(errs.slice(0, 3)) : 'none');
await browser.close();
process.exit(0);
