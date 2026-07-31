import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight, FiCpu, FiCreditCard, FiHeart, FiMonitor } from 'react-icons/fi';
import { divisions } from '../data/content';

const divisionIcons = {
  medkit: FiHeart,
  card: FiCreditCard,
  chip: FiCpu,
};

const divisionBgIcons = {
  medkit: FiHeart,
  card: FiCreditCard,
  chip: FiMonitor,
};

export default function Divisions({ onOpenQuote }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="divisions" className="section-padding relative bg-slate-50">
      
      <div ref={ref} className="relative container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="section-label mx-auto w-fit">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Our Divisions
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            Three Divisions,{' '}
            <span className="gradient-text">One Standard of Excellence</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Specialized manufacturing divisions serving the most demanding industries with uncompromising quality.
          </p>
        </motion.div>

        {/* Division Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {divisions.map((division, index) => {
            const Icon = divisionIcons[division.icon];
            const BgIcon = divisionBgIcons[division.icon];
            return (
              <motion.div
                key={division.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all duration-500 shadow-sm hover:shadow-md"
              >
                {/* Background Icon */}
                <div className="absolute -right-8 -top-8 text-8xl text-slate-100 group-hover:text-slate-200 transition-colors duration-500">
                  <BgIcon />
                </div>

                <div className="relative p-5">
                  {/* Icon */}
                  <div className={`inline-flex w-10 h-10 rounded-lg bg-gradient-to-br ${division.color} items-center justify-center mb-3 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold font-display text-slate-900 mb-1.5">
                    {division.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    {division.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {division.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {division.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-md border border-slate-200"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Product Images Grid */}
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Products</p>
                    <div className="grid grid-cols-5 gap-1.5">
                      {division.products.map((product) => (
                        <div key={product.name} className="group/img relative aspect-square overflow-hidden rounded-lg border border-slate-200 hover:border-slate-300 transition-all">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                            <p className="text-[7px] font-medium text-white leading-tight truncate">{product.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
