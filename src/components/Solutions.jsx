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

const divisionColors = {
  medical: { gradient: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  payment: { gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
  custom: { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
};

const categoryColorMap = {
  'Medical Devices': { bar: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-50/30', border: 'border-cyan-200', iconBg: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-200/50' },
  'Payment Systems': { bar: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50/30', border: 'border-violet-200', iconBg: 'from-violet-500 to-purple-600', glow: 'shadow-violet-200/50' },
  'Custom Electronics': { bar: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50/30', border: 'border-amber-200', iconBg: 'from-amber-500 to-orange-600', glow: 'shadow-amber-200/50' },
};

function DivisionShowcase({ division, onSelect }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = divisionIcons[division.id];
  const colors = divisionColors[division.id];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      onClick={() => onSelect(division)}
      className="cursor-pointer group"
    >
      <div className="relative">
        {/* Products on Pedestals */}
        <div className="flex justify-center items-end gap-4 md:gap-6 mb-6 h-[200px] md:h-[260px]">
          {division.products.slice(0, 3).map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
              className="relative"
              style={{ 
                marginBottom: index === 1 ? '20px' : '0',
                zIndex: index === 1 ? 10 : 5 - index
              }}
            >
              {/* Pedestal */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-gradient-to-b from-slate-200 to-slate-300 rounded-full shadow-lg" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-3 bg-gradient-to-b from-slate-100 to-slate-200 rounded-full" />
              
              {/* Product Image */}
              <div className="relative w-24 h-28 md:w-32 md:h-36 mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Division Info */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} border ${colors.border} ${colors.text} text-sm font-semibold mb-3`}>
            <Icon className="w-4 h-4" />
            {division.title}
          </div>
          <h3 className="text-xl font-bold font-display text-slate-900 mb-2">{division.title}</h3>
          <p className="text-sm text-slate-500 mb-4 max-w-xs mx-auto">{division.subtitle}</p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {division.features.slice(0, 3).map((f) => (
              <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                <FiCheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                {f}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-900 group-hover:text-cyan-600 transition-colors">
            View Solutions
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
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
      <div className="relative h-48 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
        />
        <div className={`absolute top-3 right-3 px-2 py-0.5 text-[9px] font-semibold text-white bg-gradient-to-r ${colors?.bar || 'from-slate-400 to-slate-500'} rounded-full`}>
          {product.category}
        </div>
      </div>
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
          onClick={(e) => { e.stopPropagation(); onOpenQuote(); }}
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
    <section id="solutions" className="section-padding relative bg-gradient-to-b from-slate-50 to-white">
      <div ref={ref} className="relative container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
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
            /* Division Showcase */
            <motion.div
              key="divisions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-8 lg:gap-12"
            >
              {divisions.map((division) => (
                <DivisionShowcase
                  key={division.id}
                  division={division}
                  onSelect={setSelectedDivision}
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
