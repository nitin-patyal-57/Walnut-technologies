import { useRef, useState, useMemo, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiCreditCard, FiCpu, FiCheckCircle, FiArrowLeft, FiWifi, FiArrowUpRight, FiArrowUp } from 'react-icons/fi';
import { products, divisions } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import ProductShowcase from './ProductShowcase';
import MedicalShowcase from './MedicalShowcase';
import NeuroShowcase from './NeuroShowcase';
import IoTShowcase from './IoTShowcase';

const divisionIcons = {
  neuro: FiCpu,
  medical: FiHeart,
  fintech: FiCreditCard,
  automotive: FiCpu,
  iot: FiWifi,
};

const divisionColors = {
  neuro: { accent: '#10b981', gradient: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50', ring: 'ring-emerald-200' },
  medical: { accent: '#06b6d4', gradient: 'from-cyan-500 to-blue-600', light: 'bg-cyan-50', ring: 'ring-cyan-200' },
  fintech: { accent: '#8b5cf6', gradient: 'from-violet-500 to-purple-600', light: 'bg-violet-50', ring: 'ring-violet-200' },
  automotive: { accent: '#f59e0b', gradient: 'from-amber-500 to-orange-600', light: 'bg-amber-50', ring: 'ring-amber-200' },
  iot: { accent: '#0891b2', gradient: 'from-cyan-500 to-teal-600', light: 'bg-cyan-50', ring: 'ring-cyan-200' },
};

const categoryColorMap = {
  'Neuro Rehab Devices': { bar: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-50/30', border: 'border-emerald-200', iconBg: 'from-emerald-500 to-teal-600' },
  'Medical': { bar: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-50/30', border: 'border-cyan-200', iconBg: 'from-cyan-500 to-blue-600' },
  'Fintech': { bar: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50/30', border: 'border-violet-200', iconBg: 'from-violet-500 to-purple-600' },
  'Automotive': { bar: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50/30', border: 'border-amber-200', iconBg: 'from-amber-500 to-orange-600' },
  'IoT': { bar: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-50/30', border: 'border-cyan-200', iconBg: 'from-cyan-500 to-blue-600' },
};

function HeroBanner({ onSelect }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const divisionsList = [
    { label: 'Medical', color: '#06b6d4', initial: 'M' },
    { label: 'Fintech', color: '#8b5cf6', initial: 'F' },
    { label: 'Neuro', color: '#10b981', initial: 'N' },
    { label: 'Automotive', color: '#f59e0b', initial: 'A' },
    { label: 'IoT', color: '#0891b2', initial: 'I' },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl mb-8"
    >
      {/* Background image */}
      <img
        src="/gpsgatewaybackground.webp"
        alt="GPS Gateway Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex flex-col lg:flex-row items-center">
        {/* Left Content */}
        <div className="flex-1 p-8 md:p-12 lg:p-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black font-display text-white leading-[1.1] tracking-tight mb-5 drop-shadow-lg">
              {t('solutions.heroTitle')}
            </h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-md mb-8 drop-shadow-md">
              {t('solutions.heroDesc')}
            </p>
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => onSelect(divisions[0])}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
              >
                {t('solutions.exploreProducts')}
              </button>
              <button
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-blue-200 transition-colors drop-shadow-md"
              >
                See More
                <FiArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            {/* Trust badges */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {divisionsList.map((d, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: d.color }}>
                    {d.initial}
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/90 leading-tight drop-shadow-md">
                <span className="font-semibold text-white">{t('solutions.heroTrusted')}.</span><br />
                {t('solutions.heroTrustedDesc')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function CategoryCard({ division, onSelect, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onSelect(division)}
      className="cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative rounded-2xl bg-slate-100/80 aspect-[4/3] flex items-center justify-center p-6 mb-4 overflow-hidden group-hover:bg-slate-200/60 transition-colors duration-300">
        <img
          src={division.products[0].image}
          alt={division.products[0].name}
          className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-110 transition-transform duration-500 ease-out mix-blend-multiply drop-shadow-md"
        />
      </div>
      {/* Text */}
      <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
        {division.title}
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
        {division.subtitle}
      </p>
    </motion.div>
  );
}

function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const features = [
    {
      title: 'GPS Gateway',
      desc: 'Reliable tracking and connectivity for industrial and logistics applications.',
      image: '/GPS Gateway.webp',
      icon: FiWifi,
    },
    {
      title: 'Bharat Pay Solutions',
      desc: 'Secure payment terminals powering digital transactions across India.',
      image: '/bharatpay m.webp',
      icon: FiCreditCard,
    },
    {
      title: 'MedStim Neuro Devices',
      desc: 'Advanced neurostimulation therapy for accelerated recovery.',
      image: '/medstim new.webp',
      icon: FiCpu,
    },
    {
      title: 'Smart Lock Systems',
      desc: 'Connected IoT locks with BLE/WiFi and cloud integration.',
      image: '/smartlock.webp',
      icon: FiWifi,
    },
  ];

  return (
    <section ref={ref} className="py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Features</p>
        <h2 className="text-2xl md:text-3xl font-black font-display text-slate-900 mb-2 leading-tight">
          Electronics for the Future: Innovations
        </h2>
        <p className="text-sm text-slate-500 max-w-md">
          Discover the cutting-edge innovations of tomorrow in one place.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left - Large card (GPS Gateway) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-slate-900 md:row-span-2 group cursor-pointer"
        >
          <img
            src={features[0].image}
            alt={features[0].title}
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-all duration-700"
          />
          <div className="relative z-10 h-full flex flex-col justify-between p-5 md:p-6 min-h-[300px] md:min-h-[420px]">
            <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              {(() => { const Icon = features[0].icon; return <Icon className="w-3.5 h-3.5 text-white" />; })()}
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white mb-1">{features[0].title}</h3>
              <p className="text-[11px] text-white/70 leading-relaxed">{features[0].desc}</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side - 3 cards stacked */}
        <div className="flex flex-col gap-4">
          {/* Bharat Pay */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl bg-slate-900 group cursor-pointer h-[160px]"
          >
            <img
              src={features[1].image}
              alt={features[1].title}
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-all duration-700"
            />
            <div className="relative z-10 h-full flex flex-col justify-between p-5">
              <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                {(() => { const Icon = features[1].icon; return <Icon className="w-3.5 h-3.5 text-white" />; })()}
              </div>
              <div>
                <h3 className="text-xs font-bold text-white mb-0.5">{features[1].title}</h3>
                <p className="text-[10px] text-white/70">{features[1].desc}</p>
              </div>
            </div>
          </motion.div>

          {/* Bottom two cards side by side */}
          <div className="grid grid-cols-2 gap-4">
            {features.slice(2).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="relative overflow-hidden rounded-2xl bg-slate-900 group cursor-pointer h-[160px]"
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-all duration-700"
                />
                <div className="relative z-10 h-full flex flex-col justify-between p-4">
                  <div className="w-6 h-6 rounded-md bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    {(() => { const Icon = feature.icon; return <Icon className="w-3 h-3 text-white" />; })()}
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-white mb-0.5">{feature.title}</h3>
                    <p className="text-[9px] text-white/70 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const stats = [
    { value: '2016', label: 'Founded' },
    { value: '400+', label: 'Engineers' },
    { value: '20+', label: 'Countries' },
    { value: '300K+', label: 'Units/Month' },
    { value: '150K', label: 'sq.ft Facility' },
    { value: '4', label: 'SMT Lines' },
  ];

  return (
    <section ref={ref} className="py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="rounded-3xl bg-slate-900 overflow-hidden"
      >
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
              className="p-6 md:p-8 text-center border-r border-white/10 last:border-r-0"
            >
              <div className="text-2xl md:text-3xl font-black font-display text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-white/60 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ProductCard({ product, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const colors = categoryColorMap[product.category];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 hover:border-slate-300 transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50">
        <div className="relative h-48 lg:h-56 bg-slate-100/60 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-32 h-32 lg:w-40 lg:h-40 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-md"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{product.title}</h3>
          <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {product.features.slice(0, 2).map((f) => (
              <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-slate-50 text-slate-600 rounded-md border border-slate-200/60">
                <FiCheckCircle className="w-3 h-3 text-emerald-500" />
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Solutions({ onOpenQuote }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [searchParams] = useSearchParams();
  const specificProductId = searchParams.get('product');
  const categoryParam = searchParams.get('category');

  const initialDivision = useMemo(() => {
    if (specificProductId) {
      const product = products.find(p => p.id === specificProductId);
      if (product) {
        const division = divisions.find(d => d.title === product.category);
        if (division) return division;
        return divisions[0];
      }
    }
    if (categoryParam) {
      return divisions.find(d => d.title === categoryParam) || null;
    }
    return null;
  }, [specificProductId, categoryParam]);

  const [selectedDivision, setSelectedDivision] = useState(initialDivision);

  useEffect(() => {
    if (selectedDivision) {
      const isFullPageShowcase = ['fintech', 'medical', 'neuro', 'iot'].includes(selectedDivision.id);
      const el = document.getElementById('solutions');
      if (isFullPageShowcase) {
        const timer = setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 350);
        return () => clearTimeout(timer);
      }
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [selectedDivision]);

  const divisionProducts = useMemo(() => {
    if (!selectedDivision) return [];
    if (specificProductId) {
      const product = products.find(p => p.id === specificProductId);
      if (product) return [product];
    }
    return products.filter(p => p.category === selectedDivision.title);
  }, [selectedDivision, specificProductId]);

  const isFintechSelected = selectedDivision?.id === 'fintech';
  const isMedicalSelected = selectedDivision?.id === 'medical';
  const isNeuroSelected = selectedDivision?.id === 'neuro';
  const isIoTSelected = selectedDivision?.id === 'iot';
  const isSpecialDivision = isFintechSelected || isMedicalSelected || isNeuroSelected || isIoTSelected;

  return (
    <section id="solutions" className={`relative ${isSpecialDivision ? 'p-0 m-0' : 'py-16 md:py-20'}`}>
      <div ref={ref} className={`${isSpecialDivision ? 'p-0 m-0 w-full' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'}`}>

        <AnimatePresence mode="wait">
          {!selectedDivision ? (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Banner */}
              <HeroBanner onSelect={setSelectedDivision} />

              {/* Category Grid */}
              <div id="categories" className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 mb-8">
                {divisions.map((division, index) => (
                  <CategoryCard
                    key={division.id}
                    division={division}
                    onSelect={setSelectedDivision}
                    index={index}
                  />
                ))}
              </div>

              {/* Features Section */}
              <FeaturesSection />

              {/* Stats Section */}
              <StatsSection />
            </motion.div>
          ) : selectedDivision?.id === 'fintech' ? (
            <ProductShowcase
              key="fintech-showcase"
              onBack={() => setSelectedDivision(null)}
            />
          ) : selectedDivision?.id === 'medical' ? (
            <MedicalShowcase
              key="medical-showcase"
              onBack={() => setSelectedDivision(null)}
            />
          ) : selectedDivision?.id === 'neuro' ? (
            <NeuroShowcase
              key="neuro-showcase"
              onBack={() => setSelectedDivision(null)}
            />
          ) : selectedDivision?.id === 'iot' ? (
            <IoTShowcase
              key="iot-showcase"
              onBack={() => setSelectedDivision(null)}
            />
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setSelectedDivision(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm hover:shadow-md"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  {t('solutions.allDivisions')}
                </button>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
              </div>

              {/* Division Info */}
              <div className="mb-8 p-5 md:p-6 rounded-2xl bg-slate-100/60 border border-slate-200/60">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${divisionColors[selectedDivision.id]?.gradient || 'from-slate-400 to-slate-500'} flex items-center justify-center shadow-lg`}>
                    {(() => {
                      const DivIcon = divisionIcons[selectedDivision.id];
                      return DivIcon ? <DivIcon className="w-5 h-5 text-white" /> : null;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-slate-900">{selectedDivision.title}</h3>
                    <p className="text-xs text-slate-500">{selectedDivision.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {divisionProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
