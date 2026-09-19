import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiMapPin, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';
import { brand, trustSignals } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Products',
    to: '/solutions',
    dropdown: [
      { label: 'Neuro Rehab', to: '/solutions?category=Neuro Rehab Devices', image: '/walklab product dropdown.png', desc: 'Advanced rehabilitation systems' },
      { label: 'Medical', to: '/solutions?category=Medical', image: '/medstim-neuro-devices.webp', desc: 'Precision healthcare devices' },
      { label: 'Fintech', to: '/solutions?category=Fintech', image: '/DQR.webp', desc: 'Digital payment solutions' },
      { label: 'IoT Solutions', to: '/solutions?category=IoT', image: '/smartlock product dropdown.png', desc: 'Connected smart devices' },
      { label: 'Automotive', to: '/solutions?category=Automotive', image: '/cluster-background.webp', desc: 'Smart instrument clusters' },
    ],
  },
  { label: 'Expertise', to: '/expertise' },
  { label: 'Career', to: '/career' },
  { label: 'Contact', to: '/contact' },
];

const socialLinks = [
  { label: 'YouTube', url: 'https://www.youtube.com/@walnutmedical9305', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg' },
  { label: 'Instagram', url: 'https://www.instagram.com/walnut_medical/', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/walnut-medical-private-limited', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg' },
];

export default function Navbar({ onOpenSchedule }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  const isHomePage = location.pathname === '/';

  const handleMobileEscape = useCallback((e) => {
    if (e.key === 'Escape' && isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [isMobileOpen]);

  useEffect(() => {
    if (isMobileOpen) {
      previousFocusRef.current = document.activeElement;
      document.addEventListener('keydown', handleMobileEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleMobileEscape);
      document.body.style.overflow = 'unset';
      if (!isMobileOpen) previousFocusRef.current?.focus();
    };
  }, [isMobileOpen, handleMobileEscape]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Dynamic navbar styles based on page and scroll position
  const navStyles = 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm';

  const textColor = 'text-slate-600';
  const textColorHover = 'hover:text-slate-900';
  const bgHover = 'hover:bg-slate-100';
  const dropdownBg = 'bg-white border-slate-200';
  const dropdownText = 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
  const btnOutline = 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900';
  const btnSolid = 'bg-slate-900 text-white hover:bg-slate-800';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navStyles}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-14">
            {/* Logo */}
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center group shrink-0">
              <img
                src="/walnut-logo/Walnut_Technologies_logo_transparent.webp"
                alt="Walnut Technologies"
                width="160"
                height="44"
                className="h-10 md:h-11 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative pb-2"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={link.to}
                    onClick={(e) => handleNavClick(e, link.to)}
                    aria-expanded={link.dropdown ? activeDropdown === link.label : undefined}
                    aria-haspopup={link.dropdown ? 'true' : undefined}
                    className={`px-2.5 py-1.5 text-[13px] rounded-lg transition-all flex items-center gap-1 ${
                      isActive(link.to) ? 'text-slate-900 font-medium' : `${textColor} ${textColorHover}`
                    } ${bgHover}`}
                  >
                    {link.label}
                    {link.dropdown && <FiChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />}
                  </Link>
                  {link.dropdown && activeDropdown === link.label && (
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 ${dropdownBg} border rounded-2xl shadow-2xl overflow-hidden`}>
                      <div className="flex items-stretch divide-x divide-slate-100">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            className="group relative w-44 flex-shrink-0 block"
                            onClick={(e) => { handleNavClick(e, item.to); setActiveDropdown(null); }}
                          >
                            <div className="h-28 overflow-hidden">
                              <img src={item.image} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <div className="text-sm font-semibold text-white">{item.label}</div>
                              <div className="text-[11px] text-white/80 mt-0.5">{item.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={onOpenSchedule}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-lg shadow-sm transition-all ${btnSolid}`}
              >
                {t('nav.scheduleCall')}
              </button>
              {/* Three Line Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`p-2 transition-colors ${textColor} ${textColorHover} ${bgHover} rounded-lg`}
                aria-label="Open navigation menu"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                ref={mobileMenuButtonRef}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`p-2 transition-colors ${textColor} ${textColorHover} bg-slate-100 rounded-xl`}
                aria-label="Open navigation menu"
              >
                {isMobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
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
                    className={`block px-3 py-2.5 rounded-lg text-[13px] transition-all ${
                      isActive(link.to) ? 'text-slate-900 bg-slate-100 font-medium' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 space-y-2 border-t border-slate-200 mt-2">
                  <button
                    onClick={() => { onOpenSchedule(); setIsMobileOpen(false); }}
                    className="w-full py-2.5 text-[13px] font-medium text-white bg-slate-900 rounded-lg shadow-sm transition-all"
                  >
                    {t('nav.scheduleCall')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Info Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Info Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Information sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[420px] max-w-[90vw] bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Sidebar Header with Gradient */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                   <img src="/walnut-logo/Walnut_Technologies_logo_transparent.webp" alt="Walnut Technologies" width="192" height="48" className="h-12 w-auto object-contain" />
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close sidebar"
                    className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{brand.subtitle}</p>
              </div>
            </div>

            {/* Sidebar Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {trustSignals.stats.map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50/50 border border-blue-100 text-center hover:shadow-md transition-all">
                      <div className="text-2xl font-bold font-display text-slate-900">{stat.value}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Certifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {trustSignals.certifications.map((cert) => (
                      <span key={cert} className="px-3 py-1.5 text-xs bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Contact Us
                  </h4>
                  <div className="space-y-3">
                    <a href={`tel:${brand.phone}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FiPhone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Phone</p>
                        <p className="text-sm text-slate-700 font-semibold">{brand.phone}</p>
                      </div>
                    </a>
                    <a href={`mailto:${brand.email}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FiMail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Email</p>
                        <p className="text-sm text-slate-700 font-semibold">{brand.email}</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-3 p-3 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <FiMapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Address</p>
                        <p className="text-sm text-slate-700 font-semibold">{brand.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Follow Us
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all group"
                      >
                        <img src={social.icon} alt={social.label} className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xs text-slate-600 font-medium">{social.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => { onOpenSchedule(); setIsSidebarOpen(false); }}
                    className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 rounded-xl transition-all shadow-lg shadow-slate-900/20"
                  >
                    Schedule a Call
                  </button>
                </div>
              </div>
            </div>

              {/* Sidebar Footer - Chatbot */}
            <div className="border-t border-slate-200 p-4 shrink-0 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                  <FiMessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900">Chat with us</h4>
                  <p className="text-xs text-emerald-600 font-medium">Usually replies instantly</p>
                </div>
                <button
                  onClick={() => { setIsSidebarOpen(false); window.dispatchEvent(new Event('open-walnut-chat')); }}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all shrink-0 shadow-lg shadow-emerald-500/30"
                >
                  Open Chat
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
