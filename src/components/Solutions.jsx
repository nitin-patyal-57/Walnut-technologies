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

const categoryColorMap = {
  'Medical Devices': { bar: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-50/30', border: 'border-cyan-200', iconBg: 'from-cyan-500 to-blue-600' },
  'Payment Systems': { bar: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50/30', border: 'border-violet-200', iconBg: 'from-violet-500 to-purple-600' },
  'Custom Electronics': { bar: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50/30', border: 'border-amber-200', iconBg: 'from-amber-500 to-orange-600' },
};

function DivisionShowcase({ division, onSelect, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = divisionIcons[division.id];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      onClick={() => onSelect(division)}
      className="cursor-pointer group text-center"
    >
      {/* Products Display */}
      <div className="relative h-[280px] md:h-[320px] mb-8">
        {/* Background Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 md:w-56 md:h-56 bg-gradient-to-b from-slate-100 to-slate-200 rounded-full opacity-50" />
        </div>
        
        {/* Products on Pedestals */}
        <div className="relative flex justify-center items-end h-full px-4">
          {division.products.slice(0, 3).map((product, pIndex) => {
            const isCenter = pIndex === 1;
            const offsets = ['-translate-x-12 md:-translate-x-16', '', 'translate-x-12 md:translate-x-16'];
            const heights = ['h-24 md:h-28', 'h-32 md:h-40', 'h-24 md:h-28'];
            const bottoms = ['bottom-8', 'bottom-16', 'bottom-8'];
            
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + pIndex * 0.1 }}
                className={`absolute ${offsets[pIndex]} ${bottoms[pIndex]} z-${isCenter ? 20 : 10 - pIndex}`}
              >
                {/* Pedestal */}
                <div className="relative">
                  {/* Shadow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/10 rounded-full blur-sm" />
                  
                  {/* Pedestal Base */}
                  <div className="w-24 h-4 md:w-28 md:h-5 bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-full shadow-md border border-slate-200/50 mx-auto" />
                  
                  {/* Product */}
                  <div className={`absolute -top-${isCenter ? '32' : '24'} md:-top-${isCenter ? '40' : '32'} left-1/2 -translate-x-1/2 ${heights[pIndex]} w-20 md:w-24 group-hover:scale-105 transition-transform duration-500`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Division Info */}
      <div className="relative">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-slate-700" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 mb-2">{division.title}</h3>
        <p className="text-sm text-slate-500 mb-4 max-w-xs mx-auto leading-relaxed">{division.subtitle}</p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {division.features.slice(0, 3).map((f) => (
            <span key={f} className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-full border border-slate-200">
              <FiCheckCircle className="w-3 h-3 text-emerald-500" />
              {f}
            </span>
          ))}
        </div>

        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-full transition-colors group/btn">
          Explore Products
          <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all duration-500 shadow-sm hover:shadow-xl"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${colors?.bar || 'from-slate-400 to-slate-500'}`} />
      
      {/* Product Image */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-b from-slate-50 to-white p-6">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 text-[10px] font-semibold text-white bg-gradient-to-r ${colors?.bar || 'from-slate-400 to-slate-500'} rounded-full`}>
          {product.category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{product.title}</h3>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">{product.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-5">
          {product.features.map((feature) => (
            <span key={feature} className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-full border border-slate-200">
              {feature}
            </span>
          ))}
        </div>
        
        <button
          onClick={(e) => { e.stopPropagation(); onOpenQuote(); }}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          Request Quote
          <FiArrowRight className="w-4 h-4" />
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
    <section id="solutions" className="py-16 md:py-24 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
            {selectedDivision ? (
              <>
                <span className="text-blue-600">{selectedDivision.title}</span> Solutions
              </>
            ) : (
              <>
                Our <span className="text-blue-600">Solutions</span>
              </>
            )}
          </h2>
          <p className="text-base text-slate-500 max-w-2xl mx-auto">
            {selectedDivision
              ? selectedDivision.description
              : 'Specialized manufacturing verticals serving the most demanding industries.'}
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
              {divisions.map((division, index) => (
                <DivisionShowcase
                  key={division.id}
                  division={division}
                  onSelect={setSelectedDivision}
                  index={index}
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
                className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm"
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
