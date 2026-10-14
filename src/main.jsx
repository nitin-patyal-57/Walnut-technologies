import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const isDev = import.meta.env.DEV

if ('serviceWorker' in navigator) {
  if (isDev) {
    // Dev: a service worker answers from its cache, so stale /src/*.js modules
    // and /images/* get served and edits appear once, then revert on reload.
    // Never register one locally — and clean up leftovers from older sessions.
    navigator.serviceWorker.getRegistrations()
      .then((rs) => rs.forEach((r) => r.unregister()))
      .catch(() => {});
    if ('caches' in window) {
      caches.keys()
        .then((ks) => ks.filter((k) => k.startsWith('walnut')).forEach((k) => caches.delete(k)))
        .catch(() => {});
    }
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });

    // reload when a new service worker takes control (sw.js bumped)
    if (navigator.serviceWorker.controller) {
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }

    // detect new deploys (entry chunk renamed) and refresh when the tab is hidden
    const entry = document.querySelector('script[src*="/assets/index-"]');
    const checkForUpdate = async () => {
      try {
        const res = await fetch(location.pathname + location.search, { cache: 'no-store' });
        const html = await res.text();
        const m = html.match(/\/assets\/index-[^"]+\.js/);
        if (m && entry && !entry.src.endsWith(m[0])) {
          if (document.visibilityState === 'hidden') {
            window.location.reload();
          } else {
            document.addEventListener('visibilitychange', () => {
              if (document.visibilityState === 'hidden') window.location.reload();
            }, { once: true });
          }
        }
      } catch {}
    };
    setInterval(checkForUpdate, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkForUpdate();
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
