import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1900, height: 1000, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

const res = await page.goto('https://walnutmedical.in/', { waitUntil: 'networkidle2', timeout: 90000 });
console.log('status:', res.status(), 'url:', page.url());
await wait(3000);

const info = await page.evaluate(() => ({
  title: document.title,
  h2s: [...document.querySelectorAll('h2')].map((h) => h.innerText.replace(/\s+/g, ' ').slice(0, 60)),
  productImgs: [...document.querySelectorAll('img')]
    .filter((i) => /products/.test(i.src))
    .map((i) => ({ file: new URL(i.currentSrc || i.src).pathname.split('/').pop(), w: i.naturalWidth, h: i.naturalHeight })),
  sw: navigator.serviceWorker ? navigator.serviceWorker.controller?.scriptURL || 'none' : 'unsupported',
}));
console.log(JSON.stringify(info, null, 1));

// scroll to the divisions section and shoot it
const el = await page.evaluateHandle(() => {
  const h2 = [...document.querySelectorAll('h2')].find((h) => h.innerText.includes('Technology That Powers'));
  return h2 ? h2.closest('section') : null;
});
const sec = el.asElement();
if (sec) {
  await sec.scrollIntoView();
  await wait(2500);
  await sec.screenshot({ path: 'C:/Users/Abcom/AppData/Local/Temp/opencode/probe-live.png' });
  console.log('live section shot saved');
} else {
  await page.screenshot({ path: 'C:/Users/Abcom/AppData/Local/Temp/opencode/probe-live.png' });
  console.log('live full-page shot saved (section missing)');
}

await browser.close();
process.exit(0);
