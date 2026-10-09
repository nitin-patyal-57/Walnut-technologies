import {
  products,
  divisions,
  trustSignals,
  process as processSteps,
  brand,
  about,
  expertise,
  clientSectors,
} from './content';

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'am', 'was', 'were', 'be', 'been', 'being', 'do', 'does', 'did',
  'what', 'which', 'who', 'whom', 'whose', 'when', 'where', 'why', 'how', 'can', 'could', 'would',
  'should', 'will', 'shall', 'may', 'might', 'must', 'i', 'you', 'we', 'they', 'he', 'she', 'it',
  'my', 'your', 'our', 'their', 'his', 'her', 'its', 'me', 'us', 'them', 'this', 'that', 'these',
  'those', 'of', 'in', 'on', 'at', 'to', 'for', 'from', 'by', 'with', 'without', 'about', 'and',
  'or', 'not', 'no', 'yes', 'please', 'tell', 'show', 'give', 'have', 'has', 'had', 'want', 'need',
  'get', 'got', 'make', 'made', 'much', 'many', 'more', 'most', 'some', 'any', 'all', 'into',
  'there', 'here', 'just', 'also', 'too', 'very', 'really', 'something', 'anything', 'one', 'two',
  'if', 'then', 'than', 'as', 'so', 'up', 'out', 'off', 'over', 'under', 'per', 'via', 'each',
  'both', 'other', 'another', 'using', 'use', 'used', 'like', 'well', 'back', 'only', 'even',
]);

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  return normalize(text)
    .split(' ')
    .filter((w) => w && w.length > 1 && !STOPWORDS.has(w));
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function list(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

const PRODUCT_ALIASES = {
  walklab: ['walk lab', 'gait training', 'gait trainer', 'gait system', 'rehab robot', 'rehabilitation robot', 'neuro robot'],
  'bp-monitor': ['bp monitor', 'bp machine', 'blood pressure machine', 'sphygmomanometer'],
  thermometer: ['temperature meter', 'infrared thermometer', 'temperature gun'],
  'oxygen-concentrator': ['oxygen', 'o2', 'oxygen machine', 'concentrator'],
  nebulizer: ['nebuliser', 'compressor nebulizer', 'nebulizer machine'],
  'single-sim': ['single sim soundbox', '1 sim model'],
  'double-sim': ['double sim soundbox', 'dual sim', 'dual sim soundbox'],
  'with-display': ['display soundbox', 'soundbox with display', 'lcd soundbox'],
  'common-model': ['common soundbox'],
  'dqr-double-display': ['double display', 'dual display soundbox', 'two display soundbox'],
  'all-in-one': ['all in one soundbox', 'allinone'],
  rtos: ['rtos soundbox'],
  dqr: ['digital qr', 'qr soundbox', 'dqr soundbox'],
  ldqr: ['large display qr', '10 inch soundbox', 'touch screen soundbox', 'nfc soundbox', 'nfc terminal'],
  cluster: ['cluster display', 'instrument cluster', 'dashboard display', 'car cluster', 'vehicle cluster'],
  'iot-smart-lock': ['smart lock', 'iot lock', 'smart lock system'],
};

const DIVISION_ALIASES = {
  neuro: ['neuro', 'neuro rehab', 'neuro rehabilitation', 'rehab', 'rehabilitation', 'robotics division', 'robotics'],
  medical: ['medical devices', 'medical device', 'healthcare devices', 'clinical devices', 'medical division'],
  fintech: ['fintech', 'payment', 'payments', 'payment systems', 'payment terminal', 'payment terminals', 'soundbox', 'sound box', 'soundboxes', 'pos', 'upi', 'qr payment'],
  automotive: ['automotive', 'vehicle electronics', 'harvester'],
  iot: ['iot', 'connected devices', 'smart devices', 'iot solutions'],
};

function firstSegment(title) {
  return normalize(title.replace(/[:–-].*$/, ''));
}

const KB = [];

for (const p of products) {
  const aliases = PRODUCT_ALIASES[p.id] || [];
  const aliasText = aliases.join(' ');
  KB.push({
    kind: 'product',
    phrases: uniq([normalize(p.title), firstSegment(p.title), ...aliases.map(normalize)]),
    tokens: new Set(uniq([
      ...tokenize(p.title),
      ...tokenize(p.category),
      ...tokenize(aliasText),
      ...p.id.split('-'),
    ])),
    answer: `${p.title} (${p.category})\n\n${p.description}\n\nKey features:\n${list(p.features)}`,
  });
}

for (const d of divisions) {
  const aliases = DIVISION_ALIASES[d.id] || [];
  const aliasText = aliases.join(' ');
  const productNames = d.products.map((p) => p.name);
  KB.push({
    kind: 'division',
    phrases: uniq([normalize(d.title), firstSegment(d.title), ...aliases.map(normalize)]),
    tokens: new Set(uniq([
      ...tokenize(d.title),
      ...tokenize(d.subtitle),
      ...tokenize(aliasText),
      ...d.id.split('-'),
    ])),
    answer: `${d.title} — ${d.subtitle}\n\n${d.description}\n\nHighlights: ${d.features.join(', ')}\n\nProducts: ${productNames.join(', ')}`,
  });
}

KB.push(
  {
    kind: 'certifications',
    phrases: ['certification', 'certifications', 'certified', 'certificates', 'iso', 'iso 13485', 'iso 9001', 'quality certifications', 'quality standards', 'compliance', 'standards'],
    tokens: new Set(['certification', 'certifications', 'certified', 'iso', '13485', '9001', 'ce', 'fcc', 'pci', 'dss', 'iec', '60601', 'bis', 'compliance', 'standards', 'regulatory']),
    answer: `Our certifications & standards:\n${list(trustSignals.certifications)}\n- ISO 9001 certified processes\n- EMV L1/L2 for payment devices`,
  },
  {
    kind: 'capabilities',
    phrases: ['capability', 'capabilities', 'facility', 'facilities', 'cleanroom', 'smt', 'capacity', 'production capacity', 'manufacturing capacity', 'yield', 'yield rate', 'sq ft', 'square feet', 'factory'],
    tokens: new Set(['capability', 'capabilities', 'facility', 'cleanroom', 'smt', 'capacity', 'yield', 'production', 'manufacturing', 'lines', 'engineers', 'units', 'month']),
    answer: `Our key capabilities:\n- 150,000 sq.ft facility\n- Class 10K cleanroom\n- 4 SMT production lines\n- 500K+ units/month capacity\n- 99.8% yield rate\n- 600+ engineers & technicians\n- ISO 13485 & ISO 9001 certified\n- Serving 10+ countries`,
  },
  {
    kind: 'process',
    phrases: ['process', 'manufacturing process', 'production process', 'workflow', 'how do you manufacture', 'how are products made', 'end to end', 'stages'],
    tokens: new Set(['process', 'manufacturing', 'production', 'workflow', 'stages', 'steps']),
    answer: `Our end-to-end manufacturing process:\n${processSteps.map((s) => `${s.step}. ${s.title}`).join('\n')}`,
  },
  {
    kind: 'contact',
    phrases: ['contact', 'contact info', 'contact information', 'phone', 'email', 'mail', 'address', 'location', 'where are you', 'where is your office', 'reach you', 'call you', 'number'],
    tokens: new Set(['contact', 'phone', 'email', 'address', 'location', 'office', 'number', 'reach', 'call', 'mail']),
    answer: `Reach us:\n- Phone: ${brand.phone}\n- Email: ${brand.email}\n- Address: ${brand.location}\n\nWorking hours: Mon-Sat, 9 AM - 6 PM IST`,
  },
  {
    kind: 'about',
    phrases: ['about', 'about us', 'about the company', 'company', 'who are you', 'who is walnut', 'walnut technologies', 'founded', 'history', 'story'],
    tokens: new Set(['company', 'walnut', 'technologies', 'founded', 'history', 'headquarters', 'about']),
    answer: `${about.story}\n\nFounded: ${brand.founded}\nStats: ${about.stats.map((s) => `${s.value} ${s.label}`).join(' | ')}`,
  },
  {
    kind: 'clients',
    phrases: ['clients', 'customers', 'partners', 'brands', 'sectors', 'who do you serve'],
    tokens: new Set(['clients', 'customers', 'partners', 'brands', 'sectors', 'serve']),
    answer: `We serve clients across sectors:\n${clientSectors.map((s) => `- ${s.sector}${s.clients.length ? ': ' + s.clients.join(', ') : ''}`).join('\n')}`,
  },
  {
    kind: 'expertise',
    phrases: ['expertise', 'services', 'oem', 'odm', 'pcb', 'firmware', 'design and engineering', 'what do you do'],
    tokens: new Set(['expertise', 'services', 'oem', 'odm', 'pcb', 'firmware', 'engineering', 'design']),
    answer: `Our core expertise:\n${list(expertise.map((e) => e.title))}\n\nAsk about any of these for details.`,
  },
  {
    kind: 'careers',
    phrases: ['career', 'careers', 'jobs', 'job', 'hiring', 'vacancy', 'vacancies', 'work with you', 'openings'],
    tokens: new Set(['career', 'careers', 'job', 'jobs', 'hiring', 'vacancy', 'vacancies', 'openings', 'apply']),
    answer: 'We are hiring! Visit the Careers page to see open positions across R&D, manufacturing, and quality teams. You can also email your resume to ' + brand.email + '.',
  },
  {
    kind: 'global',
    phrases: ['countries', 'global presence', 'how many countries', 'where do you sell'],
    tokens: new Set(['countries', 'global', 'presence', 'worldwide', 'international']),
    answer: `Global presence:\n- Serving 10+ countries\n- Vision: 50+ countries by 2030\n- Clients across healthcare, defence, banking, and pharma sectors`,
  }
);

export function searchKnowledge(query) {
  const q = normalize(query);
  if (!q) return null;
  const qTokens = new Set(tokenize(query));
  let best = null;
  let bestScore = 0;
  for (const entry of KB) {
    let score = 0;
    for (const phrase of entry.phrases) {
      if (phrase && q.includes(phrase)) score += 4 + phrase.split(' ').length * 2;
    }
    for (const token of qTokens) {
      if (entry.tokens.has(token)) score += token.length >= 6 ? 3 : token.length >= 4 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return bestScore >= 3 ? best : null;
}
