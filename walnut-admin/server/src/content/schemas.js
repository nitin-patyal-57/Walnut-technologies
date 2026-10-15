import { z } from 'zod';

// ─── Content model ────────────────────────────────────────────────────
// Every editable part of the website is described here once. The admin UI
// renders its forms from these definitions and the API validates with them,
// so adding a field = adding one line here (plus using it on the website).
//
// Field types: text, textarea, url, email, image, number, tags, select,
//              gradient (Tailwind "from-x to-y" classes), object, list.

const GRADIENT_HELP = 'Tailwind gradient classes, e.g. "from-cyan-500 to-blue-600"';
const ICON_HELP = 'Icon name used by the website component (ask a developer before changing)';

const stat = [
  { name: 'value', label: 'Value', type: 'text', required: true, max: 40 },
  { name: 'label', label: 'Label', type: 'text', required: true, max: 80 },
];

export const COLLECTIONS = [
  // ── Company ──
  {
    key: 'brand',
    label: 'Company Details',
    group: 'Company',
    kind: 'single',
    description: 'Name, contact details and social links shown in the header, footer, contact and legal pages.',
    fields: [
      { name: 'name', label: 'Short name', type: 'text', required: true, max: 80 },
      { name: 'fullName', label: 'Legal name', type: 'text', required: true, max: 120 },
      { name: 'tagline', label: 'Tagline', type: 'text', max: 120 },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea', max: 400 },
      { name: 'description', label: 'Short description (SEO)', type: 'textarea', max: 400 },
      { name: 'location', label: 'Address', type: 'textarea', max: 300 },
      { name: 'phone', label: 'Phone', type: 'text', max: 30 },
      { name: 'email', label: 'Contact email', type: 'email', max: 254 },
      { name: 'domain', label: 'Domain', type: 'text', max: 100 },
      { name: 'gstn', label: 'GSTN', type: 'text', max: 20 },
      { name: 'founded', label: 'Founded (year)', type: 'text', max: 4 },
      {
        name: 'social', label: 'Social links', type: 'object', fields: [
          { name: 'instagram', label: 'Instagram', type: 'url' },
          { name: 'linkedin', label: 'LinkedIn', type: 'url' },
          { name: 'youtube', label: 'YouTube', type: 'url' },
        ],
      },
    ],
  },
  {
    key: 'about',
    label: 'About Us',
    group: 'Company',
    kind: 'single',
    description: 'Mission, vision, story, values and stats on the About page.',
    fields: [
      { name: 'mission', label: 'Mission', type: 'textarea', max: 500 },
      { name: 'vision', label: 'Vision', type: 'textarea', max: 500 },
      { name: 'story', label: 'Our story', type: 'textarea', max: 3000 },
      {
        name: 'values', label: 'Values', type: 'list', itemLabel: 'title', fields: [
          { name: 'title', label: 'Title', type: 'text', required: true, max: 80 },
          { name: 'description', label: 'Description', type: 'textarea', max: 300 },
        ],
      },
      { name: 'stats', label: 'Stats', type: 'list', itemLabel: 'label', fields: stat },
    ],
  },
  {
    key: 'trustSignals',
    label: 'Trust Signals',
    group: 'Company',
    kind: 'single',
    description: 'Headline stats and certification badges used across the site.',
    fields: [
      { name: 'stats', label: 'Stats', type: 'list', itemLabel: 'label', fields: stat },
      { name: 'certifications', label: 'Certifications', type: 'tags', max: 60 },
    ],
  },

  // ── Products ──
  {
    key: 'divisions',
    label: 'Divisions',
    group: 'Products',
    kind: 'list',
    itemLabel: 'title',
    description: 'Business divisions (Medical, Fintech, IoT…) and the products listed under each.',
    fields: [
      { name: 'id', label: 'ID (url slug)', type: 'text', required: true, max: 40, slug: true },
      { name: 'title', label: 'Title', type: 'text', required: true, max: 80 },
      { name: 'subtitle', label: 'Subtitle', type: 'text', max: 150 },
      { name: 'description', label: 'Description', type: 'textarea', max: 600 },
      { name: 'icon', label: 'Icon', type: 'text', max: 30, help: ICON_HELP },
      { name: 'color', label: 'Colour', type: 'gradient', max: 80, help: GRADIENT_HELP },
      { name: 'features', label: 'Features', type: 'tags', max: 60 },
      {
        name: 'products', label: 'Products', type: 'list', itemLabel: 'name', fields: [
          { name: 'name', label: 'Name', type: 'text', required: true, max: 100 },
          { name: 'image', label: 'Image', type: 'image' },
        ],
      },
    ],
  },
  {
    key: 'products',
    label: 'Products',
    group: 'Products',
    kind: 'list',
    itemLabel: 'title',
    description: 'Product cards on the Solutions page.',
    fields: [
      { name: 'id', label: 'ID (url slug)', type: 'text', required: true, max: 60, slug: true },
      {
        name: 'category', label: 'Category', type: 'select', required: true,
        options: ['Neuro Rehab Devices', 'Medical', 'Fintech', 'Automotive', 'IoT'],
      },
      { name: 'title', label: 'Title', type: 'text', required: true, max: 120 },
      { name: 'description', label: 'Description', type: 'textarea', max: 1000 },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'features', label: 'Features', type: 'tags', max: 60 },
    ],
  },
  {
    key: 'expertise',
    label: 'Expertise',
    group: 'Products',
    kind: 'list',
    itemLabel: 'title',
    description: 'Expertise areas and their tags.',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, max: 100 },
      { name: 'description', label: 'Description', type: 'textarea', max: 500 },
      { name: 'icon', label: 'Icon', type: 'text', max: 30, help: ICON_HELP },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'areas', label: 'Areas', type: 'tags', max: 60 },
    ],
  },

  // ── Process ──
  {
    key: 'process',
    label: 'Production Process',
    group: 'Process',
    kind: 'list',
    itemLabel: 'title',
    description: 'The step-by-step end-to-end process.',
    fields: [
      { name: 'step', label: 'Step number', type: 'number', required: true, min: 1, max: 50 },
      { name: 'title', label: 'Title', type: 'text', required: true, max: 100 },
      { name: 'subtitle', label: 'Subtitle', type: 'text', max: 100 },
      { name: 'details', label: 'Details', type: 'tags', max: 80 },
      { name: 'icon', label: 'Icon', type: 'text', max: 30, help: ICON_HELP },
      { name: 'color', label: 'Colour', type: 'gradient', max: 80, help: GRADIENT_HELP },
    ],
  },
  {
    key: 'industryFourTechnologies',
    label: 'Industry 4.0 Technologies',
    group: 'Process',
    kind: 'list',
    itemLabel: 'title',
    description: 'Technology cards on the Process page.',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, max: 80 },
      { name: 'description', label: 'Description', type: 'textarea', max: 300 },
      { name: 'icon', label: 'Icon', type: 'text', max: 30, help: ICON_HELP },
    ],
  },
  {
    key: 'impactBenefits',
    label: 'Impact & Benefits',
    group: 'Process',
    kind: 'list',
    itemLabel: 'title',
    description: 'Benefit cards on the Process page.',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, max: 80 },
      { name: 'description', label: 'Description', type: 'textarea', max: 300 },
      { name: 'icon', label: 'Icon', type: 'text', max: 30, help: ICON_HELP },
    ],
  },

  // ── Clients & Resources ──
  {
    key: 'clientSectors',
    label: 'Client Sectors',
    group: 'Clients & Resources',
    kind: 'list',
    itemLabel: 'sector',
    description: 'Industries served and example clients.',
    fields: [
      { name: 'sector', label: 'Sector', type: 'text', required: true, max: 80 },
      { name: 'description', label: 'Description', type: 'textarea', max: 300 },
      { name: 'clients', label: 'Clients', type: 'tags', max: 80 },
      { name: 'icon', label: 'Icon', type: 'text', max: 30, help: ICON_HELP },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'gradient', label: 'Colour', type: 'gradient', max: 80, help: GRADIENT_HELP },
    ],
  },
  {
    key: 'resources',
    label: 'Resources',
    group: 'Clients & Resources',
    kind: 'list',
    itemLabel: 'title',
    description: 'Whitepapers, case studies and brochures visitors can request.',
    fields: [
      { name: 'id', label: 'ID', type: 'text', required: true, max: 60, slug: true },
      { name: 'title', label: 'Title', type: 'text', required: true, max: 200 },
      { name: 'type', label: 'Type', type: 'select', required: true, options: ['Whitepaper', 'Case Study', 'Brochure'] },
      { name: 'description', label: 'Description', type: 'textarea', max: 1000 },
      { name: 'icon', label: 'Icon', type: 'select', options: ['whitepaper', 'casestudy', 'brochure'] },
      { name: 'color', label: 'Colour', type: 'gradient', max: 80, help: GRADIENT_HELP },
    ],
  },
  {
    key: 'news',
    label: 'News',
    group: 'Clients & Resources',
    kind: 'list',
    itemLabel: 'title',
    description: 'News and announcements, newest first.',
    fields: [
      { name: 'id', label: 'ID', type: 'number', required: true, min: 1, max: 100000 },
      { name: 'date', label: 'Date (as displayed)', type: 'text', required: true, max: 40, help: 'e.g. "March 15, 2026"' },
      { name: 'title', label: 'Title', type: 'text', required: true, max: 200 },
      { name: 'description', label: 'Summary', type: 'textarea', max: 1000 },
      {
        name: 'category', label: 'Category', type: 'select', required: true,
        options: ['Certification', 'Expansion', 'Partnership', 'Press', 'Product', 'Milestone', 'Event'],
      },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'readTime', label: 'Read time', type: 'text', max: 20, help: 'e.g. "3 min read"' },
    ],
  },

  // ── Chat ──
  {
    key: 'chatbot',
    label: 'Chat Widget',
    group: 'Chat',
    kind: 'single',
    description: 'Greeting messages of the website chat assistant.',
    fields: [
      { name: 'greeting', label: 'Greeting', type: 'textarea', max: 500 },
      { name: 'leadCapture', label: 'Lead capture prompt', type: 'textarea', max: 500 },
    ],
  },
];

export const COLLECTION_KEYS = COLLECTIONS.map((c) => c.key);
export const getCollection = (key) => COLLECTIONS.find((c) => c.key === key);

// ─── Validation built from the definitions ────────────────────────────
// Site path, https URL, or (local development) an http://localhost media URL.
const IMAGE_PATH = /^(\/[\w\-./%]+|https:\/\/[^\s"'<>]+|http:\/\/localhost(:\d+)?\/[^\s"'<>]*)$/;

function fieldSchema(field) {
  let s;
  switch (field.type) {
    case 'number':
      s = z.coerce.number().int().min(field.min ?? 0).max(field.max ?? 1e9);
      return field.required ? s : s.optional().nullable();
    case 'tags':
      return z.array(z.string().trim().min(1).max(field.max ?? 120)).max(50).default([]);
    case 'object':
      return objectSchema(field.fields).default({});
    case 'list':
      return z.array(objectSchema(field.fields)).max(200).default([]);
    case 'select':
      s = z.enum(field.options);
      return field.required ? s : s.optional().or(z.literal(''));
    case 'url':
      s = z.string().trim().url().max(500).refine((v) => /^https?:\/\//.test(v), 'Must start with http(s)://');
      return field.required ? s : s.optional().or(z.literal(''));
    case 'email':
      s = z.string().trim().email().max(254);
      return field.required ? s : s.optional().or(z.literal(''));
    case 'image':
      s = z.string().trim().max(500).regex(IMAGE_PATH, 'Must be a site path like /images/x.webp or an https URL');
      return field.required ? s : s.optional().or(z.literal(''));
    case 'gradient':
      s = z.string().trim().max(field.max ?? 80).regex(/^[a-z0-9\- ]*$/, 'Only Tailwind class names allowed');
      return field.required ? s.min(1) : s.optional();
    default: // text, textarea
      s = z.string().trim().max(field.max ?? 2000);
      if (field.slug) s = s.regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and dashes');
      return field.required ? s.min(1, 'Required') : s.optional();
  }
}

function objectSchema(fields) {
  return z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f)]))).strip();
}

export function validateCollection(def, value) {
  const schema = def.kind === 'list'
    ? z.array(objectSchema(def.fields)).max(500)
    : objectSchema(def.fields);
  const result = schema.safeParse(value);
  if (!result.success) {
    const issue = result.error.issues[0];
    return { error: `${issue.path.join(' › ') || def.label}: ${issue.message}` };
  }
  if (def.kind === 'list') {
    for (const slugField of def.fields.filter((f) => f.slug || f.name === 'id')) {
      const seen = new Set();
      for (const item of result.data) {
        const v = item[slugField.name];
        if (v === undefined || v === '') continue;
        if (seen.has(v)) return { error: `Duplicate ${slugField.label}: "${v}"` };
        seen.add(v);
      }
    }
  }
  return { data: result.data };
}
