// Shared, consent-gated bridge between the React app and GA4.
// The low-level SDK lives in public/firebase-analytics.js, which exposes
// window.__walnutAnalytics once the visitor has granted consent.
//
// Privacy rules enforced here (they apply to every event we send):
//   - Nothing is sent until consent is "granted" (ConsentBanner.jsx decides,
//     stored under localStorage key "walnut_analytics_consent").
//   - Never send names, emails, phone numbers, form contents or other PII:
//     sanitizeParams() drops risky keys and any value that looks like an
//     email address or phone number, as a second line of defence.
//   - Never send URLs with query strings: every event carries a query-free
//     page_location (origin + path) and page_view carries the path only.
//   - Anonymous website activity only — no fingerprinting, no session replay,
//     no identifiers beyond the random one GA4 assigns after consent.

const CONSENT_KEY = 'walnut_analytics_consent';
export const CONSENT_EVENT = 'walnut:analytics-consent';

// Param keys that must never reach GA4 (form fields, contact details...).
const FORBIDDEN_KEY =
  /^(name|full_?name|first_?name|last_?name|email|e_?mail|phone|tel|mobile|address|street|city|zip|postal|message|comment|subject|resume|cv|file|attachment|query|search|website)$/i;

// Values that look like personal contact details are dropped even under an
// otherwise safe key (we never build such params ourselves — belt and braces).
const EMAIL_LIKE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_LIKE = /^\+?[\d\s().-]{7,}$/;

// GA4 event name rules: start with a letter, lowercase/digits/underscore, ≤40 chars.
const GA4_EVENT_NAME = /^[a-z][a-z0-9_]{0,39}$/;
const MAX_PARAM_LENGTH = 120;

const win = () => (typeof window === 'undefined' ? undefined : window);
const docTitle = () => (typeof document === 'undefined' ? '' : String(document.title || ''));

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

/** 'granted' | 'denied' | null (no choice made yet) */
export function getConsent() {
  try {
    return win()?.localStorage?.getItem(CONSENT_KEY) ?? null;
  } catch {
    return null; // storage blocked → treat as no consent, never track
  }
}

export function isGranted() {
  return getConsent() === 'granted';
}

/** Stores the visitor's choice and announces it (public/firebase-analytics.js listens). */
export function setConsent(value) {
  // value: 'granted' | 'denied'
  try {
    win()?.localStorage?.setItem(CONSENT_KEY, value);
  } catch {
    /* storage blocked: the choice simply won't persist */
  }
  try {
    win()?.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { consent: value } }));
  } catch {
    /* no window / no CustomEvent (SSR or tests) */
  }
}

// ---------------------------------------------------------------------------
// Param hygiene
// ---------------------------------------------------------------------------

/** Keeps only minimal, non-sensitive primitives. Drops PII-ish keys/values. */
export function sanitizeParams(params) {
  const out = {};
  if (!params || typeof params !== 'object') return out;
  for (const [key, value] of Object.entries(params)) {
    if (FORBIDDEN_KEY.test(key)) continue;
    if (typeof value === 'number' || typeof value === 'boolean') {
      out[key] = value;
    } else if (typeof value === 'string') {
      if (EMAIL_LIKE.test(value) || PHONE_LIKE.test(value)) continue; // looks like PII
      out[key] = value.slice(0, MAX_PARAM_LENGTH);
    }
    // objects, arrays, null and undefined are dropped — params stay minimal
  }
  return out;
}

// ---------------------------------------------------------------------------
// Sending
// ---------------------------------------------------------------------------

function send(name, params) {
  if (!isGranted()) return false;
  if (!GA4_EVENT_NAME.test(name)) {
    console.warn('[analytics] invalid event name dropped:', name);
    return false;
  }
  const bridge = win()?.__walnutAnalytics;
  if (typeof bridge?.logEvent !== 'function') return false; // analytics script not loaded

  const clean = sanitizeParams(params);
  // Override gtag's default document location so no hit we send can carry a
  // query string (the URL is origin + path only).
  try {
    const location = win()?.location;
    if (location?.origin) {
      const path = String(location.pathname || '/').split('?')[0].split('#')[0] || '/';
      clean.page_location = `${location.origin}${path}`;
    }
  } catch {
    /* no location (tests) — skip the override */
  }

  try {
    bridge.logEvent(name, clean);
    return true;
  } catch (err) {
    console.warn('[analytics] send failed:', err);
    return false;
  }
}

/**
 * Sends a GA4 event, but only after consent. Returns true when the event was
 * handed to the analytics bridge, false when it was dropped (no consent,
 * invalid name, bridge missing).
 *
 * Event names follow GA4 conventions (snake_case); params must stay minimal
 * and non-sensitive — sanitizeParams enforces that regardless.
 */
export function trackEvent(name, params) {
  return send(name, params);
}

/**
 * Sends one page_view for a client-side route change. The path is stripped of
 * any query string / fragment before it is sent.
 */
export function trackPageView(pathname) {
  if (!isGranted()) return false;
  const raw = typeof pathname === 'string' && pathname ? pathname : '/';
  const path = raw.split('?')[0].split('#')[0] || '/';
  return send('page_view', { page_path: path, page_title: docTitle() });
}

// ---------------------------------------------------------------------------
// Delegated link tracking
// ---------------------------------------------------------------------------

let contactTracking = false;

/**
 * One document-level listener catches every tel:, mailto: and wa.me link —
 * including links rendered later (modals, mobile nav, footer). Only the link
 * TYPE is sent; the href itself (which contains the number or address) never
 * leaves the browser. Idempotent: safe to call from effects that re-run.
 */
export function initContactTracking() {
  if (contactTracking || typeof document === 'undefined') return;
  contactTracking = true;
  document.addEventListener(
    'click',
    (event) => {
      const anchor = event.target?.closest?.('a[href]');
      if (!anchor) return;
      const href = String(anchor.getAttribute('href') || '');
      let method = null;
      if (href.startsWith('tel:')) method = 'phone';
      else if (href.startsWith('mailto:')) method = 'email';
      else if (/^https:\/\/wa\.me\//i.test(href)) method = 'whatsapp';
      if (method) trackEvent('contact_link_click', { method });
    },
    { passive: true },
  );
}
