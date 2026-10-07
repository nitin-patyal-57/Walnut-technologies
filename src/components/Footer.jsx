import { Link, useLocation } from 'react-router-dom';
import { FiLinkedin, FiInstagram, FiYoutube, FiArrowUp, FiMapPin, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi';
import { brand } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import Picture from '../components/Picture';
import { scrollBehavior } from '../utils/motion';

export default function Footer() {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  };

  const footerLinks = {
    [t('footer.solutions')]: [
      { label: 'Neuro Rehab', to: '/solutions?category=Neuro Rehab Devices' },
      { label: 'Medical', to: '/solutions?category=Medical' },
      { label: 'Fintech', to: '/solutions?category=Fintech' },
      { label: 'Automotive', to: '/solutions?category=Automotive' },
      { label: 'IoT Solutions', to: '/solutions?category=IoT' },
    ],
    [t('footer.company')]: [
      { label: t('footer.aboutUs'), to: '/about' },
      { label: t('footer.process'), to: '/process' },
      { label: t('footer.clients'), to: '/clients' },
      { label: t('footer.expertise'), to: '/expertise' },
      { label: t('footer.news'), to: '/news' },
    ],
    [t('footer.resources')]: [
      { label: t('footer.whitepapers'), to: '/resources' },
      { label: t('footer.caseStudies'), to: '/resources' },
      { label: t('footer.brochures'), to: '/resources' },
    ],
    [t('footer.legal')]: [
      { label: t('footer.privacyPolicy'), to: '/privacy' },
      { label: t('footer.termsOfService'), to: '/terms' },
      { label: t('footer.contact'), to: '/contact' },
    ],
  };

  return (
    <footer className="relative bg-white text-slate-900 overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-600/5 rounded-full blur-[100px]" />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 lg:pb-4">
        <div className="grid grid-cols-2 min-[360px]:grid-cols-4 lg:grid-cols-12 gap-x-4 gap-y-6 lg:gap-6 mb-6">
          <div className="col-span-2 min-[360px]:col-span-4 lg:col-span-4">
            <Link to="/" aria-current={pathname === '/' ? 'page' : undefined} onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })} className="inline-block mb-3 !min-h-0">
              <Picture loading="lazy" decoding="async" sizes="(max-width: 640px) 80px, 160px" src="/images/brand/Walnut_Technologies_logo_transparent.webp" alt="Walnut Technologies" width="120" height="32" className="h-8 w-auto object-contain" />
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed mb-4 max-w-[280px]">
              Vertically integrated Original Design Manufacturer for medical devices, payment systems, and custom electronics. ISO 13485 certified.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs text-slate-500">
                <FiMapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-cyan-600" />
                <span>Plot No. 132, JLPL Industrial Park,<br />Sector 82, Mohali, Punjab - 160055</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-2">
              <h3 className="text-[10px] lg:text-xs font-bold text-slate-900 uppercase tracking-wide lg:tracking-wider mb-2 break-words">{title}</h3>
              <div className="w-6 h-0.5 bg-cyan-600 mb-3" />
              <ul className="space-y-1.5 lg:space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} aria-current={pathname === link.to ? 'page' : undefined} className="flex items-center gap-1.5 !min-h-0 py-1 lg:py-0 text-[11px] lg:text-xs text-slate-500 hover:text-cyan-700 transition-colors group">
                      <FiArrowRight className="hidden lg:block w-3 h-3 shrink-0 text-cyan-700 opacity-70 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200" />

        <div className="py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} {brand.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            <a href={brand.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 !min-h-0 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-700 hover:border-cyan-300 transition-all">
              <FiLinkedin className="w-3.5 h-3.5" />
            </a>
            <a href={brand.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 !min-h-0 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-700 hover:border-cyan-300 transition-all">
              <FiYoutube className="w-3.5 h-3.5" />
            </a>
            <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 !min-h-0 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-cyan-700 hover:border-cyan-300 transition-all">
              <FiInstagram className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <a href={`tel:${brand.phone}`} className="!min-h-0 py-1 lg:py-0 hover:text-slate-900 transition-colors">{brand.phone}</a>
            <span className="text-slate-300">|</span>
            <a href={`mailto:${brand.email}`} className="!min-h-0 py-1 lg:py-0 hover:text-slate-900 transition-colors">{brand.email}</a>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-24 lg:bottom-6 left-6 z-40 w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 flex items-center justify-center transition-all shadow-sm"
      >
        <FiArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
}
