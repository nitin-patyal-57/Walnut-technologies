import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = 'C:/Users/Abcom/AppData/Local/Temp/opencode';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const preview = spawn('npx', ['vite', 'preview', '--port', '4192', '--strictPort'], {
  shell: true, stdio: 'ignore', cwd: 'C:\\Users\\Abcom\\Documents\\Walnut',
});
for (let i = 0; i < 60; i++) {
  try { if ((await fetch('http://localhost:4192')).ok) break; } catch {}
  await wait(500);
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });

for (const vp of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto('http://localhost:4192/', { waitUntil: 'networkidle2', timeout: 60000 });
  await wait(1500);

  const handle = await page.evaluateHandle(() => {
    const h2 = [...document.querySelectorAll('h2')].find((h) => h.innerText.includes('Production Process'));
    return h2 ? (h2.closest('div').parentElement.parentElement || h2) : null;
  });
  const el = handle.asElement();
  if (!el) { console.log(`${vp.name}: section not found`); await page.close(); continue; }
  await el.scrollIntoView();
  await wait(2000);
  const box = await el.boundingBox();
  await el.screenshot({ path: `${OUT}/proc-${vp.name}.png` });
  console.log(`${vp.name}: ${JSON.stringify(box)}`);

  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll('img')].filter((i) => i.src.includes('/images/process/')).map((i) => ({
      file: i.currentSrc.split('/').pop().split('?')[0], ok: i.complete && i.naturalWidth > 0,
    }))
  );
  console.log(`${vp.name} imgs: ${JSON.stringify(imgs)}`);
  await page.close();
}

await browser.close();
preview.kill();
process.exit(0);
