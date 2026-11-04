import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, initContactTracking } from '../lib/analytics';

// Sends one GA4 page_view per client-side route CHANGE.
//
// The first render never sends: the initial page view is covered exactly once
// by the analytics side — either Firebase's automatic page_view at init (SDK
// behaviour when send_page_view is not suppressed) or the explicit initial
// view sent after consent-gated init. Sending here as well would duplicate it.
// Verified empirically: initial load = 1 page_view, SPA navigations = 0
// automatic page_views (so route changes must come from this component).
export default function RouteTracker() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    // One global listener for tel:/mailto:/wa.me clicks (idempotent).
    initContactTracking();

    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
