// Converts website images (public/images, WebP) into PPTX-friendly JPG/PNG,
// builds the "Google Maps on the cluster" mirroring visual, and renders icons.
// Output: catalog/source/assets/. Run: node prepare-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Fi from 'react-icons/fi';
import { renderDashboards } from './dashboards.mjs';
import { hudPhoto, productOrbit } from './visuals.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(here, '../../public/images');
const OUT = path.join(here, 'assets');
fs.mkdirSync(path.join(OUT, 'icons'), { recursive: true });

const src = (p) => path.join(SITE, p);
const out = (p) => path.join(OUT, p);

// ─── Photos (JPG) and cut-outs (PNG) ──────────────────────────────────
const PHOTOS = {
  
  'cleanroom.jpg': 'about/06_Cleanroom_Manufacturing.webp',
  
  
  
  'global.jpg': 'about/05_Global_Technology.webp',
  
  'handshake.jpg': 'about/12_Business_Partnership.webp',
  'engineer.jpg': 'backgrounds/aboutbackground.webp',
  
  'medical-range.jpg': 'backgrounds/medical-background.webp',
  'fintech-range.jpg': 'backgrounds/fintech-homebackground.webp',
  'gps-dark.jpg': 'backgrounds/gpsgatewaybackground.webp',
  'lock-range.jpg': 'backgrounds/iot-smartlock-background1.webp',
  'cluster.jpg': 'products/cluster1.webp',
  'gps.jpg': 'products/gps-gateway.webp',
  'lock.jpg': 'products/iot-lock-smart.webp',
  'bp.jpg': 'products/bp-home.webp',
  'thermometer.jpg': 'products/Thermometer.webp',
  'nebulizer.jpg': 'products/Nebulizer.webp',
  'oxygen.jpg': 'products/Oxygen-Concentrator-5.webp',
  'walklab.jpg': 'products/neuro_rehab_device.webp',
  'repose.jpg': 'products/ces-repose.webp',
  'tilt-bed.jpg': 'products/tilt-bed.webp',
  'medstim.jpg': 'products/medstim-neuro-devices.webp',
  'soundbox.jpg': 'products/soundbox-new.webp',
  'boxsound.jpg': 'products/boxsound.webp',
  'rtos.jpg': 'products/RTOS.webp',
  'dqr.jpg': 'products/DQR.webp',
  'ldqr.jpg': 'products/LDQR.webp',
  // production process (10 steps)
  'step-01.jpg': 'process/idea-and-requirement.webp',
  'step-02.jpg': 'process/research-and-market-analysis.webp',
  'step-03.jpg': 'process/design-and-engineering.webp',
  'step-04.jpg': 'process/prototype-development.webp',
  'step-05.jpg': 'process/validation-and-testing.webp',
  
  'step-07.jpg': 'process/quality-assurance.webp',
  
  'step-09.jpg': 'process/after-sales-support.webp',
  'step-10.jpg': 'process/continuous-improvement.webp',
};

const LOGOS = {
  'logo-walnut.png': 'brand/Walnut_Technologies_logo_transparent.webp',
  'wm-ink.png': 'brand/wm-ink.png',
  'wm-white.png': 'brand/wm-white.png',
  'client-sbi.png': 'clients/sbi.webp',
  'client-paytm.png': 'clients/paytm-logo.webp',
  'client-bharatpe.png': 'clients/bhartpe.webp',
  'client-apollo.png': 'clients/apollo.webp',
  'client-army.png': 'clients/indian-army.webp',
};

for (const [name, file] of Object.entries(PHOTOS)) {
  await sharp(src(file)).resize({ width: 1800, withoutEnlargement: true }).flatten({ background: '#ffffff' })
    .jpeg({ quality: 84, mozjpeg: true }).toFile(out(name));
}
for (const [name, file] of Object.entries(LOGOS)) {
  await sharp(src(file)).resize({ width: 900, withoutEnlargement: true }).png().toFile(out(name));
}

// Trim the wide white margin around the payment-device line-up
await sharp(src('backgrounds/fintech-homebackground.webp')).flatten({ background: '#ffffff' }).trim({ threshold: 12 })
  .extend({ top: 20, bottom: 20, left: 40, right: 40, background: '#ffffff' }).jpeg({ quality: 88 }).toFile(out('fintech-range.jpg'));

// ─── Clean cut-outs for the journey timeline (whole product, white background, no margin) ─
// Crop to the bounding box of real content: opaque pixels (alpha > 40) that are
// not near-white. Stray faint pixels in corners no longer defeat the trim.
async function trimmed(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const content = data[i + 3] > 40 && Math.min(data[i], data[i + 1], data[i + 2]) < 238;
      if (content) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
  }
  // Ignore a lone stray pixel cluster in a corner by requiring a sane box
  const box = x1 < 0 ? { left: 0, top: 0, width: w, height: h } : { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
  // Off-white studio backgrounds (≈ #f2f2f2) read as a grey box on a white slide:
  // push near-white pixels to pure white.
  const { data: px, info: pi } = await sharp(input).extract(box).flatten({ background: '#ffffff' }).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < px.length; i += pi.channels) {
    if (Math.min(px[i], px[i + 1], px[i + 2]) >= 232) px[i] = px[i + 1] = px[i + 2] = 255;
  }
  return sharp(px, { raw: { width: pi.width, height: pi.height, channels: pi.channels } });
}
const CUTOUTS = {
  'j-walklab.png': 'products/walklab-product.webp',
  'j-thermo.png': 'products/Thermometer.webp',
  'j-fintech.png': 'products/bharatpay-m.webp',
  'j-rtos.png': 'products/RTOS.webp',
  'j-dqr.png': 'products/DQR.webp',
  'j-ldqr.png': 'products/LDQR.webp',
  'j-gps.png': 'products/gps-gateway.webp',
  'j-logo-tech.png': 'brand/Walnut_Technologies_logo_transparent.webp',
};
for (const [name, file] of Object.entries(CUTOUTS)) {
  await (await trimmed(src(file))).png().toFile(out(name));
}
// Walnut Medical logo, taken from the company's earlier introduction letter (static/)
await (await trimmed(path.join(here, 'static/walnut-medical-logo.png'))).png().toFile(out('j-logo-medical.png'));

// Cluster cut-out: flood-fill the light studio background from the image edges,
// so the black cluster (and its lit screen, enclosed by the bezel) is kept whole.
// `input` is the full 1200×900 cluster photo (plain or with Google Maps on screen).
// Also used for other dark products on light studio backgrounds (BP monitor).
async function clusterCutout(input, name, box = { left: 300, top: 240, width: 620, height: 470 }) {
  const { data, info } = await sharp(input).extract(box)
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const bg = new Uint8Array(w * h);
  const light = (p) => 0.299 * data[p * 3] + 0.587 * data[p * 3 + 1] + 0.114 * data[p * 3 + 2] > 110;
  const queue = [];
  const push = (p) => { if (!bg[p] && light(p)) { bg[p] = 1; queue.push(p); } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (queue.length) {
    const p = queue.pop(), x = p % w, y = (p - x) / w;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (y > 0) push(p - w);
    if (y < h - 1) push(p + w);
  }
  // Keep only the largest connected object: stray specks (podium shadows, dust)
  // would otherwise widen the trimmed crop.
  const label = new Int32Array(w * h).fill(-1);
  let best = -1, bestSize = 0;
  for (let start = 0, id = 0; start < w * h; start++) {
    if (bg[start] || label[start] !== -1) continue;
    const stack = [start];
    label[start] = id;
    let size = 0;
    while (stack.length) {
      const p = stack.pop(), x = p % w, y = (p - x) / w;
      size++;
      for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1]) {
        if (q >= 0 && !bg[q] && label[q] === -1) { label[q] = id; stack.push(q); }
      }
    }
    if (size > bestSize) { bestSize = size; best = id; }
    id++;
  }
  for (let p = 0; p < w * h; p++) if (!bg[p] && label[p] !== best) bg[p] = 1;
  // Background → white; pixels next to the background are blended 50/50 to soften the edge
  const rgb = Buffer.alloc(w * h * 3);
  for (let p = 0; p < w * h; p++) {
    const x = p % w, y = (p - x) / w;
    const edge = !bg[p] && ((x > 0 && bg[p - 1]) || (x < w - 1 && bg[p + 1]) || (y > 0 && bg[p - w]) || (y < h - 1 && bg[p + w]));
    for (let c = 0; c < 3; c++) {
      const v = data[p * 3 + c];
      rgb[p * 3 + c] = bg[p] ? 255 : edge ? Math.round((v + 255) / 2) : v;
    }
  }
  const flat = await sharp(rgb, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
  await (await trimmed(flat)).png().toFile(out(name));
}
await clusterCutout(src('products/cluster1.webp'), 'j-cluster.png');
// BP monitor: the website's transparent version is only ~220 px, so cut it from the studio shot
await clusterCutout(src('products/bp-home.webp'), 'j-bp.png', { left: 0, top: 0, width: 1200, height: 900 });

// ─── Real Walnut factory photos (static/photos, supplied by the company) ──────
// Portrait 3:4 shots; named by what they show.
const REAL = {
  'real-rework.jpg': '01_Digital_Circuitry.jpg', // microscope soldering / rework
  'real-chamber.jpg': '02_Precision_Assembly.jpg', // environmental test chamber
  'real-press.jpg': '03_Dust_Chamber_Test.jpg', // assembly press station
  'real-packing.jpg': '04_Micro_Precision.jpg', // packing & weighing line
  'real-test-station.jpg': '05_Packaging_Line.jpg', // functional test jigs
  'real-line.jpg': 'production-line.jpg', // production line (supplied)
  'real-smt.jpg': 'smt-line.jpg', // SMT line (supplied)
  'walklab-test.jpg': 'walklab-test.png', // WalkLab in use (supplied)
  'step-06.jpg': '06_Quality_Control_Test_Station.jpg', // process: manufacturing engineering
  'step-08.jpg': '04_Micro_Precision.jpg', // process: packaging & dispatch
  'team.jpg': 'team.png', // engineering office
  'building.jpg': 'company.png', // Walnut Technologies building (cover)
};
for (const [name, file] of Object.entries(REAL)) {
  await sharp(path.join(here, 'static/photos', file)).rotate().resize({ width: 2000, withoutEnlargement: true }).flatten({ background: '#ffffff' })
    .jpeg({ quality: 86, mozjpeg: true }).toFile(out(name));
}
// Product line-ups added from the website (static/photos), trimmed to the products
await (await trimmed(path.join(here, 'static/photos/neuro-rehab-display.webp'))).png().toFile(out('j-neuro-range.png'));
await (await trimmed(path.join(here, 'static/photos/iot-smartlock-background1.webp'))).png().toFile(out('j-lock-range.png'));

// Medical line-up for the catalog: only the four medical products, side by side on white
{
  const parts = ['j-bp.png', 'j-thermo.png', 'nebulizer.jpg', 'oxygen.jpg'];
  const H = 700, gap = 90;
  const imgs = [];
  for (const f of parts) {
    const t = await (await trimmed(out(f))).png().toBuffer();
    const r = await sharp(t).resize({ height: f === 'oxygen.jpg' ? H : Math.round(H * 0.72) }).png().toBuffer({ resolveWithObject: true });
    imgs.push(r);
  }
  const width = imgs.reduce((s, i) => s + i.info.width, 0) + gap * (imgs.length + 1);
  let x = gap;
  const composite = imgs.map((i) => { const c = { input: i.data, left: x, top: H + 40 - i.info.height }; x += i.info.width + gap; return c; });
  await sharp({ create: { width, height: H + 80, channels: 3, background: '#ffffff' } }).composite(composite).png().toFile(out('j-medical-range.png'));
}

// Walkex (FES for foot drop) — photo supplied by the company
await sharp(path.join(here, 'static/photos/WalkEX.webp')).resize({ width: 1080, withoutEnlargement: true }).jpeg({ quality: 88 }).toFile(out('walkex.jpg'));
// GPS tracker WM-MFT-4G (supplied photo, white background): upright and sideways cut-outs
await (await trimmed(path.join(here, 'static/photos/gps-tracker.jpg'))).png().toFile(out('j-tracker.png'));
await sharp(out('j-tracker.png')).rotate(-90, { background: '#ffffff' }).png().toFile(out('j-tracker-h.png'));
// Cluster in a tractor cab (supplied). Bottom strip cropped to drop the generator mark.
await sharp(path.join(here, 'static/photos/cluster-tractor.jpg')).extract({ left: 0, top: 0, width: 1024, height: 680 })
  .jpeg({ quality: 90 }).toFile(out('cluster-tractor.jpg'));
// Smart lock cut-out
await (await trimmed(src('products/smartlock-product-removebg.webp'))).png().toFile(out('j-lock.png'));

// White version of the full logo for black slides (invert colour, keep alpha)
await sharp(src('brand/Walnut_Technologies_logo_transparent.webp')).resize({ width: 900, withoutEnlargement: true })
  .negate({ alpha: false }).png().toFile(out('logo-walnut-white.png'));

// HDFC logo ships with a fake grey/white checkerboard baked in: turn every
// near-neutral light pixel into transparency so it sits cleanly on white.
{
  const { data, info } = await sharp(src('clients/hdfc.webp')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const neutral = Math.max(r, g, b) - Math.min(r, g, b) < 12;
    if (neutral && r > 185) data[i + 3] = 0;
  }
  await sharp(data, { raw: info }).png().toFile(out('client-hdfc.png'));
}

// ─── Google Maps navigation screen (vector, drawn for the mirroring visual) ─
function mapSvg(w, h, { portrait = false } = {}) {
  const s = (v) => v * (w / 330); // designed on a 330px wide canvas
  const roads = portrait
    ? `M ${s(-10)} ${h * 0.70} L ${w + 10} ${h * 0.62} M ${s(60)} -10 L ${s(95)} ${h + 10} M ${s(220)} -10 L ${s(250)} ${h + 10} M -10 ${h * 0.32} L ${w + 10} ${h * 0.26}`
    : `M -10 ${h * 0.72} L ${w + 10} ${h * 0.60} M ${s(70)} -10 L ${s(95)} ${h + 10} M ${s(250)} -10 L ${s(270)} ${h + 10} M -10 ${h * 0.30} L ${w + 10} ${h * 0.22}`;
  const route = portrait
    ? `M ${s(170)} ${h * 0.86} L ${s(165)} ${h * 0.66} L ${s(152)} ${h * 0.44} L ${s(232)} ${h * 0.39} L ${s(300)} ${h * 0.34}`
    : `M ${s(150)} ${h * 0.86} L ${s(160)} ${h * 0.64} L ${s(170)} ${h * 0.44} L ${s(250)} ${h * 0.36} L ${s(330)} ${h * 0.30}`;
  const puck = portrait ? [s(168), h * 0.78] : [s(153), h * 0.79];
  const top = portrait ? h * 0.07 : 0; // phone: keep the banner clear of the camera notch
  const bannerH = portrait ? h * 0.11 : h * 0.24;
  const bannerW = portrait ? w : w * 0.62;
  const bottomH = portrait ? h * 0.11 : h * 0.19;
  const fs1 = portrait ? s(26) : s(17);
  const fs2 = portrait ? s(13) : s(9.5);
  // Turn-right arrow drawn in a fixed square so it never stretches
  const a = portrait ? s(30) : bannerH * 0.62;
  const ax = s(12), ay = top + (bannerH - a) / 2;
  const arrow = `M ${ax + a * 0.18} ${ay + a} V ${ay + a * 0.48} Q ${ax + a * 0.18} ${ay + a * 0.28} ${ax + a * 0.4} ${ay + a * 0.28} H ${ax + a * 0.62} V ${ay + a * 0.06} L ${ax + a * 0.95} ${ay + a * 0.4} L ${ax + a * 0.62} ${ay + a * 0.74} V ${ay + a * 0.52} H ${ax + a * 0.44} Q ${ax + a * 0.38} ${ay + a * 0.52} ${ax + a * 0.38} ${ay + a * 0.58} V ${ay + a} Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#eef0f2"/>
  <path d="M ${s(250)} ${h * 0.55} q ${s(40)} ${s(-10)} ${s(90)} ${s(5)} v ${h} h ${-s(100)} z" fill="#c9e7c4"/>
  <path d="M -10 ${h * 0.86} q ${s(60)} ${s(-12)} ${s(120)} ${s(4)} v ${h} h ${-s(130)} z" fill="#aecbfa"/>
  <rect x="${s(120)}" y="${h * 0.08}" width="${s(70)}" height="${h * 0.14}" rx="4" fill="#e1e4e8"/>
  <rect x="${s(195)}" y="${h * 0.42}" width="${s(40)}" height="${h * 0.12}" rx="4" fill="#e1e4e8"/>
  <path d="${roads}" stroke="#d6d9de" stroke-width="${s(13)}" fill="none" stroke-linecap="round"/>
  <path d="${roads}" stroke="#ffffff" stroke-width="${s(10)}" fill="none" stroke-linecap="round"/>
  <path d="${route}" stroke="#0b57d0" stroke-width="${s(11)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${route}" stroke="#1a73e8" stroke-width="${s(8)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${puck[0]}" cy="${puck[1]}" r="${s(11)}" fill="#ffffff"/>
  <circle cx="${puck[0]}" cy="${puck[1]}" r="${s(8.5)}" fill="#1a73e8"/>
  <path d="M ${puck[0]} ${puck[1] - s(5.5)} L ${puck[0] + s(4.2)} ${puck[1] + s(4)} L ${puck[0]} ${puck[1] + s(2)} L ${puck[0] - s(4.2)} ${puck[1] + s(4)} Z" fill="#ffffff"/>
  <rect x="0" y="0" width="${bannerW}" height="${top + bannerH}" rx="${portrait ? 0 : s(6)}" fill="#0f7b3e"/>
  <path d="${arrow}" fill="#ffffff"/>
  <text x="${s(54)}" y="${top + bannerH * 0.48}" font-family="Arial" font-weight="700" font-size="${fs1}" fill="#ffffff">200 m</text>
  <text x="${s(54)}" y="${top + bannerH * 0.82}" font-family="Arial" font-size="${fs2}" fill="#ffffff">Turn right onto Airport Road</text>
  <rect x="0" y="${h - bottomH}" width="${w}" height="${bottomH}" fill="#ffffff"/>
  <text x="${s(12)}" y="${h - bottomH * 0.33}" font-family="Arial" font-weight="700" font-size="${portrait ? s(19) : s(13)}" fill="#188038">12 min</text>
  <text x="${portrait ? s(100) : s(72)}" y="${h - bottomH * 0.33}" font-family="Arial" font-size="${portrait ? s(13) : s(10)}" fill="#5f6368">4.8 km · 10:42 ETA</text>
</svg>`;
}

// Cluster screen in products/cluster1.webp (1200×900): x 444–773, y 388–577.
const SCREEN = { left: 444, top: 388, width: 330, height: 190 };
{
  const map = await sharp(Buffer.from(mapSvg(SCREEN.width * 4, SCREEN.height * 4))).resize(SCREEN.width, SCREEN.height).png().toBuffer();
  const base = await sharp(src('products/cluster1.webp')).composite([{ input: map, left: SCREEN.left, top: SCREEN.top }]).toBuffer();
  await sharp(base).jpeg({ quality: 90 }).toFile(out('cluster-maps.jpg'));
  await clusterCutout(base, 'j-cluster-maps.png');
  // Tight crop of the cluster (with maps) for close-ups
  await sharp(base).extract({ left: 300, top: 240, width: 620, height: 470 }).jpeg({ quality: 90 }).toFile(out('cluster-maps-crop.jpg'));
  await sharp(src('products/cluster1.webp')).extract({ left: 300, top: 240, width: 620, height: 470 }).jpeg({ quality: 90 }).toFile(out('cluster-crop.jpg'));
}

// Phone mirroring the same navigation (portrait)
{
  const W = 300, H = 620, pad = 14, r = 42;
  const sw = W - pad * 2, sh = H - pad * 2;
  const screen = await sharp(Buffer.from(mapSvg(sw * 3, sh * 3, { portrait: true }))).resize(sw, sh).png().toBuffer();
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}"><rect width="${sw}" height="${sh}" rx="${r - pad}" fill="#fff"/></svg>`);
  const roundedScreen = await sharp(screen).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  const body = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" rx="${r}" fill="#111111"/>
    <rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="${r - 2}" fill="none" stroke="#3a3a3a" stroke-width="2"/></svg>`);
  const notch = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect x="${W / 2 - 45}" y="${pad + 8}" width="90" height="22" rx="11" fill="#111111"/></svg>`);
  await sharp(body).composite([{ input: roundedScreen, left: pad, top: pad }, { input: notch, left: 0, top: 0 }]).png().toFile(out('phone-maps.png'));
}

// ─── Icons (Feather set, same family as the website) ──────────────────
const ICONS = [
  'FiMonitor', 'FiCpu', 'FiZap', 'FiShield', 'FiSettings', 'FiThermometer', 'FiWifi', 'FiCloud', 'FiLock',
  'FiActivity', 'FiSmartphone', 'FiMapPin', 'FiNavigation', 'FiBluetooth', 'FiRadio', 'FiTruck', 'FiLayers',
  'FiAward', 'FiCheckCircle', 'FiGlobe', 'FiUsers', 'FiPackage', 'FiTool', 'FiBox', 'FiTrendingUp', 'FiHeart',
  'FiCreditCard', 'FiServer', 'FiDatabase', 'FiMail', 'FiPhone', 'FiTarget', 'FiEye', 'FiCode', 'FiGrid',
  'FiRefreshCw', 'FiCast', 'FiSliders', 'FiCalendar', 'FiUserPlus', 'FiShare2', 'FiFeather', 'FiAlertTriangle', 'FiBattery', 'FiSun', 'FiClock', 'FiHome', 'FiMaximize', 'FiAperture', 'FiLink',
];
for (const name of ICONS) {
  for (const [suffix, color] of [['dark', '#111111'], ['light', '#ffffff']]) {
    const svg = renderToStaticMarkup(React.createElement(Fi[name], { size: 256, color, strokeWidth: 1.8 }));
    await sharp(Buffer.from(svg)).resize(256, 256).png().toFile(out(`icons/${name}-${suffix}.png`));
  }
}

// Products section opener: one tile per product line (2 columns × 3 rows), each product whole
{
  const tiles = ['j-walklab.png', 'j-bp.png', 'j-fintech.png', 'j-cluster-maps.png', 'j-tracker-h.png', 'j-lock.png'];
  const T = 620, gap = 40;
  const composite = [];
  for (let i = 0; i < tiles.length; i++) {
    const buf = await sharp(out(tiles[i])).resize(T - 60, T - 60, { fit: 'contain', background: '#ffffff' }).flatten({ background: '#ffffff' }).png().toBuffer();
    composite.push({ input: buf, left: (i % 2) * (T + gap) + 30, top: Math.floor(i / 2) * (T + gap) + 30 });
  }
  await sharp({ create: { width: 2 * T + gap, height: 3 * T + 2 * gap, channels: 3, background: '#ffffff' } })
    .composite(composite).png().toFile(out('j-products-grid.png'));
}

// Cluster TMS dashboard mock-ups
await renderDashboards(out);

// Infrastructure grid: real factory photos with a modern monochrome tech treatment
const HUD = [['real-line.jpg', 'Production line'], ['real-smt.jpg', 'SMT line'], ['real-rework.jpg', 'Precision rework'],
  ['real-chamber.jpg', 'Environmental testing'], ['real-test-station.jpg', 'Functional testing'], ['real-packing.jpg', 'Packing & dispatch']];
for (let i = 0; i < HUD.length; i++) {
  await hudPhoto(out(HUD[i][0]), out(`hud-${i + 1}.jpg`), { index: String(i + 1).padStart(2, '0'), caption: HUD[i][1] });
}

// Products opener: our products orbiting the Walnut mark
await productOrbit([
  { file: out('j-cluster-maps.png'), label: 'Smart cluster' }, { file: out('j-tracker-h.png'), label: 'GPS tracker' },
  { file: out('j-gps.png'), label: 'GPS gateway' }, { file: out('j-lock.png'), label: 'Smart lock' },
  { file: out('j-fintech.png'), label: 'Soundbox' }, { file: out('j-bp.png'), label: 'BP monitor' },
  { file: out('j-walklab.png'), label: 'WalkLab' }, { file: out('j-thermo.png'), label: 'Thermometer' },
], out('wm-white.png'), out('products-orbit.png'));

console.log(`Assets written to ${OUT}`);
