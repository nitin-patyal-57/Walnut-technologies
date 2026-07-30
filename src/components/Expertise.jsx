import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  FiHeart, FiCpu, FiLayout, FiSettings, FiCheckCircle, FiShield, 
  FiCode, FiGlobe, FiArrowRight, FiX, FiZap 
} from 'react-icons/fi';
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

const expertiseColors = [
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-green-600',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-blue-600',
  'from-teal-500 to-cyan-600',
  'from-fuchsia-500 to-purple-600',
];

function ExpertiseHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <img
          src="/3d image.png"
          alt=""
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/95" />
      </div>
      
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold mb-6">
              <FiZap className="w-3.5 h-3.5 text-cyan-400" />
              Our Expertise
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-5 leading-tight">
              Deep Expertise Across{' '}
              <span className="text-cyan-400">8 Domains</span>
            </h1>
            <p className="text-base md:text-lg text-white/60 mb-8 leading-relaxed max-w-lg">
              Years of accumulated knowledge and proven capabilities across the electronics manufacturing spectrum.
            </p>
            <div className="flex flex-wrap gap-3">
              {expertise.slice(0, 4).map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10"
                >
                  <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${expertiseColors[i]}`} />
                  <span className="text-xs text-white/80 font-medium">{item.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:grid grid-cols-4 gap-3"
          >
            {expertise.slice(0, 8).map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                className="aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ExpertiseCard({ item, index, onSelect }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = expertiseIcons[item.icon];
  const color = expertiseColors[index];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onClick={() => onSelect(item)}
      className="group relative cursor-pointer"
    >
      <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-all duration-500 shadow-sm hover:shadow-xl">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          
          {/* Icon */}
          <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
            <p className="text-[11px] text-white/70 line-clamp-2">{item.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex flex-wrap gap-1.5">
            {item.areas.slice(0, 4).map((area) => (
              <span key={area} className="px-2 py-0.5 text-[9px] bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                {area}
              </span>
            ))}
            {item.areas.length > 4 && (
              <span className="px-2 py-0.5 text-[9px] bg-slate-100 text-slate-500 rounded-md">
                +{item.areas.length - 4}
              </span>
            )}
          </div>
          
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-cyan-600 group-hover:text-cyan-500 transition-colors">
            Learn More
            <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ExpertiseModal({ item, onClose }) {
  const Icon = expertiseIcons[item.icon];
  const color = expertiseColors[expertise.findIndex(e => e.title === item.title)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>

          <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-bold text-white mb-1">{item.title}</h2>
            <p className="text-sm text-white/80">{item.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Core Areas</h3>
          <div className="grid grid-cols-2 gap-2">
            {item.areas.map((area, i) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100"
              >
                <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                  <FiCheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-slate-700 font-medium">{area}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href="/contact"
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors text-center"
            >
              Get in Touch
            </a>
            <a
              href="/solutions"
              className="flex-1 py-2.5 bg-white hover:bg-slate-50 text-slate-900 text-sm font-semibold rounded-xl border border-slate-200 transition-colors text-center"
            >
              View Solutions
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Expertise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <section id="expertise" className="relative bg-white">
      {/* Hero */}
      <ExpertiseHero />

      {/* Cards Section */}
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-600 text-xs font-semibold mb-4">
            <FiZap className="w-3.5 h-3.5" />
            Core Competencies
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            Explore Our <span className="text-cyan-600">Expertise</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Click on any domain to learn more about our capabilities
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {expertise.map((item, index) => (
            <ExpertiseCard
              key={item.title}
              item={item}
              index={index}
              onSelect={setSelectedItem}
            />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '8+', label: 'Domain Expertise' },
              { value: '500+', label: 'Engineers' },
              { value: '20+', label: 'Countries Served' },
              { value: '10+', label: 'Years Experience' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white border border-slate-200"
              >
                <div className="text-2xl font-bold font-display text-cyan-600 mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ExpertiseModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
