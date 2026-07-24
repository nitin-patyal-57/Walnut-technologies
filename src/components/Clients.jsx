import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiHeart, FiShield, FiBriefcase, FiActivity, FiZap, FiTool } from 'react-icons/fi';
import { clientSectors } from '../data/content';

const sectorIcons = {
  hospital: FiHeart,
  shield: FiShield,
  gov: FiBriefcase,
  pharma: FiActivity,
  energy: FiZap,
  industry: FiTool,
};

export default function Clients() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="clients" className="section-padding relative bg-white">
      
      <div ref={ref} className="relative container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-label mx-auto w-fit">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Industries We Serve
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            Trusted Across{' '}
            <span className="gradient-text">6 Key Sectors</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            From healthcare to defence — our manufacturing capabilities serve the most demanding industries worldwide.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {clientSectors.map((sector, index) => {
            const Icon = sectorIcons[sector.icon];
            return (
              <motion.div
                key={sector.sector}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all duration-500 shadow-sm hover:shadow-md"
              >
                <div className="relative p-6">
                  <div className={`inline-flex w-9 h-9 rounded-lg bg-gradient-to-br ${sector.gradient} items-center justify-center mb-3 shadow-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-0.5">{sector.sector}</h3>
                  <p className="text-xs text-slate-500 mb-2">{sector.description}</p>
                  {sector.clients && sector.clients.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {sector.clients.map((client) => (
                        <span key={client} className="px-1.5 py-0.5 text-[9px] bg-slate-100 text-slate-600 rounded border border-slate-200">
                          {client}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
