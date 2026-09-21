import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onOpenSchedule }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

  const stats = [
    { value: '10+', label: t('stats.years') },
    { value: '400+', label: t('stats.engineers') },
    { value: '20+', label: t('stats.countries') },
    { value: '500K+', label: t('stats.units') },
    { value: '150,000 sq.ft', label: t('stats.facility') },
    { value: '4', label: t('stats.smt') },
  ];

  return (
    <section id="hero" className="relative min-h-[100dvh] min-h-screen flex flex-col overflow-hidden w-full">
      <div className="absolute inset-0">
        <img
          src="/home-background.webp"
          alt="Walnut Technologies electronics manufacturing facility"
          width="1920"
          height="1080"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/70" />
      </div>

      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="max-w-3xl">
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs backdrop-blur-sm w-fit"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t('hero.tagline')}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1]"
                >
                  <span className="text-white">Electronics</span>
                  <br />
                  <span className="text-cyan-400">for the World</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="text-sm sm:text-base text-white/70 leading-relaxed max-w-lg"
                >
                  {t('hero.subtitle')}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-wrap gap-3 pt-1"
                >
                  <button
                    onClick={onOpenSchedule}
                    className="group px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 flex items-center gap-2"
                  >
                    {t('hero.cta1')}
                    <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => document.getElementById('divisions-preview')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-6 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
                  >
                    <FiPlay className="w-3.5 h-3.5" />
                    {t('hero.cta2')}
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar at Bottom of Hero */}
      <div ref={statsRef} className="relative z-10 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                  className="text-center"
                >
                  <div className="text-lg font-bold font-display text-cyan-400">{stat.value}</div>
                  <div className="text-[10px] text-white/60 font-medium leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
