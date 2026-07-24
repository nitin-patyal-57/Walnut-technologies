import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { brand, trustSignals } from '../data/content';

export default function Hero({ onOpenQuote, onOpenSchedule }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/3d image.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/70" />
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Vertically Integrated OEM/ODM Manufacturer
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
                {brand.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-3 pt-1"
              >
                <button
                  onClick={onOpenQuote}
                  className="group px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 flex items-center gap-2"
                >
                  Request a Quote
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={onOpenSchedule}
                  className="px-6 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
                >
                  <FiPlay className="w-3.5 h-3.5" />
                  Schedule a Call
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-3">
                {trustSignals.stats.map((stat, index) => (
                  <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 hover:bg-white/15 transition-all duration-300">
                    <div className="text-2xl font-bold font-display text-white mb-0.5">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/60">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4">
                <div className="flex flex-wrap gap-1.5">
                  {trustSignals.certifications.map((cert) => (
                    <span key={cert} className="px-2 py-1 text-[11px] font-medium bg-white/10 text-white/70 rounded-md border border-white/15">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
