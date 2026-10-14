import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const BASE = process.argv[2] || 'http://localhost:3000';
const OUT = 'C:/Users/Abcom/AppData/Local/Temp/opencode/journey-now.png';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1900, height: 1000 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
await wait(1500);

const handle = await page.evaluateHandle(() => {
  const h2 = [...document.querySelectorAll('h2')].find((h) => h.innerText.includes('From Walnut Medical'));
  return h2 ? h2.closest('section') : null;
});
const el = handle.asElement();
if (!el) { console.log('journey section not found'); process.exit(1); }
await el.scrollIntoView();
await wait(2500);
await el.screenshot({ path: OUT });
console.log('saved', OUT, JSON.stringify(await el.boundingBox()));
await browser.close();
