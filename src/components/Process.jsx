import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  FiZap, FiSearch, FiEdit3, FiLayers, FiCheckCircle, FiSettings,
  FiShield, FiTruck, FiHeadphones, FiTrendingUp,
  FiWifi, FiGrid, FiPieChart, FiMonitor, FiCloud, FiActivity,
  FiAward, FiClock, FiDollarSign, FiHeart, FiLock, FiUsers, FiArrowRight
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
  '/TDCS.png',
  '/smart lock.PNG',
  '/Pocket Soundbox.png',
  '/BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw.webp',
  '/paytm soundbox.png',
  '/RTMS.png',
  '/walklab 3.0.jpeg',
  '/soundbox.png',
  '/soundbox (3).png',
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

function ScrollProcess() {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const stepIndex = Math.min(Math.floor(v * process.length), process.length - 1);
      setActiveStep(stepIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeStep}
              src={stepImages[activeStep]}
              alt=""
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.25, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/95" />
        </div>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-20">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
            style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
          />
        </div>

        {/* Step indicators */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {process.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeStep
                  ? 'w-8 bg-cyan-400'
                  : i < activeStep
                  ? 'w-3 bg-cyan-600'
                  : 'w-3 bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Left - Image */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: -50, rotateY: -10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: 50, rotateY: 10 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={stepImages[activeStep]}
                      alt={process[activeStep].title}
                      className="w-full h-[280px] md:h-[380px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${process[activeStep].color} flex items-center justify-center`}>
                          {(() => {
                            const Icon = stepIcons[process[activeStep].icon];
                            return <Icon className="w-5 h-5 text-white" />;
                          })()}
                        </div>
                        <span className="px-3 py-1 text-[10px] font-bold bg-white/20 backdrop-blur-sm text-white rounded-full">
                          STEP {process[activeStep].step} OF {process.length}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-1">
                        {process[activeStep].title}
                      </h2>
                      <p className="text-sm text-white/70">{process[activeStep].subtitle}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Floating step number */}
                <motion.div
                  animate={{ rotate: activeStep * 36 }}
                  transition={{ duration: 0.6 }}
                  className="absolute -top-3 -right-3 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-xl"
                >
                  <span className="text-xl font-bold text-white">{activeStep + 1}</span>
                </motion.div>
              </div>

              {/* Right - Details */}
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <div className="mb-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${process[activeStep].color} text-white text-[10px] font-semibold mb-3`}>
                        <FiZap className="w-2.5 h-2.5" />
                        Step {process[activeStep].step}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold font-display text-white mb-1">
                        {process[activeStep].title}
                      </h3>
                      <p className="text-xs text-white/60">{process[activeStep].subtitle}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {process[activeStep].details.map((detail, i) => (
                        <motion.div
                          key={detail}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.08 }}
                          className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10"
                        >
                          <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${process[activeStep].color} flex items-center justify-center shrink-0`}>
                            <FiCheckCircle className="w-2.5 h-2.5 text-white" />
                          </div>
                          <span className="text-[10px] text-white/90 font-medium">{detail}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Navigation hint */}
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <FiArrowRight className="w-3 h-3 animate-pulse" />
                      <span>Scroll to continue</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TechSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-4">
            <FiWifi className="w-3.5 h-3.5" />
            Smart Manufacturing
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            Powered by <span className="text-blue-600">Industry 4.0</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Integrating cutting-edge technologies for smart manufacturing
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {industryFourTechnologies.map((tech, index) => {
            const Icon = techIcons[tech.icon];
            return (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-0.5">{tech.title}</h3>
                <p className="text-[10px] text-slate-500">{tech.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold mb-4">
            <FiAward className="w-3.5 h-3.5" />
            Our Commitment
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            Delivering <span className="text-emerald-600">Impact</span> at Every Step
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Excellence in every aspect of manufacturing
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {impactBenefits.map((benefit, index) => {
            const Icon = impactIcons[benefit.icon];
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-0.5">{benefit.title}</h3>
                <p className="text-[10px] text-slate-500">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Process() {
  return (
    <section id="process" className="relative bg-white">
      {/* Scroll-animated Process Steps */}
      <ScrollProcess />

      {/* Industry 4.0 Technologies */}
      <TechSection />

      {/* Delivering Impact */}
      <ImpactSection />

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden"
          >
            <div className="absolute inset-0">
              <img src="/soundbox (3).png" alt="" className="w-full h-full object-cover opacity-20" />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-3">
                Ready to Start Your Project?
              </h2>
              <p className="text-sm text-white/60 mb-6 max-w-md mx-auto">
                From concept to mass production — we've got you covered.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors duration-300"
              >
                Get Started
                <FiArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </section>
  );
}
