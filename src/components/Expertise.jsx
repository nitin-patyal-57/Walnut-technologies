import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiHeart, FiCpu, FiLayout, FiSettings, FiCheckCircle, FiShield, FiCode, FiGlobe } from 'react-icons/fi';
import { expertise } from '../data/content';

const expertiseIcons = {
  heart: FiHeart,
  cpu: FiCpu,
  board: FiLayout,
  gear: FiSettings,
  check: FiCheckCircle,
  shield: FiShield,
  code: FiCode,
  globe: FiGlobe,
};

export default function Expertise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="expertise" className="section-padding relative bg-slate-50">
      
      <div ref={ref} className="relative container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-label mx-auto w-fit">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Core Competencies
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            Deep Expertise Across{' '}
            <span className="gradient-text">8 Domains</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Years of accumulated knowledge and proven capabilities across the electronics manufacturing spectrum.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {expertise.map((item, index) => {
            const Icon = expertiseIcons[item.icon];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group glass-card p-6 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 mb-2 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.areas.map((area) => (
                    <span key={area} className="px-2 py-0.5 text-[11px] bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      {area}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
