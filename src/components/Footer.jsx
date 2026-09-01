import { Link } from 'react-router-dom';
import { FiLinkedin, FiInstagram, FiYoutube, FiArrowUp, FiMapPin, FiPhone, FiMail, FiShield, FiCheckCircle } from 'react-icons/fi';
import { brand } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const certifications = [
  'ISO 13485',
  'Class 10K Cleanroom',
  'CE / FCC',
  'PCI DSS',
  'IEC 60601',
  'BIS Certified',
];

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
    <footer className="relative border-t border-slate-200 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Certifications Banner */}
        <div className="py-4 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {certifications.map((cert) => (
              <div key={cert} className="flex items-center gap-1.5 text-xs text-slate-400">
                <FiShield className="w-3 h-3 text-cyan-400" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand & Contact */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <a href="/" onClick={() => window.location.reload()} className="inline-block mb-3">
              <img src="/walnut-logo/walnut_technologies_logo.svg" alt="Walnut Technologies" className="h-8 w-auto object-contain brightness-0 invert" />
            </a>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-[240px]">
              {t('footer.desc')}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FiMapPin className="w-3 h-3 shrink-0 text-cyan-400" />
                <span>Plot No. 132, JLPL Industrial Park, Sector 82, Mohali, Punjab - 160055</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FiPhone className="w-3 h-3 shrink-0 text-cyan-400" />
                <a href={`tel:${brand.phone}`} className="hover:text-white transition-colors">{brand.phone}</a>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FiMail className="w-3 h-3 shrink-0 text-cyan-400" />
                <a href={`mailto:${brand.email}`} className="hover:text-white transition-colors">{brand.email}</a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a href={brand.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-400 transition-all">
                <FiLinkedin className="w-4 h-4" />
              </a>
              <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-400 transition-all">
                <FiInstagram className="w-4 h-4" />
              </a>
              <a href={brand.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-400 transition-all">
                <FiYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {brand.fullName}. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>GSTN: {brand.gstn}</span>
            <span className="text-white/20">|</span>
            <span>Est. {brand.founded}</span>
            <span className="text-white/20">|</span>
            <span>Mohali, Punjab, India</span>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 lg:bottom-6 left-6 z-40 w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-white/60 hover:text-white hover:bg-cyan-500/20 flex items-center justify-center transition-all shadow-sm"
      >
        <FiArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
}
