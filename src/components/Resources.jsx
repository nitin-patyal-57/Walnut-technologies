import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiDownload, FiFileText, FiBarChart2, FiBook } from 'react-icons/fi';
import { resources } from '../data/content';

const resourceIcons = {
  whitepaper: FiFileText,
  casestudy: FiBarChart2,
  brochure: FiBook,
};

export default function Resources() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="resources" className="section-padding relative bg-slate-50">
      
      <div ref={ref} className="relative container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-label mx-auto w-fit">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Resources
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            Knowledge Base &{' '}
            <span className="gradient-text">Downloads</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Whitepapers, case studies, and brochures to help you make informed decisions.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {resources.map((resource, index) => {
            const Icon = resourceIcons[resource.icon];
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group glass-card p-6 hover:border-slate-300 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${resource.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{resource.type}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{resource.title}</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{resource.description}</p>
                <button className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-600 hover:text-cyan-500 transition-colors">
                  <FiDownload className="w-3.5 h-3.5" />
                  Download
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
