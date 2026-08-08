import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiArrowRight } from 'react-icons/fi';

const solutionCategories = [
  { id: 'walklab', title: 'Walk Lab', image: '/walklab 3.0.jpeg', link: '/solutions?product=walklab' },
  { id: 'bp-monitor', title: 'Digital Blood Pressure', image: '/BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw.webp', link: '/solutions?product=bp-monitor' },
  { id: 'thermometer', title: 'IR Thermometer', image: '/TDCS.png', link: '/solutions?product=thermometer' },
  { id: 'oxygen-concentrator', title: 'Oxygen Concentrator', image: '/RTMS.png', link: '/solutions?product=oxygen-concentrator' },
  { id: 'nebulizer', title: 'Compressor Nebulizer', image: '/CES repose.png', link: '/solutions?product=nebulizer' },
  { id: 'single-sim', title: 'Single SIM Model', image: '/paytm soundbox.png', link: '/solutions?product=single-sim' },
  { id: 'double-sim', title: 'Double SIM Model', image: '/Pocket Soundbox.png', link: '/solutions?product=double-sim' },
  { id: 'with-display', title: 'With Display Model', image: '/soundbox (2).png', link: '/solutions?product=with-display' },
];

function CategoryCard({ category, index, isInView }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.06 }}
      className="group relative overflow-hidden rounded-xl cursor-pointer border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-500 bg-white"
    >
      <Link to={category.link} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6">
          <img
            src={category.image}
            alt={category.title}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-xs font-bold font-display text-white uppercase tracking-wide leading-tight">
              {category.title}
            </h3>
          </div>
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <FiArrowUpRight className="w-3 h-3 text-slate-700" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function SolutionCategories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="solution-categories" className="py-16 md:py-20 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              What We Build
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4 leading-tight">
              Precision Engineered{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
                Solutions
              </span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-md">
              From robotics to medical devices, fintech solutions, and automotive electronics — we design, develop, and manufacture mission-critical products with international certifications.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { label: 'Robotics', desc: 'AI-assisted rehabilitation & gait training' },
                { label: 'Medical', desc: 'ISO 13485, FDA, IEC 60601 compliant' },
                { label: 'Fintech', desc: 'PCI-DSS, NPCI, RBI certified' },
                { label: 'Automotive', desc: 'Industrial grade, durable electronics' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              to="/solutions"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-lg transition-all duration-300"
            >
              View All Solutions
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right Side - Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {solutionCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
