// Firebase Analytics (GA4) — free visitor dashboard at
// https://console.firebase.google.com/ → project "walnut-technologies" → Analytics.
// Lives in public/ (loaded by index.html) because the site's CSP forbids
// inline scripts — an external file needs no CSP weakening.
// Must never break the site: init is wrapped in try/catch.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-analytics.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDUpNou_DW3xe8GQJwSt72cxQMe-EZ7Bhk',
  authDomain: 'walnut-technologies.firebaseapp.com',
  projectId: 'walnut-technologies',
  storageBucket: 'walnut-technologies.firebasestorage.app',
  messagingSenderId: '919652354374',
  appId: '1:919652354374:web:18f8d20331d949f3febd47',
  measurementId: 'G-7FWYTREEJB',
};

try {
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
} catch (err) {
  console.warn('[analytics] init failed:', err);
}
