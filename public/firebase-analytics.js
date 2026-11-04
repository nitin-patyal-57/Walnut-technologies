// Consent-gated Firebase Analytics (GA4) — free visitor dashboard at
// https://console.firebase.google.com/ → project "walnut-technologies" → Analytics.
//
// Lives in public/ (loaded by index.html) because the site's CSP forbids
// inline scripts — an external file needs no CSP weakening.
//
// Consent model (see also src/lib/analytics.js and ConsentBanner.jsx):
//   - Nothing Google-related is downloaded until the visitor grants consent:
//     the Firebase SDK is imported dynamically only from init(), and init()
//     refuses to run unless localStorage "walnut_analytics_consent" is
//     "granted". Rejecting means this file never contacts Google at all.
//   - The React app stores the choice via src/lib/analytics.js and announces
//     it with a window event "walnut:analytics-consent"; we listen for it.
//   - init() is idempotent: the SDK loads and initialises exactly once,
//     however many times it is called (load, consent event, logEvent).
//
// React talks back through window.__walnutAnalytics.logEvent(name, params).
// Must never break the site: everything is wrapped in try/catch.
const firebaseConfig = {
  apiKey: 'AIzaSyDUpNou_DW3xe8GQJwSt72cxQMe-EZ7Bhk',
  authDomain: 'walnut-technologies.firebaseapp.com',
  projectId: 'walnut-technologies',
  storageBucket: 'walnut-technologies.firebasestorage.app',
  messagingSenderId: '919652354374',
  appId: '1:919652354374:web:18f8d20331d949f3febd47',
  measurementId: 'G-7FWYTREEJB',
};

const CONSENT_KEY = 'walnut_analytics_consent';
const CONSENT_EVENT = 'walnut:analytics-consent';
const FIREBASE_APP = 'https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js';
const FIREBASE_ANALYTICS = 'https://www.gstatic.com/firebasejs/13.2.0/firebase-analytics.js';

let analytics = null;      // set once getAnalytics() succeeded
let initialising = null;   // in-flight init promise (dedupes concurrent calls)

function hasConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'granted';
  } catch {
    return false; // storage blocked → never track
  }
}

// Idempotent: safe to call on every consent event and every logEvent. The SDK
// and Firebase config are only ever loaded/initialised a single time.
function init() {
  if (analytics) return Promise.resolve(analytics);
  if (initialising) return initialising;
  if (!hasConsent()) return Promise.resolve(null); // consent not granted → no SDK, no request to Google

  initialising = (async () => {
    try {
      const { initializeApp } = await import(FIREBASE_APP);
      const { getAnalytics, setAnalyticsConfig } = await import(FIREBASE_ANALYTICS);
      const app = initializeApp(firebaseConfig);
      analytics = getAnalytics(app);
      // Ask GA4 not to send its own automatic page_view: the React app sends
      // exactly one page_view per route change (src/components/RouteTracker.jsx),
      // which is what keeps page views duplicate-free. Harmless no-op if this
      // SDK build does not support the config.
      try {
        if (typeof setAnalyticsConfig === 'function') {
          setAnalyticsConfig(analytics, 'send_page_view', false);
        }
      } catch (err) {
        console.warn('[analytics] could not disable automatic page_view:', err);
      }
      console.info('[analytics] consent granted → GA4 initialised');
    } catch (err) {
      console.warn('[analytics] init failed:', err);
      initialising = null; // allow a later retry (e.g. flaky network)
    }
    return analytics;
  })();
  return initialising;
}

// Fire-and-forget event send. Returns true when the event was queued for a
// consented visit, false when tracking is off (no consent).
function logEvent(name, params) {
  if (!hasConsent()) return false;
  init()
    .then((instance) => {
      if (!instance) return;
      return import(FIREBASE_ANALYTICS).then(({ logEvent: send }) => send(instance, name, params));
    })
    .catch((err) => console.warn('[analytics] logEvent failed:', err));
  return true;
}

window.__walnutAnalytics = { init, logEvent, hasConsent };

// React announced a consent change (granted or denied).
window.addEventListener(CONSENT_EVENT, () => {
  if (hasConsent()) init();
});

// Returning visitor who already accepted on an earlier visit.
if (hasConsent()) init();
