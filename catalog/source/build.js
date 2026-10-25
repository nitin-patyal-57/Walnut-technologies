// Builds two decks from website content + images:
//   ../Walnut-Company-Presentation.pptx
//   ../Walnut-Automotive-IoT-Presentation.pptx
// Black & white theme, 16:9. Run `node prepare-assets.mjs` once first, then
// `node build.js`, then export.ps1 for the PDFs (uses PowerPoint).
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const sharp = require('sharp');
const pptxgen = require('pptxgenjs');

// apply_theme.js lives outside this folder; let it resolve our pptxgenjs/jszip
process.env.NODE_PATH = [path.join(__dirname, 'node_modules'), process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
require('node:module').Module._initPaths();

const SKILL = process.env.PPTX_SKILL_DIR
  || path.join(os.homedir(), '.claude/skills/synced/7974b839-142d-4fdf-91ef-5fa755812d33_fc10a1c9-e99b-4824-9b38-7fff786407b0/pptx');
const { applyTheme } = require(path.join(SKILL, 'scripts/apply_theme.js'));

const ASSETS = path.join(__dirname, 'assets');
const CACHE = path.join(ASSETS, 'cache');
const OUT_DIR = path.resolve(__dirname, '..');
fs.mkdirSync(CACHE, { recursive: true });
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

// Slide geometry (LAYOUT_WIDE = 13.333" × 7.5")
const W = 13.333, H = 7.5, M = 0.6, CW = W - 2 * M;

// ─── Image helpers: pre-crop with sharp so every picture fills its box exactly ─
let cacheId = 0;
async function fitImage(file, w, h, fit = 'cover', position = 'centre', bg = '#ffffff', { rounded = 0, blurFill = false } = {}) {
  const pxW = Math.round(w * 220), pxH = Math.round(h * 220);
  const mode = blurFill ? 'blurf' : fit;
  const destExt = rounded > 0 ? 'png' : (file.endsWith('.png') ? 'png' : 'jpg');
  const dest = path.join(CACHE, `${path.basename(file, path.extname(file))}-${pxW}x${pxH}-${mode}-${rounded}-${cacheId++}.${destExt}`);

  // Blur-fill: the photo keeps its whole subject (contained, centred) while an
  // enlarged, blurred copy of itself fills every remaining pixel of the box —
  // no empty margins, nothing cropped away.
  if (blurFill) {
    const sigma = Math.max(8, Math.round(Math.min(pxW, pxH) / 14));
    const back = await sharp(A(file)).resize(pxW, pxH, { fit: 'cover', position }).blur(sigma).png().toBuffer();
    const front = await sharp(A(file)).resize(pxW, pxH, { fit: 'contain', position, background: { r: 255, g: 255, b: 255, alpha: 0 } }).ensureAlpha().png().toBuffer();
    let img = sharp(back).composite([{ input: front }]);
    if (rounded > 0) {
      const rx = Math.round(rounded * 220);
      const mask = Buffer.from(`<svg><rect x="0" y="0" width="${pxW}" height="${pxH}" rx="${rx}" ry="${rx}" fill="#fff"/></svg>`);
      img = sharp(await img.png().toBuffer()).composite([{ input: mask, blend: 'dest-in' }]);
    }
    await img.png().toFile(dest);
    return dest;
  }

  // Contained images are padded with a solid colour (white, or black on dark
  // slides): transparent padding leaves a faint hairline at the picture edge
  // once PowerPoint resamples it.
  const transparentPad = (file.endsWith('.png') || rounded > 0) && fit !== 'contain';
  let img = sharp(A(file)).resize(pxW, pxH, { fit, position, background: transparentPad ? { r: 255, g: 255, b: 255, alpha: 0 } : bg });
  if (!transparentPad && rounded === 0) img = img.flatten({ background: bg });
  if (rounded > 0) {
    const rx = Math.round(rounded * 220);
    const mask = Buffer.from(`<svg><rect x="0" y="0" width="${pxW}" height="${pxH}" rx="${rx}" ry="${rx}" fill="#fff"/></svg>`);
    img = img.composite([{ input: mask, blend: 'dest-in' }]);
  }
  img = destExt === 'png' ? img.png() : img.jpeg({ quality: 86 });
  await img.toFile(dest);
  return dest;
}
const ratio = async (file) => {
  const m = await sharp(A(file)).metadata();
  return m.width / m.height;
};

function createDeck({ title, subject }) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.author = 'Walnut Technologies Pvt. Ltd.';
  pres.company = 'Walnut Technologies Pvt. Ltd.';
  pres.title = title;
  pres.subject = subject;
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  return pres;
}

async function defineLayouts(pres) {
  const C = pres.SchemeColor;
  const logoR = await ratio('logo-walnut.png');
  const footerY = 6.9;
  const logoH = 0.34;

  const titlePh = (color) => ({
    placeholder: {
      options: { name: 'title', type: 'title', x: M, y: 0.68, w: CW - 1.5, h: 0.8, fontSize: 32, bold: true, color, align: 'left', valign: 'top', margin: 0 },
      text: '',
    },
  });

  pres.defineSlideMaster({
    title: 'Cover',
    background: { color: '111111' },
    objects: [],
  });

  pres.defineSlideMaster({
    title: 'Cover Light',
    background: { color: 'FFFFFF' },
    objects: [],
  });

  pres.defineSlideMaster({
    title: 'Divider',
    background: { color: '111111' },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 3.15, w: 6.6, h: 1.5, fontSize: 44, bold: true, color: C.background1, align: 'left', valign: 'top', margin: 0 }, text: '' } },
      { placeholder: { options: { name: 'body', type: 'body', x: M, y: 4.75, w: 6.2, h: 1.3, fontSize: 18, color: C.accent3, align: 'left', valign: 'top', margin: 0 }, text: '' } },
    ],
  });

  pres.defineSlideMaster({
    title: 'Divider Light',
    background: { color: 'FFFFFF' },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 3.15, w: 4.8, h: 1.5, fontSize: 44, bold: true, color: C.text1, align: 'left', valign: 'top', margin: 0 }, text: '' } },
      { placeholder: { options: { name: 'body', type: 'body', x: M, y: 4.75, w: 4.8, h: 1.5, fontSize: 16, color: C.text2, align: 'left', valign: 'top', margin: 0 }, text: '' } },
    ],
  });

  pres.defineSlideMaster({
    title: 'Content',
    background: { color: 'FFFFFF' },
    objects: [
      { image: { path: A('wm-ink.png'), x: 9.35, y: 5.05, w: 4.6, h: 1.72, transparency: 94 } },
      { image: { path: A('logo-walnut.png'), x: M, y: footerY, w: logoH * logoR, h: logoH } },
      { text: { text: 'walnutmedical.in', options: { x: 9.6, y: footerY + 0.02, w: 2.4, h: 0.3, fontSize: 10, color: C.text2, align: 'right', margin: 0 } } },
      titlePh(C.text1),
    ],
    slideNumber: { x: 12.15, y: footerY + 0.02, w: 0.58, h: 0.3, fontSize: 10, color: C.text1, align: 'right', margin: 0 },
  });

  pres.defineSlideMaster({
    title: 'Content Dark',
    background: { color: '111111' },
    objects: [
      { image: { path: A('wm-white.png'), x: 9.35, y: 5.05, w: 4.6, h: 1.72, transparency: 93 } },
      { image: { path: A('logo-walnut-white.png'), x: M, y: footerY, w: logoH * logoR, h: logoH } },
      { text: { text: 'walnutmedical.in', options: { x: 9.6, y: footerY + 0.02, w: 2.4, h: 0.3, fontSize: 10, color: C.accent3, align: 'right', margin: 0 } } },
      titlePh(C.background1),
    ],
    slideNumber: { x: 12.15, y: footerY + 0.02, w: 0.58, h: 0.3, fontSize: 10, color: C.background1, align: 'right', margin: 0 },
  });
}

// ─── Building blocks ──────────────────────────────────────────────────
function makeKit(pres) {
  const C = pres.SchemeColor;
  let section = '';
  const kit = {
    C,
    section(title) {
      section = title;
      pres.addSection({ title });
    },
    slide(masterName) {
      return pres.addSlide({ masterName, sectionTitle: section });
    },
    text(slide, text, o) {
      slide.addText(text, { isTextBox: true, margin: 0, valign: 'top', color: C.text1, fontSize: 14, ...o });
    },
    eyebrow(slide, label, dark = false) {
      kit.text(slide, label.toUpperCase(), { x: M, y: 0.36, w: 8, h: 0.28, fontSize: 11, bold: true, charSpacing: 3, color: dark ? C.accent3 : C.text2 });
    },
    content(title, eyebrow, { dark = false } = {}) {
      const s = kit.slide(dark ? 'Content Dark' : 'Content');
      if (eyebrow) kit.eyebrow(s, eyebrow, dark);
      s.addText(title, { placeholder: 'title' });
      return s;
    },
    card(slide, x, y, w, h, { fill = C.background2, line } = {}) {
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: line ? { color: line, width: 1 } : { type: 'none' },
      });
    },
    icon(slide, name, x, y, size, { light = false, circle = false, circleFill } = {}) {
      if (circle) {
        slide.addShape(pres.shapes.OVAL, { x, y, w: size, h: size, fill: { color: circleFill || (light ? C.background1 : C.text1) }, line: { type: 'none' } });
        const pad = size * 0.27;
        slide.addImage({ path: A(`icons/${name}-${light ? 'dark' : 'light'}.png`), x: x + pad, y: y + pad, w: size - 2 * pad, h: size - 2 * pad, altText: '' });
      } else {
        slide.addImage({ path: A(`icons/${name}-${light ? 'light' : 'dark'}.png`), x, y, w: size, h: size, altText: '' });
      }
    },
    async photo(slide, file, x, y, w, h, { fit = 'cover', position = 'centre', alt = '', bg = '#ffffff', rounded = 0, blurFill = false } = {}) {
      slide.addImage({ path: await fitImage(file, w, h, fit, position, bg, { rounded, blurFill }), x, y, w, h, altText: alt });
    },
    // Rows of icon + bold label + description
    iconList(slide, items, x, y, w, { rowH = 0.78, light = false, iconSize = 0.42, titleSize = 15, bodySize = 13 } = {}) {
      items.forEach((it, i) => {
        const yy = y + i * rowH;
        kit.icon(slide, it.icon, x, yy, iconSize, { circle: true, light });
        kit.text(slide, it.title, { x: x + iconSize + 0.22, y: yy - 0.02, w: w - iconSize - 0.22, h: 0.3, fontSize: titleSize, bold: true, color: light ? C.background1 : C.text1 });
        if (it.body) kit.text(slide, it.body, { x: x + iconSize + 0.22, y: yy + 0.3, w: w - iconSize - 0.22, h: rowH - 0.32, fontSize: bodySize, color: light ? C.accent3 : C.text2 });
      });
    },
    chips(slide, labels, x, y, { light = false, size = 12, gap = 0.12, maxW = CW } = {}) {
      let cx = x, cy = y;
      for (const label of labels) {
        const w = 0.32 + label.length * size * 0.0082;
        if (cx + w > x + maxW) { cx = x; cy += 0.48; }
        slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
          x: cx, y: cy, w, h: 0.38, rectRadius: 0.19,
          fill: { color: light ? C.accent2 : C.background1 }, line: { color: light ? C.accent5 : C.text1, width: 1 },
        });
        kit.text(slide, label, { x: cx, y: cy, w, h: 0.38, fontSize: size, bold: true, align: 'center', valign: 'middle', color: light ? C.background1 : C.text1 });
        cx += w + gap;
      }
    },
  };
  return kit;
}

// ─── Shared slides ────────────────────────────────────────────────────
const STATS = [
  ['10+', 'Years of excellence'], ['600+', 'Engineers & technicians'], ['10+', 'Countries served'],
  ['500K+', 'Units manufactured / month'], ['150,000', 'Sq. ft facility'], ['4', 'SMT production lines'],
];

// One-slide journey. Images are clean cut-outs (prepare-assets.mjs) shown whole.
const JOURNEY = [
  { year: '2016', title: 'Walnut Medical founded', body: 'Started with a vision to make quality healthcare more accessible.', image: 'j-logo-medical.png', alt: 'Walnut Medical logo', fit: 'contain' },
  { year: '2017', title: 'Robotics & neuro-rehab', body: 'Walkex functional therapy and the WalkLab gait-training robot.', image: 'walklab-journey.jpg', alt: 'WalkLab gait training robot', fit: 'cover', position: 'centre' },
  { year: '2019', title: 'Medical devices', body: 'IR thermometer and digital BP monitor, then nebulizers and oxygen concentrators.', image: 'bp presentation.png', alt: 'Walnut Medical digital BP monitor', fit: 'cover', position: 'centre' },
  { year: '2021', title: 'Walnut Technologies', body: 'Engineering expands beyond healthcare into electronics for every industry.', image: 'j-logo-tech.png', alt: 'Walnut Technologies logo', fit: 'contain' },
  { year: '2022', title: 'Fintech · soundbox', body: 'Smart payment soundboxes and POS devices, in mass production from 2023.', image: 'soundbox presentation.png', alt: 'Walnut payment soundbox on a shop counter', fit: 'cover', position: 'centre' },
  { year: '2025', title: 'Smart clusters', body: '5″ and 7″ smart clusters for 2-wheelers, tractors and vehicles.', image: 'cluster-tractor.jpg', alt: 'Smart instrument cluster', fit: 'cover', position: 'centre' },
  { year: '2026', title: 'GPS tracker & IoT', body: 'GPS tracker & gateway and a growing range of connected IoT devices.', image: 'gps tracker presentation.png', alt: 'Walnut GPS tracker', fit: 'cover', position: 'left' },
];

const PROCESS = [
  ['Idea & Requirement', 'Clear direction'], ['Research & Market Analysis', 'Right opportunity'],
  ['Design & Engineering', 'Optimized design'], ['Prototype Development', 'Working prototype'],
  ['Validation & Testing', 'Validated performance'], ['Manufacturing Engineering', 'Production ready'],
  ['Quality Assurance', 'Zero-defect mindset'], ['Packaging & Dispatch', 'Safe, on-time delivery'],
  ['After-Sales Support', 'Reliable support'], ['Continuous Improvement', 'Better every day'],
];

async function coverSlide(kit, { eyebrow, title, subtitle, image, position = 'centre', titleSize = 40, light = false }) {
  const { C } = kit;
  const s = kit.slide(light ? 'Cover Light' : 'Cover');
  const panelW = 6.1;
  await kit.photo(s, image, panelW, 0, W - panelW, H, { position, alt: '' });
  const logoFile = light ? 'logo-walnut.png' : 'logo-walnut-white.png';
  const logoR = await ratio(logoFile);
  s.addImage({ path: A(logoFile), x: M, y: 0.55, w: 0.85 * logoR, h: 0.85, altText: 'Walnut Technologies' });
  kit.text(s, eyebrow.toUpperCase(), { x: M, y: 2.35, w: 5.2, h: 0.3, fontSize: 12, bold: true, charSpacing: 3, color: light ? C.text2 : C.accent3 });
  // Longer headlines get a smaller size and push the subtitle down
  const long = titleSize < 40;
  kit.text(s, title, { x: M, y: 2.8, w: 5.3, h: long ? 2.2 : 1.75, fontSize: titleSize, bold: true, color: light ? C.text1 : C.background1 });
  kit.text(s, subtitle, { x: M, y: long ? 5.15 : 4.75, w: 5.0, h: 1.5, fontSize: long ? 15 : 16, color: light ? C.text2 : C.accent3 });
  kit.text(s, 'Walnut Technologies™  ·  Mohali, India  ·  walnutmedical.in', { x: M, y: 6.85, w: 5.3, h: 0.3, fontSize: 10, color: light ? C.text2 : C.accent3 });
}

async function dividerSlide(kit, num, title, body, image, { contain, light = false } = {}) {
  const { C } = kit;
  const s = kit.slide(light ? 'Divider Light' : 'Divider');
  kit.text(s, num, { x: M, y: 1.55, w: 3, h: 1.3, fontSize: 80, bold: true, color: light ? 'D9D9D9' : C.accent5 });
  s.addText(title, { placeholder: 'title' });
  s.addText(body, { placeholder: 'body' });
  if (light) {
    // Prominent product orbit visual on white divider: large, prominent, filling the right side
    await kit.photo(s, image, 5.6, 0.25, W - 5.6 - 0.25, H - 0.5, { fit: 'contain', bg: '#ffffff' });
  } else if (contain === 'white') {
    // Product cut-out shown whole on a white panel
    s.addShape(kit.pres.shapes.RECTANGLE, { x: 7.75, y: 0, w: W - 7.75, h: H, fill: { color: 'FFFFFF' }, line: { type: 'none' } });
    await kit.photo(s, image, 8.25, 0.8, W - 8.25 - 0.5, H - 1.6, { fit: 'contain', bg: '#ffffff' });
  } else if (contain === 'dark') {
    // Whole photo, letterboxed on the black divider — never cropped
    await kit.photo(s, image, 7.75, 0.6, W - 7.75 - M, H - 1.2, { fit: 'contain', bg: '#111111' });
  } else {
    await kit.photo(s, image, 7.75, 0, W - 7.75, H, { bg: light ? '#ffffff' : '#111111' });
  }
}

// White section opener for Products: editorial title block, a five-item
// category agenda on the left and the product orbit on a soft panel at right.
async function productsDividerSlide(kit) {
  const { C, pres } = kit;
  const s = kit.slide('Cover Light');

  // Right: product orbit, framed like a plate on the white canvas
  const panelX = 7.45, panelY = 0.6, panelW = W - panelX - M, panelH = H - 2 * 0.6;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: panelX, y: panelY, w: panelW, h: panelH, rectRadius: 0.12, fill: { color: 'FFFFFF' }, line: { color: 'D9D9D9', width: 1 } });
  await kit.photo(s, 'products-orbit-white.png', panelX + 0.2, panelY + 0.2, panelW - 0.4, panelH - 0.4, { fit: 'contain', bg: '#ffffff', alt: 'Walnut product range' });

  // Left: title block
  kit.text(s, 'SECTION 04', { x: M, y: 1.05, w: 5, h: 0.3, fontSize: 12, bold: true, charSpacing: 3, color: C.text2 });
  kit.text(s, 'Products', { x: M, y: 1.4, w: 6.2, h: 1.15, fontSize: 54, bold: true });
  s.addShape(pres.shapes.LINE, { x: M, y: 2.72, w: 5.9, h: 0, line: { color: '111111', width: 1.5 } });
  kit.text(s, 'Five product families, designed and built in-house.', { x: M, y: 2.88, w: 6.1, h: 0.4, fontSize: 13, color: C.text2 });

  // Left: category agenda
  const rows = [
    ['FiHeart', 'Medical', 'Diagnostics & monitoring'],
    ['FiActivity', 'Neuro-rehabilitation', 'Robotics & FES therapy'],
    ['FiCreditCard', 'Fintech', 'Soundboxes & payment POS'],
    ['FiTruck', 'Automotive', 'Smart instrument clusters'],
    ['FiWifi', 'IoT', 'Trackers, gateways & locks'],
  ];
  const rowY = 3.62, rowH = 0.64, rowW = panelX - M - 0.35;
  rows.forEach(([icon, title, body], i) => {
    const y = rowY + i * rowH;
    kit.icon(s, icon, M, y, 0.44, { circle: true });
    kit.text(s, title, { x: M + 0.62, y: y + 0.02, w: 2.5, h: 0.4, fontSize: 15, bold: true, valign: 'middle' });
    kit.text(s, body, { x: M + 3.2, y: y + 0.02, w: rowW - 3.2, h: 0.4, fontSize: 12.5, color: C.text2, valign: 'middle' });
    if (i < rows.length - 1) {
      s.addShape(pres.shapes.LINE, { x: M + 0.62, y: y + rowH - 0.1, w: rowW - 0.62, h: 0, line: { color: 'D9D9D9', width: 1 } });
    }
  });
}

async function aboutSlide(kit, { focus }) {
  const { C } = kit;
  const s = kit.content('Who we are', '01 · About Walnut');
  kit.text(s, [
    { text: 'Walnut Medical & Walnut Technologies', options: { bold: true } },
    { text: ` is a multi-vertical original design and equipment manufacturer (ODM/OEM). Established in 2016, we have grown from a small electronics workshop into a vertically integrated design and manufacturing partner for technologically advanced products${focus ? ` — today including ${focus}` : ''}.` },
  ], { x: M, y: 1.75, w: 5.7, h: 2.0, fontSize: 16 });
  kit.text(s, 'From PCB design to final assembly, every stage is in-house: electronics and firmware design, mould design, SMT, testing, quality and dispatch.', { x: M, y: 3.9, w: 5.7, h: 0.85, fontSize: 14, color: C.text2 });
  kit.iconList(s, [
    { icon: 'FiMapPin', title: 'Production units', body: 'Mohali (Punjab) · AMTZ, Visakhapatnam (Andhra Pradesh) · Dhanana (Upcoming in Haryana)' },
    { icon: 'FiAward', title: 'Certified quality', body: 'ISO 13485 · CE · FCC · BIS · Industry 4.0 · Full traceability' },
  ], M, 4.95, 5.7, { rowH: 0.86 });
  // Real photos from the Walnut factory floor (portrait)
  const pw = (5.98 - 0.25) / 2;
  await kit.photo(s, 'real-line.jpg', 6.75, 1.75, pw, 4.8, { alt: 'Walnut assembly line' });
  await kit.photo(s, 'real-rework.jpg', 6.75 + pw + 0.25, 1.75, pw, 4.8, { alt: 'Microscope soldering and rework' });
}

// Company deck: "Who we are" and "at a glance" combined on one slide
async function aboutGlanceSlide(kit) {
  const { C, pres } = kit;
  const s = kit.content('Who we are', '01 · About Walnut');
  kit.text(s, [
    { text: 'Walnut Medical & Walnut Technologies', options: { bold: true } },
    { text: ', established in 2016, has grown into a vertically integrated design and manufacturing company — from PCB design to final assembly, every stage is in-house.' },
  ], { x: M, y: 1.65, w: 6.4, h: 1.25, fontSize: 14 });
  // Stats band: six figures on black, three per row
  const bx = M, bw = 6.4, by = 3.0;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: by, w: bw, h: 2.55, rectRadius: 0.1, fill: { color: '111111' }, line: { type: 'none' } });
  const colW = (bw - 0.6) / 3;
  STATS.forEach(([value, label], i) => {
    const x = bx + 0.3 + (i % 3) * colW, y = by + 0.25 + Math.floor(i / 3) * 1.15;
    kit.text(s, value, { x, y, w: colW - 0.1, h: 0.6, fontSize: 28, bold: true, color: C.background1 });
    kit.text(s, label, { x, y: y + 0.6, w: colW - 0.1, h: 0.4, fontSize: 10.5, color: C.accent3 });
  });
  kit.iconList(s, [
    { icon: 'FiMapPin', title: 'Mohali · AMTZ Visakhapatnam · Dhanana (Upcoming in Haryana)' },
    { icon: 'FiAward', title: 'ISO 13485 · CE · FCC · BIS · Industry 4.0 · Full traceability' },
  ], M, 5.78, 6.4, { rowH: 0.45, iconSize: 0.32, titleSize: 11.5 });
  // Two tall factory photos with caption tags
  const px = 7.3, gap = 0.2, pw = (W - M - px - gap) / 2, ph = 4.95;
  for (const [i, file, caption] of [[0, 'real-line.jpg', 'Production line'], [1, 'real-smt.jpg', 'SMT line · JUKI & FUJI']]) {
    const x = px + i * (pw + gap);
    await kit.photo(s, file, x, 1.65, pw, ph, { alt: caption });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.15, y: 1.65 + ph - 0.55, w: pw - 0.3, h: 0.4, rectRadius: 0.2, fill: { color: '111111' }, line: { type: 'none' } });
    kit.text(s, caption, { x: x + 0.15, y: 1.65 + ph - 0.55, w: pw - 0.3, h: 0.4, fontSize: 11, bold: true, color: C.background1, align: 'center', valign: 'middle' });
  }
}

async function glanceSlide(kit) {
  const { C } = kit;
  const s = kit.content('Walnut at a glance', 'Scale & reach', { dark: true });
  const colW = 2.45, rowH = 2.15, x0 = M, y0 = 1.85;
  STATS.forEach(([value, label], i) => {
    const x = x0 + (i % 3) * colW, y = y0 + Math.floor(i / 3) * rowH;
    kit.text(s, value, { x, y, w: colW - 0.2, h: 0.95, fontSize: 44, bold: true, color: C.background1 });
    kit.text(s, label, { x, y: y + 0.98, w: colW - 0.3, h: 0.6, fontSize: 14, color: C.accent3 });
  });
  await kit.photo(s, 'real-test-station.jpg', 8.35, 1.85, 4.38, 4.6, { alt: 'Functional test stations on the Walnut factory floor' });
}

async function missionStrengthsSlide(kit) {
  const { C } = kit;
  const s = kit.content('Vision, mission & strengths', '01 · About Walnut');

  // Top Section: Vision & Mission (y = 1.62, h = 2.45)
  const topY = 1.62, topH = 2.45;
  const cardW = (CW - 0.25) / 2;

  // Left card: OUR VISION
  kit.card(s, M, topY, cardW, topH);
  kit.icon(s, 'FiEye', M + 0.35, topY + 0.25, 0.45, { circle: true });
  kit.text(s, 'OUR VISION', { x: M + 1.0, y: topY + 0.28, w: cardW - 1.3, h: 0.35, fontSize: 18, bold: true, charSpacing: 1 });
  kit.text(s, "To become India's leading technology and manufacturing powerhouse, delivering innovative, high-quality payment and electronic solutions to global markets.",
    { x: M + 0.35, y: topY + 0.88, w: cardW - 0.7, h: 1.4, fontSize: 14.5, color: C.text1 });

  // Right card: OUR MISSION — a 2 × 2 grid so every point has room to breathe
  const rx = M + cardW + 0.25;
  kit.card(s, rx, topY, cardW, topH);
  kit.icon(s, 'FiTarget', rx + 0.35, topY + 0.24, 0.44, { circle: true });
  kit.text(s, 'OUR MISSION', { x: rx + 1.0, y: topY + 0.27, w: cardW - 1.3, h: 0.35, fontSize: 18, bold: true, charSpacing: 1 });

  const missionPoints = [
    ['Customer First', 'Exceed expectations with innovative, reliable solutions.'],
    ['Quality Excellence', 'Superior products through continuous improvement.'],
    ['Integrity & Trust', 'The highest standards of ethics and transparency.'],
    ['Sustainable Growth', 'Lasting value for customers, partners and stakeholders.'],
  ];
  const padX = 0.35, cellGapX = 0.24, cellGapY = 0.16;
  const gridY = topY + 0.88, gridH = topH - 0.88 - 0.2;
  const cellW = (cardW - 2 * padX - cellGapX) / 2, cellH = (gridH - cellGapY) / 2;
  // Hairline cross that quietly splits the four quadrants
  s.addShape(kit.pres.shapes.LINE, { x: rx + padX, y: gridY + cellH + cellGapY / 2, w: cardW - 2 * padX, h: 0, line: { color: 'D9D9D9', width: 1 } });
  s.addShape(kit.pres.shapes.LINE, { x: rx + cardW / 2, y: gridY + 0.02, w: 0, h: gridH - 0.04, line: { color: 'D9D9D9', width: 1 } });
  missionPoints.forEach(([title, body], i) => {
    const cx2 = rx + padX + (i % 2) * (cellW + cellGapX);
    const cy2 = gridY + Math.floor(i / 2) * (cellH + cellGapY);
    kit.text(s, title, { x: cx2, y: cy2, w: cellW, h: 0.26, fontSize: 12.5, bold: true });
    kit.text(s, body, { x: cx2, y: cy2 + 0.27, w: cellW, h: cellH - 0.27, fontSize: 10.5, color: C.text2 });
  });

  // Bottom Section: 5 Strategic Strengths (y = 4.28, h = 2.4)
  const botY = 4.28, botH = 2.4;
  const n = 5, gap = 0.2, sw = (CW - (n - 1) * gap) / n;

  const strengths = [
    ['FiCpu', 'R&D', 'Research & Development', 'Dedicated research and innovation driving next-gen hardware, firmware, and embedded system technologies.'],
    ['FiLayers', 'D&D', 'Design & Development', 'In-house design capability — from industrial aesthetics and mechanical CAD to schematics, PCB layout, and validation.'],
    ['FiCloud', 'Cloud & Firmware', 'In-House Architecture', 'AWS server-side, RTOS platforms, MQTT, HTTPS, FOTA and JSON for connected IoT devices.'],
    ['FiRefreshCw', 'Lean Mfg.', 'Six Sigma & 5S', '5S, Kaizen and Six Sigma practices — less waste, shorter lead times, and consistent high quality.'],
    ['FiTrendingUp', 'Fast Growth', '100%+ CAGR', 'CAGR above 100% over the last four years with expanding international footprint.'],
  ];

  strengths.forEach(([icon, title, sub, body], i) => {
    const x = M + i * (sw + gap);
    kit.card(s, x, botY, sw, botH);
    kit.icon(s, icon, x + 0.22, botY + 0.2, 0.4, { circle: true });
    kit.text(s, title, { x: x + 0.22, y: botY + 0.74, w: sw - 0.44, h: 0.3, fontSize: 14.5, bold: true });
    kit.text(s, sub, { x: x + 0.22, y: botY + 1.04, w: sw - 0.44, h: 0.24, fontSize: 10, bold: true, color: C.text2 });
    kit.text(s, body, { x: x + 0.22, y: botY + 1.32, w: sw - 0.44, h: 1.0, fontSize: 10.5, color: C.text2 });
  });
}

async function journeySlide(kit) {
  const { C, pres } = kit;
  const s = kit.content('Our journey', '02 · Journey 2016 – 2026');
  const n = JOURNEY.length, gap = 0.2, colW = (CW - (n - 1) * gap) / n;
  const tileY = 1.65, tileH = 1.8, lineY = tileY + tileH + 0.42;
  const cx = (i) => M + i * (colW + gap) + colW / 2;
  s.addShape(pres.shapes.LINE, { x: cx(0), y: lineY, w: cx(n - 1) - cx(0), h: 0, line: { color: '111111', width: 2 } });
  for (let i = 0; i < n; i++) {
    const it = JOURNEY[i];
    const x = M + i * (colW + gap);
    const current = i === n - 1;
    const isCover = it.fit === 'cover';
    if (isCover) {
      await kit.photo(s, it.image, x, tileY, colW, tileH, { fit: 'cover', position: it.position || 'centre', rounded: 0.08, alt: it.alt });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y: tileY, w: colW, h: tileH, rectRadius: 0.08,
        fill: { type: 'none' },
        line: { color: current ? '111111' : 'D9D9D9', width: current ? 2 : 1 },
      });
    } else {
      kit.card(s, x, tileY, colW, tileH, { fill: C.background1, line: current ? '111111' : 'D9D9D9' });
      const pad = 0.06;
      await kit.photo(s, it.image, x + pad, tileY + pad, colW - 2 * pad, tileH - 2 * pad, { fit: 'contain', alt: it.alt });
    }
    s.addShape(pres.shapes.LINE, { x: cx(i), y: tileY + tileH, w: 0, h: lineY - tileY - tileH, line: { color: 'D9D9D9', width: 1 } });
    s.addShape(pres.shapes.OVAL, {
      x: cx(i) - 0.13, y: lineY - 0.13, w: 0.26, h: 0.26,
      fill: { color: current ? 'FFFFFF' : '111111' }, line: { color: '111111', width: current ? 2.5 : 1 },
    });
    kit.text(s, it.year, { x, y: lineY + 0.3, w: colW, h: 0.5, fontSize: 26, bold: true, align: 'center' });
    kit.text(s, it.title, { x, y: lineY + 0.85, w: colW, h: 0.6, fontSize: 14, bold: true, align: 'center' });
    kit.text(s, it.body, { x, y: lineY + 1.55, w: colW, h: 1.05, fontSize: 12, color: C.text2, align: 'center' });
  }
}

async function leadershipSlide(kit) {
  const { C } = kit;
  const s = kit.content('Leadership', '01 · About Walnut');
  // Leader cards stacked on the left, the real engineering-office photo large on the right
  const cardW = 6.35, cardH = 2.3, gap = 0.2;
  [
    ['SD', 'Siddharth Dhawan', 'Director & CEO', 'Spent 10 years at National Instruments Corp. in the USA and India, working in high-tech embedded and control systems and managing the business in India.'],
    ['AB', 'Amol Bhardwaj', 'Director & CTO', 'Leads medical device development; launched devices across diagnostics, therapeutics and robotics — EEG, ECG, rTMS and gait training robots. Expert in QC tools, SPC, APQP, PPAP, Six Sigma, Cpk and 5S; Management Representative for ISO 13485 and CE audits (2009–2014).'],
  ].forEach(([ini, name, role, bio], i) => {
    const y = 1.75 + i * (cardH + gap);
    kit.card(s, M, y, cardW, cardH);
    s.addShape('ellipse', { x: M + 0.3, y: y + 0.3, w: 0.9, h: 0.9, fill: { color: '111111' }, line: { type: 'none' } });
    kit.text(s, ini, { x: M + 0.3, y: y + 0.3, w: 0.9, h: 0.9, fontSize: 20, bold: true, color: C.background1, align: 'center', valign: 'middle' });
    kit.text(s, name, { x: M + 1.45, y: y + 0.3, w: cardW - 1.75, h: 0.4, fontSize: 19, bold: true });
    kit.text(s, role, { x: M + 1.45, y: y + 0.72, w: cardW - 1.75, h: 0.3, fontSize: 13, color: C.text2 });
    kit.text(s, bio, { x: M + 1.45, y: y + 1.1, w: cardW - 1.75, h: cardH - 1.2, fontSize: 12, color: C.text1 });
  });
  const px = M + cardW + 0.3;
  await kit.photo(s, 'team.jpg', px, 1.75, W - M - px, 2 * cardH + gap, { alt: 'Walnut engineering team at work' });
}

async function infrastructureSlide(kit, num = '03') {
  const { C } = kit;
  const s = kit.content('Manufacturing infrastructure', `${num} · Infrastructure`);
  // 3 × 2 grid of real factory photos (portrait tiles, so they stay nearly uncropped)
  const gap = 0.15, gw = (6.0 - 2 * gap) / 3, gh = (4.8 - gap) / 2, gx = M, gy = 1.75;
  const photos = [
    ['hud-1.jpg', 'Production line'], ['hud-2.jpg', 'SMT line'], ['hud-3.jpg', 'Precision rework'],
    ['hud-4.jpg', 'Environmental testing'], ['hud-5.jpg', 'Functional testing'], ['hud-6.jpg', 'Packing and dispatch'],
  ];
  for (let i = 0; i < photos.length; i++) {
    await kit.photo(s, photos[i][0], gx + (i % 3) * (gw + gap), gy + Math.floor(i / 3) * (gh + gap), gw, gh, { alt: photos[i][1] });
  }
  kit.iconList(s, [
    { icon: 'FiHome', title: '150,000 sq. ft facility', body: 'Mohali · AMTZ · Dhanana (Upcoming in Haryana)' },
    { icon: 'FiCpu', title: '4 SMT production lines', body: 'Fully automatic SMT — JUKI RS-1, FUJI, 200,000 CPH' },
    { icon: 'FiActivity', title: 'In-house test & calibration', body: 'Keysight · National Instruments · Rigol · Tektronix' },
    { icon: 'FiLayers', title: 'PCB design to production', body: 'Design, validation, prototyping, pilot lots, full scale' },
    { icon: 'FiCheckCircle', title: 'IQC · LQC · OQC quality teams', body: 'Inspection at incoming, line and outgoing stages' },
    { icon: 'FiBox', title: 'Moulds & injection moulding', body: 'Mass-production mould design and plastics in-house' },
  ], 6.95, 1.78, 5.78, { rowH: 0.8, iconSize: 0.4, titleSize: 15, bodySize: 13 });
}

function strengthsSlide(kit, num = '03') {
  const { C } = kit;
  const s = kit.content('Why choose Walnut', `${num} · Strengths`);
  const items = [
    ['FiCpu', 'R&D (Research & Development)', 'Dedicated research and innovation driving next-generation hardware, firmware, and embedded system technologies.'],
    ['FiLayers', 'D&D (Design & Development)', 'In-house design capability — from industrial aesthetics and mechanical CAD to schematics, PCB layout, and validation.'],
    ['FiCloud', 'Cloud & firmware in-house', 'AWS server-side, RTOS platforms, MQTT, HTTPS, FOTA and JSON for connected IoT devices.'],
    ['FiRefreshCw', 'Lean manufacturing', '5S, Kaizen and Six Sigma practices — less waste, shorter lead times, and consistent high quality.'],
    ['FiTrendingUp', 'Fast growth', 'CAGR above 100% over the last four years with expanding international footprint.'],
  ];

  const cw3 = (CW - 2 * 0.3) / 3, ch = 2.2;
  items.slice(0, 3).forEach(([icon, title, body], i) => {
    const x = M + i * (cw3 + 0.3), y = 1.75;
    kit.card(s, x, y, cw3, ch);
    kit.icon(s, icon, x + 0.35, y + 0.3, 0.46, { circle: true });
    kit.text(s, title, { x: x + 0.35, y: y + 0.92, w: cw3 - 0.7, h: 0.55, fontSize: 14.5, bold: true });
    kit.text(s, body, { x: x + 0.35, y: y + 1.52, w: cw3 - 0.7, h: 0.62, fontSize: 12, color: C.text2 });
  });

  const cw2 = (CW - 0.3) / 2;
  items.slice(3).forEach(([icon, title, body], i) => {
    const x = M + i * (cw2 + 0.3), y = 1.75 + ch + 0.3;
    kit.card(s, x, y, cw2, ch);
    kit.icon(s, icon, x + 0.35, y + 0.3, 0.46, { circle: true });
    kit.text(s, title, { x: x + 0.35, y: y + 0.92, w: cw2 - 0.7, h: 0.4, fontSize: 15.5, bold: true });
    kit.text(s, body, { x: x + 0.35, y: y + 1.45, w: cw2 - 0.7, h: 0.65, fontSize: 12.5, color: C.text2 });
  });
}

async function processSlide(kit, num = '03') {
  const { C } = kit;
  const s = kit.content('End-to-End Production Process', `${num} · How we work`);
  const n = 5, gap = 0.22, iw = (CW - (n - 1) * gap) / n, ih = 1.3;
  for (let i = 0; i < PROCESS.length; i++) {
    const [title, sub] = PROCESS[i];
    const x = M + (i % n) * (iw + gap), y = 1.7 + Math.floor(i / n) * 2.55;
    await kit.photo(s, `step-${String(i + 1).padStart(2, '0')}.jpg`, x, y, iw, ih, { alt: title });
    kit.text(s, String(i + 1).padStart(2, '0'), { x, y: y + ih + 0.12, w: 0.5, h: 0.35, fontSize: 15, bold: true, color: C.text2 });
    kit.text(s, title, { x: x + 0.45, y: y + ih + 0.12, w: iw - 0.45, h: 0.55, fontSize: 14, bold: true });
    kit.text(s, sub, { x: x + 0.45, y: y + ih + 0.68, w: iw - 0.45, h: 0.3, fontSize: 12, color: C.text2 });
  }
}

async function qualitySlide(kit, num = '03') {
  const { C } = kit;
  const s = kit.content('Quality & certifications', `${num} · Quality`);
  await kit.photo(s, 'real-chamber.jpg', M, 1.75, 4.3, 4.75, { alt: 'Environmental test chamber at Walnut' });
  const certs = [
    ['ISO', 'ISO 13485', 'Quality management for medical devices'],
    ['4.0', 'Industry 4.0', 'Connected, data-driven production with traceability'],
    ['CE', 'CE · FCC · PCI-DSS', 'European, US and payment-security standards'],
    ['IEC', 'IEC 60601', 'Medical electrical equipment safety'],
    ['BIS', 'BIS certified', 'Bureau of Indian Standards compliance'],
    ['QA', 'IQC · LQC · OQC', 'Inspection at incoming, line and outgoing stages'],
  ];
  const x0 = 5.2, cw = (W - M - x0 - 0.3) / 2, ch = 1.18;
  certs.forEach(([code, title, body], i) => {
    const x = x0 + (i % 2) * (cw + 0.3), y = 1.75 + Math.floor(i / 2) * (ch + 0.22);
    kit.card(s, x, y, cw, ch);
    s.addShape(kit.pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: y + 0.24, w: 0.7, h: 0.7, rectRadius: 0.08, fill: { color: '111111' }, line: { type: 'none' } });
    kit.text(s, code, { x: x + 0.25, y: y + 0.24, w: 0.7, h: 0.7, fontSize: 14, bold: true, color: C.background1, align: 'center', valign: 'middle' });
    kit.text(s, title, { x: x + 1.15, y: y + 0.22, w: cw - 1.3, h: 0.35, fontSize: 15, bold: true });
    kit.text(s, body, { x: x + 1.15, y: y + 0.58, w: cw - 1.3, h: 0.55, fontSize: 12, color: C.text2 });
  });
  kit.text(s, [
    { text: 'Compliances: ', options: { bold: true } },
    { text: 'ISO 13485, ISO 80601-2-69, IEC 60601-1, IEC 60601-1-2 (NABL-accredited labs), CE, FCC, RoHS' },
  ], { x: x0, y: 5.95, w: W - M - x0, h: 0.6, fontSize: 13, color: C.text1 });
}

async function clientsSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Trusted by leading brands', `${num} · Clients & industries`);
  const logos = ['client-hdfc.png', 'client-sbi.png', 'client-paytm.png', 'client-bharatpe.png', 'client-apollo.png', 'client-army.png'];
  const names = ['HDFC Bank', 'State Bank of India', 'Paytm', 'BharatPe', 'Apollo', 'Indian Army'];
  const lw = (CW - 5 * 0.25) / 6, lh = 1.75;
  for (let i = 0; i < logos.length; i++) {
    const x = M + i * (lw + 0.25);
    kit.card(s, x, 1.75, lw, lh, { fill: C.background1, line: 'D9D9D9' });
    const r = await ratio(logos[i]);
    const boxW = lw - 0.5, boxH = lh - 0.45;
    let w = boxW, h = boxW / r;
    if (h > boxH) { h = boxH; w = boxH * r; }
    s.addImage({ path: A(logos[i]), x: x + (lw - w) / 2, y: 1.75 + (lh - h) / 2, w, h, altText: names[i] });
  }
  const sectors = [
    ['FiHeart', 'Healthcare', 'Hospitals, clinics and medical device companies'],
    ['FiShield', 'Defence & aerospace', 'Mission-critical electronics for defence'],
    ['FiCreditCard', 'Banking & payments', 'POS terminals, soundboxes and payment devices'],
    ['FiActivity', 'Pharmaceutical', 'Manufacturing equipment and monitoring systems'],
    ['FiZap', 'Energy & utilities', 'Smart metering, grid monitoring, industrial controls'],
    ['FiTruck', 'Industrial & automotive', 'Industrial electronics, sensors and automotive'],
  ];
  const cw = (CW - 2 * 0.3) / 3;
  sectors.forEach(([icon, title, body], i) => {
    const x = M + (i % 3) * (cw + 0.3), y = 4.05 + Math.floor(i / 3) * 1.4;
    kit.icon(s, icon, x, y, 0.5, { circle: true });
    kit.text(s, title, { x: x + 0.72, y: y - 0.02, w: cw - 0.8, h: 0.35, fontSize: 16, bold: true });
    kit.text(s, body, { x: x + 0.72, y: y + 0.36, w: cw - 0.8, h: 0.75, fontSize: 13, color: C.text2 });
  });
}

async function contactSlide(kit) {
  const { C } = kit;
  const s = kit.slide('Cover');
  await kit.photo(s, 'handshake.jpg', 7.4, 0, W - 7.4, H, { alt: 'Business partnership' });
  const logoR = await ratio('logo-walnut-white.png');
  s.addImage({ path: A('logo-walnut-white.png'), x: M, y: 0.6, w: 0.5 * logoR, h: 0.5, altText: 'Walnut Technologies' });
  kit.text(s, "Let's build what's next", { x: M, y: 1.7, w: 6.4, h: 1.0, fontSize: 40, bold: true, color: C.background1 });
  kit.text(s, 'Engineering precision with user-centric design — we welcome the opportunity to collaborate with your team.', { x: M, y: 2.75, w: 6.2, h: 0.9, fontSize: 16, color: C.accent3 });
  kit.iconList(s, [
    { icon: 'FiMapPin', title: 'Address', body: 'Plot 132, JLPL Industrial Park, Sector 82, Mohali 160055\nDhanana (Upcoming in Haryana)' },
    { icon: 'FiPhone', title: 'Phone', body: '+91 77194 63719' },
    { icon: 'FiMail', title: 'Email', body: 'contact@walnutmedical.in' },
    { icon: 'FiGlobe', title: 'Website', body: 'walnutmedical.in' },
  ], M, 3.6, 6.2, { rowH: 0.86, light: true, iconSize: 0.42, titleSize: 14, bodySize: 13 });
}

// Product cards: image on white, then title + description
async function productGrid(kit, s, items, { y = 2.35, h = 4.25 } = {}) {
  const { C } = kit;
  const n = items.length, gap = 0.3, cw = (CW - (n - 1) * gap) / n, ih = h * 0.5;
  for (let i = 0; i < n; i++) {
    const it = items[i];
    const x = M + i * (cw + gap);
    kit.card(s, x, y, cw, h, { fill: C.background1, line: 'D9D9D9' });
    await kit.photo(s, it.image, x + 0.12, y + 0.12, cw - 0.24, ih, { fit: it.fit || 'contain', alt: it.title });
    kit.text(s, it.title, { x: x + 0.25, y: y + ih + 0.25, w: cw - 0.5, h: 0.6, fontSize: 15, bold: true, valign: 'bottom' });
    kit.text(s, it.body, { x: x + 0.25, y: y + ih + 0.95, w: cw - 0.5, h: h - ih - 1.05, fontSize: 13, color: C.text2 });
  }
}

// ─── Automotive & IoT slides ──────────────────────────────────────────
async function clusterHeroSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Smart instrument clusters', `${num} · Automotive electronics`);
  await kit.photo(s, 'cluster page 14.png', M, 1.75, 6.4, 4.8, { fit: 'cover', alt: 'Walnut 5-inch and 7-inch smart clusters' });
  kit.text(s, 'Next-generation digital clusters with high-resolution displays, real-time vehicle data and customisable driver interfaces — built for durability and clarity.', { x: 7.35, y: 1.75, w: 5.38, h: 1.3, fontSize: 16 });
  kit.iconList(s, [
    { icon: 'FiMaximize', title: '5-inch and 7-inch displays', body: 'Two sizes to suit compact and full-size dashboards' },
    { icon: 'FiCpu', title: 'Android and RTOS based', body: 'Smart and cost-optimised platform options' },
    { icon: 'FiWifi', title: '4G · Bluetooth · Wi-Fi', body: 'Connected cluster with phone screen mirroring' },
  ], 7.35, 3.2, 5.38, { rowH: 0.82 });
  kit.text(s, 'BUILT FOR', { x: 7.35, y: 5.75, w: 3, h: 0.3, fontSize: 11, bold: true, charSpacing: 3, color: C.text2 });
  kit.chips(s, ['2-wheelers', 'Tractors & farm equipment', 'LMV & HMV'], 7.35, 6.1, { maxW: 5.38 });
}

async function clusterOptionsSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Choose your size: 5-inch or 7-inch', `${num} · Cluster options`);
  // Same cluster drawn at true relative scale (5/7) on a shared baseline
  const cardY = 1.75, cardH = 4.8, cardW = 3.45;
  const base = cardY + 3.65;
  const imgR = 620 / 470;
  const big = { w: 3.05 }; big.h = big.w / imgR;
  const small = { w: big.w * 5 / 7 }; small.h = small.w / imgR;
  for (const [i, size, dim] of [[0, '5″', small], [1, '7″', big]]) {
    const x = M + i * (cardW + 0.3);
    kit.card(s, x, cardY, cardW, cardH);
    await kit.photo(s, 'cluster-crop.jpg', x + (cardW - dim.w) / 2, base - dim.h, dim.w, dim.h, { alt: `${size} smart instrument cluster` });
    kit.text(s, size, { x: x + 0.3, y: base + 0.2, w: 1.4, h: 0.75, fontSize: 40, bold: true });
    kit.text(s, `${size === '5″' ? '5' : '7'}-inch display`, { x: x + 1.55, y: base + 0.35, w: cardW - 1.8, h: 0.35, fontSize: 15, bold: true });
    kit.text(s, 'Smart instrument cluster', { x: x + 1.55, y: base + 0.68, w: cardW - 1.8, h: 0.3, fontSize: 12, color: C.text2 });
  }

  const tx = M + 2 * (cardW + 0.3) + 0.1, tw = W - M - tx;
  kit.text(s, 'Configuration options', { x: tx, y: cardY, w: tw, h: 0.4, fontSize: 18, bold: true });
  const rows = [
    ['Display size', '5-inch  ·  7-inch'],
    ['Platform', 'RTOS  ·  Android'],
    ['Connectivity', '4G  ·  Bluetooth  ·  Wi-Fi'],
    ['Navigation', 'Phone screen mirroring — Google Maps on the cluster'],
    ['Interface', 'Custom layouts, themes and brand integration'],
    ['Vehicle data', 'Real-time speed, RPM, fuel, temperature, diagnostics'],
  ];
  s.addTable(rows.map(([k, v]) => [
    { text: k, options: { bold: true, color: C.text1, fill: { color: C.background2 } } },
    { text: v, options: { color: C.text1 } },
  ]), {
    x: tx, y: cardY + 0.55, w: tw, colW: [1.65, tw - 1.65], fontSize: 13, valign: 'middle',
    border: { type: 'solid', pt: 1, color: 'D9D9D9' }, rowH: 0.62, margin: [0.06, 0.12, 0.06, 0.12],
  });
  kit.text(s, 'Clusters shown at relative scale. Final specifications and combinations are confirmed per project; datasheets on request.', { x: tx, y: 6.15, w: tw, h: 0.45, fontSize: 11, color: C.text2 });
}

async function mirroringSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Google maps capture on non-andriod cluster', `${num} · Phone screen mirroring`);
  const phoneH = 3.7, phoneW = phoneH * 300 / 620;
  s.addImage({ path: A('phone-maps.png'), x: 1.3, y: 1.75, w: phoneW, h: phoneH, altText: 'Phone showing Google Maps navigation' });
  // Mirroring link between phone and cluster
  kit.icon(s, 'FiCast', 4.47, 3.05, 0.75, { circle: true });
  s.addShape('line', { x: 3.3, y: 3.43, w: 1.05, h: 0, line: { color: '111111', width: 1.5, dashType: 'dash' } });
  s.addShape('line', { x: 5.34, y: 3.43, w: 1.05, h: 0, line: { color: '111111', width: 1.5, dashType: 'dash', endArrowType: 'triangle' } });
  const ch = 3.75, cw = ch * 620 / 470;
  await kit.photo(s, 'j-cluster-maps.png', 6.6, 1.7, cw, ch, { fit: 'contain', alt: 'Cluster displaying mirrored Google Maps navigation' });
  const items = [
    ['FiNavigation', 'Turn-by-turn on the dash', "Google Maps navigation from the rider's phone appears on the cluster screen."],
    ['FiEye', 'Eyes stay on the road', 'Directions sit in the driver’s line of sight — no phone on the handlebar or dashboard.'],
    ['FiSmartphone', 'Works with your phone', 'Pair over the cluster’s wireless connectivity and start navigating.'],
  ];
  const w3 = (CW - 2 * 0.3) / 3;
  items.forEach(([icon, title, body], i) => {
    const x = M + i * (w3 + 0.3);
    kit.icon(s, icon, x, 5.72, 0.42, { circle: true });
    kit.text(s, title, { x: x + 0.62, y: 5.7, w: w3 - 0.62, h: 0.3, fontSize: 15, bold: true });
    kit.text(s, body, { x: x + 0.62, y: 6.0, w: w3 - 0.62, h: 0.62, fontSize: 12, color: C.text2 });
  });
}

function clusterFeaturesSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Engineered for the road and the field', `${num} · Cluster features`, { dark: true });
  const items = [
    ['FiMonitor', 'High-resolution display', 'Crystal-clear visuals for real-time vehicle data; anti-glare, wide viewing angles, sunlight readable.'],
    ['FiCpu', 'Advanced processing', 'Multiple data streams processed simultaneously for instant driver feedback.'],
    ['FiZap', 'Low power consumption', 'Energy-efficient design for extended vehicle battery life.'],
    ['FiShield', 'Rugged build', 'Industrial-grade components for harsh environments.'],
    ['FiSettings', 'Customisable interface', 'Configurable layouts and themes for different vehicles and brands.'],
    ['FiThermometer', 'Temperature resistant', 'Operating range from −40 °C to +85 °C for all climates.'],
  ];
  const cw = (CW - 2 * 0.3) / 3, ch = 2.2;
  items.forEach(([icon, title, body], i) => {
    const x = M + (i % 3) * (cw + 0.3), y = 1.75 + Math.floor(i / 3) * (ch + 0.3);
    kit.card(s, x, y, cw, ch, { fill: C.accent2 });
    kit.icon(s, icon, x + 0.35, y + 0.35, 0.5, { circle: true, light: true });
    kit.text(s, title, { x: x + 0.35, y: y + 1.0, w: cw - 0.7, h: 0.4, fontSize: 17, bold: true, color: C.background1 });
    kit.text(s, body, { x: x + 0.35, y: y + 1.42, w: cw - 0.7, h: 0.75, fontSize: 13, color: C.accent3 });
  });
}

function capabilityBlocks(kit, s, blocks, { y = 1.75, ch = 2.25 } = {}) {
  const { C } = kit;
  const cw = (CW - 0.3) / 2;
  blocks.forEach(([title, body, bullets], i) => {
    const x = M + (i % 2) * (cw + 0.3), yy = y + Math.floor(i / 2) * (ch + 0.25);
    kit.card(s, x, yy, cw, ch);
    kit.text(s, String(i + 1).padStart(2, '0'), { x: x + 0.35, y: yy + 0.3, w: 0.7, h: 0.5, fontSize: 24, bold: true, color: C.text2 });
    kit.text(s, title, { x: x + 1.05, y: yy + 0.32, w: cw - 1.4, h: 0.4, fontSize: 17, bold: true });
    kit.text(s, body, { x: x + 1.05, y: yy + 0.75, w: cw - 1.4, h: 0.7, fontSize: 13, color: C.text2 });
    kit.text(s, bullets.join('   ·   '), { x: x + 1.05, y: yy + 1.55, w: cw - 1.4, h: 0.5, fontSize: 12, bold: true });
  });
}

function automotiveCapabilitiesSlide(kit, num) {
  const s = kit.content('Automotive engineering capabilities', `${num} · Capabilities`);
  capabilityBlocks(kit, s, [
    ['Display technology', 'High-brightness LCD/TFT displays with anti-glare coating and wide viewing angles.', ['LCD/TFT', 'Anti-glare', 'Sunlight readable']],
    ['Real-time data processing', 'Speed, RPM, fuel, temperature and diagnostics handled simultaneously.', ['CAN bus support', 'Diagnostics', 'Instant updates']],
    ['Custom design & engineering', 'Clusters designed to your vehicle specifications, brand identity and functions.', ['Custom layouts', 'Brand integration', 'DFM']],
    ['Quality & certification', 'Tested for temperature, vibration, humidity and electromagnetic compatibility.', ['IATF 16949 ready', 'AEC-Q100', 'EMC & vibration tested']],
  ]);
}

async function agriSuiteSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Automatic tractor electronics suite', `${num} · Agri & off-highway`);
  kit.card(s, M, 1.75, 5.6, 4.8, { fill: C.background1, line: 'D9D9D9' });
  await kit.photo(s, 'j-cluster.png', M + 0.4, 2.2, 4.8, 3.9, { fit: 'contain', alt: 'Walnut smart instrument cluster' });
  kit.text(s, 'A complete suite of smart, IoT-enabled electronics for agricultural equipment, earth-moving equipment and tractors.', { x: 6.6, y: 1.75, w: 6.13, h: 1.0, fontSize: 17 });
  kit.iconList(s, [
    { icon: 'FiMonitor', title: 'Smart instrument clusters', body: '5″ and 7″ clusters with 4G, Bluetooth and Wi-Fi' },
    { icon: 'FiSettings', title: 'Tractor automation electronics', body: 'Electronics for automation of agricultural tractors' },
    { icon: 'FiMapPin', title: 'Telematics & tracking', body: 'GPS tracker and gateway for fleet visibility in the field' },
    { icon: 'FiCloud', title: 'Connected platform', body: 'Cloud dashboards, mobile apps and OTA updates' },
  ], 6.6, 3.05, 6.13, { rowH: 0.86 });
}

// ─── GPS tracker WM-MFT-4G (from "GPS TRACKER by Walnut Technologies-2026") ─
async function gpsSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('GPS Tracker WM-MFT-4G', `${num} · Smart tracking | safer vehicles | smarter fleets`);
  kit.text(s, [{ text: 'Smart tracking. Total control. ', options: { bold: true, color: C.text1 } },
  { text: 'A rugged 4G GPS tracker for real-time fleet visibility, smart geo-fencing, and route intelligence — built for tractors, auto-rickshaws, construction equipment, trucks and two-wheelers.' }],
    { x: M, y: 1.6, w: 6.8, h: 0.75, fontSize: 12.5, color: C.text2 });

  const feats = [
    ['FiMapPin', 'Precision GPS tracking', '<2.5 m positioning accuracy with continuous round-the-clock vehicle tracking.'],
    ['FiRadio', '4G LTE CAT-1 connectivity', 'Reliable and seamless real-time data transmission anywhere on the network.'],
    ['FiTarget', 'Smart geo-fencing', 'Customisable virtual boundaries with instant entry and exit alerts.'],
    ['FiClock', '10,000 location history logs', 'Route tracking, trip analysis and complete movement records on demand.'],
    ['FiZap', 'Ignition intelligence', 'Real-time ACC / engine ignition status monitoring and anti-theft security.'],
    ['FiRefreshCw', 'FOTA & SOS support', 'Remote over-the-air firmware upgrades plus SOS emergency button.'],
  ];
  const colW = 6.4;
  feats.forEach(([ic, t, b], i) => {
    const y = 2.45 + i * 0.62;
    kit.icon(s, ic, M, y, 0.38, { circle: true });
    kit.text(s, t, { x: M + 0.52, y: y - 0.02, w: colW - 0.55, h: 0.28, fontSize: 13, bold: true });
    kit.text(s, b, { x: M + 0.52, y: y + 0.26, w: colW - 0.55, h: 0.35, fontSize: 11, color: C.text2 });
  });

  kit.chips(s, ['Tractors', 'Auto-rickshaws', 'Construction', 'Trucks', 'Two-wheelers'], M, 6.25, { maxW: 6.6, size: 10 });

  // Hero photo on right
  const px = 7.6, pw = W - M - px;
  await kit.photo(s, 'gps tracker presentation.png', px, 1.6, pw, 5.0, { fit: 'cover', alt: 'Walnut WM-MFT-4G GPS Tracker' });
}

// ─── GPS tracker in the field: safety & fleet value (from the reference deck, p.5) ─
async function gpsFleetSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Smart tracking | safer vehicles | smarter fleets', `${num} · Fleet safety & visibility`);
  const items = [
    { icon: 'FiTarget', title: 'Smart geo-fencing', body: 'Customisable virtual boundaries for enhanced vehicle monitoring, with instant entry and exit alerts.' },
    { icon: 'FiRadio', title: '4G LTE CAT-1 connectivity', body: 'Reliable and seamless real-time data transmission from the vehicle, anywhere on the network.' },
    { icon: 'FiNavigation', title: 'Real-time GPS/GNSS monitoring', body: 'Continuous vehicle tracking for improved fleet visibility, round the clock.' },
    { icon: 'FiRefreshCw', title: 'FOTA firmware updates', body: 'Convenient remote device upgrades and maintenance — no workshop visit needed.' },
    { icon: 'FiDatabase', title: '10,000 location history logs', body: 'Route tracking, trip analysis and complete movement records, on demand.' },
  ];
  kit.iconList(s, items, M, 1.7, 7.5, { rowH: 1.0, titleSize: 16, bodySize: 13 });

  // Two field photos, stacked and scaled to their true aspect ratios so neither is cropped
  const shots = [
    ['ref-geofence.png', 'Freight truck on the highway with a geo-fenced zone mapped around its route'],
    ['ref-fota.png', 'Connected truck receiving a firmware-over-the-air update'],
  ];
  const gap = 0.15, top = 1.6, bottom = 6.8;
  const ratios = await Promise.all(shots.map(([f]) => ratio(f)));
  const iw = (bottom - top - gap) / ratios.reduce((a, r) => a + 1 / r, 0);
  const ix = W - M - iw;
  let iy = top;
  for (let i = 0; i < shots.length; i++) {
    const ih = iw / ratios[i];
    await kit.photo(s, shots[i][0], ix, iy, iw, ih, { fit: 'cover', alt: shots[i][1] });
    iy += ih + gap;
  }
}

async function gatewaySlide(kit, num) {
  const { C } = kit;
  const s = kit.content('GPS gateway', `${num} · Multi-sensor asset tracking & telemetry`);
  kit.text(s, 'Reliable GPS gateway for industrial and logistics applications — multi-sensor monitoring, real-time tracking, telemetry reporting, and fleet management with secure cloud connectivity.',
    { x: M, y: 1.6, w: 5.8, h: 0.85, fontSize: 12.5, color: C.text2 });

  const specs = [
    { icon: 'FiBattery', title: '200 mAh battery backup', body: 'Internal backup battery ensures continuous telemetry transmission even if main power is disconnected.' },
    { icon: 'FiRadio', title: 'Bluetooth & GPS connectivity', body: 'Dual wireless interfaces: precise GNSS location combined with BLE for wireless sensor integration.' },
    { icon: 'FiActivity', title: 'Multi-sensor capability', body: 'Supports Security sensor, Fuel sensor, Temperature sensor, and Humidity sensor simultaneously.' },
    { icon: 'FiTrendingUp', title: 'Sends multiple parameters', body: 'Transmits all telemetry parameters in real time for smarter, safer, and more efficient fleet operations.' },
    { icon: 'FiCloud', title: 'Secure cloud gateway', body: 'Encrypted cloud communication to fleet dashboards and mobile monitoring applications.' },
  ];
  kit.iconList(s, specs, M, 2.55, 5.8, { rowH: 0.78, iconSize: 0.38, titleSize: 13, bodySize: 11 });

  // Hero photo on right
  const px = 6.6, pw = W - M - px;
  await kit.photo(s, 'gps gateway presentation.png', px, 1.6, pw, 5.0, { fit: 'contain', alt: 'Walnut GPS Gateway Multi-Sensor Solution' });
}

async function gpsSpecsSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Technical specifications — WM-MFT-4G', `${num} · GPS tracker`);
  const rows = [
    ['GNSS', 'GPS + GLONASS · L1 · 33 tracking channels'],
    ['Accuracy', '<2.5 m CEP · tracking −167 dBm · acquisition −149 dBm'],
    ['TTFF (open sky)', 'Hot start <5 s · cold start <40 s'],
    ['Cellular', 'LTE CAT-1 4G module · Nano-SIM'],
    ['Power', '9–90 V DC input · 60 mAh / 3.7 V battery · battery backup'],
    ['Interface', '1 ignition input · 1 output (CAN optional) · LED: GNSS blue, cellular green'],
    ['Physical', '82.5 × 38.5 × 15.0 mm · 50 g · built-in GSM & GNSS antennas'],
    ['Environment', '−20 °C to +70 °C · 5–95% RH, non-condensing'],
    ['Data storage', 'Up to 10,000 history logs (as per customer requirement)'],
  ];
  s.addTable(rows.map(([k, v]) => [
    { text: k, options: { bold: true, color: C.text1, fill: { color: C.background2 } } },
    { text: v, options: { color: C.text1 } },
  ]), { x: M, y: 1.65, w: 7.4, colW: [1.75, 5.65], fontSize: 11.5, valign: 'middle', border: { type: 'solid', pt: 1, color: 'D9D9D9' }, rowH: 0.5, margin: [0.04, 0.12, 0.04, 0.12] });
  const fx = 8.3, fw = W - M - fx;
  kit.text(s, 'ADDITIONAL FEATURES', { x: fx, y: 1.65, w: fw, h: 0.25, fontSize: 10, bold: true, charSpacing: 3, color: C.text2 });
  [
    ['FiRadio', 'LBS positioning', 'Cell-tower (station mode) positioning'],
    ['FiTarget', 'Geo-fence', 'Optional customisable boundaries'],
    ['FiRefreshCw', 'FOTA updates', 'Firmware-over-the-air upgrades'],
    ['FiCpu', 'CAN optional', 'For diagnostics or data exchange'],
    ['FiServer', 'Protocol', 'TCP (server based) and MQTT, customisable'],
    ['FiAlertTriangle', 'SOS button', 'Enhanced safety in critical situations'],
  ].forEach(([ic, t, b], i) => {
    const y = 2.05 + i * 0.75;
    kit.icon(s, ic, fx, y, 0.4, { circle: true });
    kit.text(s, t, { x: fx + 0.55, y: y - 0.02, w: fw - 0.6, h: 0.28, fontSize: 13, bold: true });
    kit.text(s, b, { x: fx + 0.55, y: y + 0.27, w: fw - 0.6, h: 0.35, fontSize: 11, color: C.text2 });
  });
}

async function smartLockDashboardSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Smart GPS & IoT Monitoring Dashboard', `${num} · IoT security & fleet control`);
  await kit.photo(s, 'smartlock presentation.png', M, 1.65, 6.2, 5.0, { fit: 'contain', alt: 'Smart GPS & IoT Monitoring Dashboard' });

  const rx = 7.15, rw = W - M - rx;
  kit.text(s, 'KEY FEATURES', { x: rx, y: 1.65, w: rw, h: 0.25, fontSize: 10, bold: true, charSpacing: 3, color: C.text2 });

  const features = [
    ['FiMonitor', '1. Device Monitoring', 'Device info, firmware & health status.'],
    ['FiMapPin', '2. GPS Tracking', 'Real-time location, speed & trip monitoring.'],
    ['FiRadio', '3. Connectivity', '4G/LTE, Bluetooth and NFC interfaces.'],
    ['FiBattery', '4. Battery Management', 'Battery level, charging and power status.'],
    ['FiLock', '5. Smart Lock Control', 'Lock/unlock status and access management.'],
    ['FiShield', '6. Security Monitoring', 'Tamper detection, alerts & device security.'],
    ['FiActivity', '7. Driving Analytics', 'Harsh braking, acceleration & driving score.'],
    ['FiTarget', '8. Geofencing', 'Location boundaries & violation alerts.'],
    ['FiThermometer', '9. Sensor Monitoring', 'Temperature, humidity & motion detection.'],
    ['FiTool', '10. Remote Diagnostics', 'Device health, memory & error monitoring.'],
  ];

  const colW = (rw - 0.25) / 2;
  features.forEach(([ic, t, b], i) => {
    const col = i < 5 ? 0 : 1;
    const row = i % 5;
    const x = rx + col * (colW + 0.25);
    const y = 2.0 + row * 0.95;
    kit.icon(s, ic, x, y, 0.34, { circle: true });
    kit.text(s, t, { x: x + 0.44, y: y - 0.02, w: colW - 0.45, h: 0.28, fontSize: 12, bold: true });
    kit.text(s, b, { x: x + 0.44, y: y + 0.26, w: colW - 0.45, h: 0.55, fontSize: 10.5, color: C.text2 });
  });
}

async function dashcamSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('HW-EH13 — 4G Dual Camera Dashcam', `${num} · Connected video telematics`);

  kit.text(s, 'Intelligent vehicle security dashcam with dual Full HD cameras, 4G LTE Cat 1 connectivity, live video streaming, and collision telematics.',
    { x: M, y: 1.6, w: 6.6, h: 0.65, fontSize: 12.5, color: C.text2 });

  kit.chips(s, ['Single Dashcam', 'Dual Dashcam', 'Full HD 1080p', '4G LTE Cat 1'], M, 2.3, { maxW: 6.6, size: 10.5 });

  const specs = [
    ['Dual Camera', 'Front & Rear/Cabin Recording'],
    ['Video Quality', 'Full HD 1080p, 25 FPS'],
    ['Connectivity', '4G LTE Cat 1 module'],
    ['GPS Tracking', 'Real-time vehicle location'],
    ['Safety Features', 'Collision & vibration alerts'],
    ['Storage', 'Up to 128 GB MicroSD'],
    ['Audio', 'Built-in microphone & speaker'],
    ['Power Supply', '9–36 V DC wide input'],
    ['Video Compression', 'H.265 / H.264 high efficiency'],
    ['Compact Design', '105 × 86 × 32 mm enclosure'],
    ['Remote Monitoring', 'Video & data transmission'],
    ['Applications', 'Fleet tracking, vehicle security & driver monitoring'],
  ];

  s.addTable(specs.map(([k, v]) => [
    { text: k, options: { bold: true, color: C.text1, fill: { color: C.background2 } } },
    { text: v, options: { color: C.text1 } },
  ]), {
    x: M, y: 2.75, w: 6.6, colW: [2.1, 4.5], fontSize: 10.5, valign: 'middle',
    border: { type: 'solid', pt: 1, color: 'D9D9D9' }, rowH: 0.33, margin: [0.03, 0.08, 0.03, 0.08],
  });

  const px = 7.7, pw = W - M - px;
  await kit.photo(s, 'dc camera new.png', px, 1.6, pw, 2.55, { fit: 'cover', position: 'centre', alt: 'Walnut 4G dual camera dashcam mounted on a truck windscreen' });
  await kit.photo(s, 'DC new.png', px, 4.3, pw, 2.45, { blurFill: true, alt: 'HW-EH13 4G Dual Camera Dashcam hardware' });
}

async function lockSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('4G smart lock', `${num} · IoT security`);
  await kit.photo(s, 'j-lock-range.png', M, 1.75, 4.6, 4.8, { fit: 'contain', alt: 'Walnut 4G smart lock with GPS trackers' });
  kit.text(s, 'Connected smart lock for logistics, assets and infrastructure — remote access control, real-time monitoring and cloud management from anywhere.', { x: 5.55, y: 1.75, w: 7.18, h: 1.0, fontSize: 16 });
  const items = [
    ['FiActivity', 'Real-time status monitoring'], ['FiShield', 'Industrial-grade IP67 design'],
    ['FiBattery', '6 months standby capability'], ['FiRadio', '4G · BLE · Wi-Fi connectivity'],
    ['FiLock', 'Remote access control'], ['FiCloud', 'Cloud integration'],
  ];
  const cw = (W - M - 5.55 - 0.3) / 2;
  items.forEach(([icon, title], i) => {
    const x = 5.55 + (i % 2) * (cw + 0.3), y = 3.0 + Math.floor(i / 2) * 1.15;
    kit.card(s, x, y, cw, 0.95);
    kit.icon(s, icon, x + 0.25, y + 0.24, 0.47, { circle: true });
    kit.text(s, title, { x: x + 0.95, y, w: cw - 1.1, h: 0.95, fontSize: 15, bold: true, valign: 'middle' });
  });
}

async function paymentIotSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Connected payment devices', `${num} · IoT at scale`);
  await kit.photo(s, 'fintech-range.jpg', M, 1.7, CW, 2.35, { fit: 'contain', alt: 'Walnut payment soundbox range' });
  const cols = [
    ['FiRadio', 'Smart payment soundboxes', 'BIS-approved soundboxes with 4G/2G, NB-IoT, Bluetooth and Wi-Fi, multi-language audio confirmation and secure integrations.'],
    ['FiCreditCard', 'NFC tap & pay with EMV chip', 'Contactless and chip-insert payments — launching in 2026.'],
    ['FiServer', 'IoT management platform', 'SaaS platform for monitoring and managing deployed payment and IoT devices.'],
  ];
  const w3 = (CW - 2 * 0.3) / 3;
  cols.forEach(([icon, title, body], i) => {
    const x = M + i * (w3 + 0.3);
    kit.card(s, x, 4.3, w3, 2.3);
    kit.icon(s, icon, x + 0.3, 4.6, 0.46, { circle: true });
    kit.text(s, title, { x: x + 0.3, y: 5.2, w: w3 - 0.6, h: 0.35, fontSize: 16, bold: true });
    kit.text(s, body, { x: x + 0.3, y: 5.58, w: w3 - 0.6, h: 0.95, fontSize: 12, color: C.text2 });
  });
}

function iotCapabilitiesSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('IoT engineering, end to end', `${num} · Capabilities`);
  capabilityBlocks(kit, s, [
    ['Product design & development', 'From concept to connected product: hardware, firmware and connectivity.', ['Hardware', 'RTOS firmware', 'Wireless']],
    ['Security & authentication', 'End-to-end encryption, secure boot and tamper detection for mission-critical devices.', ['Encryption', 'Secure element', 'Tamper detection']],
    ['Manufacturing & assembly', '4 SMT lines and 500K+ units per month with full traceability.', ['SMT & PCB', 'RF testing', 'Firmware flashing']],
    ['Cloud & mobile platforms', 'Companion apps and cloud dashboards with real-time analytics.', ['Dashboards', 'Mobile apps', 'OTA updates']],
  ], { y: 1.7, ch: 2.0 });
  kit.text(s, 'PROTOCOLS', { x: M, y: 6.25, w: 1.6, h: 0.38, fontSize: 11, bold: true, charSpacing: 3, color: C.text2, valign: 'middle' });
  kit.chips(s, ['AWS', 'MQTT', 'HTTPS', 'FOTA', 'JSON', 'RTOS', 'BLE', '4G LTE', 'NB-IoT'], M + 1.7, 6.25, { maxW: CW - 1.7, size: 11 });
}

// ─── Company-wide product slides ──────────────────────────────────────
async function medicalSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Medical devices', `${num} · Medical`);
  kit.text(s, 'CDSCO-approved Class B and Class C medical devices, designed and manufactured under ISO 13485.', { x: M, y: 1.68, w: CW, h: 0.5, fontSize: 16, color: C.text2 });
  await productGrid(kit, s, [
    { image: 'j-bp.png', title: 'Digital BP monitor', body: 'Clinical-grade automatic blood pressure monitor with digital display and memory.' },
    { image: 'thermometer.jpg', title: 'IR thermometer', body: 'ThermoSure non-contact infrared thermometer — fast, hygienic readings.' },
    { image: 'nebulizer.jpg', title: 'Compressor nebulizer', body: 'Compact, low-noise respiratory therapy for clinic and home.' },
    { image: 'oxygen.jpg', title: 'Oxygen concentrator', body: '5 L and 10 L, single and dual flow, for clinical and homecare use.' },
  ], { y: 2.25, h: 3.7 });
  kit.card(s, M, 6.1, CW, 0.62);
  kit.text(s, 'In development: a gold-standard electronic BP monitoring device, with ICMR funding and clinical trials at AIIMS Nagpur, AIIMS Delhi and Chettinad Super Speciality Hospital.', { x: M + 0.3, y: 6.1, w: CW - 0.6, h: 0.62, fontSize: 12, valign: 'middle', bold: true });
}

async function neuroSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Neuro-rehabilitation & robotics', `${num} · Neuro rehab`);
  kit.chips(s, ['AI-assisted therapy', 'Real-time monitoring', 'Tele-rehab ready', 'FES', 'rTMS', 'RMNS'], M, 1.62, { size: 11 });
  // Images fill the whole card header edge-to-edge — nothing left empty.
  // WalkLab's portrait shot keeps its subject whole over a blurred fill; the
  // landscape / square shots are cover-cropped to the box.
  const items = [
    { image: 'walklab-test.jpg', blurFill: true, title: 'WalkLab', body: 'Lower limb walk trainer.' },
    { image: 'weebo presentation.png', title: 'Weebo', body: 'Early rehabilitation robot and functional electrical stimulation.' },
    { image: 'walkex.jpg', position: 'centre', title: 'Walkex', body: 'Functional electrical stimulation for foot drop — stroke and paralysis recovery.' },
  ];
  const iw = (CW - 2 * 0.3) / 3, cy = 2.3, ch = 4.3, imgH = 2.95;
  for (let i = 0; i < items.length; i++) {
    const { image, title, body, blurFill, position } = items[i];
    const x = M + i * (iw + 0.3);
    kit.card(s, x, cy, iw, ch, { fill: C.background1, line: 'D9D9D9' });
    await kit.photo(s, image, x, cy, iw, imgH, { fit: 'cover', position, blurFill, rounded: 0.08, alt: title });
    kit.text(s, title, { x: x + 0.25, y: cy + imgH + 0.22, w: iw - 0.5, h: 0.38, fontSize: 17, bold: true });
    kit.text(s, body, { x: x + 0.25, y: cy + imgH + 0.62, w: iw - 0.5, h: 0.62, fontSize: 12.5, color: C.text2 });
  }
}

async function fintechSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Fintech & payment devices', `${num} · Fintech`);
  // Certifications first, as a quiet row of tags under the title
  kit.chips(s, ['BIS approved', 'PCI-DSS', 'NPCI compliant', 'EMV L1/L2', 'Multi-language audio', 'NFC tap & pay — 2026'], M, 1.62, { size: 11 });
  // The full soundbox line-up (website fintech-homebackground), shown whole
  await kit.photo(s, 'fintech-range.jpg', M, 2.2, CW, 1.5, { fit: 'contain', alt: 'Walnut payment soundbox range' });
  // One catalogue card per model: product cut-out on white, name, short spec line
  const models = [
    ['j-rtos.png', 'All in one', 'On-device QR generation with EMV tap and chip insert, and a certified PIN pad.'],
    ['j-dqr.png', 'DQR — Digital QR', 'High-contrast LCD for dynamic QR and clear transaction visibility.'],
    ['j-ldqr.png', 'LDQR — Large display', '10″ touchscreen, 2.4″ merchant display, keyboard and NFC tap-and-pay.'],
    ['j-fintech.png', 'Payment soundbox', '4G/2G, NB-IoT, Bluetooth and Wi-Fi smart payment speakers.'],
  ];
  const mw = (CW - 3 * 0.3) / 4, cy = 3.9, ch = 2.75;
  for (let i = 0; i < models.length; i++) {
    const [image, title, body] = models[i];
    const x = M + i * (mw + 0.3);
    kit.card(s, x, cy, mw, ch, { fill: C.background1, line: 'D9D9D9' });
    await kit.photo(s, image, x + 0.25, cy + 0.2, mw - 0.5, 1.3, { fit: 'contain', alt: title });
    kit.text(s, title, { x: x + 0.25, y: cy + 1.62, w: mw - 0.5, h: 0.35, fontSize: 15, bold: true });
    kit.text(s, body, { x: x + 0.25, y: cy + 2.0, w: mw - 0.5, h: 0.7, fontSize: 12, color: C.text2 });
  }
}

async function automotiveIotOverviewSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Automotive & IoT', `${num} · Automotive & IoT`);
  const third = (CW - 3 * 0.3) / 4;
  // Whole products on white tiles (cut-outs, contained — nothing cropped)
  const items = [
    ['j-cluster-maps.png', 'Smart clusters', '5″ and 7″ · Android & RTOS · 4G, BT, Wi-Fi · Google Maps mirroring · custom cluster development'],
    ['j-tracker-h.png', 'GPS tracker', 'WM-MFT-4G · <2.5 m accuracy · 4G CAT-1 · geo-fencing · ignition monitoring · SOS'],
    ['j-gps.png', 'GPS gateway', 'Asset tracking and telemetry · fleet management · secure cloud connectivity'],
    ['j-lock.png', '4G smart lock', 'Remote access control · real-time status · IP67 · with battery backup'],
  ];
  for (let i = 0; i < items.length; i++) {
    const [file, title, body] = items[i];
    const x = M + i * (third + 0.3);
    kit.card(s, x, 1.75, third, 4.8);
    await kit.photo(s, file, x + 0.25, 1.95, third - 0.5, 2.2, { fit: 'contain', alt: title });
    kit.text(s, title, { x: x + 0.2, y: 4.35, w: third - 0.4, h: 0.4, fontSize: 16, bold: true, color: C.text1 });
    kit.text(s, body, { x: x + 0.2, y: 4.8, w: third - 0.4, h: 1.6, fontSize: 12, color: C.text2 });
  }
}

// ─── Soundbox ecosystem: Terminal Management System + MQTT broker ─
async function soundboxTmsSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Terminal Management System', `${num} · End-to-end soundbox ecosystem`);
  kit.text(s, [{ text: 'Manage your fleet anywhere, anytime. ', options: { bold: true, color: C.text1 } }, { text: 'A control centre for your entire terminal estate — TMS streamlines the full device lifecycle, from deployment to OTA updates and troubleshooting, with real-time visibility into every unit.' }],
    { x: M, y: 1.6, w: 6.0, h: 0.95, fontSize: 12.5, color: C.text2 });
  kit.iconList(s, [
    { icon: 'FiGrid', title: 'Device & network', body: 'Storage, CPU, memory, battery, IP, IMEI, operator and live location.' },
    { icon: 'FiSmartphone', title: 'App details', body: 'App, SDK, sound-file and language versions; install history.' },
    { icon: 'FiCalendar', title: 'Scheduler', body: 'Schedule OTA jobs, advertisements and remote commands.' },
    { icon: 'FiUserPlus', title: 'Onboarding', body: 'Link to merchant accounts, release OTP, un-bind, watch the transaction matrix.' },
    { icon: 'FiShield', title: 'Defender', body: 'Security metrics, anomaly detection, audits, alerts and mitigation.' },
  ], M, 2.7, 6.0, { rowH: 0.8, iconSize: 0.4, titleSize: 13, bodySize: 11 });
  // Dashboard screens: device view large, fleet map and alerts below
  const dw = 5.55, dx = W - M - dw;
  await kit.photo(s, 'dash-device.png', dx, 1.6, dw, dw * 920 / 1600, { fit: 'contain', alt: 'TMS device dashboard' });
  const sw = (dw - 0.2) / 2, sh = sw * 1000 / 1600, sy = 1.6 + dw * 920 / 1600 + 0.2;
  await kit.photo(s, 'dash-fleet.png', dx, sy, sw, sh, { fit: 'contain', alt: 'Fleet device map' });
  await kit.photo(s, 'dash-alerts.png', dx + sw + 0.2, sy, sw, sh, { fit: 'contain', alt: 'Alerts and tickets' });
}

async function soundboxBrokerSlide(kit, num) {
  const { C, pres } = kit;
  const s = kit.content('MQTT broker — instant, secure announcements', `${num} · End-to-end soundbox ecosystem`);
  kit.text(s, 'Carrier-grade, isolated messaging infrastructure delivering payment voice confirmations in under 200 ms with end-to-end cryptographic integrity.',
    { x: M, y: 1.6, w: CW, h: 0.55, fontSize: 13, color: C.text2 });

  const cards = [
    ['FiShare2', 'Dedicated connection', 'MQTT traffic isolated on its own fast-path to prevent network congestion and guarantee ultra-low latency.'],
    ['FiLock', 'TLS 1.2 encryption', 'Hardware-accelerated end-to-end encryption, MITM protection, and verified data integrity in transit.'],
    ['FiServer', 'Centralised broker', 'Streamlined broker architecture for simplified access control, ACLs, and enterprise policy enforcement at scale.'],
    ['FiFeather', 'Lightweight by design', 'Minimal packet overhead, QoS 1 delivery, and optimized keep-alive intervals tailored for battery-operated soundboxes.'],
  ];

  const colW = 3.35;
  cards.forEach(([ic, title, body], i) => {
    const x = M + (i % 2) * (colW + 0.25);
    const y = 2.3 + Math.floor(i / 2) * 2.15;
    kit.card(s, x, y, colW, 2.0);
    kit.icon(s, ic, x + 0.25, y + 0.25, 0.45, { circle: true });
    kit.text(s, title, { x: x + 0.85, y: y + 0.28, w: colW - 1.05, h: 0.35, fontSize: 14.5, bold: true });
    kit.text(s, body, { x: x + 0.25, y: y + 0.82, w: colW - 0.5, h: 1.0, fontSize: 11.5, color: C.text2 });
  });

  // Right side: Dashboard screen + metrics
  const dx = 7.9, dw = W - M - dx;
  kit.card(s, dx, 2.3, dw, 4.15, { fill: C.background2, line: 'D9D9D9' });
  await kit.photo(s, 'dash-device.png', dx + 0.2, 2.45, dw - 0.4, 2.3, { fit: 'contain', alt: 'TMS dashboard preview' });

  const metrics = [
    ['< 200 ms', 'Voice announcement latency'],
    ['TLS 1.2', 'Bank-grade payload encryption'],
    ['99.99%', 'Delivery success rate'],
  ];
  const mw = (dw - 0.6) / 3;
  metrics.forEach(([val, lbl], i) => {
    const mx = dx + 0.25 + i * (mw + 0.05);
    kit.card(s, mx, 4.95, mw, 1.25, { fill: C.background1 });
    kit.text(s, val, { x: mx + 0.05, y: 5.1, w: mw - 0.1, h: 0.4, fontSize: 17, bold: true, align: 'center', color: C.text1 });
    kit.text(s, lbl, { x: mx + 0.05, y: 5.55, w: mw - 0.1, h: 0.55, fontSize: 9.5, color: C.text2, align: 'center' });
  });
}

function expertiseSlide(kit, num) {
  const { C } = kit;
  const s = kit.content('Engineering expertise', `${num} · Expertise`);
  const items = [
    ['FiHeart', 'Medical electronics', 'Life-critical device design with full regulatory compliance.'],
    ['FiCpu', 'Embedded systems & IoT', 'Firmware, RTOS and cloud-connected embedded solutions.'],
    ['FiLayers', 'PCB design & fabrication', 'Multi-layer, HDI and flex PCBs for high-volume production.'],
    ['FiSettings', 'Manufacturing & assembly', '4 SMT lines, 500K+ units per month, 99.8% yield.'],
    ['FiCheckCircle', 'Quality & compliance', 'ISO 13485 quality management with full traceability.'],
    ['FiShield', 'Payment hardware security', 'PCI PTS, EMVCo and NPCI certified terminal design.'],
    ['FiCode', 'Software & firmware', 'Full-stack firmware, drivers and companion apps.'],
    ['FiGlobe', 'Supply chain & logistics', 'Global component sourcing and door-to-door delivery.'],
  ];
  const cw = (CW - 3 * 0.3) / 4, ch = 2.25;
  items.forEach(([icon, title, body], i) => {
    const x = M + (i % 4) * (cw + 0.3), y = 1.75 + Math.floor(i / 4) * (ch + 0.3);
    kit.card(s, x, y, cw, ch);
    kit.icon(s, icon, x + 0.3, y + 0.3, 0.46, { circle: true });
    kit.text(s, title, { x: x + 0.3, y: y + 0.88, w: cw - 0.6, h: 0.62, fontSize: 15, bold: true, valign: 'bottom' });
    kit.text(s, body, { x: x + 0.3, y: y + 1.58, w: cw - 0.6, h: 0.62, fontSize: 12, color: C.text2 });
  });
}

// ─── Decks ────────────────────────────────────────────────────────────
async function buildCompanyDeck() {
  const pres = createDeck({ title: 'Walnut Technologies — Company Presentation', subject: 'Company profile: about, journey, infrastructure, products' });
  await defineLayouts(pres);
  const kit = makeKit(pres); kit.pres = pres;

  kit.section('Introduction');
  await coverSlide(kit, {
    eyebrow: 'Company presentation 2026',
    title: 'Intelligent Embedded Systems, Engineered for a Connected World', titleSize: 32,
    subtitle: 'End-to-end design, development and manufacturing partner (ODM/OEM) for medical devices, neuro-rehabilitation robotics, Payment system and its software eco-system, IoT and automotive electronics.',
    image: 'building.jpg', position: 'centre',
    light: true,
  });
  kit.section('About');
  await aboutGlanceSlide(kit);
  await missionStrengthsSlide(kit);
  kit.section('Journey');
  await journeySlide(kit);
  kit.section('Infrastructure');
  await infrastructureSlide(kit);
  await processSlide(kit);
  kit.section('Products');
  await productsDividerSlide(kit);
  await medicalSlide(kit, '04');
  await neuroSlide(kit, '04');
  await fintechSlide(kit, '04');
  await soundboxTmsSlide(kit, '04');
  await soundboxBrokerSlide(kit, '04');
  await automotiveIotOverviewSlide(kit, '04');
  await clusterHeroSlide(kit, '04');
  await mirroringSlide(kit, '04');
  await gpsSlide(kit, '04');
  await gpsSpecsSlide(kit, '04');
  await gatewaySlide(kit, '04');
  await smartLockDashboardSlide(kit, '04');
  await dashcamSlide(kit, '04');
  kit.section('Clients');
  await clientsSlide(kit, '05');
  kit.section('Contact');
  await contactSlide(kit);

  const file = path.join(OUT_DIR, 'Walnut-Company-Presentation.pptx');
  await pres.writeFile({ fileName: file });
  await applyTheme(file, THEME);
  return file;
}

async function buildAutomotiveIotDeck() {
  const pres = createDeck({ title: 'Walnut Technologies — Automotive & IoT Solutions', subject: 'Smart instrument clusters, GPS tracker & gateway, IoT devices' });
  await defineLayouts(pres);
  const kit = makeKit(pres); kit.pres = pres;

  kit.section('Introduction');
  await coverSlide(kit, {
    eyebrow: 'Automotive & IoT solutions',
    title: 'Smart clusters,\nconnected devices',
    subtitle: 'Smart instrument clusters with phone screen mirroring, GPS trackers and gateways, and IoT devices — designed and manufactured in India by Walnut Technologies.',
    image: 'cluster-maps.jpg',
  });
  kit.section('About');
  await aboutSlide(kit, { focus: 'smart instrument clusters, telematics and IoT devices' });
  await glanceSlide(kit);
  await leadershipSlide(kit);
  kit.section('Journey');
  await journeySlide(kit);
  kit.section('Infrastructure');
  await dividerSlide(kit, '03', 'Infrastructure & manufacturing', 'In-house electronics design, SMT, testing and quality — from prototype to 500K+ units a month.', 'real-line.jpg');
  await infrastructureSlide(kit);
  await processSlide(kit);
  await qualitySlide(kit);
  kit.section('Automotive');
  await dividerSlide(kit, '04', 'Automotive electronics', 'Smart instrument clusters in 5-inch and 7-inch, with Google Maps navigation through phone screen mirroring.', 'j-cluster-maps.png', { contain: 'white' });
  await clusterHeroSlide(kit, '04');
  await clusterOptionsSlide(kit, '04');
  await mirroringSlide(kit, '04');
  clusterFeaturesSlide(kit, '04');
  automotiveCapabilitiesSlide(kit, '04');
  await agriSuiteSlide(kit, '04');
  kit.section('IoT');
  await dividerSlide(kit, '05', 'IoT solutions', 'GPS tracker & gateway, 4G smart lock, connected payment devices and the cloud platform behind them.', 'j-tracker.png', { contain: 'white' });
  await gpsSlide(kit, '05');
  await gpsSpecsSlide(kit, '05');
  await gatewaySlide(kit, '05');
  await lockSlide(kit, '05');
  await paymentIotSlide(kit, '05');
  iotCapabilitiesSlide(kit, '05');
  kit.section('Clients & contact');
  await clientsSlide(kit, '06');
  await contactSlide(kit);

  const file = path.join(OUT_DIR, 'Walnut-Automotive-IoT-Presentation.pptx');
  await pres.writeFile({ fileName: file });
  await applyTheme(file, THEME);
  return file;
}

(async () => {
  fs.rmSync(CACHE, { recursive: true, force: true });
  fs.mkdirSync(CACHE, { recursive: true });
  const files = [await buildCompanyDeck(), await buildAutomotiveIotDeck()];
  files.forEach((f) => console.log('wrote', f));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
