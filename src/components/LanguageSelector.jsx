import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe, FiCheck } from 'react-icons/fi';
import { languages } from '../data/translations';

export default function LanguageSelector({ currentLang, onLangChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
      >
        <FiGlobe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{current.name}</span>
        <span className="text-slate-400">({current.label})</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLangChange(lang.code);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1 text-left">
                  <span className="font-medium text-slate-900">{lang.name}</span>
                  <span className="text-slate-400 ml-1">({lang.label})</span>
                </span>
                {currentLang === lang.code && (
                  <FiCheck className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
