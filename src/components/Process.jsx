import { useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  FiZap, FiSearch, FiEdit3, FiLayers, FiCheckCircle, FiSettings,
  FiShield, FiTruck, FiHeadphones, FiTrendingUp,
  FiWifi, FiGrid, FiPieChart, FiMonitor, FiCloud, FiActivity,
  FiAward, FiClock, FiDollarSign, FiHeart, FiLock, FiUsers
} from 'react-icons/fi';
import { process, industryFourTechnologies, impactBenefits } from '../data/content';

const stepIcons = {
  lightbulb: FiZap,
  search: FiSearch,
  design: FiEdit3,
  prototype: FiLayers,
  testing: FiCheckCircle,
  manufacturing: FiSettings,
  quality: FiShield,
  packaging: FiTruck,
  support: FiHeadphones,
  improvement: FiTrendingUp,
};

const stepImages = [
  '/3d image.png',
  '/Automotive Electronics.png',
  '/Oxygen Concentrator.png',
  '/Walnut Compressor Nebulizer.png',
  '/BP.png',
  '/Infrared Thermometer.png',
  '/pcb designer.png',
  '/walklab.png',
  '/walkex.png',
  '/all images.png',
];

const techIcons = {
  iot: FiWifi,
  mes: FiGrid,
  ai: FiPieChart,
  twin: FiMonitor,
  cloud: FiCloud,
  robot: FiActivity,
};

const impactIcons = {
  'quality-badge': FiAward,
  speed: FiClock,
  cost: FiDollarSign,
  sustainable: FiHeart,
  security: FiLock,
  customer: FiUsers,
};

function TimelineStep({ step, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = stepIcons[step.icon];
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex items-center w-full mb-8 md:mb-0">
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-[1fr_80px_1fr] w-full items-center">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={isEven ? 'pr-8' : ''}
        >
          {isEven ? (
            <StepCard step={step} Icon={Icon} image={stepImages[index]} />
          ) : (
            <StepDetails step={step} />
          )}
        </motion.div>

        {/* Center node */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative z-10"
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
              <span className="text-[8px] font-bold text-slate-700">{step.step}</span>
            </div>
          </motion.div>
        </div>

        {/* Right content */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={isEven ? '' : 'pl-8'}
        >
          {isEven ? (
            <StepDetails step={step} />
          ) : (
            <StepCard step={step} Icon={Icon} image={stepImages[index]} />
          )}
        </motion.div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex w-full">
        <div className="flex flex-col items-center mr-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative z-10"
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
              <span className="text-[9px] font-bold text-slate-700">{step.step}</span>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 pb-4"
        >
          <StepCard step={step} Icon={Icon} image={stepImages[index]} />
          <StepDetails step={step} />
        </motion.div>
      </div>
    </div>
  );
}

function StepCard({ step, Icon, image }) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-500">
      <div className="relative h-36 overflow-hidden">
        <img
          src={image}
          alt={step.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-sm font-bold text-white drop-shadow-lg">{step.title}</h3>
          <span className="text-[10px] text-white/80 font-medium">{step.subtitle}</span>
        </div>
      </div>
    </div>
  );
}

function StepDetails({ step }) {
  return (
    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-100">
      <h4 className="text-xs font-bold text-slate-900 mb-2">{step.title}</h4>
      <div className="grid grid-cols-2 gap-1.5">
        {step.details.map((detail, i) => (
          <div key={i} className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-100">
            <div className={`w-4 h-4 rounded-md bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0`}>
              <FiCheckCircle className="w-2 h-2 text-white" />
            </div>
            <span className="text-[10px] text-slate-700 leading-tight">{detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="process" className="relative bg-white min-h-screen">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-4">
            <FiZap className="w-3.5 h-3.5" />
            Industry 4.0 Enabled
          </div>
          <h1 className="text-2xl md:text-4xl font-bold font-display text-slate-900 mb-3">
            From <span className="text-blue-600">Idea</span> to <span className="text-emerald-600">Impact</span>
          </h1>
          <p className="text-base text-slate-500 max-w-2xl mx-auto mb-4">
            End-to-End Product Development & Manufacturing Solutions
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">WE DESIGN</span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">WE DEVELOP</span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">WE MANUFACTURE</span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">WE DELIVER</span>
          </div>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative mb-12">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-emerald-200 to-purple-200 -translate-x-1/2" />
          {/* Mobile vertical line */}
          <div className="md:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-emerald-200 to-purple-200" />

          <div className="flex flex-col gap-8 md:gap-10">
            {process.map((step, index) => (
              <TimelineStep key={step.step} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* Industry 4.0 Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 mb-1">
              Powered by <span className="text-blue-600">Industry 4.0</span> Technologies
            </h2>
            <p className="text-sm text-slate-500">Smart manufacturing for the modern era</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {industryFourTechnologies.map((tech, index) => {
              const Icon = techIcons[tech.icon];

              return (
                <motion.div
                  key={tech.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.08 }}
                  className="group p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 text-center hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mb-0.5">
                    {tech.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {tech.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Delivering Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 mb-1">
              Delivering <span className="text-emerald-600">Impact</span> at Every Step
            </h2>
            <p className="text-sm text-slate-500">Our commitment to excellence</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {impactBenefits.map((benefit, index) => {
              const Icon = impactIcons[benefit.icon];

              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.08 }}
                  className="group p-4 rounded-xl bg-white border border-slate-200 text-center hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mb-0.5">
                    {benefit.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-xl">
            <span className="text-blue-400 font-semibold">Innovating Today</span>
            <span className="text-slate-600">•</span>
            <span className="text-white font-semibold">Delivering Excellence</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold">Building a Better Tomorrow</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
