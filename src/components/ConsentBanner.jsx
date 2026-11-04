import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConsent, setConsent } from '../lib/analytics';
import { useLanguage } from '../context/LanguageContext';

// Bottom consent bar: Google Analytics stays completely off until the visitor
// presses Accept. Reject stores "denied" — the Firebase SDK is never even
// downloaded for that visitor. The bar only appears while no choice is stored;
// a stored choice is permanent (visitors can change it by clearing site data,
// as the privacy page explains).
export default function ConsentBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() !== null) return; // already accepted or rejected earlier
    // Small delay so the entry preloader clears first.
    const timer = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const decide = (value) => {
    setConsent(value); // 'granted' → analytics initialises; 'denied' → nothing loads
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('consent.title')}
      className="fixed inset-x-0 bottom-0 z-[110] border-t border-slate-200 bg-white/95 backdrop-blur shadow-[0_-4px_20px_rgba(15,23,42,0.10)]"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
          {t('consent.text')}{' '}
          <Link to="/privacy" className="underline text-blue-600 hover:text-blue-700 font-medium">
            {t('consent.learnMore')}
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => decide('denied')}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all"
          >
            {t('consent.reject')}
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            {t('consent.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
