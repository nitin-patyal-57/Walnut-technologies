import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import {
  FiShield, FiChevronRight, FiArrowRight, FiClipboard,
  FiLayers, FiLock, FiHash, FiLink, FiUser, FiMail,
  FiChevronDown, FiArrowUpRight, FiPhone
} from 'react-icons/fi';
import { brand } from '../data/content';

const sectionIcons = {
  clipboard: FiClipboard,
  layers: FiLayers,
  shield: FiShield,
  cookie: FiHash,
  link: FiLink,
  user: FiUser,
  mail: FiMail,
};

const colorPairs = [
  { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
  { bg: 'from-cyan-500 to-cyan-600', light: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
  { bg: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
  { bg: 'from-violet-500 to-violet-600', light: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600' },
  { bg: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
  { bg: 'from-amber-500 to-amber-600', light: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  { bg: 'from-rose-500 to-rose-600', light: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' },
];

function SectionCard({ section, index, isInView }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = sectionIcons[section.icon] || FiShield;
  const colors = colorPairs[index % colorPairs.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      className="group"
    >
      <div
        className={`relative bg-white rounded-2xl border ${colors.border} hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Top accent line */}
        <div className={`h-1 w-full bg-gradient-to-r ${colors.bg}`} />

        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className={`text-xs font-bold ${colors.text} uppercase tracking-wider block mb-1`}>
                    Section {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
                </div>
                <motion.div
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0"
                >
                  <FiChevronDown className="w-4 h-4 text-slate-500" />
                </motion.div>
              </div>

              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{section.content}</p>

              {/* Expandable details */}
              <AnimatePresence>
                {expanded && section.details && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`mt-4 pt-4 border-t ${colors.border}`}>
                      <ul className="space-y-2.5">
                        {section.details.map((detail, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-2.5"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colors.bg} mt-1.5 shrink-0`} />
                            <span className="text-sm text-slate-600">{detail}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PrivacyPage() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, margin: '-50px' });
  const isContentInView = useInView(contentRef, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  const sections = t('privacy.sections');
  const toc = Array.isArray(sections) ? sections.map((s) => s.title) : [];

  const scrollToSection = (index) => {
    const el = document.getElementById(`privacy-section-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title="Privacy Policy"
        description="Walnut Technologies Privacy Policy - Learn how we collect, use, and protect your personal information. Your privacy is important to us."
        path="/privacy"
        noindex={true}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold mb-6"
            >
              <FiShield className="w-4 h-4" />
              {t('privacy.effectiveDate')}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-5 leading-tight"
            >
              {t('privacy.title')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base text-white/60 leading-relaxed max-w-2xl mx-auto mb-8"
            >
              {t('privacy.subtitle')}
            </motion.p>

            {/* Updated date */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm text-white/40"
            >
              {t('privacy.lastUpdated')}
            </motion.p>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 28C672 36 768 48 864 50C960 52 1056 44 1152 36C1248 28 1344 20 1392 16L1440 12V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50/30 rounded-2xl p-6 lg:p-8 border border-blue-100"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Our Commitment to Privacy</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{t('privacy.intro')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents + Sections */}
      <section ref={contentRef} className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
            {/* Table of Contents - Sticky */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isContentInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">{t('privacy.tableOfContents')}</h3>
                <nav className="space-y-1">
                  {toc.map((title, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToSection(i)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group"
                    >
                      <FiChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      <span className="truncate">{title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Sections */}
            <div className="space-y-5">
              {Array.isArray(sections) && sections.map((section, index) => (
                <div key={index} id={`privacy-section-${index}`}>
                  <SectionCard section={section} index={index} isInView={isContentInView} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Questions About Your Privacy?</h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Our team is here to help. Reach out to us for any privacy-related concerns or to exercise your data rights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"
              >
                <FiMail className="w-4 h-4" />
                Contact Privacy Team
              </Link>
              <a
                href={`mailto:${brand.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-all"
              >
                <FiArrowUpRight className="w-4 h-4" />
                {brand.email}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
