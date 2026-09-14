import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  FiCalendar, FiArrowRight, FiClock, FiTag,
  FiChevronRight, FiArrowUpRight, FiFileText, FiFilter,
  FiX, FiShare2
} from 'react-icons/fi';
import { news } from '../data/content';

const categoryConfig = {
  Certification: {
    gradient: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    tag: 'bg-emerald-100 text-emerald-700',
  },
  Expansion: {
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    tag: 'bg-blue-100 text-blue-700',
  },
  Partnership: {
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    tag: 'bg-purple-100 text-purple-700',
  },
  Press: {
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    tag: 'bg-amber-100 text-amber-700',
  },
  Product: {
    gradient: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    tag: 'bg-cyan-100 text-cyan-700',
  },
  Milestone: {
    gradient: 'from-rose-500 to-red-500',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    tag: 'bg-rose-100 text-rose-700',
  },
};

const categories = ['All', 'Certification', 'Expansion', 'Partnership', 'Press', 'Product', 'Milestone'];

function NewsModal({ item, onClose }) {
  if (!item) return null;
  const config = categoryConfig[item.category] || categoryConfig['Certification'];

  // Find related news (same category, excluding current)
  const related = news.filter((n) => n.id !== item.id && n.category === item.category).slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen flex items-start justify-center p-4 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero Image */}
          <div className="relative h-72 md:h-96 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Bottom overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[11px] font-bold ${config.tag} px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm`}>
                  {item.category}
                </span>
                <div className="flex items-center gap-1.5 text-white/70">
                  <FiCalendar className="w-3.5 h-3.5" />
                  <span className="text-xs">{item.date}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/40" />
                <div className="flex items-center gap-1.5 text-white/70">
                  <FiClock className="w-3.5 h-3.5" />
                  <span className="text-xs">{item.readTime}</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {item.title}
              </h1>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {/* Author / Meta bar */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                  WT
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Walnut Technologies</p>
                  <p className="text-xs text-slate-500">Corporate Communications</p>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
                <FiShare2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>

            {/* Lead paragraph */}
            <div className="mb-8">
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>

            {/* Article body */}
            <div className="prose prose-slate max-w-none mb-8">
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                This development marks a significant milestone for Walnut Technologies as the company continues to expand its capabilities across medical devices, payment systems, and custom electronics manufacturing. The achievement reflects our unwavering commitment to quality and innovation.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                With over 15 years of experience in electronics manufacturing, Walnut Technologies has established itself as a trusted partner for companies seeking reliable OEM/ODM solutions. Our state-of-the-art facility in Mohali, Punjab features 4 SMT lines, a Class 10K cleanroom, and capacity for 500K+ units per month.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                This achievement further strengthens our position as a leading Original Design Manufacturer serving 20+ countries worldwide, with certifications including ISO 13485, CE, FCC, and PCI-DSS.
              </p>
            </div>

            {/* Key takeaways */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl p-6 border border-slate-100 mb-8">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-6 h-0.5 bg-blue-600 rounded-full" />
                Key Takeaways
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Demonstrates continued growth and industry leadership',
                  'Reinforces commitment to quality and compliance',
                  'Benefits existing and future global partnerships',
                  'Positions Walnut Technologies for next phase of expansion',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-slate-100">
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                      <FiArrowRight className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-slate-600">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related news */}
            {related.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Related News
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {related.map((r) => {
                    const rConfig = categoryConfig[r.category] || categoryConfig['Certification'];
                    return (
                      <div key={r.id} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all cursor-pointer group">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <span className={`text-[9px] font-bold ${rConfig.tag} px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                            {r.category}
                          </span>
                          <h4 className="text-sm font-semibold text-slate-900 leading-snug mt-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {r.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">{r.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 md:px-8 lg:px-10 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all"
            >
              Back to News
            </button>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all"
            >
              Contact Us
              <FiArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function FeaturedCard({ item, isInView, onReadMore }) {
  const config = categoryConfig[item.category] || categoryConfig['Certification'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="group relative bg-white rounded-2xl border border-slate-200 hover:shadow-2xl transition-all duration-500 overflow-hidden col-span-full lg:col-span-2"
    >
      <div className="grid lg:grid-cols-2 h-full">
        {/* Image */}
        <div className="relative h-64 lg:h-full overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
              Featured
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <FiCalendar className="w-3 h-3 text-white/70" />
              <span className="text-xs text-white/80">{item.date}</span>
              <span className="text-white/40">·</span>
              <FiClock className="w-3 h-3 text-white/70" />
              <span className="text-xs text-white/80">{item.readTime}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 flex flex-col justify-center">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${config.tag} px-2.5 py-1 rounded-full uppercase tracking-wider w-fit mb-4`}>
            <FiTag className="w-3 h-3" />
            {item.category}
          </span>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            {item.description}
          </p>
          <button onClick={() => onReadMore(item)} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors w-fit group/btn">
            Read Full Article
            <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function NewsCard({ item, index, isInView, onReadMore }) {
  const config = categoryConfig[item.category] || categoryConfig['Certification'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      className="group"
    >
      <div className="relative bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-[10px] font-bold ${config.tag} px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm`}>
              {item.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <FiCalendar className="w-3 h-3" />
              <span className="text-xs">{item.date}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <div className="flex items-center gap-1.5 text-slate-400">
              <FiClock className="w-3 h-3" />
              <span className="text-xs">{item.readTime}</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed flex-1 line-clamp-3">
            {item.description}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <button onClick={() => onReadMore(item)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group/btn">
              Read More
              <FiArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TimelineCard({ item, index, isInView, onReadMore }) {
  const config = categoryConfig[item.category] || categoryConfig['Certification'];

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      className="group relative flex items-start gap-6"
    >
      {/* Timeline dot */}
      <div className="relative z-10 shrink-0">
        <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${config.gradient} ring-4 ring-white shadow-md`} />
        {index < news.length - 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200" />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 pb-8">
        <div className="bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="flex items-stretch">
            {/* Image */}
            <div className="w-32 shrink-0 overflow-hidden hidden sm:block">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-4 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold ${config.tag} px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400">{item.date}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1.5 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {item.description}
              </p>
              <button onClick={() => onReadMore(item)} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Read More <FiArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function News() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, margin: '-50px' });
  const isContentInView = useInView(contentRef, { once: true, margin: '-50px' });
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState('grid');
  const [selectedNews, setSelectedNews] = useState(null);

  const filteredNews = activeCategory === 'All'
    ? news
    : news.filter((n) => n.category === activeCategory);

  const counts = {
    All: news.length,
    ...categories.slice(1).reduce((acc, cat) => {
      acc[cat] = news.filter((n) => n.category === cat).length;
      return acc;
    }, {}),
  };

  const featured = filteredNews[0];
  const rest = filteredNews.slice(1);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold mb-6"
            >
              <FiFileText className="w-4 h-4" />
              News & Updates
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-5 leading-tight"
            >
              Company{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Milestones
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base text-white/60 leading-relaxed max-w-2xl mx-auto mb-8"
            >
              Stay updated with our latest achievements, partnerships, certifications, and industry recognition.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center gap-6 flex-wrap"
            >
              {[
                { label: 'Certifications', value: counts.Certification || 0, color: 'text-emerald-400' },
                { label: 'Expansions', value: counts.Expansion || 0, color: 'text-blue-400' },
                { label: 'Partnerships', value: counts.Partnership || 0, color: 'text-purple-400' },
                { label: 'Press Features', value: counts.Press || 0, color: 'text-amber-400' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 28C672 36 768 48 864 50C960 52 1056 44 1152 36C1248 28 1344 20 1392 16L1440 12V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Filters & Content */}
      <section ref={contentRef} className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            {/* Category filters */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const config = categoryConfig[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                        : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'
                    }`}
                  >
                    {cat}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20' : 'bg-slate-100'
                    }`}>
                      {counts[cat] || 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 shrink-0">
              {['grid', 'list', 'timeline'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                    view === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </motion.div>

          {/* News Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'grid' && featured && (
                <div className="space-y-6">
                  {/* Featured card */}
                  <FeaturedCard item={featured} isInView={isContentInView} onReadMore={setSelectedNews} />

                  {/* Grid of remaining */}
                  {rest.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                      {rest.map((item, index) => (
                        <NewsCard
                          key={item.id}
                          item={item}
                          index={index}
                          isInView={isContentInView}
                          onReadMore={setSelectedNews}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {view === 'list' && (
                <div className="space-y-4">
                  {filteredNews.map((item, index) => {
                    const config = categoryConfig[item.category] || categoryConfig['Certification'];
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="group"
                      >
                        <div className="bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                          <div className="flex items-stretch">
                            <div className="w-40 shrink-0 overflow-hidden hidden sm:block">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-5 flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] font-bold ${config.tag} px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                                  {item.category}
                                </span>
                                <span className="text-xs text-slate-400">{item.date}</span>
                                <span className="text-slate-300">·</span>
                                <span className="text-xs text-slate-400">{item.readTime}</span>
                              </div>
                              <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1.5 group-hover:text-blue-600 transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <div className="p-5 flex items-center">
                              <button onClick={() => setSelectedNews(item)} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                <FiArrowUpRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {view === 'timeline' && (
                <div className="max-w-3xl mx-auto">
                  {filteredNews.map((item, index) => (
                    <TimelineCard
                      key={item.id}
                      item={item}
                      index={index}
                      isInView={isContentInView}
                      onReadMore={setSelectedNews}
                    />
                  ))}
                </div>
              )}

              {filteredNews.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-500">No news found for this category.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Follow us on social media or subscribe to our newsletter for the latest updates from Walnut Technologies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-600/20"
              >
                Subscribe to Newsletter
                <FiArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-all"
              >
                Follow on LinkedIn
                <FiArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      {/* News Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <NewsModal item={selectedNews} onClose={() => setSelectedNews(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
