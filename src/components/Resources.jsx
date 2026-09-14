import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  FiDownload, FiFileText, FiBarChart2, FiBook,
  FiArrowRight, FiChevronRight, FiCalendar, FiClock,
  FiFilter, FiGrid, FiList, FiExternalLink, FiArrowUpRight,
  FiX, FiMail, FiCheck, FiSend, FiUser
} from 'react-icons/fi';
import { resources } from '../data/content';

const typeConfig = {
  Whitepaper: {
    icon: FiFileText,
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    lightGradient: 'from-blue-50 to-cyan-50/30',
    tag: 'bg-blue-100 text-blue-700',
  },
  'Case Study': {
    icon: FiBarChart2,
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    lightGradient: 'from-purple-50 to-pink-50/30',
    tag: 'bg-purple-100 text-purple-700',
  },
  Brochure: {
    icon: FiBook,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
    lightGradient: 'from-amber-50 to-orange-50/30',
    tag: 'bg-amber-100 text-amber-700',
  },
};

const resourceIcons = {
  whitepaper: FiFileText,
  casestudy: FiBarChart2,
  brochure: FiBook,
};

const filters = ['All', 'Whitepaper', 'Case Study', 'Brochure'];

function RequestModal({ resource, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', company: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    // Simulate sending - replace with actual API call
    await new Promise((r) => setTimeout(r, 1500));

    // In production, you'd send this to your backend
    const mailtoLink = `mailto:contact@walnutmedical.in?subject=Resource Request: ${encodeURIComponent(resource.title)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\n\nPlease send me the following resource:\n${resource.title} (${resource.type})`)}`;
    window.open(mailtoLink, '_blank');

    setSending(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
          >
            <FiX className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FiDownload className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">{resource.type}</p>
              <h3 className="text-sm font-bold text-white leading-snug">{resource.title}</h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {!submitted ? (
            <>
              <p className="text-sm text-slate-500 mb-5">
                Fill in your details and we'll send this resource directly to your email.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address *</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Acme Corp"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      Send Resource
                    </>
                  )}
                </button>
              </form>
              <p className="text-[11px] text-slate-400 mt-3 text-center">
                We'll send the document to your email within 24 hours.
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Request Sent!</h4>
              <p className="text-sm text-slate-500">
                We'll send <strong>{resource.title}</strong> to your email shortly.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ResourceCard({ resource, index, isInView, view, onRequest }) {
  const config = typeConfig[resource.type] || typeConfig['Whitepaper'];
  const Icon = resourceIcons[resource.icon] || FiFileText;

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group"
      >
        <div className={`relative bg-white rounded-xl border ${config.border} hover:shadow-lg transition-all duration-300 overflow-hidden`}>
          <div className={`h-0.5 w-full bg-gradient-to-r ${config.gradient}`} />
          <div className="p-4 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold ${config.tag} px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                  {resource.type}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 truncate">{resource.title}</h3>
              <p className="text-xs text-slate-500 truncate">{resource.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onRequest(resource)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold ${config.text} hover:bg-slate-50 rounded-lg transition-colors`}
              >
                <FiDownload className="w-3.5 h-3.5" />
                Request
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group"
    >
      <div className={`relative bg-white rounded-2xl border ${config.border} hover:shadow-xl transition-all duration-500 overflow-hidden h-full flex flex-col`}>
        {/* Top accent */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${config.gradient}`} />

        {/* Header area */}
        <div className={`bg-gradient-to-br ${config.lightGradient} p-6 pb-4`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <span className={`text-[10px] font-bold ${config.tag} px-2.5 py-1 rounded-full uppercase tracking-wider`}>
              {resource.type}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-slate-800 transition-colors">
            {resource.title}
          </h3>
        </div>

        {/* Body */}
        <div className="p-6 pt-4 flex flex-col justify-between flex-1">
          <p className="text-sm text-slate-500 leading-relaxed mb-5">
            {resource.description}
          </p>

          <button
            onClick={() => onRequest(resource)}
            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r ${config.gradient} rounded-xl hover:opacity-90 transition-opacity shadow-md`}
          >
            <FiDownload className="w-3.5 h-3.5" />
            Request Document
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Resources() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, margin: '-50px' });
  const isContentInView = useInView(contentRef, { once: true, margin: '-50px' });
  const [activeFilter, setActiveFilter] = useState('All');
  const [view, setView] = useState('grid');
  const [selectedResource, setSelectedResource] = useState(null);

  const filteredResources = activeFilter === 'All'
    ? resources
    : resources.filter((r) => r.type === activeFilter);

  const counts = {
    All: resources.length,
    Whitepaper: resources.filter((r) => r.type === 'Whitepaper').length,
    'Case Study': resources.filter((r) => r.type === 'Case Study').length,
    Brochure: resources.filter((r) => r.type === 'Brochure').length,
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
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
              <FiBook className="w-4 h-4" />
              Resources & Downloads
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-5 leading-tight"
            >
              Knowledge Base &{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Downloads
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base text-white/60 leading-relaxed max-w-2xl mx-auto mb-8"
            >
              Whitepapers, case studies, and brochures to help you make informed decisions about our solutions.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center gap-8"
            >
              {[
                { label: 'Whitepapers', value: counts.Whitepaper },
                { label: 'Case Studies', value: counts['Case Study'] },
                { label: 'Brochures', value: counts.Brochure },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
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
            {/* Filter tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                        : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'
                    }`}
                  >
                    {filter}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20' : 'bg-slate-100'
                    }`}>
                      {counts[filter]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                  view === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                  view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Resources */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'grid' ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {filteredResources.map((resource, index) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      index={index}
                      isInView={isContentInView}
                      view={view}
                      onRequest={setSelectedResource}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredResources.map((resource, index) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      index={index}
                      isInView={isContentInView}
                      view={view}
                      onRequest={setSelectedResource}
                    />
                  ))}
                </div>
              )}

              {filteredResources.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-500">No resources found for this category.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need Custom Documentation?</h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Can't find what you're looking for? Our team can prepare custom technical documentation for your specific requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"
              >
                Request Custom Docs
                <FiArrowRight className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@walnutmedical.in"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-all"
              >
                <FiArrowUpRight className="w-4 h-4" />
                Contact Sales
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Request Modal */}
      <AnimatePresence>
        {selectedResource && (
          <RequestModal
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
