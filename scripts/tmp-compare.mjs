import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const preview = spawn('npx', ['vite', 'preview', '--port', '4190', '--strictPort'], {
  shell: true, stdio: 'ignore', cwd: 'C:\\Users\\Abcom\\Documents\\Walnut',
});
for (let i = 0; i < 40; i++) {
  try { if ((await fetch('http://localhost:4190')).ok) break; } catch {}
  await wait(500);
}

const TARGETS = [
  { name: 'vvdn', url: 'https://www.vvdn.com/' },
  { name: 'dixon', url: 'https://www.dixoninfo.com/' },
  { name: 'ours', url: 'http://localhost:4190/' },
];

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, args: ['--no-sandbox'],
});

for (const t of TARGETS) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  try {
    await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => !document.body.innerText.includes('ELECTRONICS FOR THE WORLD'), { timeout: 15000 }).catch(() => {});
    await wait(3500);
    const stats = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const res = performance.getEntriesByType('resource');
      const sameOrigin = res.filter((r) => r.name.startsWith(location.origin));
      const kb = Math.round(sameOrigin.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024);
      const txt = (el) => (el ? el.innerText.trim().replace(/\s+/g, ' ') : '');
      return {
        title: document.title,
        desc: (document.querySelector('meta[name=description]') || {}).content || '',
        dcl: Math.round(nav.domContentLoadedEventEnd || 0),
        load: Math.round(nav.loadEventEnd || 0),
        resources: res.length, sameOriginKB: kb,
        h1: [...document.querySelectorAll('h1')].map(txt).filter(Boolean).slice(0, 3),
        h2: [...document.querySelectorAll('h2')].map(txt).filter(Boolean).slice(0, 12),
        navLinks: [...document.querySelectorAll('nav a, header a')].map(txt).filter(Boolean).slice(0, 30),
        sections: document.querySelectorAll('section').length,
        imgs: document.querySelectorAll('img').length,
        lazyImgs: [...document.querySelectorAll('img')].filter((i) => i.loading === 'lazy').length,
      };
    });
    console.log('==== ' + t.name + ' ' + t.url);
    console.log(JSON.stringify(stats, null, 1));
    await page.screenshot({ path: `C:/Users/Abcom/AppData/Local/Temp/opencode/cmp-${t.name}.png` });
  } catch (e) {
    console.log('==== ' + t.name + ' FAILED: ' + String(e).slice(0, 150));
  }
  await page.close();
}

await browser.close();
preview.kill();
process.exit(0);
