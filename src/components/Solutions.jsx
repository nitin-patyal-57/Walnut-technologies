import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiCreditCard, FiCpu, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { products, divisions } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import ProductShowcase from './ProductShowcase';
import MedicalShowcase from './MedicalShowcase';
import NeuroShowcase from './NeuroShowcase';

const divisionIcons = {
  neuro: FiCpu,
  medical: FiHeart,
  fintech: FiCreditCard,
  automotive: FiCpu,
};

const categoryColorMap = {
  'Neuro Rehab Devices': { bar: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-50/30', border: 'border-emerald-200', iconBg: 'from-emerald-500 to-teal-600' },
  'Medical': { bar: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-50/30', border: 'border-cyan-200', iconBg: 'from-cyan-500 to-blue-600' },
  'Fintech': { bar: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50/30', border: 'border-violet-200', iconBg: 'from-violet-500 to-purple-600' },
  'Automotive': { bar: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50/30', border: 'border-amber-200', iconBg: 'from-amber-500 to-orange-600' },
  'IoT': { bar: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-50/30', border: 'border-cyan-200', iconBg: 'from-cyan-500 to-blue-600' },
};

const divisionAnimations = {
  neuro: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
  },
  medical: {
    initial: { opacity: 0, scale: 0.5, blur: 10 },
    animate: { opacity: 1, scale: 1, blur: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
  fintech: {
    initial: { opacity: 0, x: -100, skewX: 15 },
    animate: { opacity: 1, x: 0, skewX: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
  },
  automotive: {
    initial: { opacity: 0, y: 100, rotateX: 45 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

function DivisionShowcase({ division, onSelect, index }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = divisionIcons[division.id];
  const anim = divisionAnimations[division.id];

  return (
    <motion.div
      ref={ref}
      initial={anim.initial}
      animate={isInView ? anim.animate : anim.initial}
      transition={{ ...anim.transition, delay: index * 0.15 }}
      onClick={() => onSelect(division)}
      className="cursor-pointer group text-center"
    >
      <div className="relative mb-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-56 bg-gradient-to-b from-slate-100 to-slate-50 rounded-full" />
        
        <div className="relative pt-8 pb-4">
          <div className="flex justify-center items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-32 md:w-32 md:h-40 mb-2 flex items-center justify-center overflow-hidden rounded-xl">
                <img
                  src={division.products[0].image}
                  alt={division.products[0].name}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md mix-blend-multiply"
                />
              </div>
              
              <div className="w-24 h-4 md:w-32 md:h-5 bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-full shadow-sm border border-slate-200/50" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 mb-3 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5 text-slate-700" />
        </div>
        <h3 className="text-xl font-bold font-display text-slate-900 mb-2">{division.title}</h3>
        <p className="text-sm text-slate-500 mb-4 max-w-xs mx-auto leading-relaxed">{division.subtitle}</p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {division.features.slice(0, 3).map((f) => (
            <span key={f} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full border border-slate-200">
              <FiCheckCircle className="w-3 h-3 text-emerald-500" />
              {f}
            </span>
          ))}
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-full transition-colors"
        >
          {t('solutions.exploreProducts')}
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <FiArrowRight className="w-4 h-4" />
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProductCard({ product, index, onOpenQuote }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const colors = categoryColorMap[product.category];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="group relative text-center flex flex-col items-center"
    >
      <div className="relative mb-4 w-full flex justify-center">
        <div className="w-44 h-44 lg:w-52 lg:h-52 bg-[#f0f2f5] rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-32 h-32 lg:w-40 lg:h-40 object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
          />
        </div>
      </div>

      <div className="w-28 h-px bg-slate-200 mb-4" />

      <div className="relative w-full">
        <h3 className="text-sm lg:text-[15px] font-bold text-slate-900 mb-1">{product.title}</h3>
        <p className="text-xs text-slate-500 mb-3 px-2 leading-relaxed line-clamp-2">{product.description}</p>
        
        <div className="flex flex-wrap justify-center gap-1.5">
          {product.features.slice(0, 2).map((f) => (
            <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] lg:text-xs font-medium text-slate-600">
              <FiCheckCircle className="w-3 h-3 text-emerald-500" />
              {f}
            </span>
          ))}
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
  const isSpecialDivision = isFintechSelected || isMedicalSelected || isNeuroSelected;

  return (
    <section id="solutions" className={`bg-white ${isSpecialDivision ? 'p-0 m-0' : 'py-16 md:py-24'}`}>
      <div ref={ref} className={isSpecialDivision ? 'p-0 m-0 w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
        {!selectedDivision && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
              {specificProductId ? (
                <>
                  <span className="text-blue-600">{products.find(p => p.id === specificProductId)?.title || 'Product'}</span>
                </>
              ) : (
                <>
                  {t('solutions.ourSolutions')}
                </>
              )}
            </h2>
            <p className="text-base text-slate-500 max-w-2xl mx-auto">
              {t('solutions.defaultDesc')}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!selectedDivision ? (
            <motion.div
              key="divisions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
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
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelectedDivision(null)}
                className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm"
              >
                <FiArrowLeft className="w-4 h-4" />
                {t('solutions.allDivisions')}
              </button>

              <div className="grid gap-6 lg:gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
