import { Link } from 'react-router-dom';
import { FiLinkedin, FiInstagram, FiYoutube, FiArrowUp, FiMapPin, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi';
import { brand } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <footer className="relative bg-[#0a1628] text-white overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-4">
            <a href="/" onClick={() => window.location.reload()} className="inline-block mb-3">
              <img src="/walnut-logo/Walnut_Technologies_logo_transparent.png" alt="Walnut Technologies" className="h-8 w-auto object-contain brightness-0 invert" />
            </a>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-[280px]">
              Vertically integrated Original Design Manufacturer for medical devices, payment systems, and custom electronics. ISO 13485 certified.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <FiMapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-cyan-400" />
                <span>Plot No. 132, JLPL Industrial Park,<br />Sector 82, Mohali, Punjab - 160055</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">{title}</h3>
              <div className="w-6 h-0.5 bg-cyan-500 mb-3" />
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors group">
                      <FiArrowRight className="w-3 h-3 text-cyan-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10" />

        <div className="py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} {brand.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            <a href={brand.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all">
              <FiLinkedin className="w-3.5 h-3.5" />
            </a>
            <a href={brand.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all">
              <FiYoutube className="w-3.5 h-3.5" />
            </a>
            <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all">
              <FiInstagram className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <a href={`tel:${brand.phone}`} className="hover:text-white transition-colors">{brand.phone}</a>
            <span className="text-white/20">|</span>
            <a href={`mailto:${brand.email}`} className="hover:text-white transition-colors">{brand.email}</a>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-24 lg:bottom-6 left-6 z-40 w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-white/60 hover:text-white hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 flex items-center justify-center transition-all shadow-sm"
      >
        <FiArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
}
