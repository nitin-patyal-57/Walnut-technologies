import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiCreditCard, FiCpu, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { products, divisions } from '../data/content';

const divisionIcons = {
  medical: FiHeart,
  payment: FiCreditCard,
  custom: FiCpu,
};

const divisionImages = {
  medical: '/all in one.jpg',
  payment: '/D and D.png',
  custom: '/4.png',
};

const categoryColorMap = {
  'Medical Devices': { bar: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-50/30', border: 'border-cyan-200', iconBg: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-200/50' },
  'Payment Systems': { bar: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50/30', border: 'border-violet-200', iconBg: 'from-violet-500 to-purple-600', glow: 'shadow-violet-200/50' },
  'Custom Electronics': { bar: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50/30', border: 'border-amber-200', iconBg: 'from-amber-500 to-orange-600', glow: 'shadow-amber-200/50' },
};

function DivisionCard({ division, onClick }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = divisionIcons[division.id];
  const colors = categoryColorMap[division.title];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-all duration-500 shadow-sm hover:shadow-xl hover:${colors.glow}`}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={divisionImages[division.id]}
          alt={division.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
        <div className={`absolute top-4 left-4 w-11 h-11 rounded-xl bg-gradient-to-br ${colors.iconBg} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold font-display text-white mb-1">{division.title}</h3>
          <p className="text-xs text-white/80 font-medium">{division.subtitle}</p>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">{division.description}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {division.features.map((f) => (
            <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-200">
              <FiCheckCircle className="w-2.5 h-2.5 text-emerald-500" />
              {f}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-900 group-hover:text-cyan-600 transition-colors">
          View Solutions
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

function ProductCard({ product, index, onOpenQuote }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const colors = categoryColorMap[product.category];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all duration-500 shadow-sm hover:shadow-lg"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${colors?.bar || 'from-slate-400 to-slate-500'}`} />
      <div className="p-5">
        <h3 className="text-base font-bold text-slate-900 mb-1.5">{product.title}</h3>
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">{product.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {product.features.map((feature) => (
            <span key={feature} className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-md border border-slate-200">
              {feature}
            </span>
          ))}
        </div>
        <button
          onClick={onOpenQuote}
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-600 hover:text-cyan-500 transition-colors group/btn"
        >
          Request Quote
          <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

export default function Solutions({ onOpenQuote }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [searchParams] = useSearchParams();
  const specificProductId = searchParams.get('product');
  const categoryParam = searchParams.get('category');

  const initialDivision = useMemo(() => {
    if (specificProductId) {
      const product = products.find(p => p.id === specificProductId);
      if (product) return divisions.find(d => d.title === product.category) || null;
    }
    if (categoryParam) {
      return divisions.find(d => d.title === categoryParam) || null;
    }
    return null;
  }, [specificProductId, categoryParam]);

  const [selectedDivision, setSelectedDivision] = useState(initialDivision);

  const divisionProducts = useMemo(() => {
    if (!selectedDivision) return [];
    return products.filter(p => p.category === selectedDivision.title);
  }, [selectedDivision]);

  return (
    <section id="solutions" className="section-padding relative bg-white">
      <div ref={ref} className="relative container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-label mx-auto w-fit">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Our Solutions
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            {selectedDivision ? (
              <>
                <span className="gradient-text">{selectedDivision.title}</span> Solutions
              </>
            ) : (
              <>
                Choose a <span className="gradient-text">Division</span>
              </>
            )}
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            {selectedDivision
              ? selectedDivision.description
              : 'Select a division to explore our specialized solutions and products.'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedDivision ? (
            /* Division Cards Grid */
            <motion.div
              key="divisions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-6 lg:gap-8"
            >
              {divisions.map((division) => (
                <DivisionCard
                  key={division.id}
                  division={division}
                  onClick={() => setSelectedDivision(division)}
                />
              ))}
            </motion.div>
          ) : (
            /* Products View */
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back Button */}
              <button
                onClick={() => setSelectedDivision(null)}
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:text-slate-900 transition-all"
              >
                <FiArrowLeft className="w-4 h-4" />
                All Divisions
              </button>

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {divisionProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onOpenQuote={onOpenQuote}
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
