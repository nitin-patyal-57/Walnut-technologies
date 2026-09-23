import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const expertiseAreas = [
  {
    slug: 'medical-electronics',
    image: '/expertise/medical-tech.jpg',
    color: 'from-blue-600 to-blue-700',
    num: '01',
  },
  {
    slug: 'embedded-electronic-and-iot',
    image: '/expertise/global-network.jpg',
    color: 'from-cyan-500 to-cyan-600',
    num: '02',
  },
  {
    slug: 'ip-oriented-product',
    image: '/expertise/engineer-work.jpg',
    color: 'from-blue-500 to-indigo-600',
    num: '03',
  },
  {
    slug: 'pcb-design-development',
    image: '/expertise/circuit-macro.jpg',
    color: 'from-indigo-500 to-violet-600',
    num: '04',
  },
  {
    slug: 'it-electronics',
    image: '/expertise/circuit-blue.jpg',
    color: 'from-blue-600 to-blue-700',
    num: '05',
  },
  {
    slug: 'iot-software-development',
    image: '/expertise/software-code.jpg',
    color: 'from-cyan-500 to-cyan-600',
    num: '06',
  },
  {
    slug: 'large-scale-manufacturing',
    image: '/expertise/factory-line.jpg',
    color: 'from-blue-500 to-indigo-600',
    num: '07',
  },
  {
    slug: 'payment-systems',
    image: '/expertise/payment-terminal.jpg',
    color: 'from-indigo-500 to-violet-600',
    num: '08',
  },
];

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Expertise() {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-50px' });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });

  const translatedAreas = t('expertise.areas');

  return (
    <div className="bg-white min-h-screen">
      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/40" />
        <div className="absolute top-24 right-16 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-28 md:pb-20 w-full">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Content */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 backdrop-blur-sm border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  {t('expertise.ourExpertise')}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black font-display text-slate-900 leading-[1.05] mb-5"
              >
                {t('expertise.expertisePowersInnovation')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm md:text-base text-slate-500 leading-relaxed mb-8 max-w-lg"
              >
                {t('expertise.description')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
                >
                  {t('expertise.cta')}
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/solutions"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
                >
                  Our Solutions
                </Link>
              </motion.div>
            </div>

            {/* Image — magazine style with overlapping accent */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-6"
            >
              <div className="relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/expertise/hero-engineer.jpg"
                    alt="Engineer working on electronics at Walnut Technologies"
                    className="w-full h-[300px] sm:h-[360px] md:h-[420px] object-cover"
                  />
                </div>
                {/* Decorative dot */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-100 rounded-full -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ EXPERTISE GRID — evolution-card pattern from About ═══ */}
      <section ref={gridRef} className="py-14 lg:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            {/* Label with side lines */}
            <div className="flex items-center justify-center gap-4 mb-5">
              <span className="w-10 h-px bg-blue-300" />
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-bold uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                Domains We Master
              </span>
              <span className="w-10 h-px bg-blue-300" />
            </div>

            {/* Split heading — last word in gradient */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-display text-slate-900 mb-4 leading-tight">
              {(() => {
                const words = t('expertise.whereExpertiseMeetsExcellence').split(' ');
                const last = words.pop();
                return (
                  <>
                    {words.join(' ')}{' '}
                    <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                      {last}
                    </span>
                  </>
                );
              })()}
            </h2>

            <p className="text-sm text-slate-500 max-w-2xl mx-auto mb-6 leading-relaxed">
              Eight specialized domains under one roof — from medical electronics and PCB design
              to payment systems and large-scale manufacturing.
            </p>

            {/* Animated shimmer divider */}
            <div className="relative w-40 h-1 mx-auto bg-slate-200 rounded-full overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 animate-shimmer bg-[length:200%_100%]"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertiseAreas.map((item, i) => {
              const title = translatedAreas?.[i]?.title || item.slug;
              const desc = translatedAreas?.[i]?.description || '';
              return (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={gridInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <Link
                    to={`/expertise/${item.slug}`}
                    className="group block relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-500 h-full flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={item.image}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-sm font-black text-white">{item.num}</span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-5 flex-1">
                      <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{desc}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 mt-4">
                        {t('expertise.learnMore')}
                        <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                    {/* Bottom accent */}
                    <div className={`h-1 w-full bg-gradient-to-r ${item.color}`} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
