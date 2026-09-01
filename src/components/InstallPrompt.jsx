import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiX } from 'react-icons/fi';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (isDismissed || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-24 right-6 z-50 max-w-xs"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
              <FiDownload className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">Install Walnut Tech</p>
              <p className="text-xs text-slate-500 mt-0.5">Add to home screen for quick access</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-1.5 text-slate-500 hover:text-slate-700 text-xs font-medium transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
