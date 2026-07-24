import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Solutions',
    to: '/solutions',
    dropdown: [
      { label: 'Medical Devices', to: '/solutions?category=Medical+Devices' },
      { label: 'Payment Systems', to: '/solutions?category=Payment+Systems' },
      { label: 'Custom Electronics', to: '/solutions?category=Custom+Electronics' },
    ],
  },
  { label: 'Process', to: '/process' },
  { label: 'Expertise', to: '/expertise' },
  { label: 'Clients', to: '/clients' },
  { label: 'Contact', to: '/contact' },
];

const homeSectionIds = {
  '/': ['hero', 'divisions-preview', 'cta-section'],
  '/about': ['about'],
  '/solutions': ['solutions'],
  '/process': ['process'],
  '/expertise': ['expertise'],
  '/clients': ['clients'],
  '/contact': ['contact'],
};

export default function Navbar({ onOpenQuote, onOpenSchedule }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to) => location.pathname === to;

  const handleNavClick = (e, to) => {
    const currentPath = location.pathname;
    const targetPath = to.split('?')[0];
    const hasSection = to.includes('#');
    const sectionId = hasSection ? to.split('#')[1] : null;

    if (targetPath === currentPath && sectionId) {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (targetPath !== currentPath) {
      e.preventDefault();
      navigate(to);
      setTimeout(() => {
        if (sectionId) {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <img
              src="/walnut-logo.svg.png"
              alt="Walnut Technologies"
              className="h-20 md:h-24 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.to}
                  onClick={(e) => handleNavClick(e, link.to)}
                  className={`px-2.5 py-1.5 text-[13px] rounded-lg hover:bg-slate-100 transition-all flex items-center gap-1 ${
                    isActive(link.to) ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {link.dropdown && <FiChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />}
                </Link>
                {link.dropdown && activeDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-2">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="block px-4 py-2 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        onClick={(e) => { handleNavClick(e, item.to); setActiveDropdown(null); }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onOpenSchedule}
              className="px-3 py-1.5 text-[13px] text-slate-600 border border-slate-300 hover:border-slate-400 rounded-lg hover:text-slate-900 transition-all"
            >
              Schedule a Call
            </button>
            <button
              onClick={onOpenQuote}
              className="px-4 py-1.5 text-[13px] font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all"
            >
              Request Quote
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {isMobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={(e) => { handleNavClick(e, link.to); setIsMobileOpen(false); }}
                  className={`block px-3 py-2 rounded-lg text-[13px] transition-all ${
                    isActive(link.to) ? 'text-slate-900 bg-slate-100 font-medium' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 space-y-2 border-t border-slate-200 mt-2">
                <button
                  onClick={() => { onOpenSchedule(); setIsMobileOpen(false); }}
                  className="w-full py-2 text-[13px] text-slate-600 border border-slate-300 rounded-lg hover:text-slate-900 hover:border-slate-400 transition-all"
                >
                  Schedule a Call
                </button>
                <button
                  onClick={() => { onOpenQuote(); setIsMobileOpen(false); }}
                  className="w-full py-2 text-[13px] font-medium text-white bg-slate-900 rounded-lg shadow-sm transition-all"
                >
                  Request Quote
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
