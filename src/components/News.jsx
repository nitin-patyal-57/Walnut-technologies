import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';
import { news } from '../data/content';

const categoryColors = {
  Certification: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Expansion: 'bg-blue-50 text-blue-700 border-blue-200',
  Partnership: 'bg-purple-50 text-purple-700 border-purple-200',
  Press: 'bg-amber-50 text-amber-700 border-amber-200',
  Product: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Milestone: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function News() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="news" className="section-padding relative bg-white">
      
      <div ref={ref} className="relative container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-label mx-auto w-fit">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            News & Updates
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            Company{' '}
            <span className="gradient-text">Milestones</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Stay updated with our latest achievements, partnerships, and industry recognition.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {news.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group glass-card p-6 hover:border-slate-300 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">{item.date}</span>
              </div>
              <span className={`inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-lg border mb-3 ${
                categoryColors[item.category] || 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {item.category}
              </span>
              <h3 className="text-xs font-bold text-slate-900 mb-1.5 group-hover:text-cyan-600 transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-[10px] text-slate-500 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
