import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { trustSignals } from '../data/content';
import { FiShield, FiAward, FiCheckCircle, FiStar } from 'react-icons/fi';

const icons = [FiAward, FiShield, FiCheckCircle, FiStar];

export default function TrustSignals() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-12 overflow-hidden bg-white">
      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />

        <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-6 md:p-8 border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustSignals.stats.map((stat, index) => {
              const Icon = icons[index];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600 mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-slate-200" />

          {/* Certifications */}
          <div className="flex flex-wrap justify-center gap-3">
            {trustSignals.certifications.map((cert, index) => (
              <motion.span
                key={cert}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg border border-slate-200 hover:border-slate-300 hover:text-slate-900 transition-all cursor-default"
              >
                {cert}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
