import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiArrowRight } from 'react-icons/fi';

const solutionCategories = [
  { id: 'oxygen-concentrators', title: 'Oxygen Concentrators', image: '/RTMS.png', link: '/solutions?product=oxygen-concentrator' },
  { id: 'pos-terminals', title: 'POS Terminals', image: '/paytm soundbox.png', link: '/solutions?product=pos-terminals' },
  { id: 'neuro-rehab', title: 'Neuro Rehab Devices', image: '/walklab 3.0.jpeg', link: '/solutions?product=walklab' },
  { id: 'bp-monitors', title: 'BP Monitors', image: '/BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw.webp', link: '/solutions?product=bp-monitor' },
  { id: 'qr-soundboxes', title: 'QR Soundboxes', image: '/Pocket Soundbox.png', link: '/solutions?product=qr-soundbox' },
  { id: 'thermometers', title: 'IR Thermometers', image: '/TDCS.png', link: '/solutions?product=thermometer' },
  { id: 'pcb-design', title: 'PCB Design', image: '/3d image.png', link: '/solutions?product=pcb-design' },
  { id: 'iot-solutions', title: 'IoT Solutions', image: '/smart lock.PNG', link: '/solutions?product=iot-solutions' },
];

function CategoryCard({ category, index, isInView }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.06 }}
      className="group relative overflow-hidden rounded-xl cursor-pointer border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-500"
    >
      <Link to={category.link} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent group-hover:from-slate-900/80 transition-all duration-500" />
          <div className="absolute inset-0 flex flex-col justify-end p-3">
            <h3 className="text-[10px] font-bold font-display text-white uppercase tracking-wide leading-tight mb-1.5">
              {category.title}
            </h3>
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-all duration-300">
              <FiArrowUpRight className="w-3 h-3 text-white group-hover:text-slate-900" />
            </div>
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
              From medical devices to payment systems and custom electronics — we design, develop, and manufacture mission-critical products with international certifications.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { label: 'Medical Devices', desc: 'ISO 13485, FDA, IEC 60601 compliant' },
                { label: 'Payment Systems', desc: 'PCI-DSS, NPCI, RBI certified' },
                { label: 'Custom Electronics', desc: '4 SMT Lines, 300K+ units/month' },
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
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
