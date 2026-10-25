// Stylised visuals built from the company's own photos and products.
//  - hudPhoto: real factory photo → high-contrast monochrome with a tech/HUD overlay
//  - productOrbit: products arranged on a ring around the WM logo ("connected world")
import sharp from 'sharp';

const F = 'font-family="Arial, Helvetica, sans-serif"';

export async function hudPhoto(input, output, { index, caption, w = 900, h = 1100 }) {
  const base = await sharp(input).rotate().resize(w, h, { fit: 'cover', position: 'attention' })
    .modulate({ saturation: 1.18, brightness: 1.04 }).linear(1.1, -8).sharpen({ sigma: 0.8 }).toBuffer();
  const c = 46, inset = 34, stroke = 'rgba(255,255,255,0.9)';
  const grid = [];
  for (let x = 90; x < w; x += 90) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`);
  for (let y = 90; y < h; y += 90) grid.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`);
  const corner = (x, y, dx, dy) => `<path d="M ${x} ${y + dy * c} L ${x} ${y} L ${x + dx * c} ${y}" fill="none" stroke="${stroke}" stroke-width="5"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.25"/><stop offset="0.25" stop-color="#000" stop-opacity="0"/>
      <stop offset="0.68" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.75"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    
    ${corner(inset, inset, 1, 1)}${corner(w - inset, inset, -1, 1)}${corner(inset, h - inset, 1, -1)}${corner(w - inset, h - inset, -1, -1)}
    <circle cx="${w - 110}" cy="110" r="26" fill="none" stroke="${stroke}" stroke-width="3"/>
    <line x1="${w - 150}" y1="110" x2="${w - 70}" y2="110" stroke="${stroke}" stroke-width="2"/>
    <line x1="${w - 110}" y1="70" x2="${w - 110}" y2="150" stroke="${stroke}" stroke-width="2"/>
    <text x="78" y="128" ${F} font-size="64" font-weight="700" fill="#ffffff">${index}</text>
    <rect x="78" y="146" width="70" height="5" fill="#ffffff"/>
    <text x="78" y="${h - 96}" ${F} font-size="40" font-weight="700" fill="#ffffff" letter-spacing="3">${caption.toUpperCase().replace(/&/g, '&amp;')}</text>
    <text x="78" y="${h - 56}" ${F} font-size="24" fill="rgba(255,255,255,0.75)" letter-spacing="4">WALNUT TECHNOLOGIES · IN-HOUSE</text>
  </svg>`;
  await sharp(base).composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 88 }).toFile(output);
}

// products: [{ file, label }]; logo: WM mark (PNG)
export async function productOrbit(products, logo, output, { w = 1200, h = 1150, light = false } = {}) {
  const cx = w / 2, cy = h / 2, R = 350, node = 82;
  const pts = products.map((p, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / products.length;
    return { ...p, a, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  const bg = light ? '#ffffff' : '#111111';
  const dotFill = light ? '#111111' : '#ffffff';
  const dotOpacity = light ? '0.04' : '0.06';
  const r1Stroke = light ? '#e2e8f0' : '#2a2a2a';
  const r2Stroke = light ? '#94a3b8' : '#5e5e5e';
  const r3Stroke = light ? '#cbd5e1' : '#3a3a3a';
  const lineStroke = light ? '#cbd5e1' : '#3a3a3a';
  const centerFill = light ? '#f8fafc' : '#1e1e1e';
  const centerStroke = light ? '#111111' : '#ffffff';
  const nodeStroke = light ? '#cbd5e1' : '#ffffff';
  const nodeRing = light ? '#64748b' : '#ffffff';
  const textFill = light ? '#111111' : '#ffffff';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="${bg}"/>
    <g fill="${dotFill}" fill-opacity="${dotOpacity}">${Array.from({ length: Math.floor(w / 40) * Math.floor(h / 40) }, (_, k) => {
      const x = 20 + (k % Math.floor(w / 40)) * 40, y = 20 + Math.floor(k / Math.floor(w / 40)) * 40;
      return `<circle cx="${x}" cy="${y}" r="2"/>`;
    }).join('')}</g>
    <circle cx="${cx}" cy="${cy}" r="${R + 120}" fill="none" stroke="${r1Stroke}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${r2Stroke}" stroke-width="3" stroke-dasharray="4 14" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="170" fill="none" stroke="${r3Stroke}" stroke-width="2"/>
    ${pts.map((p) => `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="${lineStroke}" stroke-width="2"/>`).join('')}
    <circle cx="${cx}" cy="${cy}" r="130" fill="${centerFill}" stroke="${centerStroke}" stroke-width="3"/>
    ${pts.map((p) => {
      const cos = Math.cos(p.a);
      const sin = Math.sin(p.a);
      let lx, ly, anchor;
      if (cos > 0.4) {
        anchor = 'start';
        lx = p.x + node + 18;
        ly = p.y + 8;
      } else if (cos < -0.4) {
        anchor = 'end';
        lx = p.x - node - 18;
        ly = p.y + 8;
      } else {
        anchor = 'middle';
        lx = p.x;
        ly = sin < 0 ? p.y - node - 20 : p.y + node + 34;
      }
      return `<circle cx="${p.x}" cy="${p.y}" r="${node}" fill="#ffffff" stroke="${nodeStroke}" stroke-width="2"/>
      <circle cx="${p.x}" cy="${p.y}" r="${node + 8}" fill="none" stroke="${nodeRing}" stroke-opacity="0.35" stroke-width="2"/>
      <text x="${lx}" y="${ly}" ${F} font-size="24" font-weight="700" fill="${textFill}" text-anchor="${anchor}">${p.label}</text>`;
    }).join('')}
  </svg>`;
  const layers = [];
  for (const p of pts) {
    const size = Math.round(node * 1.45);
    const img = await sharp(p.file).resize(size, size, { fit: 'contain', background: '#ffffff' }).flatten({ background: '#ffffff' }).png().toBuffer();
    layers.push({ input: img, left: Math.round(p.x - size / 2), top: Math.round(p.y - size / 2) });
  }
  const lw = 200;
  const lg = await sharp(logo).resize({ width: lw }).png().toBuffer({ resolveWithObject: true });
  layers.push({ input: lg.data, left: Math.round(cx - lw / 2), top: Math.round(cy - lg.info.height / 2) });
  await sharp(Buffer.from(svg)).composite(layers).png().toFile(output);
}
