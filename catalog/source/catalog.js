// Builds the A4 portrait product catalog book:
//   ../Walnut-Product-Catalog-2026.pptx  (export.ps1 makes the PDF)
// 32 pages (a multiple of 4, so it prints as a saddle-stitched booklet).
// Uses the same assets as build.js — run `node prepare-assets.mjs` first.
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const sharp = require('sharp');
const pptxgen = require('pptxgenjs');

process.env.NODE_PATH = [path.join(__dirname, 'node_modules'), process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
require('node:module').Module._initPaths();
const SKILL = process.env.PPTX_SKILL_DIR
  || path.join(os.homedir(), '.claude/skills/synced/7974b839-142d-4fdf-91ef-5fa755812d33_fc10a1c9-e99b-4824-9b38-7fff786407b0/pptx');
const { applyTheme } = require(path.join(SKILL, 'scripts/apply_theme.js'));

const ASSETS = path.join(__dirname, 'assets');
const CACHE = path.join(ASSETS, 'cache-catalog');
const A = (f) => path.join(ASSETS, f);

const THEME = {
  name: 'Walnut Monochrome',
  headFontFace: 'Arial',
  bodyFontFace: 'Arial',
  colors: {
    dk1: '111111', lt1: 'FFFFFF', dk2: '5E5E5E', lt2: 'F2F2F2',
    accent1: '111111', accent2: '1E1E1E', accent3: 'A6A6A6', accent4: 'D9D9D9',
    accent5: '3A3A3A', accent6: '8C8C8C', hlink: '111111', folHlink: '5E5E5E',
  },
};

// A4 portrait, inches
const W = 8.27, H = 11.69, M = 0.6, CW = W - 2 * M;
const TOP = 1.65; // content starts below the page title
const FOOT = 11.05;

// ─── Image helpers ────────────────────────────────────────────────────
let cacheId = 0;
async function fitImage(file, w, h, fit = 'cover', position = 'centre', bg = '#ffffff') {
  const pxW = Math.round(w * 240), pxH = Math.round(h * 240);
  const ext = file.endsWith('.png') && fit !== 'contain' ? 'png' : 'jpg';
  const dest = path.join(CACHE, `${path.basename(file, path.extname(file))}-${pxW}x${pxH}-${cacheId++}.${ext}`);
  let img = sharp(A(file)).resize(pxW, pxH, { fit, position, background: bg }).flatten({ background: bg });
  img = ext === 'png' ? img.png() : img.jpeg({ quality: 88 });
  await img.toFile(dest);
  return dest;
}
const ratio = async (file) => {
  const m = await sharp(A(file)).metadata();
  return m.width / m.height;
};

// ─── Deck, layouts and building blocks ────────────────────────────────
const pres = new pptxgen();
pres.defineLayout({ name: 'A4_PORTRAIT', width: W, height: H });
pres.layout = 'A4_PORTRAIT';
pres.author = 'Walnut Technologies Pvt. Ltd.';
pres.company = 'Walnut Technologies Pvt. Ltd.';
pres.title = 'Walnut Technologies — Product Catalog 2026';
pres.subject = 'Medical, neuro-rehabilitation, fintech, automotive and IoT products';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

async function defineLayouts() {
  const logoR = await ratio('logo-walnut.png');
  pres.defineSlideMaster({ title: 'Cover', background: { color: '111111' }, objects: [] });
  pres.defineSlideMaster({ title: 'Section', background: { color: '111111' }, objects: [] });
  pres.defineSlideMaster({
    title: 'Page',
    background: { color: 'FFFFFF' },
    objects: [
      { image: { path: A('wm-ink.png'), x: 4.6, y: 9.55, w: 3.9, h: 1.46, transparency: 95 } },
      { line: { x: M, y: FOOT - 0.12, w: CW, h: 0, line: { color: 'D9D9D9', width: 0.75 } } },
      { image: { path: A('logo-walnut.png'), x: M, y: FOOT, w: 0.26 * logoR, h: 0.26 } },
      { text: { text: 'walnutmedical.in', options: { x: 4.0, y: FOOT + 0.02, w: 3.05, h: 0.25, fontSize: 8, color: C.text2, align: 'right', margin: 0 } } },
      {
        placeholder: {
          options: { name: 'title', type: 'title', x: M, y: 0.72, w: CW, h: 0.65, fontSize: 26, bold: true, color: C.text1, align: 'left', valign: 'top', margin: 0 },
          text: '',
        },
      },
    ],
    slideNumber: { x: W - M - 0.45, y: FOOT + 0.02, w: 0.45, h: 0.25, fontSize: 8, color: C.text1, align: 'right', margin: 0 },
  });
}

let section = '';
let pageNo = 0;
const sectionStarts = [];
function newPage(master, sectionTitle) {
  if (sectionTitle && sectionTitle !== section) {
    section = sectionTitle;
    pres.addSection({ title: sectionTitle });
  }
  pageNo++;
  return pres.addSlide({ masterName: master, sectionTitle: section });
}

const text = (s, t, o) => s.addText(t, { isTextBox: true, margin: 0, valign: 'top', color: C.text1, fontSize: 10.5, ...o });
const card = (s, x, y, w, h, { fill = C.background2, line } = {}) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: line ? { color: line, width: 0.75 } : { type: 'none' },
});
async function photo(s, file, x, y, w, h, { fit = 'cover', position = 'centre', alt = '', bg = '#ffffff' } = {}) {
  s.addImage({ path: await fitImage(file, w, h, fit, position, bg), x, y, w, h, altText: alt });
}
function icon(s, name, x, y, size, { light = false } = {}) {
  s.addShape(pres.shapes.OVAL, { x, y, w: size, h: size, fill: { color: light ? 'FFFFFF' : '111111' }, line: { type: 'none' } });
  const pad = size * 0.27;
  s.addImage({ path: A(`icons/${name}-${light ? 'dark' : 'light'}.png`), x: x + pad, y: y + pad, w: size - 2 * pad, h: size - 2 * pad, altText: '' });
}
function chips(s, labels, x, y, { maxW = CW, light = false, size = 8.5 } = {}) {
  let cx = x, cy = y;
  for (const label of labels) {
    const w = 0.26 + label.length * size * 0.0083;
    if (cx + w > x + maxW) { cx = x; cy += 0.36; }
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cx, y: cy, w, h: 0.28, rectRadius: 0.14,
      fill: { color: light ? '1E1E1E' : 'FFFFFF' }, line: { color: light ? '3A3A3A' : '111111', width: 0.75 },
    });
    text(s, label, { x: cx, y: cy, w, h: 0.28, fontSize: size, bold: true, align: 'center', valign: 'middle', color: light ? C.background1 : C.text1 });
    cx += w + 0.1;
  }
  return cy + 0.28;
}
function page(sectionTitle, eyebrow, title) {
  const s = newPage('Page', sectionTitle);
  text(s, eyebrow.toUpperCase(), { x: M, y: 0.42, w: CW, h: 0.22, fontSize: 8, bold: true, charSpacing: 3, color: C.text2 });
  s.addText(title, { placeholder: 'title' });
  return s;
}
// Two-column checklist of features
function features(s, items, x, y, w, { cols = 2, rowH = 0.32, size = 9.5 } = {}) {
  const cw = w / cols;
  items.forEach((label, i) => {
    const cx = x + (i % cols) * cw, cy = y + Math.floor(i / cols) * rowH;
    s.addImage({ path: A('icons/FiCheckCircle-dark.png'), x: cx, y: cy + 0.02, w: 0.16, h: 0.16, altText: '' });
    text(s, label, { x: cx + 0.24, y: cy, w: cw - 0.3, h: rowH, fontSize: size });
  });
  return y + Math.ceil(items.length / cols) * rowH;
}
// Row of big figures
function stats(s, list, x, y, w, { light = false } = {}) {
  const cw = w / list.length;
  list.forEach(([value, label], i) => {
    text(s, value, { x: x + i * cw, y, w: cw - 0.15, h: 0.45, fontSize: 20, bold: true, color: light ? C.background1 : C.text1 });
    text(s, label, { x: x + i * cw, y: y + 0.47, w: cw - 0.15, h: 0.35, fontSize: 8.5, color: light ? C.accent3 : C.text2 });
  });
}
function label(s, t, x, y, w = CW) {
  text(s, t.toUpperCase(), { x, y, w, h: 0.22, fontSize: 8, bold: true, charSpacing: 2, color: C.text2 });
}

// Full-page product spread: big contained product image, then copy
async function productPage(sec, eyebrow, p) {
  const s = page(sec, eyebrow, p.name);
  card(s, M, TOP, CW, 4.3, { fill: C.background1, line: 'D9D9D9' });
  await photo(s, p.image, M + 0.3, TOP + 0.25, CW - 0.6, 3.8, { fit: 'contain', alt: p.name });
  let y = TOP + 4.55;
  text(s, p.sub, { x: M, y, w: CW, h: 0.3, fontSize: 13, bold: true });
  y += 0.4;
  text(s, p.desc, { x: M, y, w: CW, h: 1.25, fontSize: 10.5, color: C.text2, lineSpacingMultiple: 1.15 });
  y += 1.35;
  if (p.stats) { stats(s, p.stats, M, y, CW); y += 0.95; }
  label(s, 'Key features', M, y); y += 0.32;
  y = features(s, p.features, M, y, CW) + 0.2;
  if (p.chips) chips(s, p.chips, M, Math.min(y, FOOT - 0.55));
  return s;
}

// Half-page product block (two per page)
async function productHalf(s, y, p) {
  const h = 4.45, iw = 2.95;
  card(s, M, y, iw, iw, { fill: C.background1, line: 'D9D9D9' });
  await photo(s, p.image, M + 0.18, y + 0.18, iw - 0.36, iw - 0.36, { fit: 'contain', alt: p.name });
  const tx = M + iw + 0.35, tw = CW - iw - 0.35;
  text(s, p.name, { x: tx, y, w: tw, h: 0.38, fontSize: 16, bold: true });
  text(s, p.sub, { x: tx, y: y + 0.42, w: tw, h: 0.28, fontSize: 10.5, bold: true, color: C.text2 });
  text(s, p.desc, { x: tx, y: y + 0.8, w: tw, h: 1.3, fontSize: 9.5, color: C.text2, lineSpacingMultiple: 1.1 });
  let fy = y + 2.15;
  if (p.stats) { stats(s, p.stats, tx, fy, tw); fy += 0.95; }
  features(s, p.features, tx, fy, tw, { cols: 1, rowH: 0.28, size: 9 });
  return y + h;
}

// Black section opener with a product shown whole on a white panel
async function sectionPage(sec, num, title, intro, image, bullets) {
  const s = newPage('Section', sec);
  sectionStarts.push([num, title, pageNo]);
  const logoR = await ratio('logo-walnut-white.png');
  s.addImage({ path: A('logo-walnut-white.png'), x: M, y: 0.55, w: 0.32 * logoR, h: 0.32, altText: 'Walnut Technologies' });
  text(s, num, { x: M, y: 1.35, w: 3, h: 1.0, fontSize: 64, bold: true, color: C.accent5 });
  text(s, title, { x: M, y: 2.45, w: CW, h: 0.8, fontSize: 32, bold: true, color: C.background1 });
  text(s, intro, { x: M, y: 3.35, w: CW - 0.6, h: 1.0, fontSize: 12, color: C.accent3, lineSpacingMultiple: 1.15 });
  if (bullets) chips(s, bullets, M, 4.45, { light: true });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.3, w: W, h: H - 5.3, fill: { color: 'FFFFFF' }, line: { type: 'none' } });
  await photo(s, image, M, 5.75, CW, 5.35, { fit: 'contain', alt: title });
  return s;
}

// ─── Pages ────────────────────────────────────────────────────────────
async function frontCover() {
  const s = newPage('Cover', 'Cover');
  const logoR = await ratio('logo-walnut-white.png');
  s.addImage({ path: A('logo-walnut-white.png'), x: M, y: 0.6, w: 0.42 * logoR, h: 0.42, altText: 'Walnut Technologies' });
  text(s, 'PRODUCT CATALOG 2026', { x: M, y: 1.75, w: CW, h: 0.3, fontSize: 11, bold: true, charSpacing: 4, color: C.accent3 });
  text(s, 'Intelligent Embedded Systems, Engineered for a Connected World', { x: M, y: 2.15, w: CW - 0.3, h: 1.9, fontSize: 30, bold: true, color: C.background1 });
  text(s, 'Medical  ·  Neuro-rehabilitation  ·  Fintech  ·  Automotive  ·  IoT', { x: M, y: 4.2, w: CW, h: 0.3, fontSize: 11, color: C.accent3 });
  await photo(s, 'building.jpg', 0, 5.0, W, H - 5.0 - 0.9, { alt: 'Walnut Technologies building' });
  text(s, 'Walnut Technologies Pvt. Ltd.  ·  Mohali, India  ·  walnutmedical.in', { x: M, y: H - 0.62, w: CW, h: 0.25, fontSize: 8.5, color: C.accent3 });
}

function contentsPage() {
  const s = page('Introduction', 'Contents', 'Inside this catalog');
  text(s, 'Walnut Medical & Walnut Technologies design and manufacture electronics end to end — from idea and PCB design to SMT, assembly, testing and dispatch. This catalog introduces the company and every product line we build.', { x: M, y: TOP, w: CW, h: 0.9, fontSize: 11, color: C.text2, lineSpacingMultiple: 1.15 });
  return s; // entries are filled in once all page numbers are known
}
function fillContents(s, entries) {
  let y = TOP + 1.05;
  for (const [num, title, p, sub] of entries) {
    s.addShape(pres.shapes.LINE, { x: M, y, w: CW, h: 0, line: { color: 'D9D9D9', width: 0.75 } });
    text(s, num, { x: M, y: y + 0.18, w: 0.7, h: 0.4, fontSize: 18, bold: true, color: C.accent3 });
    text(s, title, { x: M + 0.8, y: y + 0.16, w: CW - 1.6, h: 0.32, fontSize: 14, bold: true });
    text(s, sub, { x: M + 0.8, y: y + 0.5, w: CW - 1.6, h: 0.3, fontSize: 9, color: C.text2 });
    text(s, String(p).padStart(2, '0'), { x: W - M - 0.7, y: y + 0.18, w: 0.7, h: 0.4, fontSize: 18, bold: true, align: 'right' });
    y += 0.8;
  }
}

async function aboutPage() {
  const s = page('Company', '01 · About Walnut', 'Who we are');
  text(s, [
    { text: 'Walnut Medical & Walnut Technologies', options: { bold: true, color: C.text1 } },
    { text: ' is a multi-vertical original design and equipment manufacturer (ODM/OEM). Established in 2016, we have grown from a small electronics workshop into a vertically integrated design and manufacturing partner for medical devices, neuro-rehabilitation robotics, payment devices, IoT and automotive electronics.' },
  ], { x: M, y: TOP, w: CW, h: 1.2, fontSize: 11.5, color: C.text2, lineSpacingMultiple: 1.15 });
  const pw = (CW - 0.2) / 2;
  await photo(s, 'real-line.jpg', M, TOP + 1.35, pw, 3.9, { alt: 'Walnut assembly line' });
  await photo(s, 'real-rework.jpg', M + pw + 0.2, TOP + 1.35, pw, 3.9, { alt: 'Microscope soldering and rework' });
  let y = TOP + 5.5;
  const rows = [
    ['FiMapPin', 'Production units', 'Mohali (Punjab) · AMTZ, Visakhapatnam (Andhra Pradesh) · Dhanana (Upcoming in Haryana)'],
    ['FiLayers', 'Fully in-house', 'Electronics & firmware design, mould design, SMT, testing, quality and dispatch'],
    ['FiAward', 'Certified quality', 'ISO 13485 · controlled environment · CE · FCC · BIS'],
  ];
  for (const [ic, t, b] of rows) {
    icon(s, ic, M, y, 0.38);
    text(s, t, { x: M + 0.55, y: y - 0.02, w: CW - 0.6, h: 0.26, fontSize: 11, bold: true });
    text(s, b, { x: M + 0.55, y: y + 0.25, w: CW - 0.6, h: 0.3, fontSize: 9.5, color: C.text2 });
    y += 0.72;
  }
}

async function glancePage() {
  const s = page('Company', '01 · About Walnut', 'Walnut at a glance');
  s.addShape(pres.shapes.RECTANGLE, { x: M, y: TOP, w: CW, h: 3.0, fill: { color: '111111' }, line: { type: 'none' } });
  const list = [['10+', 'Years of excellence'], ['600+', 'Engineers & technicians'], ['10+', 'Countries served'],
    ['500K+', 'Units / month'], ['150,000', 'Sq. ft facility'], ['4', 'SMT lines']];
  list.forEach(([v, l], i) => {
    const x = M + 0.35 + (i % 3) * ((CW - 0.7) / 3), y = TOP + 0.35 + Math.floor(i / 3) * 1.3;
    text(s, v, { x, y, w: 2.1, h: 0.6, fontSize: 30, bold: true, color: C.background1 });
    text(s, l, { x, y: y + 0.62, w: 2.1, h: 0.3, fontSize: 9.5, color: C.accent3 });
  });
  let y = TOP + 3.35;
  const half = (CW - 0.25) / 2;
  [['FiTarget', 'Mission', 'Deliver world-class original design manufacturing for electronics across healthcare, finance and technology — globally.'],
    ['FiEye', 'Vision', 'The most trusted ODM partner for mission-critical electronics, ISO 13485 certified, serving 50+ countries by 2030.']]
    .forEach(([ic, t, b], i) => {
      const x = M + i * (half + 0.25);
      card(s, x, y, half, 1.7);
      icon(s, ic, x + 0.25, y + 0.25, 0.4);
      text(s, t, { x: x + 0.8, y: y + 0.28, w: half - 1, h: 0.3, fontSize: 13, bold: true });
      text(s, b, { x: x + 0.25, y: y + 0.8, w: half - 0.5, h: 0.85, fontSize: 9.5, color: C.text2 });
    });
  y += 2.0;
  label(s, 'Our values', M, y); y += 0.32;
  const values = [
    ['FiAward', 'Quality first', 'ISO 13485 and ISO 9001 certified processes with a controlled environment.'],
    ['FiZap', 'Innovation', '600+ engineers pushing boundaries in medical, payment and custom electronics.'],
    ['FiGlobe', 'Global reach', 'Serving 10+ countries with end-to-end manufacturing and logistics.'],
    ['FiLayers', 'Vertical integration', 'From PCB design to final assembly — complete in-house capabilities.'],
  ];
  values.forEach(([ic, t, b], i) => {
    const x = M + (i % 2) * (half + 0.25), yy = y + Math.floor(i / 2) * 1.0;
    icon(s, ic, x, yy, 0.36);
    text(s, t, { x: x + 0.5, y: yy - 0.02, w: half - 0.55, h: 0.26, fontSize: 11, bold: true });
    text(s, b, { x: x + 0.5, y: yy + 0.26, w: half - 0.55, h: 0.6, fontSize: 9, color: C.text2 });
  });
}

async function journeyPage() {
  const s = page('Company', '02 · Journey 2016 – 2026', 'Our journey');
  const items = [
    ['2016', 'Walnut Medical founded', 'Started with a vision to make quality healthcare more accessible.', 'j-logo-medical.png'],
    ['2017', 'Robotics & neuro-rehab', 'Walkex functional therapy and the WalkLab gait-training robot.', 'j-walklab.png'],
    ['2019', 'Medical devices', 'IR thermometer and digital BP monitor, then nebulizers and oxygen concentrators.', 'j-thermo.png'],
    ['2021', 'Walnut Technologies', 'Engineering expands beyond healthcare into electronics for every industry.', 'j-logo-tech.png'],
    ['2022', 'Fintech · soundbox', 'Smart payment soundboxes and POS devices, in mass production from 2023.', 'j-fintech.png'],
    ['2025', 'Smart clusters', '5″ and 7″ smart instrument clusters for 2-wheelers, tractors and vehicles.', 'j-cluster.png'],
    ['2026', 'GPS tracker & IoT', 'GPS tracker & gateway and a growing range of connected IoT devices.', 'j-gps.png'],
  ];
  // Vertical timeline: line down the middle-left, image tile + year + text per milestone
  const rowH = 1.28, y0 = TOP + 0.05, lineX = M + 2.05;
  s.addShape(pres.shapes.LINE, { x: lineX, y: y0 + 0.5, w: 0, h: rowH * (items.length - 1), line: { color: '111111', width: 1.5 } });
  for (let i = 0; i < items.length; i++) {
    const [year, title, body, image] = items[i];
    const y = y0 + i * rowH;
    const last = i === items.length - 1;
    card(s, M, y, 1.7, 1.05, { fill: C.background1, line: last ? '111111' : 'D9D9D9' });
    await photo(s, image, M + 0.1, y + 0.08, 1.5, 0.89, { fit: 'contain', alt: title });
    s.addShape(pres.shapes.OVAL, { x: lineX - 0.11, y: y + 0.41, w: 0.22, h: 0.22, fill: { color: last ? 'FFFFFF' : '111111' }, line: { color: '111111', width: last ? 2 : 1 } });
    text(s, year, { x: lineX + 0.3, y: y + 0.12, w: 1.0, h: 0.45, fontSize: 22, bold: true });
    text(s, title, { x: lineX + 1.35, y: y + 0.14, w: CW - (lineX - M) - 1.4, h: 0.3, fontSize: 12, bold: true });
    text(s, body, { x: lineX + 1.35, y: y + 0.45, w: CW - (lineX - M) - 1.4, h: 0.55, fontSize: 9.5, color: C.text2 });
  }
}

async function leadershipPage() {
  const s = page('Company', '01 · About Walnut', 'Leadership');
  await photo(s, 'team.jpg', M, TOP, CW, 4.1, { alt: 'Walnut engineering team at work' });
  let y = TOP + 4.4;
  for (const [ini, name, role, bio] of [
    ['SD', 'Siddharth Dhawan', 'Director & CEO', 'Spent 10 years at National Instruments Corp. in the USA and India, working in high-tech embedded and control systems and managing the business in India.'],
    ['AB', 'Amol Bhardwaj', 'Director & CTO', 'Leads medical device development; launched devices across diagnostics, therapeutics and robotics — EEG, ECG, rTMS and gait training robots. Expert in QC tools, SPC, APQP, PPAP, Six Sigma, Cpk and 5S; Management Representative for ISO 13485 and CE audits (2009–2014).'],
  ]) {
    card(s, M, y, CW, 2.2);
    s.addShape(pres.shapes.OVAL, { x: M + 0.3, y: y + 0.3, w: 0.85, h: 0.85, fill: { color: '111111' }, line: { type: 'none' } });
    text(s, ini, { x: M + 0.3, y: y + 0.3, w: 0.85, h: 0.85, fontSize: 18, bold: true, color: C.background1, align: 'center', valign: 'middle' });
    text(s, name, { x: M + 1.4, y: y + 0.32, w: CW - 1.7, h: 0.32, fontSize: 15, bold: true });
    text(s, role, { x: M + 1.4, y: y + 0.66, w: CW - 1.7, h: 0.25, fontSize: 10, color: C.text2 });
    text(s, bio, { x: M + 1.4, y: y + 1.0, w: CW - 1.7, h: 1.1, fontSize: 9.5 });
    y += 2.4;
  }
}

async function infrastructurePage() {
  const s = page('Company', '03 · Infrastructure', 'Manufacturing infrastructure');
  const gap = 0.15, gw = (CW - 2 * gap) / 3, gh = 2.35;
  const shots = [['real-line.jpg', 'Assembly line'], ['real-test-station.jpg', 'Functional test stations'], ['real-rework.jpg', 'Microscope rework'],
    ['real-chamber.jpg', 'Environmental test chamber'], ['real-press.jpg', 'Assembly press'], ['real-packing.jpg', 'Packing & weighing']];
  for (let i = 0; i < shots.length; i++) {
    await photo(s, shots[i][0], M + (i % 3) * (gw + gap), TOP + Math.floor(i / 3) * (gh + gap), gw, gh, { alt: shots[i][1] });
  }
  let y = TOP + 2 * gh + gap + 0.35;
  const rows = [
    ['FiHome', '150,000 sq. ft facility', 'Mohali · AMTZ Visakhapatnam · Dhanana (Upcoming in Haryana)'],
    ['FiCpu', '4 SMT production lines', 'Fully automatic SMT — JUKI RS-1, 100,000 CPH'],
    ['FiActivity', 'In-house test & calibration', 'Keysight · National Instruments · Rigol · Tektronix'],
    ['FiLayers', 'PCB design to production', 'Design, validation, prototyping, pilot lots, full scale'],
    ['FiCheckCircle', 'IQC · LQC · OQC quality teams', 'controlled environment for controlled builds'],
    ['FiBox', 'Moulds & injection moulding', 'Mass-production mould design and plastics in-house'],
  ];
  const half = (CW - 0.25) / 2;
  rows.forEach(([ic, t, b], i) => {
    const x = M + (i % 2) * (half + 0.25), yy = y + Math.floor(i / 2) * 0.82;
    icon(s, ic, x, yy, 0.36);
    text(s, t, { x: x + 0.5, y: yy - 0.02, w: half - 0.55, h: 0.26, fontSize: 10.5, bold: true });
    text(s, b, { x: x + 0.5, y: yy + 0.25, w: half - 0.55, h: 0.45, fontSize: 9, color: C.text2 });
  });
}

async function processPage() {
  const s = page('Company', '03 · How we work', 'End-to-end production process');
  const steps = [['Idea & Requirement', 'Clear direction'], ['Research & Market Analysis', 'Right opportunity'],
    ['Design & Engineering', 'Optimized design'], ['Prototype Development', 'Working prototype'],
    ['Validation & Testing', 'Validated performance'], ['Manufacturing Engineering', 'Production ready'],
    ['Quality Assurance', 'Zero-defect mindset'], ['Packaging & Dispatch', 'Safe, on-time delivery'],
    ['After-Sales Support', 'Reliable support'], ['Continuous Improvement', 'Better every day']];
  const cw = (CW - 0.25) / 2, rh = 1.82;
  for (let i = 0; i < steps.length; i++) {
    const x = M + (i % 2) * (cw + 0.25), y = TOP + Math.floor(i / 2) * rh;
    await photo(s, `step-${String(i + 1).padStart(2, '0')}.jpg`, x, y, 1.75, 1.5, { alt: steps[i][0] });
    text(s, String(i + 1).padStart(2, '0'), { x: x + 1.95, y: y + 0.15, w: 0.6, h: 0.4, fontSize: 18, bold: true, color: C.accent3 });
    text(s, steps[i][0], { x: x + 1.95, y: y + 0.6, w: cw - 2, h: 0.5, fontSize: 11.5, bold: true });
    text(s, steps[i][1], { x: x + 1.95, y: y + 1.1, w: cw - 2, h: 0.3, fontSize: 9.5, color: C.text2 });
  }
}

async function qualityPage() {
  const s = page('Company', '03 · Quality', 'Quality & certifications');
  await photo(s, 'real-chamber.jpg', M, TOP, 2.9, 4.0, { alt: 'Environmental test chamber' });
  text(s, 'Quality is built into every stage — incoming, in-line and outgoing inspection, environmental and functional testing, and full traceability from component to customer.', { x: M + 3.15, y: TOP, w: CW - 3.15, h: 1.3, fontSize: 11, color: C.text2, lineSpacingMultiple: 1.15 });
  features(s, ['Incoming inspection (IQC)', 'In-process inspection (LQC)', 'Final quality check (OQC)', 'Reliability & environmental testing', 'Traceability'], M + 3.15, TOP + 1.45, CW - 3.15, { cols: 1, rowH: 0.36, size: 10 });
  const certs = [['ISO', 'ISO 13485', 'Quality management for medical devices'], ['10K', 'controlled environment', 'Controlled manufacturing environment'],
    ['CE', 'CE · FCC · PCI-DSS', 'European, US & payment-security standards'], ['IEC', 'IEC 60601', 'Medical electrical equipment safety'],
    ['BIS', 'BIS certified', 'Bureau of Indian Standards'], ['ISO', 'ISO 9001', 'Quality management systems']];
  const cw = (CW - 0.25) / 2;
  certs.forEach(([code, t, b], i) => {
    const x = M + (i % 2) * (cw + 0.25), y = TOP + 4.3 + Math.floor(i / 2) * 1.05;
    card(s, x, y, cw, 0.88);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.18, y: y + 0.17, w: 0.55, h: 0.55, rectRadius: 0.06, fill: { color: '111111' }, line: { type: 'none' } });
    text(s, code, { x: x + 0.18, y: y + 0.17, w: 0.55, h: 0.55, fontSize: 10, bold: true, color: C.background1, align: 'center', valign: 'middle' });
    text(s, t, { x: x + 0.9, y: y + 0.17, w: cw - 1.05, h: 0.26, fontSize: 11, bold: true });
    text(s, b, { x: x + 0.9, y: y + 0.45, w: cw - 1.05, h: 0.35, fontSize: 8.5, color: C.text2 });
  });
  text(s, [{ text: 'Compliances: ', options: { bold: true } }, { text: 'ISO 13485, ISO 80601-2-69, IEC 60601-1, IEC 60601-1-2 (NABL-accredited labs), CE, FCC, RoHS' }],
    { x: M, y: TOP + 7.55, w: CW, h: 0.5, fontSize: 9 });
}

// ── Products ──
async function medicalPages() {
  await sectionPage('Medical', '04', 'Medical devices', 'CDSCO-approved Class B and Class C medical devices, designed and manufactured under ISO 13485 in a controlled environment.', 'j-medical-range.png', ['CDSCO approved', 'ISO 13485', 'IEC 60601', 'controlled environment']);
  await productPage('Medical', '04 · Medical devices', {
    name: 'Digital Blood Pressure Monitor', image: 'j-bp.png', sub: 'Clinical-grade precision',
    desc: 'Precision blood pressure monitoring device with advanced cuff technology and a digital display for accurate clinical readings. Memory storage for multiple readings and an easy-to-use interface. A gold-standard electronic BP monitor is in development with ICMR funding and clinical trials at AIIMS Nagpur, AIIMS Delhi and Chettinad Super Speciality Hospital.',
    features: ['Clinical grade accuracy', 'Large digital display', 'Memory storage', 'NABL certified', 'Systolic, diastolic & pulse', 'Simple one-touch operation'],
    chips: ['CDSCO approved', 'ISO 13485'],
  });
  const s = page('Medical', '04 · Medical devices', 'Respiratory & diagnostics');
  let y = TOP;
  y = await productHalf(s, y, {
    name: 'IR Thermometer', image: 'j-thermo.png', sub: 'ThermoSure · non-contact temperature measurement',
    desc: 'Fast, hygienic temperature measurement with infrared technology. Ideal for clinical screening and home use — instant readings without physical contact.',
    features: ['Non-contact', 'Instant reading', 'Hygienic', 'Battery operated'],
  }) + 0.15;
  s.addShape(pres.shapes.LINE, { x: M, y: y - 0.1, w: CW, h: 0, line: { color: 'D9D9D9', width: 0.75 } });
  await productHalf(s, y + 0.1, {
    name: 'Compressor Nebulizer', image: 'nebulizer.jpg', sub: 'Respiratory therapy',
    desc: 'Efficient compressor nebulizer for respiratory therapy. Compact design with reliable performance for clinical and home settings, delivering medication directly to the lungs.',
    features: ['Efficient nebulization', 'Low noise', 'Compact design', 'Medical grade'],
  });
  await productPage('Medical', '04 · Medical devices', {
    name: 'Oxygen Concentrator', image: 'oxygen.jpg', sub: 'Reliable oxygen therapy',
    desc: 'Reliable oxygen concentrators available in 5 L and 10 L configurations with single and dual flow options, designed for clinical and homecare settings with low-noise operation.',
    stats: [['5 L / 10 L', 'Flow configurations'], ['Single / dual', 'Flow outputs'], ['ISO 13485', 'Manufactured under']],
    features: ['5 L & 10 L flow', 'Single or dual flow', 'Low-noise operation', 'Clinical & homecare use', 'ISO 80601-2-69 compliance', 'Made in a controlled environment'],
  });
}

async function neuroPages() {
  await sectionPage('Neuro-rehab', '05', 'Neuro-rehabilitation', 'Rehabilitation robotics and neuro-stimulation for stroke, traumatic brain injury, spinal cord injury and neurological conditions — with AI-assisted therapy and real-time monitoring.', 'j-neuro-range.png', ['AI-assisted therapy', 'Tele-rehab ready', 'Real-time monitoring']);
  await productPage('Neuro-rehab', '05 · Neuro-rehabilitation', {
    name: 'WalkLab Gait Training System', image: 'walklab-test.jpg', sub: 'Flagship · lower-limb gait training system',
    desc: 'A high-level gait training platform that improves gait outcomes, accelerates recovery and reduces cost of care through intensive, repetitive retraining of normal movement. Sensors track lower-limb kinematics and muscle activation to guide each step with the correct timing and force, with instant audio and visual feedback — for stroke, TBI, spinal cord injury, cerebral palsy, MS, Parkinson\'s and orthopedic conditions.',
    stats: [['150 kg', 'Max patient weight'], ['1.8–4 km/h', 'Treadmill speed'], ['<10 min', 'Therapist setup time']],
    features: ['Neural gait retraining', 'VR multitask training', 'Real-time audio & visual feedback', 'Objective progress per session'],
  });
  const s = page('Neuro-rehab', '05 · Neuro-rehabilitation', 'Early rehabilitation & neuromodulation');
  let y = await productHalf(s, TOP, {
    name: 'Weebo', image: 'tilt-bed.jpg', sub: 'Early rehabilitation robot with FES',
    desc: 'A motorised tilt table with an integrated leg-stepping mechanism. The table rises gradually toward vertical while the legs move in an alternating stepping pattern, maintaining venous return so verticalization can start earlier and be tolerated longer.',
    stats: [['0–90°', 'Tilt range'], ['45°', 'Leg stroke'], ['20–39', 'Steps / min']],
    features: ['Progressive verticalization', 'Alternating stepping motion', 'Maintains venous return', 'Prevents bed-rest complications'],
  });
  s.addShape(pres.shapes.LINE, { x: M, y: y + 0.05, w: CW, h: 0, line: { color: 'D9D9D9', width: 0.75 } });
  await productHalf(s, y + 0.25, {
    name: 'CES — Repose', image: 'repose.jpg', sub: 'Mobile cranial electrotherapy stimulator',
    desc: 'Portable cranial electrotherapy stimulation device from the Walnut Medical neuro-modulation range. Also available in the range: Functional Electrical Stimulation (FES), rTMS and RMNS (right median nerve stimulation).',
    features: ['Portable, mobile unit', 'Multiple programmes & intensity levels', 'Clear control panel', 'Part of the neuromodulation range'],
  });
}

async function fintechPages() {
  await sectionPage('Fintech', '06', 'Fintech & payment devices', 'BIS-approved smart payment soundboxes with multi-language audio confirmation, secure integrations and a complete software ecosystem — in mass production since 2023.', 'fintech-range.jpg', ['BIS approved', 'PCI-DSS', 'NPCI compliant', 'EMV L1/L2']);
  const s1 = page('Fintech', '06 · Fintech', 'Soundbox hardware platform');
  card(s1, M, TOP, CW, 2.3, { fill: C.background1, line: 'D9D9D9' });
  await photo(s1, 'fintech-range.jpg', M + 0.2, TOP + 0.15, CW - 0.4, 2.0, { fit: 'contain', alt: 'Soundbox range' });
  label(s1, 'Platform specifications', M, TOP + 2.55);
  const specs = [
    ['Types', 'Tabletop, pocket, DQR'], ['Connectivity', 'LTE CAT 1 — 4G, 3G, 2G, Bluetooth, Wi-Fi'],
    ['Battery', 'Rechargeable, up to 6000 mAh — lasts about 1 month per charge'], ['Internal memory', '4 MB to 256 MB'],
    ['Audio output', '2–5 W'], ['SIM card', 'Nano / Micro'], ['POS integration', 'API for POS integration'],
    ['Add-on features', 'LCD with backlight, BT, Wi-Fi, FM, solar'], ['Protection', 'Level 4 ESD protection, pin-hole reset'],
    ['Power efficiency', 'PCB consumes 4 mA (vs 20–35 mA typical)'],
  ];
  s1.addTable(specs.map(([k, v]) => [
    { text: k, options: { bold: true, fill: { color: C.background2 } } },
    { text: v },
  ]), { x: M, y: TOP + 2.88, w: CW, colW: [1.9, CW - 1.9], fontSize: 9.5, color: C.text1, border: { type: 'solid', pt: 0.75, color: 'D9D9D9' }, rowH: 0.36, margin: [0.04, 0.1, 0.04, 0.1], valign: 'middle' });
  label(s1, 'Software & services', M, TOP + 6.75);
  const svc = [['FiPackage', 'Finished hardware in your branding'], ['FiServer', 'MQTT broker — low-latency announcements'], ['FiGrid', 'Terminal management system & OTA'],
    ['FiRadio', 'SIM connectivity partners'], ['FiSmartphone', 'Field deployment app (Android & iOS)'], ['FiTrendingUp', '500K+ units / month capacity']];
  const half = (CW - 0.25) / 2;
  svc.forEach(([ic, t], i) => {
    const x = M + (i % 2) * (half + 0.25), y = TOP + 7.1 + Math.floor(i / 2) * 0.55;
    icon(s1, ic, x, y, 0.36);
    text(s1, t, { x: x + 0.5, y, w: half - 0.55, h: 0.36, fontSize: 9.5, bold: true, valign: 'middle' });
  });

  const s2 = page('Fintech', '06 · Fintech', 'Soundbox models');
  const models = [
    ['j-rtos.png', 'RTOS — All-in-one', 'Multiple display options to suit every merchant.', ['3.47″ or 2.8″ LCD, or segment display', '2.4″ merchant display', 'On-device QR generation', 'Built-in keyboard']],
    ['j-dqr.png', 'DQR — Digital QR', 'Compact digital-QR soundbox with a high-contrast LCD.', ['Digital QR display', 'Bright LCD for amount & confirmation', 'Loud, clear audio', 'Plug-and-play deployment']],
    ['j-ldqr.png', 'LDQR — Large display QR', 'Premium soundbox with a large touchscreen customer display.', ['10″ touchscreen', '2.4″ merchant display', 'Keyboard & custom QR', 'NFC tap-and-pay']],
    ['j-fintech.png', 'Payment soundbox', 'Smart payment speaker for every counter.', ['4G / 2G, NB-IoT', 'Bluetooth & Wi-Fi', 'Multi-language audio', 'Long battery life']],
  ];
  const cw = (CW - 0.25) / 2, ch = 4.55;
  for (let i = 0; i < models.length; i++) {
    const [img, name, desc, feats] = models[i];
    const x = M + (i % 2) * (cw + 0.25), y = TOP + Math.floor(i / 2) * (ch + 0.2);
    card(s2, x, y, cw, ch, { fill: C.background1, line: 'D9D9D9' });
    await photo(s2, img, x + 0.25, y + 0.2, cw - 0.5, 1.85, { fit: 'contain', alt: name });
    text(s2, name, { x: x + 0.25, y: y + 2.2, w: cw - 0.5, h: 0.3, fontSize: 12.5, bold: true });
    text(s2, desc, { x: x + 0.25, y: y + 2.55, w: cw - 0.5, h: 0.5, fontSize: 9, color: C.text2 });
    features(s2, feats, x + 0.25, y + 3.12, cw - 0.5, { cols: 1, rowH: 0.33, size: 9 });
  }
}

async function automotivePages() {
  await sectionPage('Automotive', '07', 'Automotive electronics', 'Smart instrument clusters in 5-inch and 7-inch, Android and RTOS based, with 4G, Bluetooth and Wi-Fi — and Google Maps navigation through phone screen mirroring.', 'j-cluster-maps.png', ['5″ & 7″', 'Android · RTOS', '4G · BT · Wi-Fi', 'Phone mirroring']);
  await productPage('Automotive', '07 · Automotive electronics', {
    name: 'Smart Instrument Cluster', image: 'j-cluster.png', sub: 'Digital clusters for 2-wheelers, tractors & farm equipment, LMV & HMV',
    desc: 'Next-generation digital clusters with high-resolution displays, real-time vehicle data and customisable driver interfaces — built for durability and clarity. Real-time processing of speed, RPM, fuel, temperature and diagnostics, with CAN bus support.',
    features: ['High-resolution LCD/TFT, sunlight readable', 'Advanced real-time processing', 'Low power consumption', 'Rugged, industrial-grade build', 'Customisable layouts & themes', 'Operates from −40 °C to +85 °C'],
    chips: ['IATF 16949 ready', 'AEC-Q100', 'EMC tested', 'Vibration tested'],
  });
  // Sizes + configuration
  const s = page('Automotive', '07 · Automotive electronics', 'Choose your size: 5-inch or 7-inch');
  const cardW = (CW - 0.25) / 2, cardH = 3.3, base = TOP + 2.45;
  const r = 620 / 470, big = 3.0, small = big * 5 / 7;
  for (const [i, size, w] of [[0, '5″', small], [1, '7″', big]]) {
    const x = M + i * (cardW + 0.25);
    card(s, x, TOP, cardW, cardH);
    await photo(s, 'cluster-crop.jpg', x + (cardW - w) / 2, base - w / r, w, w / r, { alt: `${size} cluster` });
    text(s, size, { x: x + 0.25, y: base + 0.15, w: 1.0, h: 0.55, fontSize: 28, bold: true });
    text(s, `${size === '5″' ? '5' : '7'}-inch display`, { x: x + 1.2, y: base + 0.22, w: cardW - 1.4, h: 0.28, fontSize: 11, bold: true });
    text(s, 'Smart instrument cluster', { x: x + 1.2, y: base + 0.5, w: cardW - 1.4, h: 0.25, fontSize: 9, color: C.text2 });
  }
  text(s, 'Clusters shown at relative scale.', { x: M, y: TOP + cardH + 0.08, w: CW, h: 0.22, fontSize: 8, color: C.text2 });
  label(s, 'Configuration options', M, TOP + cardH + 0.45);
  const rows = [['Display size', '5-inch  ·  7-inch'], ['Platform', 'RTOS  ·  Android'], ['Connectivity', '4G  ·  Bluetooth  ·  Wi-Fi'],
    ['Navigation', 'Phone screen mirroring — Google Maps on the cluster'], ['Interface', 'Custom layouts, themes and brand integration'],
    ['Vehicle data', 'Real-time speed, RPM, fuel, temperature, diagnostics'], ['Vehicle bus', 'CAN bus support']];
  s.addTable(rows.map(([k, v]) => [{ text: k, options: { bold: true, fill: { color: C.background2 } } }, { text: v }]),
    { x: M, y: TOP + cardH + 0.78, w: CW, colW: [1.9, CW - 1.9], fontSize: 10, color: C.text1, border: { type: 'solid', pt: 0.75, color: 'D9D9D9' }, rowH: 0.42, margin: [0.04, 0.1, 0.04, 0.1], valign: 'middle' });
  text(s, 'Final specifications and combinations are confirmed per project; datasheets on request.', { x: M, y: TOP + cardH + 3.9, w: CW, h: 0.3, fontSize: 8.5, color: C.text2 });

  // Mirroring
  const m = page('Automotive', '07 · Automotive electronics', 'Google Maps on the cluster');
  text(m, 'Phone screen mirroring brings turn-by-turn Google Maps navigation from the rider\'s phone onto the cluster display — directions stay in the line of sight, alongside speed and vehicle data.', { x: M, y: TOP, w: CW, h: 0.8, fontSize: 11, color: C.text2, lineSpacingMultiple: 1.15 });
  const phoneH = 3.3, phoneW = phoneH * 300 / 620;
  m.addImage({ path: A('phone-maps.png'), x: M + 0.2, y: TOP + 1.1, w: phoneW, h: phoneH, altText: 'Phone with Google Maps navigation' });
  icon(m, 'FiCast', M + phoneW + 0.55, TOP + 2.45, 0.6);
  await photo(m, 'j-cluster-maps.png', M + phoneW + 1.4, TOP + 1.25, CW - phoneW - 1.6, 3.1, { fit: 'contain', alt: 'Cluster showing mirrored navigation' });
  let y = TOP + 4.8;
  for (const [ic, t, b] of [
    ['FiNavigation', 'Turn-by-turn on the dash', 'Google Maps navigation from the rider\'s phone appears on the cluster screen.'],
    ['FiEye', 'Eyes stay on the road', 'Directions sit in the driver\'s line of sight — no phone on the handlebar or dashboard.'],
    ['FiSmartphone', 'Works with your phone', 'Pair over the cluster\'s wireless connectivity and start navigating.'],
    ['FiMonitor', 'One screen for everything', 'Navigation, speed and vehicle data together on the cluster display.'],
  ]) {
    icon(m, ic, M, y, 0.42);
    text(m, t, { x: M + 0.6, y: y - 0.02, w: CW - 0.65, h: 0.28, fontSize: 12, bold: true });
    text(m, b, { x: M + 0.6, y: y + 0.28, w: CW - 0.65, h: 0.4, fontSize: 9.5, color: C.text2 });
    y += 0.9;
  }

  // Tractor suite + capabilities
  const t = page('Automotive', '07 · Automotive electronics', 'Agri & off-highway electronics');
  card(t, M, TOP, CW, 2.9, { fill: C.background1, line: 'D9D9D9' });
  await photo(t, 'j-cluster.png', M + 0.3, TOP + 0.25, CW - 0.6, 2.4, { fit: 'contain', alt: 'Smart cluster' });
  text(t, 'Automatic tractor electronics suite: a complete suite of smart, IoT-enabled electronics for agricultural equipment, earth-moving equipment and tractors.', { x: M, y: TOP + 3.15, w: CW, h: 0.7, fontSize: 11, color: C.text2, lineSpacingMultiple: 1.15 });
  features(t, ['Smart instrument clusters (5″ & 7″)', 'Tractor automation electronics', 'GPS tracker & gateway telematics', 'Cloud dashboards, mobile apps, OTA'], M, TOP + 3.95, CW, { cols: 2, rowH: 0.34, size: 10 });
  label(t, 'Automotive engineering capabilities', M, TOP + 4.85);
  const caps = [['Display technology', 'LCD/TFT · anti-glare · sunlight readable'], ['Real-time data', 'CAN bus · diagnostics · instant updates'],
    ['Custom design', 'Custom layouts · brand integration · DFM'], ['Quality', 'IATF 16949 ready · AEC-Q100 · EMC & vibration tested']];
  const cw = (CW - 0.25) / 2;
  caps.forEach(([ti, b], i) => {
    const x = M + (i % 2) * (cw + 0.25), y = TOP + 5.2 + Math.floor(i / 2) * 1.35;
    card(t, x, y, cw, 1.15);
    text(t, String(i + 1).padStart(2, '0'), { x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.35, fontSize: 16, bold: true, color: C.accent3 });
    text(t, ti, { x: x + 0.75, y: y + 0.2, w: cw - 0.9, h: 0.3, fontSize: 11.5, bold: true });
    text(t, b, { x: x + 0.75, y: y + 0.55, w: cw - 0.9, h: 0.5, fontSize: 9, color: C.text2 });
  });
}

async function iotPages() {
  await sectionPage('IoT', '08', 'IoT solutions', 'GPS tracker & gateway, 4G smart lock and the cloud and mobile platform behind them — designed, built and supported in-house.', 'j-gps.png', ['GPS tracking', 'Telemetry', 'Fleet management', 'Cloud & apps']);
  await productPage('IoT', '08 · IoT solutions', {
    name: 'GPS Tracker & Gateway', image: 'j-gps.png', sub: 'Asset tracking & telemetry',
    desc: 'Reliable GPS tracking device and gateway for industrial and logistics applications — real-time tracking, telemetry reporting and fleet management with secure cloud connectivity.',
    features: ['Real-time GPS tracking', 'Telemetry reporting', 'Fleet management', 'Secure cloud gateway', 'Mobile app ready (iOS & Android)', 'Encrypted data transmission'],
    chips: ['Fleet & logistics', 'Asset tracking', 'Industrial', 'Agriculture'],
  });
  const s = page('IoT', '08 · IoT solutions', '4G smart lock & IoT platform');
  card(s, M, TOP, CW, 2.9, { fill: C.background1, line: 'D9D9D9' });
  await photo(s, 'j-lock-range.png', M + 0.3, TOP + 0.2, CW - 0.6, 2.5, { fit: 'contain', alt: '4G smart lock with trackers' });
  text(s, '4G Smart Lock', { x: M, y: TOP + 3.15, w: CW, h: 0.35, fontSize: 16, bold: true });
  text(s, 'Connected smart lock for logistics, assets and infrastructure — remote access control, real-time monitoring and cloud management from anywhere.', { x: M, y: TOP + 3.55, w: CW, h: 0.6, fontSize: 10.5, color: C.text2 });
  features(s, ['Real-time status monitoring', 'Industrial-grade IP67 design', '6 months standby capability', '4G · BLE · Wi-Fi connectivity', 'Remote access control', 'Cloud integration'], M, TOP + 4.25, CW, { cols: 2, rowH: 0.33, size: 10 });
  label(s, 'IoT engineering, end to end', M, TOP + 5.4);
  const caps = [['Product design', 'Hardware · RTOS firmware · BLE / Wi-Fi / LTE'], ['Security', 'Encryption · secure element · tamper detection'],
    ['Manufacturing', 'SMT & PCB · RF testing · firmware flashing'], ['Cloud & mobile', 'Dashboards · mobile apps · OTA updates']];
  const cw = (CW - 0.25) / 2;
  caps.forEach(([ti, b], i) => {
    const x = M + (i % 2) * (cw + 0.25), y = TOP + 5.75 + Math.floor(i / 2) * 1.1;
    card(s, x, y, cw, 0.95);
    text(s, ti, { x: x + 0.25, y: y + 0.17, w: cw - 0.5, h: 0.28, fontSize: 11.5, bold: true });
    text(s, b, { x: x + 0.25, y: y + 0.5, w: cw - 0.5, h: 0.4, fontSize: 9, color: C.text2 });
  });
  chips(s, ['AWS', 'MQTT', 'HTTPS', 'FOTA', 'JSON', 'RTOS', 'BLE', '4G LTE', 'NB-IoT'], M, TOP + 8.1);
}

async function expertisePage() {
  const s = page('Company', '09 · Why Walnut', 'Engineering expertise');
  const items = [['FiHeart', 'Medical electronics', 'Life-critical device design with full regulatory compliance.'],
    ['FiCpu', 'Embedded systems & IoT', 'Firmware, RTOS and cloud-connected embedded solutions.'],
    ['FiLayers', 'PCB design & fabrication', 'Multi-layer, HDI and flex PCBs for high-volume production.'],
    ['FiSettings', 'Manufacturing & assembly', '4 SMT lines, 500K+ units per month, 99.8% yield.'],
    ['FiCheckCircle', 'Quality & compliance', 'ISO 13485 quality management, controlled environment.'],
    ['FiShield', 'Payment hardware security', 'PCI PTS, EMVCo and NPCI certified terminal design.'],
    ['FiCode', 'Software & firmware', 'Full-stack firmware, drivers and companion apps.'],
    ['FiGlobe', 'Supply chain & logistics', 'Global component sourcing and door-to-door delivery.']];
  const cw = (CW - 0.25) / 2;
  items.forEach(([ic, t, b], i) => {
    const x = M + (i % 2) * (cw + 0.25), y = TOP + Math.floor(i / 2) * 1.2;
    card(s, x, y, cw, 1.02);
    icon(s, ic, x + 0.22, y + 0.25, 0.48);
    text(s, t, { x: x + 0.9, y: y + 0.2, w: cw - 1.05, h: 0.28, fontSize: 11.5, bold: true });
    text(s, b, { x: x + 0.9, y: y + 0.52, w: cw - 1.05, h: 0.45, fontSize: 9, color: C.text2 });
  });
  label(s, 'Why manufacturers choose Walnut', M, TOP + 5.0);
  const why = [['FiTrendingUp', 'Mass manufacturing', '500K+ units every month'], ['FiCpu', 'DICE & chip bonding', 'Maximum cost savings'],
    ['FiRefreshCw', 'Lean manufacturing', 'Across the whole organisation'], ['FiCloud', 'Cloud & firmware in-house', 'AWS, RTOS, MQTT, FOTA'],
    ['FiShield', 'Debt-free & bootstrapped', 'A stable long-term partner'], ['FiTarget', 'Fast growth', 'CAGR above 100% (last 4 years)']];
  why.forEach(([ic, t, b], i) => {
    const x = M + (i % 2) * (cw + 0.25), y = TOP + 5.35 + Math.floor(i / 2) * 0.72;
    icon(s, ic, x, y, 0.36);
    text(s, t, { x: x + 0.5, y: y - 0.02, w: cw - 0.55, h: 0.26, fontSize: 10.5, bold: true });
    text(s, b, { x: x + 0.5, y: y + 0.25, w: cw - 0.55, h: 0.3, fontSize: 9, color: C.text2 });
  });
}

async function clientsPage() {
  const s = page('Company', '09 · Clients', 'Trusted by leading brands');
  const logos = [['client-hdfc.png', 'HDFC Bank'], ['client-sbi.png', 'SBI'], ['client-paytm.png', 'Paytm'], ['client-bharatpe.png', 'BharatPe'], ['client-apollo.png', 'Apollo'], ['client-army.png', 'Indian Army']];
  const lw = (CW - 2 * 0.2) / 3, lh = 1.35;
  for (let i = 0; i < logos.length; i++) {
    const x = M + (i % 3) * (lw + 0.2), y = TOP + Math.floor(i / 3) * (lh + 0.2);
    card(s, x, y, lw, lh, { fill: C.background1, line: 'D9D9D9' });
    const r = await ratio(logos[i][0]);
    const bw = lw - 0.6, bh = lh - 0.45;
    let w = bw, h = bw / r;
    if (h > bh) { h = bh; w = bh * r; }
    s.addImage({ path: A(logos[i][0]), x: x + (lw - w) / 2, y: y + (lh - h) / 2, w, h, altText: logos[i][1] });
  }
  label(s, 'Industries we serve', M, TOP + 3.25);
  const sectors = [['FiHeart', 'Healthcare', 'Hospitals, clinics and medical device companies'], ['FiShield', 'Defence & aerospace', 'Mission-critical electronics for defence'],
    ['FiCreditCard', 'Banking & payments', 'POS terminals, soundboxes and payment devices'], ['FiActivity', 'Pharmaceutical', 'Manufacturing equipment and monitoring systems'],
    ['FiZap', 'Energy & utilities', 'Smart metering, grid monitoring, industrial controls'], ['FiTruck', 'Industrial & automotive', 'Industrial electronics, sensors and automotive']];
  const cw = (CW - 0.25) / 2;
  sectors.forEach(([ic, t, b], i) => {
    const x = M + (i % 2) * (cw + 0.25), y = TOP + 3.6 + Math.floor(i / 2) * 0.95;
    icon(s, ic, x, y, 0.42);
    text(s, t, { x: x + 0.58, y: y - 0.02, w: cw - 0.6, h: 0.28, fontSize: 11.5, bold: true });
    text(s, b, { x: x + 0.58, y: y + 0.28, w: cw - 0.6, h: 0.45, fontSize: 9, color: C.text2 });
  });
  await photo(s, 'real-test-station.jpg', M, TOP + 6.55, CW, 2.6, { alt: 'Walnut factory floor' });
}

async function contactPage() {
  const s = page('Contact', '10 · Contact', 'Let\'s build what\'s next');
  text(s, 'Engineering precision with user-centric design. We welcome the opportunity to collaborate with your team — from a first prototype to mass production.', { x: M, y: TOP, w: CW, h: 0.8, fontSize: 11.5, color: C.text2, lineSpacingMultiple: 1.15 });
  await photo(s, 'handshake.jpg', M, TOP + 1.0, CW, 3.6, { alt: 'Business partnership' });
  let y = TOP + 4.95;
  for (const [ic, t, b] of [
    ['FiMapPin', 'Address', 'Plot No. 132, JLPL Industrial Park, Sector 82, Mohali, Punjab 160055, India'],
    ['FiHome', 'Upcoming facility', 'Dhanana (Upcoming in Haryana)'],
    ['FiPhone', 'Phone', '+91 77194 63719'],
    ['FiMail', 'Email', 'contact@walnutmedical.in'],
    ['FiGlobe', 'Website', 'walnutmedical.in'],
  ]) {
    icon(s, ic, M, y, 0.42);
    text(s, t, { x: M + 0.6, y: y - 0.02, w: CW - 0.65, h: 0.26, fontSize: 11, bold: true });
    text(s, b, { x: M + 0.6, y: y + 0.26, w: CW - 0.65, h: 0.3, fontSize: 10, color: C.text2 });
    y += 0.78;
  }
}

async function backCover() {
  const s = newPage('Cover', 'Contact');
  const logoR = await ratio('logo-walnut-white.png');
  s.addImage({ path: A('wm-white.png'), x: (W - 3.2) / 2, y: 2.4, w: 3.2, h: 3.2 / 2.675, altText: '', transparency: 85 });
  s.addImage({ path: A('logo-walnut-white.png'), x: (W - 0.5 * logoR) / 2, y: 4.6, w: 0.5 * logoR, h: 0.5, altText: 'Walnut Technologies' });
  text(s, 'Intelligent Embedded Systems, Engineered for a Connected World', { x: M, y: 5.45, w: CW, h: 0.7, fontSize: 14, bold: true, color: C.background1, align: 'center' });
  text(s, 'Medical  ·  Neuro-rehabilitation  ·  Fintech  ·  Automotive  ·  IoT', { x: M, y: 6.2, w: CW, h: 0.3, fontSize: 10, color: C.accent3, align: 'center' });
  text(s, [
    { text: 'Walnut Technologies Pvt. Ltd.', options: { bold: true, color: C.background1, breakLine: true } },
    { text: 'Plot No. 132, JLPL Industrial Park, Sector 82, Mohali, Punjab 160055, India', options: { breakLine: true } },
    { text: 'Dhanana (Upcoming in Haryana)', options: { breakLine: true } },
    { text: '+91 77194 63719  ·  contact@walnutmedical.in  ·  walnutmedical.in' },
  ], { x: M, y: 9.3, w: CW, h: 1.3, fontSize: 9.5, color: C.accent3, align: 'center', lineSpacingMultiple: 1.3 });
}

// ─── Build ────────────────────────────────────────────────────────────
(async () => {
  fs.rmSync(CACHE, { recursive: true, force: true });
  fs.mkdirSync(CACHE, { recursive: true });
  await defineLayouts();

  await frontCover();                         // 1
  const toc = contentsPage();                 // 2
  sectionStarts.push(['01', 'About Walnut', pageNo + 1]);
  await aboutPage();                          // 3
  await glancePage();                         // 4
  await leadershipPage();                     // 5
  sectionStarts.push(['02', 'Our journey', pageNo + 1]);
  await journeyPage();                        // 6
  sectionStarts.push(['03', 'Infrastructure & quality', pageNo + 1]);
  await infrastructurePage();                 // 7
  await processPage();                        // 8
  await qualityPage();                        // 9
  await medicalPages();                       // 10–13
  await neuroPages();                         // 14–16
  await fintechPages();                       // 17–19
  await automotivePages();                    // 20–24
  await iotPages();                           // 25–27
  sectionStarts.push(['09', 'Expertise & clients', pageNo + 1]);
  await expertisePage();                      // 28
  await clientsPage();                        // 29
  sectionStarts.push(['10', 'Contact', pageNo + 1]);
  await contactPage();                        // 30

  // Pad to a multiple of 4 (booklet printing) with a notes page before the back cover
  while ((pageNo + 1) % 4 !== 0) {
    const n = page('Contact', 'Notes', 'Notes');
    for (let y = TOP + 0.3; y < FOOT - 0.4; y += 0.45) n.addShape(pres.shapes.LINE, { x: M, y, w: CW, h: 0, line: { color: 'D9D9D9', width: 0.5 } });
  }
  await backCover();

  const subs = {
    'About Walnut': 'Who we are, at a glance, leadership', 'Our journey': '2016 – 2026 milestones',
    'Infrastructure & quality': 'Facilities, production process, certifications', 'Medical devices': 'BP monitor, thermometer, nebulizer, oxygen concentrator',
    'Neuro-rehabilitation': 'WalkLab, Weebo, CES Repose', 'Fintech & payment devices': 'Soundbox platform and models',
    'Automotive electronics': '5″ & 7″ clusters, Google Maps mirroring, tractor suite', 'IoT solutions': 'GPS tracker & gateway, 4G smart lock',
    'Expertise & clients': 'Capabilities, brands and industries', 'Contact': 'Addresses and contacts',
  };
  const order = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
  const entries = order.map((n) => sectionStarts.find((e) => e[0] === n)).map(([n, t, p]) => [n, t, p, subs[t] || '']);
  fillContents(toc, entries);

  const file = path.resolve(__dirname, '..', 'Walnut-Product-Catalog-2026.pptx');
  await pres.writeFile({ fileName: file });
  await applyTheme(file, THEME);
  console.log(`wrote ${file} (${pageNo} pages)`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
