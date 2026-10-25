// Soundbox TMS (terminal management system) dashboard mock-ups (vector → PNG), styled like the Walnut soundbox TMS.
// Called from prepare-assets.mjs. These are illustrative screens, not live screenshots.
import sharp from 'sharp';

const F = 'font-family="Arial, Helvetica, sans-serif"';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function frame(w, h, active, body) {
  const items = ['Dashboard', 'Manage admins', 'Manage users', 'Categories', 'Fleets', 'Task scheduler', 'OTA update', 'Alerts'];
  const side = items.map((t, i) => {
    const y = 120 + i * 52;
    const on = t === active;
    return `${on ? `<rect x="22" y="${y - 26}" width="196" height="40" rx="10" fill="#111111"/>` : ''}
      <rect x="40" y="${y - 14}" width="16" height="16" rx="4" fill="none" stroke="${on ? '#ffffff' : '#8c8c8c'}" stroke-width="2"/>
      <text x="70" y="${y}" ${F} font-size="16" fill="${on ? '#ffffff' : '#5e5e5e'}" font-weight="${on ? 700 : 400}">${t}</text>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="22" fill="#ffffff"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="22" fill="none" stroke="#e1e1e1"/>
  <rect x="240" y="0" width="1" height="${h}" fill="#ececec"/>
  <rect x="24" y="24" width="30" height="30" rx="7" fill="#111111"/>
  <text x="31" y="45" ${F} font-size="13" font-weight="700" fill="#ffffff">W</text>
  <text x="64" y="45" ${F} font-size="16" font-weight="700" fill="#111111">Walnut TMS</text>
  ${side}
  <rect x="${w - 330}" y="22" width="150" height="36" rx="18" fill="#f3f3f3"/>
  <text x="${w - 310}" y="46" ${F} font-size="14" fill="#8c8c8c">Search</text>
  <circle cx="${w - 130}" cy="40" r="16" fill="#e9e9e9"/>
  <text x="${w - 105}" y="36" ${F} font-size="14" font-weight="700" fill="#111111">Fleet admin</text>
  <text x="${w - 105}" y="54" ${F} font-size="12" fill="#8c8c8c">Super admin</text>
  <rect x="241" y="78" width="${w - 241}" height="1" fill="#ececec"/>
  ${body}
</svg>`;
}

function tile(x, y, w, h, label, value, accent = '#111111', bar = null) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#ffffff" stroke="#e6e6e6"/>
    <text x="${x + 18}" y="${y + 32}" ${F} font-size="14" fill="#8c8c8c">${esc(label)}</text>
    <text x="${x + 18}" y="${y + 72}" ${F} font-size="26" font-weight="700" fill="#111111">${esc(value)}</text>
    <circle cx="${x + w - 30}" cy="${y + 56}" r="13" fill="none" stroke="${accent}" stroke-width="3"/>
    ${bar !== null ? `<rect x="${x + 18}" y="${y + h - 22}" width="${w - 36}" height="6" rx="3" fill="#efefef"/>
    <rect x="${x + 18}" y="${y + h - 22}" width="${(w - 36) * bar}" height="6" rx="3" fill="${accent}"/>` : ''}`;
}

export function deviceSvg() {
  const w = 1600, h = 920;
  const x0 = 270, tw = 310, th = 120, gx = 22, gy = 22;
  const tiles = [
    ['On/off status', 'ON', '#1e8e3e'], ['USB plugged', 'True', '#111111'], ['Battery level', '85%', '#1e8e3e', 0.85], ['Volume level', '7', '#111111', 0.7],
    ['Network performance', '75%', '#1e8e3e', 0.75], ['Network type', '4G', '#111111'], ['Txn playback delay', '2 sec', '#111111'], ['Txn success rate', '98%', '#1e8e3e', 0.98],
    ['SDK version', 'v5.12.0', '#111111'], ['App version', 'v3.9.2', '#111111'], ['Resource version', 'v1.8.3', '#111111'], ['Temperature', '35 °C', '#e8a317'],
  ];
  const body = `
  <text x="${x0}" y="118" ${F} font-size="14" fill="#8c8c8c">Dashboard  ›  Device name 4</text>
  <text x="${x0}" y="158" ${F} font-size="30" font-weight="700" fill="#111111">Device name 4</text>
  <text x="${x0}" y="188" ${F} font-size="15" fill="#5e5e5e">IMEI 86205 07749 2749  ·  4G payment soundbox  ·  Fleet: Retail North</text>
  <circle cx="${w - 150}" cy="152" r="7" fill="#1e8e3e"/><text x="${w - 136}" y="158" ${F} font-size="16" font-weight="700" fill="#1e8e3e">Active</text>
  <rect x="${w - 330}" y="130" width="120" height="40" rx="10" fill="#111111"/><text x="${w - 300}" y="156" ${F} font-size="15" font-weight="700" fill="#ffffff">Export</text>
  <rect x="${x0}" y="210" width="${w - x0 - 30}" height="56" rx="12" fill="#f6f6f6"/>
  <text x="${x0 + 20}" y="245" ${F} font-size="15" fill="#5e5e5e">Merchant ID <tspan font-weight="700" fill="#111111">M12345</tspan>  ·  Merchant <tspan font-weight="700" fill="#111111">Name</tspan>  ·  Bind state <tspan font-weight="700" fill="#111111">Bound</tspan>  ·  SIM ICCID <tspan font-weight="700" fill="#111111">8991 0000 0000 0000</tspan></text>
  ${tiles.map(([l, v, a, b], i) => tile(x0 + (i % 4) * (tw + gx), 290 + Math.floor(i / 4) * (th + gy), tw, th, l, v, a, b ?? null)).join('')}
  <text x="${x0}" y="${290 + 3 * (th + gy) + 30}" ${F} font-size="18" font-weight="700" fill="#111111">Recent activity</text>
  ${['OTA app v3.9.2 installed  ·  2 h ago', 'Payment announced: Rs 450 in 2.0 sec  ·  3 min ago', 'Bound to merchant M12345 (OTP verified)  ·  5 d ago']
    .map((t, i) => `<circle cx="${x0 + 8}" cy="${290 + 3 * (th + gy) + 62 + i * 34}" r="5" fill="#111111"/><text x="${x0 + 24}" y="${290 + 3 * (th + gy) + 68 + i * 34}" ${F} font-size="15" fill="#5e5e5e">${t}</text>`).join('')}`;
  return frame(w, h, 'Dashboard', body);
}

export function fleetSvg() {
  const w = 1600, h = 1000, x0 = 270;
  const pins = [[520, 420, '#1e8e3e'], [700, 330, '#1e8e3e'], [860, 520, '#e8a317'], [610, 610, '#1e8e3e'], [960, 380, '#d93025'], [780, 690, '#1e8e3e'], [470, 760, '#1e8e3e']];
  const rows = [['Device 4 · M12345', 'Online · 4G · 85% battery', '#1e8e3e'], ['Device 7 · M20981', 'Low battery · 12%', '#e8a317'], ['Device 12 · M33104', 'Offline · 6 h', '#d93025'], ['Device 15 · M40877', 'Online · Wi-Fi', '#1e8e3e'], ['Device 21 · M51230', 'OTA pending', '#8c8c8c'], ['Device 33 · M60415', 'Online · 4G', '#1e8e3e']];
  const body = `
  <text x="${x0}" y="128" ${F} font-size="28" font-weight="700" fill="#111111">Fleet · Live device map</text>
  <rect x="${x0}" y="160" width="800" height="790" rx="16" fill="#eef0f2"/>
  <path d="M ${x0} 400 L ${x0 + 800} 330 M ${x0 + 220} 160 L ${x0 + 300} 950 M ${x0 + 560} 160 L ${x0 + 620} 950 M ${x0} 760 L ${x0 + 800} 700" stroke="#ffffff" stroke-width="22" fill="none"/>
  <path d="M ${x0 + 540} 700 q 120 -40 260 0 v 250 h -260 z" fill="#c9e7c4"/>
  ${pins.map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="18" fill="${c}" stroke="#ffffff" stroke-width="5"/>`).join('')}
  <rect x="1100" y="160" width="470" height="790" rx="16" fill="#ffffff" stroke="#e6e6e6"/>
  <text x="1124" y="200" ${F} font-size="18" font-weight="700" fill="#111111">Devices (12,480)</text>
  ${rows.map(([n, s, c], i) => `<rect x="1120" y="${222 + i * 112}" width="430" height="96" rx="12" fill="#f7f7f7"/>
    <circle cx="1150" cy="${270 + i * 112}" r="9" fill="${c}"/>
    <text x="1172" y="${262 + i * 112}" ${F} font-size="18" font-weight="700" fill="#111111">${n}</text>
    <text x="1172" y="${290 + i * 112}" ${F} font-size="15" fill="#5e5e5e">${s}</text>`).join('')}`;
  return frame(w, h, 'Fleets', body);
}

export function alertsSvg() {
  const w = 1600, h = 1000, x0 = 270;
  const alerts = [['Device offline', 'Device 12 · no heartbeat for 6 h', '#d93025'], ['Low battery', 'Device 7 · 12% remaining', '#e8a317'], ['Playback delay high', 'Device 33 · 6.4 sec average', '#e8a317'],
    ['Location change', 'Device 21 · moved 4 km from merchant', '#1a73e8'], ['OTA update completed', '11,940 devices · app v3.9.2', '#1e8e3e']];
  const jobs = [['OTA-2026-041', 'App v3.9.2 · 12,480 devices', 'Completed'], ['ADV-2026-018', 'Festive offer audio · Retail North', 'Scheduled'], ['WM-Serv-2026-117', 'Ticket · Device 12 offline', 'Open']];
  const body = `
  <text x="${x0}" y="128" ${F} font-size="28" font-weight="700" fill="#111111">Alerts &amp; tickets</text>
  ${alerts.map(([t, d, c], i) => `<rect x="${x0}" y="${160 + i * 150}" width="650" height="130" rx="14" fill="#ffffff" stroke="#e6e6e6"/>
    <rect x="${x0 + 20}" y="${186 + i * 150}" width="10" height="78" rx="5" fill="${c}"/>
    <text x="${x0 + 50}" y="${214 + i * 150}" ${F} font-size="20" font-weight="700" fill="#111111">${t}</text>
    <text x="${x0 + 50}" y="${248 + i * 150}" ${F} font-size="16" fill="#5e5e5e">${d}</text>`).join('')}
  <text x="960" y="190" ${F} font-size="18" font-weight="700" fill="#111111">Jobs &amp; tickets</text>
  ${jobs.map(([id, d, st], i) => `<rect x="960" y="${210 + i * 170}" width="610" height="150" rx="14" fill="#f7f7f7"/>
    <text x="984" y="${252 + i * 170}" ${F} font-size="20" font-weight="700" fill="#111111">${id}</text>
    <text x="984" y="${288 + i * 170}" ${F} font-size="16" fill="#5e5e5e">${d}</text>
    <rect x="984" y="${306 + i * 170}" width="${st.length * 11 + 30}" height="32" rx="16" fill="#111111"/>
    <text x="999" y="${328 + i * 170}" ${F} font-size="15" font-weight="700" fill="#ffffff">${st}</text>`).join('')}`;
  return frame(w, h, 'Alerts', body);
}

export async function renderDashboards(outFn) {
  for (const [name, svg] of [['dash-device.png', deviceSvg()], ['dash-fleet.png', fleetSvg()], ['dash-alerts.png', alertsSvg()]]) {
    await sharp(Buffer.from(svg)).png().toFile(outFn(name));
  }
}
