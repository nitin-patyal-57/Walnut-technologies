// Focused tests for src/lib/analytics.js — the consent-gated GA4 bridge.
// Run with:  node --test tests/analytics.test.mjs   (Node's built-in runner,
// no test framework needed — keeps package.json untouched).
//
// The module reads browser globals lazily, so the stubs below are installed
// before it is imported.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const storage = new Map();
const windowListeners = {};
const documentListeners = {};
const sent = [];

globalThis.window = {
  localStorage: {
    getItem: (k) => (storage.get(k) ?? null),
    setItem: (k, v) => storage.set(k, String(v)),
    removeItem: (k) => storage.delete(k),
  },
  location: { origin: 'https://example.com', pathname: '/contact' },
  addEventListener: (type, fn) => {
    (windowListeners[type] ||= []).push(fn);
  },
  dispatchEvent: (ev) => {
    (windowListeners[ev.type] || []).slice().forEach((fn) => fn(ev));
    return true;
  },
  __walnutAnalytics: {
    logEvent: (name, params) => {
      sent.push({ name, params });
      return true;
    },
  },
};

globalThis.document = {
  title: 'Walnut Test Page',
  addEventListener: (type, fn) => {
    (documentListeners[type] ||= []).push(fn);
  },
};

const analytics = await import('../src/lib/analytics.js');
const {
  getConsent,
  isGranted,
  setConsent,
  sanitizeParams,
  trackEvent,
  trackPageView,
  initContactTracking,
  CONSENT_EVENT,
} = analytics;

beforeEach(() => {
  storage.clear();
  sent.length = 0;
});

// ---------------------------------------------------------------------------
// Consent gate
// ---------------------------------------------------------------------------

test('no stored consent => nothing is ever sent', () => {
  assert.equal(getConsent(), null);
  assert.equal(isGranted(), false);
  assert.equal(trackEvent('some_event', { a: 1 }), false);
  assert.equal(sent.length, 0);
});

test('denied consent => nothing is ever sent', () => {
  setConsent('denied');
  assert.equal(getConsent(), 'denied');
  assert.equal(trackEvent('some_event', { a: 1 }), false);
  assert.equal(sent.length, 0);
});

test('granted consent => events flow through the bridge', () => {
  setConsent('granted');
  assert.equal(trackEvent('quote_form_submit', { form_location: 'quote_modal' }), true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].name, 'quote_form_submit');
  assert.equal(sent[0].params.form_location, 'quote_modal');
});

test('setConsent announces the change with the window event', () => {
  let detail = null;
  windowListeners[CONSENT_EVENT] = [
    (ev) => {
      detail = ev.detail;
    },
  ];
  setConsent('granted');
  assert.equal(detail.consent, 'granted');
  assert.equal(storage.get('walnut_analytics_consent'), 'granted');
});

test('missing bridge (analytics script absent) => no throw, returns false', () => {
  setConsent('granted');
  const bridge = window.__walnutAnalytics;
  try {
    delete window.__walnutAnalytics;
    assert.equal(trackEvent('some_event'), false);
  } finally {
    window.__walnutAnalytics = bridge;
  }
});

// ---------------------------------------------------------------------------
// PII / param hygiene (requirement: never send names, emails, phones, forms)
// ---------------------------------------------------------------------------

test('sanitizeParams drops personal-data keys', () => {
  const out = sanitizeParams({
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+91 77194 63719',
    message: 'call me back',
    website: 'https://spam.example',
    resume: 'cv.pdf',
    formTime: 123, // allowed (number), not PII
  });
  assert.deepEqual(out, { formTime: 123 });
});

test('sanitizeParams drops values that look like an email or phone number', () => {
  const out = sanitizeParams({
    note: 'jane@example.com',
    contact: '+917719463719',
    resource_type: 'brochure', // safe: letters
    quantity: '50', // safe: too short to be a phone number
  });
  assert.deepEqual(out, { resource_type: 'brochure', quantity: '50' });
});

test('sanitizeParams keeps only primitives and caps string length', () => {
  const out = sanitizeParams({
    count: 3,
    ok: true,
    long: 'x'.repeat(500),
    nested: { a: 1 },
    list: [1, 2],
    nothing: null,
    missing: undefined,
  });
  assert.equal(out.count, 3);
  assert.equal(out.ok, true);
  assert.equal(out.long.length, 120);
  assert.ok(!('nested' in out));
  assert.ok(!('list' in out));
  assert.ok(!('nothing' in out));
  assert.ok(!('missing' in out));
});

// ---------------------------------------------------------------------------
// Page views (requirement: no query strings, once per navigation)
// ---------------------------------------------------------------------------

test('trackPageView strips query strings and fragments from the path', () => {
  setConsent('granted');
  trackPageView('/about?utm_source=x&email=a@b.c#team');
  assert.equal(sent.length, 1);
  assert.equal(sent[0].name, 'page_view');
  assert.equal(sent[0].params.page_path, '/about');
  assert.equal(sent[0].params.page_title, 'Walnut Test Page');
  // page_location is origin + path only — never a query string
  assert.equal(sent[0].params.page_location, 'https://example.com/contact');
  for (const value of Object.values(sent[0].params)) {
    assert.ok(!String(value).includes('?'), `param contains "?": ${value}`);
  }
});

test('trackPageView without consent is a no-op', () => {
  assert.equal(trackPageView('/about'), false);
  assert.equal(sent.length, 0);
});

// ---------------------------------------------------------------------------
// Event names (GA4 rules)
// ---------------------------------------------------------------------------

test('rejects invalid GA4 event names', () => {
  setConsent('granted');
  assert.equal(trackEvent('Page View'), false); // uppercase + space
  assert.equal(trackEvent('9lives'), false); // must start with a letter
  assert.equal(trackEvent('x'.repeat(41)), false); // over 40 chars
  assert.equal(trackEvent('contact_form_submit'), true);
  assert.equal(sent.length, 1);
});

// ---------------------------------------------------------------------------
// Delegated contact-link tracking (tel / mailto / wa.me)
// ---------------------------------------------------------------------------

function clickHref(href) {
  const handler = documentListeners.click?.[0];
  assert.ok(handler, 'click listener not registered');
  handler({
    target: {
      closest: (sel) =>
        sel === 'a[href]'
          ? { getAttribute: (name) => (name === 'href' ? href : null) }
          : null,
    },
  });
}

test('initContactTracking is idempotent and maps link types without leaking hrefs', () => {
  setConsent('granted');
  initContactTracking();
  initContactTracking(); // must not register twice
  assert.equal(documentListeners.click.length, 1);

  clickHref('tel:+917719463719');
  clickHref('mailto:contact@walnutmedical.in');
  clickHref('https://wa.me/917719463719');
  clickHref('https://wa.me/917719463719?text=hello'); // query string ignored
  clickHref('/contact'); // internal link => ignored

  const events = sent.filter((s) => s.name === 'contact_link_click');
  assert.equal(events.length, 4);
  assert.deepEqual(
    events.map((e) => e.params.method),
    ['phone', 'email', 'whatsapp', 'whatsapp'],
  );

  // The href itself (number / address) must never be sent.
  for (const e of events) {
    const payload = JSON.stringify(e.params);
    assert.ok(!payload.includes('77194'), 'phone number leaked');
    assert.ok(!payload.includes('walnutmedical'), 'email leaked');
    assert.ok(!payload.includes('wa.me'), 'href leaked');
  }
});

test('contact links are ignored while consent is missing', () => {
  // (listener from the previous test is still registered — state is global)
  clickHref('tel:+917719463719');
  assert.equal(sent.length, 0);
});
